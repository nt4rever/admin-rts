import axiosClient from "@/libs/axios";

const STATS_ENDPOINT = {
  admin: "/stats/admin",
};

const admin = async () => {
  const { data } = await axiosClient.get(STATS_ENDPOINT.admin);
  return data;
};

export const statsService = { admin };
