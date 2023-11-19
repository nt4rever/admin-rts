import { managerService } from "@/apis/manager";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { MangerContext } from "@/contexts/manager-context";
import { ManagerFilter } from "@/sections/manager/manager-filter";
import { MangerTable } from "@/sections/manager/manager-table";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";

const Page = () => {
  const { t } = useTranslation();
  const [managerFilter, setMangerFilter] = useState({
    area: "",
    order: "created_at|desc",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["managers", { area: managerFilter.area, order: managerFilter.order }],
    queryFn: () =>
      managerService.area({
        id: managerFilter.area,
        params: {
          order: managerFilter.order,
        },
      }),
    enabled: !!managerFilter.area,
    keepPreviousData: true,
  });

  return (
    <>
      <Head>
        <title>Managers | RTS Admin</title>
      </Head>
      <MangerContext.Provider value={{ managerFilter, setMangerFilter }}>
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
                  <Typography variant="h4">{t("common.area-manager")}</Typography>
                </Stack>
                <div>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    component={NextLink}
                    href="/managers/add"
                  >
                    {t("common.add")}
                  </Button>
                </div>
              </Stack>
              <ManagerFilter />
              {isLoading && <ComponentLoading />}
              {data && <MangerTable items={data} />}
            </Stack>
          </Container>
        </Box>
      </MangerContext.Provider>
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
