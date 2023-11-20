import { ticketService } from "@/apis/ticket";
import { reportStatusUpdate } from "@/constants/report-status";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  capitalize,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ReportForm = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const updateMutation = useMutation({
    mutationFn: ticketService.update,
  });
  const queryClient = useQueryClient();

  const statusItems = reportStatusUpdate.map((value, index) => (
    <MenuItem key={index} value={value}>
      {capitalize(t(`constraint.report.status.${value}`))}
    </MenuItem>
  ));

  const formik = useFormik({
    initialValues: {
      id: data.id,
      status: statusItems.includes(data.status) ? data.status : "",
      resolve_message: data.resolve_message,
      close_message: data.close_message,
    },
    validationSchema: new Yup.object({
      resolve_message: Yup.string()
        .optional()
        .max(500, t("validation.common.max-length", { max: 500 })),
      close_message: Yup.string()
        .optional()
        .max(500, t("validation.common.max-length", { max: 500 })),
      status: Yup.mixed().oneOf(["IN_PROCESS", "RESOLVED", "CLOSED", "PENDING", "NEW"]).optional(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await updateMutation.mutateAsync(values);
        notifications.show({
          title: t("message.update-successfully"),
          color: "green",
          autoClose: 2000,
        });
      } catch (err) {
        if (isAxiosError(err)) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          const data = err.response.data;
          const { message } = data;
          helpers.setErrors({ submit: t(message, { ns: "message" }) });
        }
        notifications.show({
          title: t("message.update-fail"),
          color: "red",
        });
      } finally {
        queryClient.invalidateQueries(["tickets"]);
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card
        sx={{
          pb: 1,
        }}
      >
        <CardHeader title={t("common.update-report")} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} item>
              <FormControl fullWidth variant="filled">
                <InputLabel id="status">{t("common.status")}</InputLabel>
                <Select
                  label={t("common.status")}
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  name="status"
                >
                  {statusItems}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <TextField
                multiline
                minRows={3}
                fullWidth
                label={t("common.resolve-message")}
                name="resolve_message"
                error={!!(formik.touched.resolve_message && formik.errors.resolve_message)}
                helperText={formik.touched.resolve_message && formik.errors.resolve_message}
                value={formik.values.resolve_message}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                multiline
                minRows={3}
                fullWidth
                label={t("common.close-message")}
                name="close_message"
                error={!!(formik.touched.close_message && formik.errors.close_message)}
                helperText={formik.touched.close_message && formik.errors.close_message}
                value={formik.values.close_message}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ px: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            {t("common.submit")}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
