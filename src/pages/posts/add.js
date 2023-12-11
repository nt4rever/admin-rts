import { postService } from "@/apis/post";
import { volunteerService } from "@/apis/volunteer";
import Editor from "@/components/editor";
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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
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

  const { data: postCategories } = useQuery({
    queryKey: ["post-categories"],
    queryFn: postService.categories,
    cacheTime: 5 * 60 * 60 * 1000,
    staleTime: 5 * 60 * 60 * 1000,
  });

  const mutation = useMutation({ mutationFn: postService.create });

  const postCategoryItems = postCategories?.map((cate, index) => (
    <MenuItem key={cate.id} value={cate.id}>
      {cate.name}
    </MenuItem>
  ));

  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      brief_content: "",
      content: "",
      picture: "",
      slug: "",
      keyword_SEO: "",
      description_SEO: "",
      submit: null,
    },
    validationSchema: new Yup.object({
      category: Yup.string().required(),
      title: Yup.string()
        .required()
        .max(50, t("validation.common.max-length", { max: 50 })),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // await mutation.mutateAsync(values);
        notifications.show({
          title: t("message.create-success"),
          color: "green",
          autoClose: 2000,
        });
        // router.back();
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
    const slug = value?.trim() ? `${slugify(value)}-${Date.now()}` : "";
    formik.setFieldValue("title", value);
    formik.setFieldValue("slug", slug);
  };

  return (
    <>
      <Head>
        <title>Posts | RTS Admin</title>
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
              <Typography variant="h5">{t("common.add-post")}</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12} item>
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="gender">{t("common.category")}</InputLabel>
                        <Select
                          label="Category"
                          value={formik.values.category}
                          onChange={formik.handleChange}
                          name="category"
                        >
                          {postCategoryItems}
                        </Select>
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
                      <Editor
                        content={formik.values.content}
                        onChange={(v) => formik.setFieldValue("content", v)}
                      />
                    </Grid>
                    <Grid xs={12} item>
                      <TextField
                        fullWidth
                        label={t("common.cover-image")}
                        name="picture"
                        error={!!(formik.touched.picture && formik.errors.picture)}
                        helperText={formik.touched.picture && formik.errors.picture}
                        value={formik.values.picture}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
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
                        error={!!(formik.touched.description_SEO && formik.errors.description_SEO)}
                        helperText={formik.touched.description_SEO && formik.errors.description_SEO}
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
