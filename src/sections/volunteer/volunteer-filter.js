import { useVolunteerContext } from "@/contexts/volunteer-context";
import { Card, FormControl, MenuItem, Select, Stack } from "@mui/material";
import { useTranslation } from "next-i18next";

export const VolunteerFilter = () => {
  const { t } = useTranslation();
  const { volunteerFilter, setVolunteerFilter } = useVolunteerContext();

  const handelChange = (e) => {
    setVolunteerFilter((prev) => ({
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
            value={volunteerFilter.order}
            onChange={handelChange}
          >
            <MenuItem disabled>{t("common.sort-by")}</MenuItem>
            <MenuItem value="created_at|asc">{t("common.default")}</MenuItem>
            <MenuItem value="created_at|desc">{t("common.newest")}</MenuItem>
            <MenuItem value="updated_at|desc">{t("common.recent-update")}</MenuItem>
            <MenuItem value="is_active|asc">{t("common.status")}</MenuItem>
            <MenuItem value="last_name|asc">{t("common.name")}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
};
