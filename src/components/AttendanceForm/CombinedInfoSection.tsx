import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CombinedInfoSectionProps {
  name: string;
  setName: (value: string) => void;
  nip: string;
  setNip: (value: string) => void;
  position: string;
  setPosition: (value: string) => void;
  institution: string;
  setInstitution: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
}

const CombinedInfoSection = ({
  name = "",
  setName = () => {},
  nip = "",
  setNip = () => {},
  position = "",
  setPosition = () => {},
  institution = "",
  setInstitution = () => {},
  region = "",
  setRegion = () => {},
  department = "",
  setDepartment = () => {},
}: CombinedInfoSectionProps) => {
  // Sample data for dropdowns
  const regions = [
    "Prov. Kep. Bangka Belitung",
    "Kota Pangkalpinang",
    "Kab. Bangka",
    "Kab. Belitung",
    "Kab. Bangka Selatan",
    "Kab. Bangka Tengah",
    "Kab. Bangka Barat",
    "Kab. Belitung Timur",
  ];

  const departments = [
    "Sumber Daya Air",
    "Cipta Karya, Perumahan, & Permukiman",
    "Bina Marga",
    "Jasa Konstruksi",
    "Tata Ruang & Pertanahan",
  ];

  return (
    <div className="w-full bg-card p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Daftar Hadir Peserta</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nama Lengkap <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nip">
            NIP <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            id="nip"
            placeholder="Masukkan NIP"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">
            Jabatan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="position"
            placeholder="Masukkan jabatan"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">
            Instansi <span className="text-destructive">*</span>
          </Label>
          <Input
            id="institution"
            placeholder="Masukkan instansi"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </div>
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

export default CombinedInfoSection;
