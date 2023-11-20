import { ticketService } from "@/apis/ticket";
import { volunteerService } from "@/apis/volunteer";
import { getFullName } from "@/utils/string";
import { notifications } from "@mantine/notifications";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ReportFormAssign = (props) => {
  const { id } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["volunteer-list"],
    queryFn: () =>
      volunteerService.list({
        id,
      }),
  });

  const mutation = useMutation({
    mutationFn: ticketService.assign,
  });

  const formik = useFormik({
    initialValues: {
      id,
      assignee: "",
      note: "",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    validationSchema: new Yup.object({
      id: Yup.string().required(),
      assignee: Yup.string().required(),
      expires_at: Yup.date().optional().nullable(),
      note: Yup.string().max(500, t("validation.common.max-length", { max: 500 })),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutation.mutateAsync(values);
        notifications.show({
          title: t("message.update-successfully"),
          color: "green",
          autoClose: 2000,
        });
        formik.resetForm();
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
        queryClient.invalidateQueries(["tasks"]);
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      {data && (
        <Grid container spacing={3}>
          <Grid xs={12} md={6} item>
            <FormControl fullWidth variant="filled">
              <InputLabel
                id="assignee"
                error={!!(formik.touched.assignee && formik.errors.assignee)}
              >
                {t("common.assign-task")}
              </InputLabel>
              <Select
                label={t("common.assign-task")}
                value={formik.values.assignee}
                onChange={formik.handleChange}
                error={!!(formik.touched.assignee && formik.errors.assignee)}
                name="assignee"
              >
                {data.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {getFullName(v.first_name, v.last_name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={6} item>
            <DateTimePicker
              componentsProps={{
                actionBar: {
                  actions: ["clear"],
                },
              }}
              label={t("common.deadline")}
              name="expires_at"
              inputFormat="dd/MM/yyyy HH:mm"
              value={formik.values.expires_at}
              onChange={(value) => {
                if (isValid(value)) formik.setFieldValue("expires_at", value.toISOString(), true);
                else formik.setFieldValue("expires_at", null, true);
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid xs={12} item>
            <TextField
              multiline
              minRows={3}
              fullWidth
              label={t("common.note")}
              name="note"
              error={!!(formik.touched.note && formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
              value={formik.values.note}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid xs={12} item>
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                {t("common.submit")}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </form>
  );
};
