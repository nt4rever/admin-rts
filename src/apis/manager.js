import axiosClient from "@/libs/axios";

const MANAGER_ENDPOINT = {
  area: "/managers/area",
  get: "/managers",
  update: "/managers",
  create: "/managers",
  delete: "/managers",
};

const area = async (payload) => {
  const { id, params } = payload;
  const { data } = await axiosClient.get(`${MANAGER_ENDPOINT.area}/${id}`, { params });
  return data;
};

const get = async (id) => {
  const { data } = await axiosClient.get(`${MANAGER_ENDPOINT.get}/${id}`);
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(`${MANAGER_ENDPOINT.update}/${id}`, {
    ...dto,
    gender: dto.gender || undefined,
  });
  return data;
};

const create = async (payload) => {
  const dto = { ...payload, gender: payload.gender || undefined };
  const { data } = await axiosClient.post(MANAGER_ENDPOINT.create, dto);
  return data;
};

const remove = async (id) => {
  const { data } = await axiosClient.delete(`${MANAGER_ENDPOINT.delete}/${id}`);
  return data;
};

export const managerService = { area, get, update, create, remove };
