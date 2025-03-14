import React from "react";
import { Button } from "../ui/button";

interface FormActionsProps {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

const FormActions = ({
  onSubmit = () => {},
  onReset = () => {},
  isSubmitting = false,
}: FormActionsProps) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 justify-end mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="w-full sm:w-auto order-2 sm:order-1"
      >
        Reset Form
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full sm:w-auto order-1 sm:order-2"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Data"}
      </Button>
    </div>
  );
};

export default FormActions;
