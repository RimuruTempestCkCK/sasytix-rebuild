# Sasy.Tix Maritime — Ferry Booking Frontend Prototype

Frontend prototype untuk platform pemesanan tiket kapal feri modern (**Batam ↔ Singapura** dan **Batam ↔ Malaysia**), terinspirasi dari alur bisnis [sasytix.com](https://sasytix.com/) dan dibangun menggunakan **HTML5, CSS3, dan Vanilla JavaScript (ES6+)** tanpa framework maupun backend.

## Fitur Utama

### 1. Buyer / Customer
- **Public Homepage** (`index.html`): Hero section, widget pencarian rute & jadwal (Sekali Jalan / Pulang Pergi), koridor rute, jadwal terdekat, destinasi populer, keunggulan layanan, proses booking, dan FAQ.
- **Search Results** (`pages/buyer/search.html`): Filter asal, tujuan, tanggal, operator, dan kuota kursi.
- **Booking Flow**:
  - Data Penumpang (`pages/buyer/passengers.html`) dengan validasi paspor & auto-fill profil demo.
  - Konfirmasi Pesanan (`pages/buyer/confirm.html`) dengan rincian biaya pelabuhan & layanan.
  - Simulasi Pembayaran (`pages/buyer/payment.html`) mendukung QRIS, Virtual Account, E-Wallet, Bank Transfer, dan Kartu Kredit/Debit beserta simulasi status (`Pending`, `Payment Submitted`, `Verified`, `Rejected`, `Expired`).
- **My Booking & Digital Boarding Pass** (`pages/buyer/bookings.html`, `pages/buyer/ticket.html`): Filter status booking dan tampilan boarding pass digital lengkap dengan QR code SVG simulasi.
- **Profil & Autentikasi Simulasi** (`pages/buyer/profile.html`, `pages/buyer/auth.html`): Login, Register, Forgot/Reset Password, OTP, dan Aktivasi Akun.

### 2. Admin Operations (`pages/admin/`)
- **Dashboard** (`dashboard.html`): Statistik booking, verifikasi pembayaran, grafik bulanan, dan status perjalanan.
- **Booking Management** (`bookings.html`): Pencarian, filter rute/status, dan modal detail penumpang.
- **Payment Verification** (`payments.html`): Setujui pembayaran (otomatis menerbitkan tiket simulasi) atau tolak dengan catatan.
- **Schedule, Route, Passenger & Reports** (`schedules.html`, `routes.html`, `passengers.html`, `reports.html`): Pengelolaan jadwal, rute, manifest penumpang, dan laporan operasional.

### 3. Owner Executive (`pages/owner/`)
- **Executive Dashboard** (`dashboard.html`): KPI Gross Revenue, Average Ticket Value, Payment Success Rate, Cancellation Rate, grafik tren bulanan, dan insight bisnis.
- **Business Analytics, Financial, Operational & Admin Management** (`analytics.html`, `financial.html`, `operational.html`, `admins.html`).

## Akun Demo (Simulasi LocalStorage)
Gunakan **Demo Mode Bar** di bagian atas halaman atau login di `pages/buyer/auth.html`:
- **Buyer**: `buyer@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`
- **Owner**: `owner@demo.com` / `demo123`

## Cara Menjalankan Secara Lokal

1. Clone atau buka folder project `sasytix-rebuild`.
2. Jalankan static HTTP server lokal, misalnya dengan Python atau Node.js:
   ```bash
   python -m http.server 8080
   ```
   atau
   ```bash
   npx serve .
   ```
3. Buka browser dan akses `http://localhost:8080`.

## Catatan Asset & Simulasi
- Foto hero dan logo operator feri yang tersedia secara publik disimpan secara lokal di `assets/` sebagai bagian dari referensi prototype.
- Foto destinasi dan interior kabin/terminal disimpan lokal di `assets/images/`.
- Seluruh transaksi, pembayaran, OTP, dan data tersimpan di `localStorage` browser (`sasytix_rebuild_state_v1`) tanpa koneksi backend atau payment gateway sungguhan.
