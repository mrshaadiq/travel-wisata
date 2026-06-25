-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Table structure for ref_provinsi
--
CREATE TABLE IF NOT EXISTS public.ref_provinsi (
    provinsi_id integer NOT NULL PRIMARY KEY,
    nama_provinsi character varying(50) NOT NULL
);

--
-- Table structure for ref_kategori_wisata
--
CREATE TABLE IF NOT EXISTS public.ref_kategori_wisata (
    kategori_id integer NOT NULL PRIMARY KEY,
    nama_kategori character varying(50) NOT NULL
);

--
-- Table structure for ref_kota
--
CREATE TABLE IF NOT EXISTS public.ref_kota (
    kota_id integer NOT NULL PRIMARY KEY,
    provinsi_id integer NOT NULL REFERENCES public.ref_provinsi(provinsi_id),
    nama_kota character varying(50) NOT NULL
);

--
-- Table structure for ref_metode_pembayaran
--
CREATE TABLE IF NOT EXISTS public.ref_metode_pembayaran (
    metode_id integer NOT NULL PRIMARY KEY,
    nama_metode character varying(50) NOT NULL,
    tipe_channel character varying(30),
    biaya_admin numeric(10,2) DEFAULT 0
);

--
-- Table structure for ref_status_booking
--
CREATE TABLE IF NOT EXISTS public.ref_status_booking (
    status_id integer NOT NULL PRIMARY KEY,
    nama_status character varying(30) NOT NULL UNIQUE,
    deskripsi text
);

--
-- Table structure for ref_tipe_kamar
--
CREATE TABLE IF NOT EXISTS public.ref_tipe_kamar (
    tipe_kamar_id integer NOT NULL PRIMARY KEY,
    nama_tipe character varying(40) NOT NULL,
    kapasitas integer
);

--
-- Table structure for m_destinasi
--
CREATE TABLE IF NOT EXISTS public.m_destinasi (
    destinasi_id integer NOT NULL PRIMARY KEY,
    nama_destinasi character varying(100) NOT NULL,
    kota_id integer REFERENCES public.ref_kota(kota_id),
    deskripsi text
);

--
-- Table structure for m_hotel
--
CREATE TABLE IF NOT EXISTS public.m_hotel (
    hotel_id integer NOT NULL PRIMARY KEY,
    nama_hotel character varying(100) NOT NULL,
    kota_id integer REFERENCES public.ref_kota(kota_id),
    bintang integer CHECK (bintang >= 1 AND bintang <= 5)
);

--
-- Table structure for m_paket_wisata
--
CREATE TABLE IF NOT EXISTS public.m_paket_wisata (
    paket_id integer NOT NULL PRIMARY KEY,
    nama_paket character varying(150) NOT NULL,
    kategori_id integer REFERENCES public.ref_kategori_wisata(kategori_id),
    durasi_hari integer NOT NULL CHECK (durasi_hari > 0),
    harga_dasar numeric(12,2) NOT NULL CHECK (harga_dasar >= 0),
    deskripsi text,
    is_aktif boolean DEFAULT true
);

--
-- Table structure for m_pelanggan
--
CREATE TABLE IF NOT EXISTS public.m_pelanggan (
    pelanggan_id integer NOT NULL PRIMARY KEY,
    nama_lengkap character varying(100) NOT NULL,
    email character varying(100) NOT NULL UNIQUE,
    no_hp character varying(20),
    tanggal_lahir date,
    kota_id integer REFERENCES public.ref_kota(kota_id),
    created_at timestamp without time zone DEFAULT now()
);

--
-- Table structure for m_pemandu
--
CREATE TABLE IF NOT EXISTS public.m_pemandu (
    pemandu_id integer NOT NULL PRIMARY KEY,
    nama_pemandu character varying(100) NOT NULL,
    no_lisensi character varying(40) UNIQUE,
    no_hp character varying(20),
    rating numeric(3,2) DEFAULT 0
);

--
-- Table structure for m_promo
--
CREATE TABLE IF NOT EXISTS public.m_promo (
    promo_id integer NOT NULL PRIMARY KEY,
    kode_promo character varying(30) NOT NULL UNIQUE,
    persentase_diskon numeric(5,2) CHECK (persentase_diskon >= 0 AND persentase_diskon <= 100),
    tanggal_mulai date,
    tanggal_berakhir date CHECK (tanggal_berakhir >= tanggal_mulai)
);

--
-- Table structure for m_transportasi
--
CREATE TABLE IF NOT EXISTS public.m_transportasi (
    transportasi_id integer NOT NULL PRIMARY KEY,
    jenis_transportasi character varying(40) NOT NULL,
    nama_armada character varying(80),
    kapasitas integer
);

--
-- Table structure for m_wishlist
--
CREATE TABLE IF NOT EXISTS public.m_wishlist (
    wishlist_id integer NOT NULL PRIMARY KEY,
    pelanggan_id integer NOT NULL REFERENCES public.m_pelanggan(pelanggan_id),
    paket_id integer NOT NULL REFERENCES public.m_paket_wisata(paket_id),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT uq_wishlist UNIQUE (pelanggan_id, paket_id)
);

--
-- Table structure for t_jadwal_keberangkatan
--
CREATE TABLE IF NOT EXISTS public.t_jadwal_keberangkatan (
    jadwal_id integer NOT NULL PRIMARY KEY,
    paket_id integer NOT NULL REFERENCES public.m_paket_wisata(paket_id),
    pemandu_id integer REFERENCES public.m_pemandu(pemandu_id),
    transportasi_id integer REFERENCES public.m_transportasi(transportasi_id),
    tanggal_berangkat date NOT NULL,
    kuota integer NOT NULL CHECK (kuota > 0),
    sisa_kuota integer NOT NULL CHECK (sisa_kuota >= 0 AND sisa_kuota <= kuota)
);

--
-- Table structure for t_booking
--
CREATE TABLE IF NOT EXISTS public.t_booking (
    booking_id integer NOT NULL PRIMARY KEY,
    kode_booking character varying(20) NOT NULL UNIQUE,
    pelanggan_id integer NOT NULL REFERENCES public.m_pelanggan(pelanggan_id),
    jadwal_id integer NOT NULL REFERENCES public.t_jadwal_keberangkatan(jadwal_id),
    status_id integer NOT NULL REFERENCES public.ref_status_booking(status_id),
    promo_id integer REFERENCES public.m_promo(promo_id),
    jumlah_peserta integer NOT NULL CHECK (jumlah_peserta > 0),
    total_harga numeric(14,2),
    tanggal_booking timestamp without time zone DEFAULT now()
);

--
-- Table structure for t_detail_peserta
--
CREATE TABLE IF NOT EXISTS public.t_detail_peserta (
    peserta_id integer NOT NULL PRIMARY KEY,
    booking_id integer NOT NULL REFERENCES public.t_booking(booking_id),
    nama_peserta character varying(100) NOT NULL,
    no_identitas character varying(40),
    tipe_kamar_id integer REFERENCES public.ref_tipe_kamar(tipe_kamar_id)
);

--
-- Table structure for t_pembayaran
--
CREATE TABLE IF NOT EXISTS public.t_pembayaran (
    pembayaran_id integer NOT NULL PRIMARY KEY,
    booking_id integer NOT NULL REFERENCES public.t_booking(booking_id),
    metode_id integer NOT NULL REFERENCES public.ref_metode_pembayaran(metode_id),
    jumlah_bayar numeric(14,2) NOT NULL CHECK (jumlah_bayar > 0),
    tanggal_bayar timestamp without time zone DEFAULT now(),
    status_bayar character varying(20) DEFAULT 'Pending'
);

--
-- Table structure for t_refund
--
CREATE TABLE IF NOT EXISTS public.t_refund (
    refund_id integer NOT NULL PRIMARY KEY,
    pembayaran_id integer NOT NULL REFERENCES public.t_pembayaran(pembayaran_id),
    jumlah_refund numeric(14,2) NOT NULL CHECK (jumlah_refund > 0),
    alasan text,
    tanggal_refund timestamp without time zone DEFAULT now()
);

--
-- Table structure for t_ulasan
--
CREATE TABLE IF NOT EXISTS public.t_ulasan (
    ulasan_id integer NOT NULL PRIMARY KEY,
    booking_id integer NOT NULL REFERENCES public.t_booking(booking_id),
    rating integer CHECK (rating >= 1 AND rating <= 5),
    komentar text,
    tanggal_ulasan timestamp without time zone DEFAULT now()
);

--
-- Table structure for t_log_audit
--
CREATE TABLE IF NOT EXISTS public.t_log_audit (
    log_id integer NOT NULL PRIMARY KEY,
    nama_tabel character varying(50),
    aksi character varying(20),
    keterangan text,
    waktu_log timestamp without time zone DEFAULT now()
);
