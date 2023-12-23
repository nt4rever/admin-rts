import axiosClient from "@/libs/axios";

const USER_ENDPOINT = {
  me: "/users/me",
  updateProfile: "/users/profile",
  uploadAvatar: "/users/avatar",
  users: "/users",
};

const me = async () => {
  const { data } = await axiosClient.get(USER_ENDPOINT.me);
  return data;
};

const updateProfile = async (dto) => {
  await axiosClient.patch(USER_ENDPOINT.updateProfile, { ...dto, gender: dto.gender || undefined });
};

const uploadAvatar = async (dto) => {
  const formData = new FormData();
  formData.append("avatar", dto.avatar);

  await axiosClient.post(USER_ENDPOINT.uploadAvatar, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const list = async (params = undefined) => {
  const { data } = await axiosClient.get(USER_ENDPOINT.users, { params });
  return data;
};

const get = async (id) => {
  const { data } = await axiosClient.get(`${USER_ENDPOINT.users}/${id}`);
  return data;
};

const update = async (payload) => {
  const { id, ...dto } = payload;
  const { data } = await axiosClient.patch(`${USER_ENDPOINT.users}/${id}`, {
    ...dto,
    gender: dto.gender || undefined,
    password: dto.password || undefined,
  });
  return data;
};

export const userService = { me, updateProfile, uploadAvatar, list, get, update };
