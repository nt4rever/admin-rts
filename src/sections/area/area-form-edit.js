import { areaService } from "@/apis/area";
import { useDeleteArea } from "@/hooks/use-delete-area";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import * as Yup from "yup";

export const AreaFromEdit = ({ data }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: areaService.update });
  const modalDelete = useDeleteArea({ id: data?.id });

  const formik = useFormik({
    initialValues: {
      id: data?.id,
      name: data?.name,
      address: data?.address,
      lat: data?.lat,
      lng: data?.lng,
      radius: data?.radius,
      submit: null,
    },
    validationSchema: new Yup.object({
      name: Yup.string()
        .required(t("validation.area.name"))
        .max(100, t("validation.common.max-length", { max: 100 })),
      address: Yup.string()
        .required(t("validation.area.address"))
        .max(200, t("validation.common.max-length", { max: 200 })),
      lat: Yup.number()
        .min(-90, t("validation.common.latitude-invalid"))
        .max(90, t("validation.common.latitude-invalid"))
        .required(t("validation.common.latitude-required")),
      lng: Yup.number()
        .min(-180, t("validation.common.longitude-invalid"))
        .max(180, t("validation.common.longitude-invalid"))
        .required(t("validation.common.longitude-required")),
      radius: Yup.number()
        .min(100, t("validation.radius.min"))
        .max(10000, t("validation.radius.max"))
        .required(t("validation.radius.required")),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutation.mutateAsync(values);
        notifications.show({
          title: t("message.update-success"),
          color: "green",
          autoClose: 2000,
        });
        router.back();
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
      }
    },
  });
  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} item>
              <TextField
                fullWidth
                label={t("common.name")}
                name="name"
                required
                error={!!(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                fullWidth
                label={t("common.address")}
                name="address"
                required
                error={!!(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                value={formik.values.address}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={4} item>
              <TextField
                fullWidth
                label={t("common.latitude")}
                type="number"
                name="lat"
                required
                error={!!(formik.touched.lat && formik.errors.lat)}
                helperText={formik.touched.lat && formik.errors.lat}
                value={formik.values.lat}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={4} item>
              <TextField
                fullWidth
                label={t("common.longitude")}
                type="number"
                name="lng"
                required
                error={!!(formik.touched.lng && formik.errors.lng)}
                helperText={formik.touched.lng && formik.errors.lng}
                value={formik.values.lng}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={4} item>
              <TextField
                fullWidth
                label={t("common.radius")}
                type="number"
                name="radius"
                required
                error={!!(formik.touched.radius && formik.errors.radius)}
                helperText={formik.touched.radius && formik.errors.radius}
                value={formik.values.radius}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ px: 1, justifyContent: "space-between" }}>
          <Button variant="outlined" color="error" onClick={modalDelete}>
            {t("common.delete-area")}
          </Button>
          <Button variant="contained" type="submit">
            {t("common.submit")}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
