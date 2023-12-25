import axiosClient from "@/libs/axios";

const PAGE_ENDPOINT = {
  base: "/pages",
  all: "/pages/all",
};

const get = async ({ type, slug = undefined }) => {
  const { data } = await axiosClient.get(PAGE_ENDPOINT.base, {
    params: {
      type,
      slug,
    },
  });
  return data;
};

const all = async (params = undefined) => {
  const { data } = await axiosClient.get(PAGE_ENDPOINT.all, { params });
  return data;
};

const create = async (payload) => {
  const { data } = await axiosClient.post(PAGE_ENDPOINT.base, payload);
  return data;
};

const deletePage = async ({ type, slug = undefined }) => {
  const { data } = await axiosClient.delete(PAGE_ENDPOINT.base, {
    params: {
      type,
      slug,
    },
  });
  return data;
};

export const pageService = { get, all, create, deletePage };
