import axiosClient from "@/libs/axios";
import { removeEmpty } from "@/utils/remove-empty";

const POST_ENDPOINT = {
  get: "/posts",
  all: "/posts",
  create: "/posts",
  update: "/posts",
  categories: "/posts/categories",
};

const get = async (id) => {
  const { data } = await axiosClient.get(`${POST_ENDPOINT.get}/${id}`);
  return data;
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
  const dto = removeEmpty(payload);
  const { data } = await axiosClient.post(POST_ENDPOINT.create, dto);
  return data;
};

const update = async (payload) => {
  const dto = removeEmpty(payload);
  const { data } = await axiosClient.patch(POST_ENDPOINT.update, dto);
  return data;
};

export const postService = { get, all, categories, create, update };
