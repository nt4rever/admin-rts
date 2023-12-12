import { postService } from "@/apis/post";
import Editor from "@/components/editor";
import { slugify } from "@/utils/string";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

const PostFormEdit = ({ data }) => {
  const { t } = useTranslation();

  const { data: postCategories } = useQuery({
    queryKey: ["post-categories"],
    queryFn: postService.categories,
    cacheTime: 5 * 60 * 60 * 1000,
    staleTime: 5 * 60 * 60 * 1000,
  });

  const mutation = useMutation({ mutationFn: postService.update });

  const postCategoryItems = postCategories?.map((cate, index) => (
    <MenuItem key={cate.id} value={cate.id}>
      {cate.name}
    </MenuItem>
  ));

  const formik = useFormik({
    initialValues: {
      category: data?.category?.id,
      title: data?.title,
      brief_content: data?.brief_content,
      content: data?.content,
      picture: data?.picture,
      slug: data?.slug,
      keyword_SEO: data?.keyword_SEO,
      description_SEO: data?.description_SEO,
      submit: null,
    },
    validationSchema: new Yup.object({
      category: Yup.string().nullable(),
      title: Yup.string()
        .required(t("validation.common.title-required"))
        .max(200, t("validation.common.max-length", { max: 200 })),
      brief_content: Yup.string()
        .max(500, t("validation.common.max-length", { max: 500 }))
        .nullable(),
      content: Yup.string()
        .max(100000, t("validation.common.max-length", { max: 100000 }))
        .required(),
      picture: Yup.string()
        .url(t("validation.url"))
        .max(200, t("validation.common.max-length", { max: 200 }))
        .nullable(),
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

  const onTitleChange = (e) => {
    const value = e.target.value;
    let slug = value?.trim() ? `${slugify(value)}-${Date.now()}` : "";
    formik.setFieldValue("title", value);
    formik.setFieldValue("slug", slug);
  };

  return (
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
                <FormHelperText error>
                  {formik.touched.category && formik.errors.category}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <TextField
                fullWidth
                label={t("common.title")}
                name="title"
                required
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
                placeholder={t("common.placeholder-post-content")}
              />
              <Typography color="error" sx={{ mt: 1 }} variant="body2">
                {formik.touched.content && formik.errors.content}
              </Typography>
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
                required
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
                required
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
  );
};

export default PostFormEdit;
