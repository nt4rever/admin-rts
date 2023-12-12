import {
  Box,
  ButtonBase,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  capitalize,
} from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Edit } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const PostTable = (props) => {
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
                <TableCell>{t("common.title")}</TableCell>
                <TableCell>{t("common.category")}</TableCell>
                <TableCell>{capitalize(t("common.views"))}</TableCell>
                <TableCell>{t("common.updated-at")}</TableCell>
                <TableCell width={120}>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((post) => {
                const updatedAt = format(new Date(post.updated_at), "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category?.name}</TableCell>
                    <TableCell>{post.view_count}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1}>
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
                          href={`/posts/${post.id}/edit`}
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

PostTable.propTypes = {
  items: PropTypes.array,
};
