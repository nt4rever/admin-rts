
import { userService } from "@/apis/user";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = (props) => useQuery(["me"], userService.me, {
  ...props,
});
