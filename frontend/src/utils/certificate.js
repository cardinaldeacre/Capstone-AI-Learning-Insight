import { jsPDF } from "jspdf";



export const generateCertificate = ({
    name,
    courseName,
    completedAt,
    certId,
    summary = { description: "", modules: [] },
    logo
}) => {
    const safeName = String(name ?? "Nama Peserta");
    const safeCourse = String(courseName ?? "Nama Kursus");
    const safeCompleted = String(completedAt ?? "-");
    const safeCertId = String(certId ?? "NO-ID");

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const COLOR_DARK_BLUE = "#2D3E50";
    const COLOR_TEAL = "#00A3C4";
    const COLOR_GRAY = "#666666";
    const COLOR_WHITE = "#FFFFFF";

    // =============== PAGE 1: SERTIFIKAT ===============

    // Border luar tipis
    doc.setDrawColor(COLOR_DARK_BLUE);
    doc.setLineWidth(40);
    doc.rect(0, 0, width - 0, height - 0);
    // Border dalam (opsional, untuk efek frame ganda)
    doc.setLineWidth(0.5);
    doc.rect(25, 25, width - 50, height - 50);

    // Ribbon Shape (Polygon manual sederhana)
    doc.setFillColor(COLOR_DARK_BLUE);
    // Menggambar bentuk pita yang menggantung dari atas
    const ribbonX = width - 130;
    doc.rect(ribbonX, 0, 80, 180, "F");
    // Segitiga bawah pita (efek potongan)
    doc.setFillColor(255, 255, 255);
    doc.triangle(ribbonX, 180, ribbonX + 40, 145, ribbonX + 90, 190, "F");

    // Teks di dalam Ribbon
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(COLOR_WHITE);
    doc.setFontSize(11);
    doc.text("SERTIFIKAT", ribbonX + 40, 40, { align: "center" });
    doc.text("KOMPETENSI", ribbonX + 40, 52, { align: "center" });
    doc.text("KELULUSAN", ribbonX + 40, 64, { align: "center" });

    const badgeCenterX = ribbonX + 40;
    const badgeCenterY = 100;

    if (logo) {
        // Ukuran gambar badge kamu
        const logoWidth = 42;
        const logoHeight = 46;

        const renderX = badgeCenterX - (logoWidth / 2);
        const renderY = badgeCenterY - (logoHeight / 2);

        // Render gambar di posisi Badge
        doc.addImage(logo, 'PNG', renderX, renderY, logoWidth, logoHeight);
    } else {
        // Fallback: Jika tidak ada gambar, gambar lingkaran putih + Teks BADGE
        doc.setFillColor(255, 255, 255);
        doc.circle(badgeCenterX, badgeCenterY, 25, "F"); // Lingkaran background

        doc.setTextColor(COLOR_DARK_BLUE);
        doc.setFontSize(8);
        // Align center & baseline middle agar teks pas di tengah titik
        doc.text("BADGE", badgeCenterX, badgeCenterY, { align: 'center', baseline: 'middle' });
    }

    // --- D. Konten Utama (Rata Kiri) ---
    let cursorY = 110;
    const leftMargin = 50;

    // 1. ID Box (Dark Box, White Text)
    doc.setFillColor(COLOR_DARK_BLUE);
    doc.roundedRect(leftMargin, cursorY, 100, 20, 3, 3, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_WHITE);
    doc.text(safeCertId, leftMargin + 50, cursorY + 13, { align: "center" });

    cursorY += 40;

    // 2. "Diberikan kepada"
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(COLOR_GRAY);
    doc.text("Diberikan kepada", leftMargin, cursorY);

    cursorY += 25;

    // 3. NAMA PESERTA (Teal, Besar, Bold)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(COLOR_TEAL);
    doc.text(safeName, leftMargin, cursorY);

    cursorY += 25;

    // 4. "Atas kelulusannya pada kelas"
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(COLOR_GRAY);
    doc.text("Atas kelulusannya pada kelas", leftMargin, cursorY);

    cursorY += 25;

    // 5. NAMA KELAS (Teal, Sedang, Bold)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(COLOR_TEAL);

    const maxTitleWidth = width - 250; // Hindari nabrak ribbon
    const wrappedCourse = doc.splitTextToSize(safeCourse, maxTitleWidth);
    doc.text(wrappedCourse, leftMargin, cursorY);

    // Update cursor berdasarkan jumlah baris judul
    cursorY += (wrappedCourse.length * 10) + 30;


    // --- E. Bagian Bawah (Tanda Tangan & Footer) ---

    // Tanggal
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_DARK_BLUE);
    doc.text(safeCompleted, leftMargin, cursorY); // Tanggal di atas TTD

    cursorY += 15;


    doc.addPage();

    doc.setDrawColor(COLOR_DARK_BLUE);
    doc.setLineWidth(40);
    doc.rect(0, 0, width - 0, height - 0);
    // Border dalam (opsional, untuk efek frame ganda)
    doc.setLineWidth(0.5);
    doc.rect(25, 25, width - 50, height - 50);

    // Reset Text Color
    doc.setTextColor(COLOR_DARK_BLUE);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Ringkasan Kelas", 40, 50);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    let p2Cursor = 80;

    const descText = String(summary?.description ?? "");
    const wrappedDesc = doc.splitTextToSize(descText, width - 80);
    doc.text(wrappedDesc, 40, p2Cursor);
    p2Cursor += (wrappedDesc.length * 16) + 20;

    doc.setFont("Helvetica", "bold");
    doc.text("Materi yang Dipelajari:", 40, p2Cursor);
    p2Cursor += 25;

    doc.setFont("Helvetica", "normal");
    const modules = Array.isArray(summary?.modules) ? summary.modules : [];

    if (modules.length === 0) {
        doc.text("- Tidak ada daftar materi -", 40, p2Cursor);
    } else {
        // 2 Kolom layout jika landscape agar muat banyak
        const col1X = 40;
        const col2X = width / 2 + 20;
        let currentX = col1X;

        modules.forEach((mod, index) => {
            // Pindah kolom jika sudah terlalu bawah
            if (p2Cursor > height - 50) {
                if (currentX === col1X) {
                    currentX = col2X;
                    p2Cursor = 80 + (wrappedDesc.length * 16) + 45; // Reset Y ke atas (sejajar materi)
                } else {
                    doc.addPage(); // Halaman baru jika kedua kolom penuh
                    doc.setDrawColor(COLOR_DARK_BLUE);
                    doc.setLineWidth(40);
                    doc.rect(0, 0, width - 0, height - 0);
                    doc.setLineWidth(0.5);
                    doc.rect(25, 25, width - 50, height - 50);
                    p2Cursor = 50;
                    currentX = col1X;
                }
            }

            const title = String(mod?.title ?? "Untitled");
            // const duration = String(mod?.duration ?? ""); 

            const itemText = `• ${title}`;
            const itemWrapped = doc.splitTextToSize(itemText, (width / 2) - 60);

            doc.text(itemWrapped, currentX, p2Cursor);
            p2Cursor += (itemWrapped.length * 16) + 5;
        });
    }

    // Save
    doc.save(`${safeName}-certificate.pdf`);
};