import { postService } from "@/apis/post";
import { buttonActionSx } from "@/theme/common";
import { modals } from "@mantine/modals";
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
  Typography,
  capitalize,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Edit, Trash } from "react-feather";
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
  const mutationDelete = useMutation({
    mutationFn: postService.deletePost,
  });
  const queryClient = useQueryClient();

  const handleDelete = (id) => {
    modals.openConfirmModal({
      title: t("message.confirm-action"),
      children: <Typography>{t("message.warning-delete")}</Typography>,
      zIndex: 9999,
      confirmProps: { color: "red" },
      labels: { confirm: t("common.confirm"), cancel: t("common.cancel") },
      onConfirm: () => {
        mutationDelete.mutate(
          { id },
          {
            onSettled: () => {
              queryClient.invalidateQueries(["posts"]);
            },
          }
        );
      },
    });
  };

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
                      <Stack direction="row" gap={0.3}>
                        <ButtonBase
                          title={`Delete`}
                          sx={{ ...buttonActionSx, color: "#f44336" }}
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash />
                        </ButtonBase>
                        <ButtonBase
                          title={`Edit`}
                          sx={buttonActionSx}
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
