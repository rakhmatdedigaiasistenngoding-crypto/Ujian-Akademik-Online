import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Ekspor data JSON array ke file Excel (.xlsx)
 */
export const exportToExcel = (data: any[], filename: string, sheetName: string = "Sheet1") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Ekspor data ke PDF dengan AutoTable
 */
export const exportToPDF = (
  title: string,
  columns: string[],
  rows: any[][],
  filename: string
) => {
  const doc = new jsPDF();
  
  // Header Text
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Tanggal cetak
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Buat tautan berbagi via WhatsApp (wa.me)
 */
export const openWhatsAppShare = (message: string, phone: string = "") => {
  const encodedMessage = encodeURIComponent(message);
  // Jika phone kosong, user bisa pilih kontak di WA
  const url = phone 
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
    : `https://api.whatsapp.com/send?text=${encodedMessage}`;
  
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Buat tautan berbagi via Email Client (mailto:)
 */
export const openEmailShare = (email: string, subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const url = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  
  // Membuka default mail client (Outlook/Mail/Gmail)
  window.open(url, '_self');
};
