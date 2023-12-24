import MapPinIcon from "@heroicons/react/24/solid/MapPinIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";

export const OverviewArea = (props) => {
  const { sx, value } = props;
  const { t } = useTranslation();

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Area
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <MapPinIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewArea.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
