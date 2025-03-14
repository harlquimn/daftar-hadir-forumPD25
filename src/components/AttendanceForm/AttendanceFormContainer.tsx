import React, { useState } from "react";
import FormHeader from "./FormHeader";
import CombinedInfoSection from "./CombinedInfoSection";
import SignatureSection from "./SignatureSection";
import FormActions from "./FormActions";
import SuccessDialog from "./SuccessDialog";
import { saveAttendance } from "@/lib/attendance";
import { useToast } from "@/components/ui/use-toast";

const AttendanceFormContainer = () => {
  // Form state
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [position, setPosition] = useState("");
  const [institution, setInstitution] = useState("");
  const [region, setRegion] = useState("");
  const [department, setDepartment] = useState("");
  const [signature, setSignature] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Nama harus diisi";
    if (!nip.trim()) newErrors.nip = "NIP harus diisi";
    if (!position.trim()) newErrors.position = "Jabatan harus diisi";
    if (!institution.trim()) newErrors.institution = "Instansi harus diisi";
    if (!region) newErrors.region = "Wilayah harus dipilih";
    if (!department) newErrors.department = "Bidang/Urusan harus dipilih";
    if (!signature) newErrors.signature = "Tanda tangan harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorId = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorId);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save data to Supabase
      const result = await saveAttendance({
        name,
        nip,
        position,
        institution,
        region,
        department,
        signature,
      });

      if (!result.success) {
        throw new Error("Gagal menyimpan data");
      }

      // Show success dialog
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description:
          "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setNip("");
    setPosition("");
    setInstitution("");
    setRegion("");
    setDepartment("");
    setSignature("");
    setErrors({});
  };

  const handleSubmitAnother = () => {
    setShowSuccess(false);
    resetForm();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background">
      <form
        onSubmit={handleSubmit}
        className="shadow-md rounded-lg overflow-hidden"
      >
        <FormHeader />

        <div className="p-4 md:p-6 space-y-6">
          <CombinedInfoSection
            name={name}
            setName={setName}
            nip={nip}
            setNip={setNip}
            position={position}
            setPosition={setPosition}
            institution={institution}
            setInstitution={setInstitution}
            region={region}
            setRegion={setRegion}
            department={department}
            setDepartment={setDepartment}
          />

          <SignatureSection signature={signature} setSignature={setSignature} />

          <FormActions
            onSubmit={handleSubmit}
            onReset={resetForm}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>

      <SuccessDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onSubmitAnother={handleSubmitAnother}
      />
    </div>
  );
};

export default AttendanceFormContainer;
