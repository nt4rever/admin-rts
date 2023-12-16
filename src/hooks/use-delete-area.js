import { areaService } from "@/apis/area";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

export const useDeleteArea = ({ id }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: areaService.deleteArea,
  });
  const openModal = () =>
    modals.openConfirmModal({
      title: t("message.delete-area"),
      centered: true,
      zIndex: 9999,
      children: <Text size="sm">{t("message.delete-area-hint")}</Text>,
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
