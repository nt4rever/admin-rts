import { managerService } from "@/apis/manager";
import { CardItem } from "@/components/Card/card-item";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { getFullName } from "@/utils/string";
import { notifications } from "@mantine/notifications";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardHeader,
  Chip,
  Container,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const router = useRouter();
  const id = router.query?.id;
  const { t } = useTranslation();
  const [status, setStatus] = useState(true);

  const { data: user, isLoading } = useQuery({
    queryKey: ["managers", id],
    queryFn: () => managerService.get(id),
    onSuccess: (data) => {
      setStatus(data?.is_active ?? true);
    },
  });

  const mutation = useMutation({
    mutationFn: managerService.update,
  });

  const handleStatusChange = (e) => {
    setStatus(e.target.checked);
    mutation.mutate(
      {
        id,
        is_active: e.target.checked,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: t("message.update-profile-success"),
            color: "green",
            autoClose: 2000,
          });
        },
        onError: () => {
          notifications.show({
            title: t("message.update-profile-fail"),
            color: "red",
          });
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Managers | RTS Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row">
              <ButtonBase
                onClick={() => {
                  router.back();
                }}
                sx={{ gap: 1 }}
              >
                <ArrowLeft />
                <Typography variant="body1">Managers</Typography>
              </ButtonBase>
            </Stack>
            {isLoading && <ComponentLoading />}
            {user && (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" gap={2}>
                    <Avatar
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                      src={user.avatar}
                    />
                    <Stack spacing={1}>
                      <Typography variant="h5">
                        {getFullName(user.first_name, user.last_name)}
                      </Typography>
                      <Typography component="div">
                        ID:&nbsp; <Chip label={user.id} size="small" />
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={status}
                          onChange={handleStatusChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label="Status"
                    />
                  </Stack>
                </Stack>
                <Card
                  sx={{
                    pb: 1,
                  }}
                >
                  <CardHeader title="Basic detail" />
                  <CardItem name="Email" content={user.email} />
                  <CardItem name="Phone number" content={user.phone_number} />
                  <CardItem name="Gender" content={user.gender} />
                  <CardItem name="Address" content={user.address} />
                  <CardItem
                    name="Date of birth"
                    content={
                      user.date_of_birth ? format(new Date(user.date_of_birth), "dd/MM/yyyy") : "--"
                    }
                  />
                  <CardItem
                    name="Created at"
                    content={format(new Date(user.created_at), "dd/MM/yyyy HH:mm")}
                  />
                  <CardItem
                    name="Updated at"
                    content={format(new Date(user.updated_at), "dd/MM/yyyy HH:mm")}
                    lastItem
                  />
                </Card>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "vi")),
    },
  };
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
