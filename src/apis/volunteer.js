import axiosClient from "@/libs/axios";

const VOLUNTEER_ENDPOINT = {
  all: "/volunteers",
  get: "/volunteers",
  update: "/volunteers",
  create: "/volunteers",
  list: "/volunteers/list",
};

const all = async (params) => {
  const { data } = await axiosClient.get(VOLUNTEER_ENDPOINT.all, {
    params,
  });
  return data;
};

const get = async (id) => {
  const { data } = await axiosClient.get(`${VOLUNTEER_ENDPOINT.get}/${id}`);
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(`${VOLUNTEER_ENDPOINT.update}/${id}`, dto);
  return data;
};

const create = async (payload) => {
  const dto = { ...payload, gender: payload.gender || undefined };
  const { data } = await axiosClient.post(VOLUNTEER_ENDPOINT.create, dto);
  return data;
};

const list = async (params) => {
  const { data } = await axiosClient.get(VOLUNTEER_ENDPOINT.list, {
    params,
  });
  return data;
};

export const volunteerService = { all, get, update, create, list };
