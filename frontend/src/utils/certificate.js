import { jsPDF } from "jspdf";

export const generateCertificate = ({
    name,
    courseName,
    completedAt,
    validUntil,
    certId,
    summary = { description: "", modules: [] }
}) => {
    const safeName = String(name ?? "Nama Peserta");
    const safeCourse = String(courseName ?? "Nama Kursus");
    const safeCompleted = String(completedAt ?? "-");
    const safeValidUntil = String(validUntil ?? "-");
    const safeCertId = String(certId ?? "NO-ID");

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // =============== PAGE 1 ===============
    // NOMOR SERTIFIKAT (atas)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text(safeCertId, width / 2, 80, { align: "center" });

    // "Diberikan kepada"
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Diberikan kepada", width / 2, 130, { align: "center" });

    // Nama Peserta (besar)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(36);
    doc.text(safeName, width / 2, 180, { align: "center" });

    // "Atas kelulusannya pada kelas"
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Atas kelulusannya pada kelas", width / 2, 220, { align: "center" });

    // Nama Course
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text(safeCourse, width / 2, 260, { align: "center" });

    // Tanggal
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text(safeCompleted, width / 2, 295, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Berlaku hingga ${safeValidUntil}`, width / 2, height - 80, { align: "center" });

    // =============== PAGE 2 ===============
    doc.addPage();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Ringkasan Kelas", 40, 60);

    // Deskripsi (wrap)
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    let cursorY = 100;

    const descText = String(summary?.description ?? "");
    const wrappedDesc = doc.splitTextToSize(descText, width - 80); // returns array of lines
    doc.text(wrappedDesc, 40, cursorY);
    cursorY += (wrappedDesc.length * 18) + 18;

    // Subjudul Materi
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Materi yang Dipelajari:", 40, cursorY);
    cursorY += 30;

    // Daftar Materi — beri fallback bila kosong
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);

    const modules = Array.isArray(summary?.modules) ? summary.modules : [];

    if (modules.length === 0) {
        doc.text("- Tidak ada daftar materi -", 50, cursorY);
        cursorY += 22;
    } else {
        modules.forEach((mod) => {
            const title = String(mod?.title ?? "Untitled");
            const duration = String(mod?.duration ?? "-");
            // jika judul sangat panjang, wrap kecil per item:
            const itemWrapped = doc.splitTextToSize(`• ${title} — ${duration}`, width - 100);
            doc.text(itemWrapped, 50, cursorY);
            cursorY += (itemWrapped.length * 18) + 8;
        });
    }

    // save
    doc.save(`${safeName}-certificate.pdf`);
};
