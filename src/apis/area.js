import axiosClient from "@/libs/axios";

const AREA_ENDPOINT = {
  all: "/areas",
  get: "/areas",
  create: "/areas",
  update: "/areas",
  delete: "/areas",
};

const all = async (params = undefined) => {
  const { data } = await axiosClient.get(AREA_ENDPOINT.all, { params });
  return data;
};

const get = async (id) => {
  const { data } = await axiosClient.get(AREA_ENDPOINT.get + `/${id}`);
  return data;
};

const create = async (payload) => {
  const { data } = await axiosClient.post(AREA_ENDPOINT.create, payload);
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(AREA_ENDPOINT.update + `/${id}`, dto);
  return data;
};

const deleteArea = async (id) => {
  const { data } = await axiosClient.delete(AREA_ENDPOINT.delete + `/${id}`);
  return data;
};

export const areaService = { all, create, get, update, deleteArea };
