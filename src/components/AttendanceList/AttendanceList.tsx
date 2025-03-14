import React, { useEffect, useState } from "react";
import { getAttendances, AttendanceData } from "@/lib/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import ExportButtons from "./ExportButtons";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const result = await getAttendances();
      if (result.success) {
        setAttendances(result.data || []);
        setError(null);
      } else {
        setError("Gagal mengambil data kehadiran");
      }
    } catch (err) {
      console.error("Error fetching attendances:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          Daftar Kehadiran
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <ExportButtons data={attendances} isDisabled={loading} />

          <Button onClick={fetchAttendances} variant="outline" size="sm">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading && !error ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Memuat data...</span>
          </div>
        ) : attendances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data kehadiran
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Instansi</TableHead>
                  <TableHead>Wilayah</TableHead>
                  <TableHead>Bidang/Urusan</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{attendance.name}</TableCell>
                    <TableCell>{attendance.nip}</TableCell>
                    <TableCell>{attendance.position}</TableCell>
                    <TableCell>{attendance.institution}</TableCell>
                    <TableCell>{attendance.region}</TableCell>
                    <TableCell>{attendance.department}</TableCell>
                    <TableCell>
                      {attendance.created_at
                        ? format(
                            new Date(attendance.created_at),
                            "dd/MM/yyyy HH:mm",
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceList;
