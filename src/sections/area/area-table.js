import MapLink from "@/components/map-link";
import {
  Box,
  ButtonBase,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Edit } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const AreaTable = (props) => {
  const { items = [] } = props;
  const { t } = useTranslation();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("common.name")}</TableCell>
                <TableCell>{t("common.address")}</TableCell>
                <TableCell>{t("common.status")}</TableCell>
                <TableCell>{t("common.location")}</TableCell>
                <TableCell>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((area) => {
                return (
                  <TableRow hover key={area.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{area.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{area.address}</TableCell>
                    <TableCell>
                      {area.is_active ? (
                        <Chip
                          size="small"
                          label={t("common.active")}
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Chip size="small" label={t("common.inactive")} color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      <MapLink lat={area.lat} lng={area.lng} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={0.5}>
                        <ButtonBase
                          title={`Edit`}
                          sx={{
                            color: "rgb(108, 115, 127)",
                            p: 1,
                            ":hover": {
                              background: "rgba(108, 115, 127, 0.04)",
                              borderRadius: 8,
                            },
                          }}
                          href={`/areas/${area.id}/edit`}
                          component={NextLink}
                        >
                          <Edit />
                        </ButtonBase>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

AreaTable.propTypes = {
  items: PropTypes.array,
};
