import { areaService } from "@/apis/area";
import { genders } from "@/constants/gender";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as Yup from "yup";
import { isValid } from "date-fns";
import { useEffect } from "react";
import { managerService } from "@/apis/manager";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";

const Page = () => {
  const router = useRouter();

  const { t } = useTranslation();
  const { data: areas } = useQuery({
    queryKey: ["area"],
    queryFn: () =>
      areaService.all({
        order: "name|asc",
      }),
    staleTime: 5 * 60 * 100,
  });

  const mutation = useMutation({ mutationFn: managerService.create });

  useEffect(() => {
    if (areas?.length > 0 && !formik.values.area_id) {
      formik.setFieldValue("area_id", areas[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  const genderItems = genders.map((gender, index) => (
    <MenuItem key={index} value={gender}>
      {t(`constraint.gender.${gender}`)}
    </MenuItem>
  ));

  const formik = useFormik({
    initialValues: {
      area_id: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: null,
      gender: "",
      address: "",
      password: "",
      email: "",
      submit: null,
    },
    validationSchema: new Yup.object({
      email: Yup.string()
        .email(t("validation.login.email-valid"))
        .required(t("validation.login.email-required")),
      password: Yup.string()
        .required(t("validation.login.password-required"))
        .min(6, t("validation.common.min-length", { min: 6 }))
        .max(50, t("validation.common.max-length", { max: 50 })),
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
      address: Yup.string()
        .optional()
        .max(200, t("validation.common.max-length", { max: 200 })),
      area_id: Yup.string().required(),
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
        <title>Managers | RTS Admin</title>
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
                <Typography variant="body1">Managers</Typography>
              </ButtonBase>
            </Stack>
            <Stack>
              <Typography variant="h5">{t("common.add-area-manager")}</Typography>
            </Stack>
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
                        label={t("common.email")}
                        name="email"
                        required
                        error={!!(formik.touched.email && formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        value={formik.values.email}
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
                      <TextField
                        fullWidth
                        type="password"
                        label={t("common.password")}
                        name="password"
                        required
                        error={!!(formik.touched.password && formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        value={formik.values.password}
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
                        <InputLabel id="area_id">{t("common.area")}</InputLabel>
                        <Select
                          name="area_id"
                          MenuProps={{ disableScrollLock: true }}
                          value={formik.values.area_id}
                          onChange={formik.handleChange}
                        >
                          {areas?.map((item) => (
                            <MenuItem value={item.id} key={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "vi")),
    },
  };
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
