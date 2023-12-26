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
  const dto = {
    ...payload,
    content: [
      {
        lang: "vi",
        value: payload.content_vi,
      },
      {
        lang: "en",
        value: payload.content_en,
      },
    ],
  };

  delete dto.content_vi;
  delete dto.content_en;

  const { data } = await axiosClient.post(PAGE_ENDPOINT.base, dto);
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
