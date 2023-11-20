import { ticketService } from "@/apis/ticket";
import { CardItem } from "@/components/Card/card-item";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { ExpandMore } from "@/components/expand-more";
import MapLink from "@/components/map-link";
import { SeverityPill } from "@/components/severity-pill";
import { reportStatusMap } from "@/constants/report-status";
import { evidenceTypeMap } from "@/constants/task-status";
import { getFullName } from "@/utils/string";
import {
  Box,
  ButtonBase,
  Card,
  CardHeader,
  Collapse,
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
import { useCallback, useState } from "react";
import { ArrowLeft, ChevronDown } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const router = useRouter();
  const id = router.query?.id;
  const { t } = useTranslation();
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);

  const handleEvidenceExpand = useCallback(() => {
    setEvidenceExpanded((prev) => !prev);
  }, [setEvidenceExpanded]);

  const { data: report, isLoading } = useQuery({
    queryKey: ["reports", id],
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
                      {report.images.map((img) => (
                        <img
                          key={img}
                          src={img}
                          style={{
                            aspectRatio: "1/1",
                            width: "300px",
                          }}
                        />
                      ))}
                    </Stack>
                  </CardItem>
                  <CardItem
                    name={t("common.severity-level")}
                    content={report.severity_level || "-"}
                  />
                  <CardItem
                    name={t("common.resolve-message")}
                    content={report.resolve_message || "-"}
                  />
                  <CardItem
                    name={t("common.close-message")}
                    content={report.close_message || "-"}
                  />
                  <CardItem name={capitalize(t("common.views"))} content={report.view_count} />
                  <CardItem name={t("common.vote")} content={report.score} lastItem />
                </Card>
                {report.evidences?.length > 0 && (
                  <Card>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ px: 3, py: 4 }}
                    >
                      <Typography variant="h6">{t("common.evidences")}</Typography>
                      <ExpandMore
                        expand={evidenceExpanded}
                        onClick={handleEvidenceExpand}
                        aria-expanded={evidenceExpanded}
                        aria-label="show more"
                      >
                        <ChevronDown />
                      </ExpandMore>
                    </Stack>
                    <Collapse in={evidenceExpanded}>
                      {report?.evidences?.map((evidence) => (
                        <div key={evidence.id}>
                          <CardItem
                            name={t("common.role.VOLUNTEER")}
                            content={`${evidence.created_by.first_name || ""} ${
                              evidence.created_by.last_name
                            }`}
                          />
                          <CardItem name={t("common.content")} content={evidence.content} />
                          <CardItem name={t("common.status")} hasChild>
                          <Stack direction="row">
                            <SeverityPill color={evidenceTypeMap[evidence.type]}>
                              {t(`constraint.report.status.${evidence.type}`)}
                            </SeverityPill>
                          </Stack>
                          </CardItem>
                          <CardItem name={t("common.location")} hasChild>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="body2">{`${evidence.lat}, ${evidence.lng}`}</Typography>
                              <MapLink lat={evidence.lat} lng={evidence.lng} />
                            </Stack>
                          </CardItem>
                          <CardItem
                            name={t("common.created_at")}
                            content={format(new Date(evidence.created_at), "dd/MM/yyyy HH:mm")}
                          />
                          <CardItem name={t("common.images")} hasChild lastItem>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                              {evidence.images.map((img) => (
                                <img
                                  key={img}
                                  src={img}
                                  style={{
                                    aspectRatio: "1/1",
                                    width: "200px",
                                  }}
                                />
                              ))}
                            </Stack>
                          </CardItem>
                        </div>
                      ))}
                    </Collapse>
                  </Card>
                )}
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
