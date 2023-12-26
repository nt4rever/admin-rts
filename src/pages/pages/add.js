import { pageService } from "@/apis/page";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import Editor from "@/components/editor";
import { STATIC_PAGE_TYPE } from "@/constants/static-page";
import { slugify } from "@/utils/string";
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
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as Yup from "yup";

const getContent = (content, lang = "en") => content?.find((c) => c?.lang === lang)?.value;

const Page = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { type, slug } = router.query;
  const enabled = !!type;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["static-page", { type, slug }],
    queryFn: () =>
      pageService.get({
        type,
        slug,
      }),
    enabled,
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: pageService.create });

  const staticPageTypeItems = STATIC_PAGE_TYPE?.map((value, index) => (
    <MenuItem key={index} value={value}>
      {value}
    </MenuItem>
  ));

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: data?.type ?? STATIC_PAGE_TYPE[0],
      title: data?.title ?? "",
      brief_content: data?.brief_content ?? "",
      content_vi: data?.content ? getContent(data.content, "vi") : "",
      content_en: data?.content ? getContent(data.content, "en") : "",
      slug: data?.slug ?? "",
      keyword_SEO: data?.keyword_SEO ?? "",
      description_SEO: data?.description_SEO ?? "",
    },
    validationSchema: new Yup.object({
      type: Yup.mixed().oneOf(STATIC_PAGE_TYPE).optional().required(),
      title: Yup.string()
        .nullable()
        .max(200, t("validation.common.max-length", { max: 200 })),
      brief_content: Yup.string()
        .max(500, t("validation.common.max-length", { max: 500 }))
        .nullable(),
      content_vi: Yup.string()
        .max(100000, t("validation.common.max-length", { max: 100000 }))
        .required(t("validation.common.content-required")),
      content_en: Yup.string()
        .max(100000, t("validation.common.max-length", { max: 100000 }))
        .required(t("validation.common.content-required")),
      keyword_SEO: Yup.string()
        .max(200, t("validation.common.max-length", { max: 500 }))
        .nullable(),
      description_SEO: Yup.string()
        .max(500, t("validation.common.max-length", { max: 500 }))
        .nullable(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutation.mutateAsync(values);
        notifications.show({
          title: t("message.create-success"),
          color: "green",
          autoClose: 2000,
        });
        queryClient.invalidateQueries(["static-page"]);
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

  const onTitleChange = (e) => {
    const value = e.target.value;
    let slug = slugify(value);
    formik.setFieldValue("title", value);
    formik.setFieldValue("slug", slug);
  };

  if (isError) {
    router.push("/404");
  }

  return (
    <>
      <Head>
        <title>Pages | RTS Admin</title>
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
              <Typography variant="h5">{t("constraint.nav.Pages")}</Typography>
            </Stack>
            {isLoading && enabled ? (
              <ComponentLoading />
            ) : (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Card>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid xs={12} item>
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="gender">{t("common.type")}</InputLabel>
                          <Select
                            label="Type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            name="type"
                          >
                            {staticPageTypeItems}
                          </Select>
                          <FormHelperText error>
                            {formik.touched.type && formik.errors.type}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid xs={12} item>
                        <TextField
                          fullWidth
                          label={t("common.title")}
                          name="title"
                          error={!!(formik.touched.title && formik.errors.title)}
                          helperText={formik.touched.title && formik.errors.title}
                          value={formik.values.title}
                          onBlur={formik.handleBlur}
                          onChange={onTitleChange}
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <TextField
                          fullWidth
                          label="Slug"
                          name="slug"
                          error={!!(formik.touched.slug && formik.errors.slug)}
                          helperText={formik.touched.slug && formik.errors.slug}
                          value={formik.values.slug}
                          disabled
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <TextField
                          fullWidth
                          label={t("common.brief-content")}
                          name="brief_content"
                          error={!!(formik.touched.brief_content && formik.errors.brief_content)}
                          helperText={formik.touched.brief_content && formik.errors.brief_content}
                          value={formik.values.brief_content}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <Typography sx={{ mb: 1 }} variant="body2">
                          Vietnamese
                        </Typography>
                        <Editor
                          content={formik.values.content_vi}
                          onChange={(v) => formik.setFieldValue("content_vi", v)}
                          placeholder={t("common.placeholder-post-content")}
                        />
                        <Typography color="error" sx={{ mb: 1 }} variant="body2">
                          {formik.touched.content_vi && formik.errors.content_vi}
                        </Typography>
                      </Grid>

                      <Grid xs={12} item>
                        <Typography sx={{ mb: 1 }} variant="body2">
                          English
                        </Typography>
                        <Editor
                          content={formik.values.content_en}
                          onChange={(v) => formik.setFieldValue("content_en", v)}
                          placeholder={t("common.placeholder-post-content")}
                        />
                        <Typography color="error" sx={{ mt: 1 }} variant="body2">
                          {formik.touched.content_en && formik.errors.content_en}
                        </Typography>
                      </Grid>

                      <Grid xs={12} item>
                        <TextField
                          fullWidth
                          label="Keyword SEO"
                          name="keyword_SEO"
                          error={!!(formik.touched.keyword_SEO && formik.errors.keyword_SEO)}
                          helperText={formik.touched.keyword_SEO && formik.errors.keyword_SEO}
                          value={formik.values.keyword_SEO}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <TextField
                          fullWidth
                          label="Description SEO"
                          name="description_SEO"
                          error={
                            !!(formik.touched.description_SEO && formik.errors.description_SEO)
                          }
                          helperText={
                            formik.touched.description_SEO && formik.errors.description_SEO
                          }
                          value={formik.values.description_SEO}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          multiline
                          rows={4}
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
            )}
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
