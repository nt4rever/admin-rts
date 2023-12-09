import axiosClient from "@/libs/axios";

const TICKET_ENDPOINT = {
  create: "/tickets",
  all: "/tickets",
  get: "/tickets",
  update: "/tickets",
  assign: (id) => `/tickets/${id}/assign`,
  excel: "/exports/reports",
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

const assign = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.post(TICKET_ENDPOINT.assign(id), {
    ...dto,
    expires_at: dto.expires_at || undefined,
  });
  return data;
};

const exportExcel = async (payload) => {
  const { data } = await axiosClient.post(TICKET_ENDPOINT.excel, payload, {
    responseType: "blob",
  });
  return data;
};

export const ticketService = { all, get, update, assign, exportExcel };
