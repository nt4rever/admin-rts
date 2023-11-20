import { taskService } from "@/apis/task";
import { CardItem } from "@/components/Card/card-item";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { ExpandMore } from "@/components/expand-more";
import { SeverityPill } from "@/components/severity-pill";
import { taskStatusMap } from "@/constants/task-status";
import { Box, Card, Collapse, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { ReportTaskTable } from "./report-task-table";
import { ReportFormAssign } from "./report-form-assign";

export const ReportTask = (props) => {
  const { id } = props;
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", { ticket: id }],
    queryFn: () => taskService.getByTicket({ id }),
  });

  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2 }}
      >
        <Typography variant="h6">{t("common.tasks")}</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpand}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ChevronDown />
        </ExpandMore>
      </Stack>
      <Collapse in={expanded}>
        <Box
          sx={{
            p: 2,
          }}
        >
          {isLoading && <ComponentLoading />}
          {data && <ReportTaskTable items={data} />}
        </Box>
        <Box
          sx={{
            p: 3,
          }}
        >
          <ReportFormAssign id={id} />
        </Box>
      </Collapse>
    </Card>
  );
};
