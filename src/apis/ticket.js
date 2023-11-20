import axiosClient from "@/libs/axios";

const TICKET_ENDPOINT = {
  create: "/tickets",
  all: "/tickets",
  get: "/tickets",
  update: "/tickets",
};

const all = async (params) => {
  const { data } = await axiosClient.get(TICKET_ENDPOINT.all, { params });
  return data;
};

const get = async (id, params = {}) => {
  const { data } = await axiosClient.get(`${TICKET_ENDPOINT.get}/${id}`, {
    params,
  });
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(`${TICKET_ENDPOINT.update}/${id}`, {
    ...dto,
    status: dto.status || undefined,
  });
  return data;
};

export const ticketService = { all, get, update };
