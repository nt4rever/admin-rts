import { CardItem } from "@/components/Card/card-item";
import { getFullName } from "@/utils/string";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const user = {
  first_name: "FPT",
  last_name: "Manager 001",
  email: "rts.hmmm.tech+fpt.mng.001@hmmmm.tech",
  is_active: true,
  role: "AREA_MANAGER",
  area: "6548e83a569141022a88bd91",
  vote_per_day: {
    point: 10,
    last_used_at: "2023-11-06T13:15:47.885Z",
  },
  created_at: "2023-11-06T13:23:01.251Z",
  updated_at: "2023-11-18T14:58:58.100Z",
  date_of_birth: "2000-11-05T17:00:00.000Z",
  gender: "FEMALE",
  avatar:
    "https://minio.hmmmm.tech/hmmmm/avatars/6548e8b5569141022a88bd9e/3e90d14b-8cda-4fd4-98e5-973dc3ad562f.png",
  id: "6548e8b5569141022a88bd9e",
};

const Page = () => {
  const router = useRouter();
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
            <Stack direction="row">
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
