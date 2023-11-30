import { CardItem } from "@/components/Card/card-item";
import MapLink from "@/components/map-link";
import { getFullName } from "@/utils/string";
import { Box, CardHeader, Stack, Typography, capitalize } from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import { forwardRef } from "react";

export const ReportPrint = forwardRef((props, ref) => {
  const { report } = props;
  const { t } = useTranslation();

  return (
    <div style={{ display: "none" }}>
      <Box
        className="print-container"
        sx={{
          p: 0,
          m: 0,
        }}
        ref={ref}
      >
        <CardHeader title={t("common.report-information")} />
        <CardItem name="ID" content={report.id} lastItem />
        <CardItem name={t("common.title")} content={report.title} lastItem />
        <CardItem name={t("common.description")} content={report.description} lastItem />
        <CardItem
          name={t("common.created_by")}
          content={getFullName(report.created_by.first_name, report.created_by.last_name)}
          lastItem
        />
        <CardItem
          name={t("common.created_at")}
          content={format(new Date(report.created_at), "dd/MM/yyyy HH:mm")}
          lastItem
        />
        <CardItem
          name={t("common.updated_at")}
          content={format(new Date(report.updated_at), "dd/MM/yyyy HH:mm")}
          lastItem
        />
        <CardItem name={t("common.area")} content={report.area?.name} lastItem />
        <CardItem name={t("common.location")} hasChild lastItem>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">{`${report.lat}, ${report.lng}`}</Typography>
            <MapLink lat={report.lat} lng={report.lng} />
          </Stack>
        </CardItem>
        <CardItem name={t("common.images")} hasChild lastItem>
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
        <CardItem name={capitalize(t("common.views"))} content={report.view_count} lastItem />
        <CardItem name={t("common.vote")} content={report.score} />
        {report?.evidences?.length > 0 && <CardHeader title={t("common.evidences")} />}
        {report?.evidences?.map((evidence) => (
          <div key={evidence.id}>
            <CardItem
              name={t("common.role.VOLUNTEER")}
              content={`${evidence.created_by.first_name || ""} ${evidence.created_by.last_name}`}
              lastItem
            />
            <CardItem name={t("common.content")} content={evidence.content} lastItem />
            <CardItem
              name={t("common.status")}
              content={t(`constraint.report.status.${evidence.type}`).toUpperCase()}
              lastItem
            />
            <CardItem name={t("common.location")} hasChild lastItem>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2">{`${evidence.lat}, ${evidence.lng}`}</Typography>
                <MapLink lat={evidence.lat} lng={evidence.lng} />
              </Stack>
            </CardItem>
            <CardItem
              name={t("common.created_at")}
              content={format(new Date(evidence.created_at), "dd/MM/yyyy HH:mm")}
              lastItem
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
      </Box>
    </div>
  );
});
