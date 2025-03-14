import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectionSectionProps {
  region: string;
  setRegion: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
}

const SelectionSection = ({
  region = "",
  setRegion = () => {},
  department = "",
  setDepartment = () => {},
}: SelectionSectionProps) => {
  // Sample data for dropdowns
  const regions = [
    "Kota Jakarta",
    "Kota Bandung",
    "Kota Surabaya",
    "Kota Medan",
    "Kota Makassar",
  ];

  const departments = [
    "Bidang Perencanaan",
    "Bidang Keuangan",
    "Bidang Infrastruktur",
    "Bidang Pendidikan",
    "Bidang Kesehatan",
  ];

  return (
    <div className="w-full bg-card p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Informasi Wilayah dan Bidang
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">
            Wilayah <span className="text-destructive">*</span>
          </Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Pilih wilayah" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">
            Bidang/Urusan <span className="text-destructive">*</span>
          </Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Pilih bidang/urusan" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SelectionSection;
