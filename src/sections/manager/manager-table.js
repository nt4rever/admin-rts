import { getFullName } from "@/utils/string";
import {
  Avatar,
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
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { ArrowRight, Edit } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const ManagerTable = (props) => {
  const { items = [] } = props;
  const { t } = useTranslation();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("common.full-name")}</TableCell>
                <TableCell>{t("common.email")}</TableCell>
                <TableCell>{t("common.status")}</TableCell>
                <TableCell>{t("common.updated-at")}</TableCell>
                <TableCell>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const updatedAt = format(new Date(user.updated_at), "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={user.avatar} />
                        <Typography variant="subtitle2">
                          {getFullName(user.first_name, user.last_name)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.is_active ? (
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
                    <TableCell>{updatedAt}</TableCell>
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
                          href={`/managers/${user.id}/edit`}
                          component={NextLink}
                        >
                          <Edit />
                        </ButtonBase>
                        <ButtonBase
                          title={`Detail`}
                          sx={{
                            color: "rgb(108, 115, 127)",
                            p: 1,
                            ":hover": {
                              background: "rgba(108, 115, 127, 0.04)",
                              borderRadius: 8,
                            },
                          }}
                          href={`/managers/${user.id}`}
                          component={NextLink}
                        >
                          <ArrowRight />
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

ManagerTable.propTypes = {
  items: PropTypes.array,
};
