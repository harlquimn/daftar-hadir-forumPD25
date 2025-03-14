import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { exportToExcel, exportToPDF, exportToWord } from "@/lib/exportUtils";
import { AttendanceData } from "@/lib/attendance";

interface ExportButtonsProps {
  data: AttendanceData[];
  isDisabled?: boolean;
}

const ExportButtons = ({
  data = [],
  isDisabled = false,
}: ExportButtonsProps) => {
  const handleExportToExcel = () => {
    exportToExcel(data);
  };

  const handleExportToPDF = async () => {
    await exportToPDF(data);
  };

  const handleExportToWord = () => {
    exportToWord(data);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleExportToExcel}
        variant="outline"
        size="sm"
        disabled={isDisabled || data.length === 0}
        className="flex items-center"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={handleExportToWord}
        variant="outline"
        size="sm"
        disabled={isDisabled || data.length === 0}
        className="flex items-center"
      >
        <FileText className="mr-2 h-4 w-4" />
        Export Word
      </Button>
      <Button
        onClick={handleExportToPDF}
        variant="outline"
        size="sm"
        disabled={isDisabled || data.length === 0}
        className="flex items-center"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
