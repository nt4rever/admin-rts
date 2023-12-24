import TicketIcon from "@heroicons/react/24/solid/TicketIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";

export const OverviewReport = (props) => {
  const { sx, value } = props;
  const { t } = useTranslation();

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {t("common.report")}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <TicketIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewReport.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
