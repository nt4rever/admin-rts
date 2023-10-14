import { authService } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authService.login,
  });
