import axiosClient from "@/libs/axios";

const MANAGER_ENDPOINT = {
  area: "/managers/area",
  get: "/managers",
  update: "/managers",
};

const area = async (payload) => {
  const { id, ...params } = payload;
  const { data } = await axiosClient.get(`${MANAGER_ENDPOINT.area}/${id}`, { params });
  return data;
};

const get = async (id) => {
  const { data } = await axiosClient.get(`${MANAGER_ENDPOINT.get}/${id}`);
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(`${MANAGER_ENDPOINT.update}/${id}`, dto);
  return data;
};

export const managerService = { area, get, update };
