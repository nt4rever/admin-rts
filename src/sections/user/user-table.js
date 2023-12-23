import { useAuthStore } from "@/store/useAuthStore";
import { buttonActionSx } from "@/theme/common";
import { getFullName } from "@/utils/string";
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
  TablePagination,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Edit } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const UserTable = (props) => {
  const { user: currentUser } = useAuthStore();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const { t } = useTranslation();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("common.full-name")}</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>{t("common.status")}</TableCell>

                <TableCell>Role</TableCell>
                <TableCell>{t("common.created_at")}</TableCell>
                <TableCell width={120}>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                if (user.id === currentUser?.id) return null;
                const createdAt = format(new Date(user.created_at), "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={user.id}>
                    <TableCell>{getFullName(user.first_name, user.last_name)}</TableCell>
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
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={0.3}>
                        <ButtonBase
                          title={`Edit`}
                          sx={buttonActionSx}
                          href={`/users/${user.id}/edit`}
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
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage={t("common.rows-per-page")}
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}–${to} ${t("common.of")} ${
            count !== -1 ? count : `${t("common.more-than")} ${to}`
          }`;
        }}
      />
    </Card>
  );
};

UserTable.propTypes = {
  items: PropTypes.array,
};
