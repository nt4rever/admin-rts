import { ticketService } from "@/apis/ticket";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { ReportContext } from "@/contexts/report-context";
import { ReportFilter } from "@/sections/report/report-filter";
import { ReportTable } from "@/sections/report/report-table";
import { useAuthStore } from "@/store/useAuthStore";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    order: "created_at|desc",
    status: "ALL",
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "tickets",
      { area: user?.area, page, rowsPerPage, order: filter.order, status: filter.status },
    ],
    queryFn: () =>
      ticketService.all({
        area: user?.area,
        page,
        per_page: rowsPerPage,
        order: filter.order,
        status: filter.status === "ALL" ? undefined : filter.status,
      }),
    enabled: !!user?.area,
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
        <title>Reports | RTS Admin</title>
      </Head>
      <ReportContext.Provider value={{ filter, setFilter }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 2,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack>
                <Typography variant="h4">{t("common.report-management")}</Typography>
              </Stack>
              <ReportFilter />
              {isLoading && <ComponentLoading />}
              {data && (
                <ReportTable
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
      </ReportContext.Provider>
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
