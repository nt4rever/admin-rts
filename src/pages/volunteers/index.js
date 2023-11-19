import { volunteerService } from "@/apis/volunteer";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { VolunteerContext } from "@/contexts/volunteer-context";
import { VolunteerFilter } from "@/sections/volunteer/volunteer-filter";
import { VolunteerTable } from "@/sections/volunteer/volunteer-table";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import NextLink from "next/link";
import { useCallback } from "react";
import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const { t } = useTranslation();
  const [volunteerFilter, setVolunteerFilter] = useState({
    order: "created_at|desc",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["volunteers", { page, rowsPerPage, order: volunteerFilter.order }],
    queryFn: () =>
      volunteerService.all({
        page,
        per_page: rowsPerPage,
        order: volunteerFilter.order,
      }),
    keepPreviousData: true,
  });

  const handlePageChange = useCallback((event, value) => {
    setPage(value + 1);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  }, []);

  return (
    <>
      <Head>
        <title>Volunteers | RTS Admin</title>
      </Head>
      <VolunteerContext.Provider value={{ volunteerFilter, setVolunteerFilter }}>
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
                  <Typography variant="h4">{t("common.volunteer-manager")}</Typography>
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
                    href="/volunteers/add"
                  >
                    {t("common.add")}
                  </Button>
                </div>
              </Stack>
              <VolunteerFilter />
              {isLoading && <ComponentLoading />}
              {data && (
                <VolunteerTable
                  count={data.meta.item_count}
                  items={data.items}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page - 1}
                  rowsPerPage={rowsPerPage}
                />
              )}
            </Stack>
          </Container>
        </Box>
      </VolunteerContext.Provider>
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
