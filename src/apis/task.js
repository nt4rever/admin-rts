import axiosClient from "@/libs/axios";

const TASK_ENDPOINT = {
  taskByTicket: "/tasks/ticket",
};

const getByTicket = async (payload) => {
  const { id, ...params } = payload;
  const { data } = await axiosClient.get(`${TASK_ENDPOINT.taskByTicket}/${id}`, {
    params,
  });
  return data;
};

export const taskService = { getByTicket };
