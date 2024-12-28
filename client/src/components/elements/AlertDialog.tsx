import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "../ui/button";

type AlertDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  cancelText: string;
  actionText: string;
  onAction: () => void; // Action handler for the confirm button
};

const CustomAlertDialog: React.FC<AlertDialogProps> = ({
  trigger,
  title,
  description,
  cancelText,
  actionText,
  onAction,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-md focus:outline-none data-[state=open]:animate-contentShow">
        <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
          {description}
        </AlertDialog.Description>
        <div className="flex justify-end gap-4">
          <AlertDialog.Cancel asChild>
            <Button variant={"secondary"}>{cancelText}</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button onClick={onAction}>{actionText}</Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default CustomAlertDialog;
