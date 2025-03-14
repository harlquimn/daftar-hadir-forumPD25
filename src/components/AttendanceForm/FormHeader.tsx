import React from "react";

interface FormHeaderProps {
  title?: string;
  subtitle1?: string;
  subtitle2?: string;
}

const FormHeader = ({
  title = "Forum Perangkat Daerah Tahun 2025",
  subtitle1 = "Dinas Pekerjaan Umum Penataan Ruang & Perumahan Rakyat Kawasan Permukiman",
  subtitle2 = "Provinsi Kepulauan Bangka Belitung",
}: FormHeaderProps) => {
  return (
    <div className="w-full bg-primary p-4 text-center text-primary-foreground rounded-t-lg">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      <h2 className="text-lg md:text-xl font-semibold">{subtitle1}</h2>
      <h3 className="text-md md:text-lg">{subtitle2}</h3>
    </div>
  );
};

export default FormHeader;
