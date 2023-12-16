import { areaService } from "@/apis/area";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { AreaTable } from "@/sections/area/area-table";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";

const Page = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["area"],
    queryFn: () => areaService.all(),
  });

  return (
    <>
      <Head>
        <title>Areas | RTS Admin</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{t("common.area")}</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  href="/areas/add"
                  component={NextLink}
                >
                  {t("common.add")}
                </Button>
              </div>
            </Stack>
            {isLoading && <ComponentLoading />}
            {data && <AreaTable items={data} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "vi")),
    },
  };
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
