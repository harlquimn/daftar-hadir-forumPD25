import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitAnother: () => void;
}

const SuccessDialog = ({
  open = true,
  onClose = () => {},
  onSubmitAnother = () => {},
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">Berhasil!</DialogTitle>
          <DialogDescription className="text-center">
            Data kehadiran Anda telah berhasil disimpan. Terima kasih atas
            partisipasi Anda dalam Forum Perangkat Daerah Tahun 2025.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Tutup
          </Button>
          <Button
            type="button"
            onClick={onSubmitAnother}
            className="w-full sm:w-auto"
          >
            Isi Form Lagi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
