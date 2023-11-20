import axiosClient from "@/libs/axios";

const TICKET_ENDPOINT = {
  create: "/tickets",
  all: "/tickets",
  get: "/tickets",
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

export const ticketService = { all, get };
