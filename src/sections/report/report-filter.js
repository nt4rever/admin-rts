import { useReportContext } from "@/contexts/report-context";
import { Card, FormControl, MenuItem, Select, Stack, capitalize } from "@mui/material";
import { useTranslation } from "next-i18next";

export const ReportFilter = () => {
  const { t } = useTranslation();
  const { filter, setFilter } = useReportContext();

  const handleChange = (e) => {
    setFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1}>
        <FormControl>
          <Select
            size="small"
            name="order"
            MenuProps={{ disableScrollLock: true }}
            value={filter.order}
            onChange={handleChange}
          >
            <MenuItem disabled>{t("common.sort-by")}</MenuItem>
            <MenuItem value="created_at|asc">{t("common.default")}</MenuItem>
            <MenuItem value="created_at|desc">{t("common.newest")}</MenuItem>
            <MenuItem value="updated_at|desc">{t("common.recent-update")}</MenuItem>
            <MenuItem value="score|desc">{t("common.vote")}</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <Select
            size="small"
            name="status"
            value={filter.status}
            onChange={handleChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem disabled>{t("common.status")}</MenuItem>
            <MenuItem value="ALL">{capitalize(t("constraint.report.status.ALL"))}</MenuItem>
            <MenuItem value="NEW">{capitalize(t("constraint.report.status.NEW"))}</MenuItem>
            <MenuItem value="PENDING">{capitalize(t("constraint.report.status.PENDING"))}</MenuItem>
            <MenuItem value="CONFIRMED">
              {capitalize(t("constraint.report.status.CONFIRMED"))}
            </MenuItem>
            <MenuItem value="REJECTED">
              {capitalize(t("constraint.report.status.REJECTED"))}
            </MenuItem>
            <MenuItem value="IN_PROCESS">
              {capitalize(t("constraint.report.status.IN_PROCESS"))}
            </MenuItem>
            <MenuItem value="RESOLVED">
              {capitalize(t("constraint.report.status.RESOLVED"))}
            </MenuItem>
            <MenuItem value="CLOSED">{capitalize(t("constraint.report.status.CLOSED"))}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
};
