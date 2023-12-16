import { areaService } from "@/apis/area";
import { notifications } from "@mantine/notifications";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as Yup from "yup";

const Page = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: areaService.update });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      lat: "",
      lng: "",
      radius: 5000,
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
          title: t("message.create-success"),
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
          title: t("message.create-fail"),
          color: "red",
        });
      }
    },
  });

  return (
    <>
      <Head>
        <title>Areas | RTS Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 5,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row">
              <ButtonBase
                onClick={() => {
                  router.back();
                }}
                sx={{ gap: 1 }}
              >
                <ArrowLeft />
                <Typography variant="body1">{t("common.back")}</Typography>
              </ButtonBase>
            </Stack>
            <Stack>
              <Typography variant="h5">{t("common.add-area")}</Typography>
            </Stack>
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
                <CardActions sx={{ px: 1, justifyContent: "flex-end" }}>
                  <Button variant="contained" type="submit">
                    {t("common.submit")}
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "vi")),
    },
  };
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
