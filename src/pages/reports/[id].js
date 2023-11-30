import { ticketService } from "@/apis/ticket";
import { CardItem } from "@/components/Card/card-item";
import ConfidenceChart from "@/components/Chart/ConfidenceChart";
import ImageSlider from "@/components/ImageSlider";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import MapLink from "@/components/map-link";
import { SeverityPill } from "@/components/severity-pill";
import { reportStatusMap } from "@/constants/report-status";
import { ReportEvidence } from "@/sections/report/report-evidence";
import { ReportForm } from "@/sections/report/report-form";
import { ReportTask } from "@/sections/report/report-task";
import { getFullName } from "@/utils/string";
import {
  Box,
  ButtonBase,
  Card,
  CardHeader,
  Container,
  Stack,
  Typography,
  capitalize,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
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
  const [slideIndex, setSlideIndex] = useState(0);

  const { data: report, isLoading } = useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketService.get(id),
  });

  return (
    <>
      <Head>
        <title>Reports | RTS Admin</title>
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
                <Typography variant="body1">{t("common.back")}</Typography>
              </ButtonBase>
            </Stack>
            {isLoading && <ComponentLoading />}
            {report && (
              <>
                <Card
                  sx={{
                    pb: 1,
                  }}
                >
                  <CardHeader title={t("common.report-information")} />
                  <CardItem name="ID" content={report.id} />
                  <CardItem name={t("common.title")} content={report.title} />
                  <CardItem name={t("common.description")} content={report.description} />
                  <CardItem
                    name={t("common.created_by")}
                    content={getFullName(report.created_by.first_name, report.created_by.last_name)}
                  />
                  <CardItem
                    name={t("common.created_at")}
                    content={format(new Date(report.created_at), "dd/MM/yyyy HH:mm")}
                  />
                  <CardItem
                    name={t("common.updated_at")}
                    content={format(new Date(report.updated_at), "dd/MM/yyyy HH:mm")}
                  />
                  <CardItem name={t("common.area")} content={report.area?.name} />
                  <CardItem name={t("common.location")} hasChild>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body2">{`${report.lat}, ${report.lng}`}</Typography>
                      <MapLink lat={report.lat} lng={report.lng} />
                    </Stack>
                  </CardItem>
                  <CardItem name={t("common.status")} hasChild>
                    <Stack direction="row">
                      <SeverityPill color={reportStatusMap[report.status]}>
                        {t(`constraint.report.status.${report.status}`)}
                      </SeverityPill>
                    </Stack>
                  </CardItem>
                  <CardItem name={t("common.images")} hasChild>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <ImageSlider data={report.images} onSlideChange={setSlideIndex} />
                    </Stack>
                  </CardItem>
                  <CardItem name={t("common.severity-level")} hasChild>
                    {report.severity_level?.length > 0 ? (
                      <ConfidenceChart data={report.severity_level[slideIndex]} />
                    ) : (
                      "-"
                    )}
                  </CardItem>
                  <CardItem
                    name={t("common.resolve-message")}
                    content={report.resolve_message || "--"}
                  />
                  <CardItem
                    name={t("common.close-message")}
                    content={report.close_message || "--"}
                  />
                  <CardItem name={capitalize(t("common.views"))} content={report.view_count} />
                  <CardItem name={t("common.vote")} content={report.score} lastItem />
                </Card>
                <ReportEvidence report={report} />
                <ReportTask id={id} />
                <ReportForm data={report} />
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
