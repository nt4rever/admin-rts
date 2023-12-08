import { managerService } from "@/apis/manager";
import { volunteerService } from "@/apis/volunteer";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

export const useDeleteAccount = ({ id, type }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const service = serviceGateGateway[type];
  if (!service) throw new Error("Service unavailable");
  const mutation = useMutation({
    mutationFn: service,
  });
  const openModal = () =>
    modals.openConfirmModal({
      title: t("message.delete-account"),
      centered: true,
      zIndex: 9999,
      children: <Text size="sm">{t("message.delete-account-hint")}</Text>,
      labels: { confirm: t("common.submit"), cancel: t("common.cancel") },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => {
        mutation.mutate(id, {
          onSuccess: () => {
            router.back();
          },
          onError: (err) => {
            notifications.show({
              title: t("message.update-fail"),
              color: "red",
            });
          },
        });
      },
    });

  return openModal;
};

const serviceGateGateway = {
  MANAGER: managerService.remove,
  VOLUNTEER: volunteerService.remove,
};
