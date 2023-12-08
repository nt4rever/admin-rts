import { volunteerService } from "@/apis/volunteer";
import { genders } from "@/constants/gender";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

const VolunteerUpdateForm = ({ user }) => {
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: volunteerService.update });

  const formik = useFormik({
    initialValues: {
      id: user?.id,
      lat: user?.location.lat,
      lng: user?.location.lng,
      radius: user?.location.radius,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || "",
      date_of_birth: null,
      gender: user?.gender || "",
      address: user?.address || "",
      is_active: user?.is_active ?? "",
      submit: null,
    },
    validationSchema: new Yup.object({
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
      first_name: Yup.string()
        .optional()
        .max(50, t("validation.common.max-length", { max: 50 })),
      last_name: Yup.string()
        .required(t("validation.account.last-name-required"))
        .max(50, t("validation.common.max-length", { max: 50 })),
      phone_number: Yup.string()
        .optional()
        .max(15, t("validation.common.max-length", { max: 15 })),
      date_of_birth: Yup.date().nullable().optional(),
      gender: Yup.mixed().oneOf(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
      is_active: Yup.boolean().optional().nullable(),
      address: Yup.string()
        .optional()
        .max(200, t("validation.common.max-length", { max: 200 })),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutation.mutateAsync(values);
        notifications.show({
          title: t("message.update-success"),
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
      }
    },
  });

  const genderItems = genders.map((gender, index) => (
    <MenuItem key={index} value={gender}>
      {t(`constraint.gender.${gender}`)}
    </MenuItem>
  ));

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                label={t("common.first-name")}
                name="first_name"
                error={!!(formik.touched.first_name && formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                label={t("common.last-name")}
                name="last_name"
                required
                error={!!(formik.touched.last_name && formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
                value={formik.values.last_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                label={t("common.address")}
                name="address"
                error={!!(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                value={formik.values.address}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                label={t("common.phone-number")}
                name="phone_number"
                error={!!(formik.touched.phone_number && formik.errors.phone_number)}
                helperText={formik.touched.phone_number && formik.errors.phone_number}
                value={formik.values.phone_number}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <DatePicker
                componentsProps={{
                  actionBar: {
                    actions: ["clear"],
                  },
                }}
                label={t("common.date-of-birth")}
                name="date_of_birth"
                inputFormat="dd/MM/yyyy"
                value={formik.values.date_of_birth}
                onChange={(value) => {
                  if (isValid(value))
                    formik.setFieldValue("date_of_birth", value.toISOString(), true);
                  else formik.setFieldValue("date_of_birth", null, true);
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <FormControl fullWidth variant="filled">
                <InputLabel id="gender">{t("common.gender")}</InputLabel>
                <Select
                  label="Age"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  name="gender"
                >
                  {genderItems}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6} item>
              <FormControl fullWidth variant="filled">
                <InputLabel id="is_active">{t("common.status")}</InputLabel>
                <Select
                  label="Status"
                  value={formik.values.is_active}
                  onChange={formik.handleChange}
                  name="is_active"
                >
                  <MenuItem value={true}>{t(`common.active`)}</MenuItem>
                  <MenuItem value={false}>{t(`common.inactive`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                type="number"
                label={t("common.latitude")}
                name="lat"
                required
                error={!!(formik.touched.lat && formik.errors.lat)}
                helperText={formik.touched.lat && formik.errors.lat}
                value={formik.values.lat}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                type="number"
                label={t("common.longitude")}
                name="lng"
                required
                error={!!(formik.touched.lng && formik.errors.lng)}
                helperText={formik.touched.lng && formik.errors.lng}
                value={formik.values.lng}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <TextField
                fullWidth
                type="number"
                label={t("common.radius")}
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
        <CardActions sx={{ px: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            {t("common.submit")}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default VolunteerUpdateForm;
