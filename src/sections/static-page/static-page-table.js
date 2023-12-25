import { pageService } from "@/apis/page";
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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Edit, Trash } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const StaticPageTable = (props) => {
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
    mutationFn: pageService.deletePage,
  });
  const queryClient = useQueryClient();

  const handleDelete = (payload) => {
    modals.openConfirmModal({
      title: t("message.confirm-action"),
      children: <Typography>{t("message.warning-delete")}</Typography>,
      zIndex: 9999,
      confirmProps: { color: "red" },
      labels: { confirm: t("common.confirm"), cancel: t("common.cancel") },
      onConfirm: () => {
        mutationDelete.mutate(payload, {
          onSettled: () => {
            queryClient.invalidateQueries(["static-page"]);
          },
        });
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
                <TableCell>{t("common.type")}</TableCell>
                <TableCell>{t("common.title")}</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell width={120}>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((page) => {
                return (
                  <TableRow hover key={page.id}>
                    <TableCell>{page.type}</TableCell>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={0.3}>
                        <ButtonBase
                          title={`Delete`}
                          sx={{ ...buttonActionSx, color: "#f44336" }}
                          onClick={() =>
                            handleDelete({
                              type: page.type,
                              slug: page.slug,
                            })
                          }
                        >
                          <Trash />
                        </ButtonBase>
                        <ButtonBase
                          title={`Edit`}
                          sx={buttonActionSx}
                          href={`/pages/add?type=${page.type}&slug=${page.slug}`}
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

StaticPageTable.propTypes = {
  items: PropTypes.array,
};
