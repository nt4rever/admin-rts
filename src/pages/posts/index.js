import { postService } from "@/apis/post";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import ComponentLoading from "@/components/Loading/ComponentLoading";
import { PostTable } from "@/sections/posts/post-table";
import { useCallback } from "react";
import EmptyData from "@/components/empty-data";

const Page = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", { page, rowsPerPage }],
    queryFn: () =>
      postService.all({
        page,
        per_page: rowsPerPage,
      }),
    keepPreviousData: true,
  });

  const handlePageChange = useCallback((event, value) => {
    setPage(value + 1);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  }, []);

  return (
    <>
      <Head>
        <title>Posts | RTS Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{t("common.post-management")}</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  component={NextLink}
                  href="/posts/add"
                >
                  {t("common.add")}
                </Button>
              </div>
            </Stack>
            {isLoading && <ComponentLoading />}
            {data?.items?.length ? (
              <PostTable
                count={data.meta.item_count}
                items={data.items}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page - 1}
                rowsPerPage={rowsPerPage}
              />
            ) : (
              <EmptyData />
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
