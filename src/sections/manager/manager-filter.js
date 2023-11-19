import { areaService } from "@/apis/area";
import { useManagerContext } from "@/contexts/manager-context";
import { Card, FormControl, MenuItem, Select, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

export const ManagerFilter = () => {
  const { t } = useTranslation();
  const { managerFilter, setMangerFilter } = useManagerContext();
  const { data: areas } = useQuery({
    queryKey: ["area"],
    queryFn: () =>
      areaService.all({
        order: "name|asc",
      }),
    staleTime: 5 * 60 * 100,
  });

  useEffect(() => {
    if (areas?.length > 0) {
      setMangerFilter((prev) => ({
        ...prev,
        area: areas[0].id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  const handelChange = (e) => {
    setMangerFilter((prev) => ({
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
            name="area"
            onChange={handelChange}
            MenuProps={{ disableScrollLock: true }}
            value={managerFilter.area}
          >
            <MenuItem disabled>{t("common.area")}</MenuItem>
            {areas?.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            size="small"
            name="order"
            MenuProps={{ disableScrollLock: true }}
            value={managerFilter.order}
            onChange={handelChange}
          >
            <MenuItem disabled>{t("common.sort-by")}</MenuItem>
            <MenuItem value="created_at|desc">{t("common.newest")}</MenuItem>
            <MenuItem value="updated_at|desc">{t("common.frequent")}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
};
