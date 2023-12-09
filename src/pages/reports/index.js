import { ticketService } from "@/apis/ticket";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { ReportContext } from "@/contexts/report-context";
import { useSelection } from "@/hooks/use-selection";
import { ReportFilter } from "@/sections/report/report-filter";
import { ReportTable } from "@/sections/report/report-table";
import { useAuthStore } from "@/store/useAuthStore";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const useReportIds = (reports) => useMemo(() => reports?.map((report) => report.id), [reports]);

const Page = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [page, setPage] = useState(+searchParam.get("page") || 1);
  const [rowsPerPage, setRowsPerPage] = useState(+searchParam.get("per_page") || 10);
  const [filter, setFilter] = useState({
    order: searchParam.get("order") || "created_at|desc",
    status: searchParam.get("status") || "ALL",
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

  const reportsSelection = useSelection(useReportIds(data?.items));

  useEffect(() => {
    router.push(
      `?page=${page}&per_page=${rowsPerPage}&order=${filter.order}&status=${filter.status}`,
      null,
      {
        scroll: false,
        shallow: true,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filter.order, filter.status]);

  useEffect(() => {
    setPage(+searchParam.get("page") || 1);
    setRowsPerPage(+searchParam.get("per_page") || 10);
    setFilter({
      order: searchParam.get("order") || "created_at|desc",
      status: searchParam.get("status") || "ALL",
    });
  }, [searchParam]);

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
              <ReportFilter reportSelected={reportsSelection.selected} />
              {isLoading && <ComponentLoading />}
              {data && (
                <ReportTable
                  count={data.meta.item_count}
                  items={data.items}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page - 1}
                  rowsPerPage={rowsPerPage}
                  onDeselectAll={reportsSelection.handleDeselectAll}
                  onDeselectOne={reportsSelection.handleDeselectOne}
                  onSelectAll={reportsSelection.handleSelectAll}
                  onSelectOne={reportsSelection.handleSelectOne}
                  selected={reportsSelection.selected}
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
