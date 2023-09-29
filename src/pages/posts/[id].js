import { getPost } from "@/apis/post";
import { withCSR } from "@/hocs/with-csr";
import { usePost } from "@/hooks/queries/post";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

const PostPage = ({ isError }) => {
  const {
    query: { id },
  } = useRouter();

  const { t } = useTranslation();

  const { data, isLoading } = usePost(id);

  if (isError) return <div>{t("page_not_found")}</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div> {JSON.stringify(data)}</div>;
};

export const getServerSideProps = withCSR(async (ctx) => {
  const { id } = ctx.params;

  const queryClient = new QueryClient();

  let isError = false;

  try {
    await queryClient.fetchQuery(["post", id], () => getPost(id));
  } catch (error) {
    isError = true;
    ctx.res.statusCode = error.response.status;
  }

  return {
    props: {
      isError,
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(ctx.locale || "vi")),
    },
  };
});

export default PostPage;
