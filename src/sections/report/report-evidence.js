import { CardItem } from "@/components/Card/card-item";
import { ExpandMore } from "@/components/expand-more";
import MapLink from "@/components/map-link";
import { SeverityPill } from "@/components/severity-pill";
import { evidenceTypeMap } from "@/constants/task-status";
import { Card, Collapse, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useState } from "react";
import { ChevronDown } from "react-feather";

export const ReportEvidence = (props) => {
  const { report } = props;
  const { t } = useTranslation();

  const [evidenceExpanded, setEvidenceExpanded] = useState(false);

  const handleEvidenceExpand = useCallback(() => {
    setEvidenceExpanded((prev) => !prev);
  }, [setEvidenceExpanded]);

  return (
    <>
      {report.evidences?.length > 0 && (
        <Card>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, py: 2 }}
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
                          // aspectRatio: "1/1",
                          width: "300px",
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
  );
};
