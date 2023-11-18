import axiosClient from "@/libs/axios";

const MANAGER_ENDPOINT = {
  area: "/managers/area",
};

const area = async (payload) => {
  const { id, ...params } = payload;
  const { data } = await axiosClient.get(`${MANAGER_ENDPOINT.area}/${id}`, { params });
  return data;
};

export const managerService = { area };
