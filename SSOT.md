# Single Source of Truth (SSOT) - Undangan Digital "Marbas"

## 1. Ringkasan Project
* **Nama Project:** Undangan Digital "Marbas"
* **Tujuan Project:** Menyediakan platform undangan digital mewah (luxury) dengan animasi high-end, mengacu pada standar Lavicia.id.
* **Fungsi Utama:** Menampilkan informasi pernikahan dengan estetika "Premium Black & White".
* **Gambaran Umum Sistem:** Aplikasi web berbasis React (Vite) yang menggunakan GSAP untuk animasi premium dan skema warna kontras tinggi (Black, White, Silver).

## 2. Arsitektur Sistem
* **Komponen Utama:** React (Frontend), GSAP (Animation Engine), Supabase (Backend as a Service).
* **Hubungan Antar Komponen:** App.jsx mengelola state utama (phase: envelope/open), mengoordinasikan komponen hooks (useClipReveal, useAutoScroll), dan merender section-section utama.
* **Dependency Utama:** `gsap`, `react`, `supabase-js`, `vite`.
* **Integrasi Eksternal:** Supabase (Database & Auth), Google Maps (via Iframe).

## 3. Struktur Folder dan File
* `src/sections/`: Berisi komponen besar untuk setiap bagian undangan (Hero, Couple, dll).
* `src/components/`: Komponen UI reusable dan elemen dekoratif (AudioPlayer, FallingPetals, dll).
* `src/hooks/`: Custom hooks untuk logika animasi dan verifikasi.
* `src/lib/`: Konfigurasi library eksternal (Supabase).
* `src/styles/`: Global CSS dan variabel tema.
* `public/`: Aset statis (gambar, video, audio).

## 4. Flow Sistem
1. **Input:** User mengakses URL (dengan parameter `?to=`).
2. **Proses:** 
   - `EnvelopeGate` muncul sebagai landing page pertama.
   - User klik "Buka Undangan".
   - State `phase` berubah menjadi `open`.
   - `Hero` dan section lainnya dimount.
   - Animasi `ClipReveal` berjalan.
3. **Output:** Tampilan undangan interaktif dengan musik latar dan elemen melayang.
4. **Error Flow:** Penanganan error saat fetch data dari Supabase (RSVP/Ucapan) atau kegagalan load asset.

## 5. Penyimpanan Data
* **Database:** Supabase (Tabel RSVP dan Ucapan).
* **File Storage:** Lokal `public/` folder untuk aset media.
* **Struktur Data Penting:** Objek RSVP (nama, kehadiran, jumlah tamu) dan Ucapan (nama, pesan).

## 6. Integrasi Eksternal
* **API:** Supabase REST API.
* **Service Pihak Ketiga:** Google Maps Embed.
* **Format Komunikasi:** JSON.

## 7. Logging dan Monitoring
* **Lokasi Log:** Console log (saat development).
* **Log Penting:** Status koneksi Supabase, trigger animasi GSAP.

## 8. Error Handling
* Menggunakan try-catch pada operasi async (Supabase).
* Fallback UI jika asset gagal dimuat.

## 9. Keamanan
* **Validasi Input:** Form RSVP dan Ucapan.
* **Manajemen Credential:** Environment variables (ditangani oleh Vite).

## 10. Deployment
* **Cara Menjalankan:** `npm run dev`
* **Dependency:** Node.js, npm.

## 11. Checklist Sebelum Perubahan
- [ ] Analisis struktur kode terkait.
- [ ] Identifikasi dampak pada animasi GSAP.
- [ ] Pastikan aset (webp/video) tersedia.
- [ ] Verifikasi mobile responsiveness.

## 12. Checklist Setelah Perubahan
- [ ] Jalankan Pre-Delivery Checklist (UI/UX Pro Max).
- [ ] Tes di berbagai ukuran layar (mobile-first).
- [ ] Pastikan tidak ada console error.
- [ ] Verifikasi flow animasi tetap smooth.

## 13. Format Laporan Perubahan
- **Perubahan:** ...
- **Alasan:** ...
- **Dampak:** ...
- **Risiko:** ...
- **Validasi:** ...
- **Rollback:** ...

## 14. Known Issues
- Performa video background pada device low-end.
- Delay loading asset audio besar.

## 15. Technical Debt
- Optimasi ukuran file video di `public/hero/`.
- Refactor styling yang masih inline di `App.jsx`.

## 16. Catatan Untuk AI Agent Berikutnya
- Prioritaskan estetika "White & Gold".
- Jangan hapus plugin `ScrollTrigger` karena hampir semua section bergantung padanya.
- Perhatikan `useCoreVerification` untuk validasi lisensi/akses.
