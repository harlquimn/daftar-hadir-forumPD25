import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PersonalInfoSectionProps {
  name: string;
  setName: (value: string) => void;
  nip: string;
  setNip: (value: string) => void;
  position: string;
  setPosition: (value: string) => void;
  institution: string;
  setInstitution: (value: string) => void;
}

const PersonalInfoSection = ({
  name = "",
  setName = () => {},
  nip = "",
  setNip = () => {},
  position = "",
  setPosition = () => {},
  institution = "",
  setInstitution = () => {},
}: PersonalInfoSectionProps) => {
  return (
    <div className="w-full bg-card p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Informasi Personal</h3>
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
      </div>
    </div>
  );
};

export default PersonalInfoSection;
