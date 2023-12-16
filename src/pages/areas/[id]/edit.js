import { areaService } from "@/apis/area";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { AreaFromEdit } from "@/sections/area/area-form-edit";
import { Box, ButtonBase, Container, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["area", id],
    queryFn: () => areaService.get(id),
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
          pt: 2,
          pb: 5,
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
                <Typography variant="body1">{t("common.back")}</Typography>
              </ButtonBase>
            </Stack>
            <Stack>
              <Typography variant="h5">{t("common.edit-area")}</Typography>
            </Stack>
            {isLoading && <ComponentLoading />}
            {data && <AreaFromEdit data={data} />}
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
