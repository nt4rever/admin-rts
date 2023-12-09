import { SeverityPill } from "@/components/severity-pill";
import { reportStatusMap } from "@/constants/report-status";
import { getFullName } from "@/utils/string";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { ArrowRight } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";

export const ReportTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    onDeselectAll,
    onDeselectOne,
    onSelectAll,
    onSelectOne,
    selected = [],
  } = props;
  const { t } = useTranslation();
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{t("common.created-by")}</TableCell>
                <TableCell>{t("common.title")}</TableCell>
                <TableCell>{t("common.score")}</TableCell>
                <TableCell>{t("common.status")}</TableCell>
                <TableCell>{t("common.updated-at")}</TableCell>
                <TableCell>{t("common.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((report) => {
                const isSelected = selected.includes(report.id);
                const updatedAt = format(new Date(report.updated_at), "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={report.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(report.id);
                          } else {
                            onDeselectOne?.(report.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={report.created_by.avatar} />
                        <Typography variant="subtitle2">
                          {getFullName(report.created_by.first_name, report.created_by.last_name)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.score}</TableCell>
                    <TableCell>
                      <SeverityPill color={reportStatusMap[report.status]}>
                        {t(`constraint.report.status.${report.status}`)}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1}>
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
                          href={`/reports/${report.id}`}
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

ReportTable.propTypes = {
  items: PropTypes.array,
};
