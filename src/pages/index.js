import { statsService } from "@/apis/stats";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { OverviewArea } from "@/sections/overview/report/overview-area";
import { OverviewReportPie } from "@/sections/overview/report/overview-chart-pie";
import { OverviewReport } from "@/sections/overview/report/overview-report";
import { OverviewUser } from "@/sections/overview/report/overview-user";
import { OverviewVolunteer } from "@/sections/overview/report/overview-volunteer";
import { ReportChartMonth } from "@/sections/overview/report/report-chart-month";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const reportChartData = (summaryReport) => {
  const label = [];
  const data = [];
  summaryReport.forEach((value) => {
    label.push(value._id.status);
    data.push(value.count);
  });
  return {
    label,
    data,
  };
};

const reportMonthData = (reportPerMonth) => {
  const data = Array.from({ length: 12 }).fill(0);
  reportPerMonth.forEach((value) => {
    data[value._id.month - 1] = value.count;
  });
  return data;
};

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: statsService.admin,
    staleTime: Infinity,
  });
  return (
    <>
      <Head>
        <title>Overview | RTS Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {isLoading && <ComponentLoading />}
          {data && (
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewReport sx={{ height: "100%" }} value={data?.total_report} />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewVolunteer sx={{ height: "100%" }} value={data?.total_volunteer} />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewUser sx={{ height: "100%" }} value={data?.total_user} />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewArea sx={{ height: "100%" }} value={data?.total_area} />
              </Grid>
              <Grid xs={12} lg={8}>
                <ReportChartMonth
                  chartSeries={[
                    {
                      name: "Report",
                      data: reportMonthData(data?.report_per_month),
                    },
                  ]}
                  sx={{ height: "100%" }}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}>
                <OverviewReportPie
                  chartSeries={reportChartData(data?.summary_report).data}
                  labels={reportChartData(data?.summary_report).label}
                  sx={{ height: "100%" }}
                />
              </Grid>
            </Grid>
          )}
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
