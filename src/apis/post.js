import axiosClient from "@/libs/axios";

const POST_ENDPOINT = {
  all: "/posts",
  create: "/posts",
  categories: "/posts/categories",
};

const all = async (params = undefined) => {
  const { data } = await axiosClient.get(POST_ENDPOINT.all, { params });
  return data;
};

const categories = async () => {
  const { data } = await axiosClient.get(POST_ENDPOINT.categories);
  return data;
};

const create = async (payload) => {
  const dto = { ...payload };
  const { data } = await axiosClient.post(POST_ENDPOINT.create, dto);
  return data;
};

export const postService = { all, categories, create };
