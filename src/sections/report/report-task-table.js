import { SeverityPill } from "@/components/severity-pill";
import { taskStatusMap } from "@/constants/task-status";
import { getFullName } from "@/utils/string";
import {
  Avatar,
  Box,
  Card,
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
import PropTypes from "prop-types";
import { Scrollbar } from "src/components/scrollbar";

export const ReportTaskTable = (props) => {
  const { items = [] } = props;

  const { t } = useTranslation();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("common.volunteer")}</TableCell>
                <TableCell>{t("common.status")}</TableCell>
                <TableCell>{t("common.note")}</TableCell>
                <TableCell>{t("common.deadline")}</TableCell>
                <TableCell>{t("common.updated-at")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((task) => {
                const updatedAt = format(new Date(task.updated_at), "dd/MM/yyyy HH:mm");
                const deadline = format(new Date(task.expires_at), "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={task.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={task.assignee.avatar} />
                        <Typography variant="subtitle2">
                          {getFullName(task.assignee.first_name, task.assignee.last_name)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={taskStatusMap[task.status]}>
                        {t(`constraint.task.status.${task.status}`)}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{task.note}</TableCell>
                    <TableCell>{deadline}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
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

ReportTaskTable.propTypes = {
  items: PropTypes.array,
};
