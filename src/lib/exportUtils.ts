import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toPng } from "html-to-image";
import { format } from "date-fns";
import { AttendanceData } from "./attendance";

// Helper to format date consistently
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
};

// Export to Excel
export const exportToExcel = (data: AttendanceData[]) => {
  // Create a worksheet with all data except signatures (which won't display well in Excel)
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item, index) => ({
      No: index + 1,
      Nama: item.name,
      NIP: item.nip,
      Jabatan: item.position,
      Instansi: item.institution,
      Wilayah: item.region,
      "Bidang/Urusan": item.department,
      TTD: "[Tanda Tangan]", // Add placeholder for signature
      Tanggal: formatDate(item.created_at),
    })),
  );

  // Set column widths
  const columnWidths = [
    { wch: 5 }, // No
    { wch: 25 }, // Nama
    { wch: 20 }, // NIP
    { wch: 25 }, // Jabatan
    { wch: 25 }, // Instansi
    { wch: 25 }, // Wilayah
    { wch: 25 }, // Bidang/Urusan
    { wch: 15 }, // TTD
    { wch: 20 }, // Tanggal
  ];
  worksheet["!cols"] = columnWidths;

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Kehadiran");

  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Daftar_Kehadiran_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`,
  );
};

// Export to PDF
export const exportToPDF = async (data: AttendanceData[]) => {
  // Create new PDF document
  const doc = new jsPDF("landscape");

  // Add title
  doc.setFontSize(16);
  doc.text(
    "Daftar Kehadiran Forum Perangkat Daerah Tahun 2025",
    doc.internal.pageSize.getWidth() / 2,
    15,
    { align: "center" },
  );
  doc.setFontSize(12);
  doc.text(
    "Dinas Pekerjaan Umum Penataan Ruang & Perumahan Rakyat Kawasan Permukiman",
    doc.internal.pageSize.getWidth() / 2,
    22,
    { align: "center" },
  );
  doc.text(
    "Provinsi Kepulauan Bangka Belitung",
    doc.internal.pageSize.getWidth() / 2,
    29,
    { align: "center" },
  );

  // Process signatures and create table data
  const tableRows = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const row = [
      i + 1,
      item.name,
      item.nip,
      item.position,
      item.institution,
      item.region,
      item.department,
      // Signature cell will be handled specially
      "", // Empty placeholder for signature
      formatDate(item.created_at),
    ];
    tableRows.push(row);
  }

  // Generate the table with space for signatures
  const table = autoTable(doc, {
    head: [
      [
        "No",
        "Nama",
        "NIP",
        "Jabatan",
        "Instansi",
        "Wilayah",
        "Bidang/Urusan",
        "TTD",
        "Tanggal",
      ],
    ],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 50, 65] },
    columnStyles: {
      0: { cellWidth: 10 }, // No
      1: { cellWidth: 30 }, // Nama
      2: { cellWidth: 20 }, // NIP
      3: { cellWidth: 25 }, // Jabatan
      4: { cellWidth: 25 }, // Instansi
      5: { cellWidth: 25 }, // Wilayah
      6: { cellWidth: 25 }, // Bidang/Urusan
      7: { cellWidth: 30 }, // TTD
      8: { cellWidth: 20 }, // Tanggal
    },
    didDrawCell: (data) => {
      // Only process cells in the TTD column (index 7) and not header
      if (data.section === "body" && data.column.index === 7) {
        const rowIndex = data.row.index;
        const item = tableRows[rowIndex];
        const attendanceItem = data[rowIndex];

        if (attendanceItem && attendanceItem.signature) {
          try {
            // Add signature image to the cell
            const cellWidth = data.cell.width;
            const cellHeight = data.cell.height;
            const x = data.cell.x + 2; // Add some padding
            const y = data.cell.y + 2; // Add some padding
            const imgWidth = cellWidth - 4;
            const imgHeight = cellHeight - 4;

            doc.addImage(
              data[rowIndex].signature,
              "PNG",
              x,
              y,
              imgWidth,
              imgHeight,
            );
          } catch (error) {
            console.error("Error adding signature to PDF table:", error);
          }
        }
      }
    },
  });

  // Save the PDF
  doc.save(`Daftar_Kehadiran_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`);
};

// Export to Word (DOC)
export const exportToWord = (data: AttendanceData[]) => {
  // Create HTML content for Word document
  let htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Daftar Kehadiran</title>
      <style>
        @page {
          size: Legal;
          margin: 1cm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
        .signature-img { width: auto; max-width: 100px; height: auto; max-height: 50px; display: block; margin: auto; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Daftar Kehadiran Forum Perangkat Daerah Tahun 2025</h2>
        <h3>Dinas Pekerjaan Umum Penataan Ruang & Perumahan Rakyat Kawasan Permukiman</h3>
        <h3>Provinsi Kepulauan Bangka Belitung</h3>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>NIP</th>
            <th>Jabatan</th>
            <th>Instansi</th>
            <th>Wilayah</th>
            <th>Bidang/Urusan</th>
            <th>TTD</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add table rows with signatures
  data.forEach((item, index) => {
    const signatureCell = item.signature
      ? `<td><img src="${item.signature}" class="signature-img" alt="Tanda tangan ${item.name}"></td>`
      : `<td></td>`;

    htmlContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.nip}</td>
        <td>${item.position}</td>
        <td>${item.institution}</td>
        <td>${item.region}</td>
        <td>${item.department}</td>
        ${signatureCell}
        <td>${formatDate(item.created_at)}</td>
      </tr>
    `;
  });

  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: "application/msword" });
  saveAs(blob, `Daftar_Kehadiran_${format(new Date(), "yyyyMMdd_HHmmss")}.doc`);
};
