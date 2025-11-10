/*
  Warnings:

  - You are about to drop the column `image_key` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nik]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('ORANGTUA', 'KADER', 'PETUGAS', 'PUSKESMAS');

-- CreateEnum
CREATE TYPE "NutritionStatus" AS ENUM ('GIZI_BAIK', 'GIZI_KURANG', 'GIZI_BURUK', 'GIZI_LEBIH', 'RISIKO_GEMUK', 'OBESE', 'NORMAL_TB_U', 'STUNTED', 'SEVERELY_STUNTED');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "image_key",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "kelurahan" TEXT,
ADD COLUMN     "kodeWilayah" TEXT,
ADD COLUMN     "nik" TEXT,
ADD COLUMN     "nomorSIP" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rt" TEXT,
ADD COLUMN     "rw" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "posyandu" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu_kader" (
    "posyanduId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "posyandu_kader_pkey" PRIMARY KEY ("posyanduId","userId")
);

-- CreateTable
CREATE TABLE "posyandu_petugas" (
    "posyanduId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "posyandu_petugas_pkey" PRIMARY KEY ("posyanduId","userId")
);

-- CreateTable
CREATE TABLE "balita" (
    "id" TEXT NOT NULL,
    "orangTuaId" TEXT NOT NULL,
    "posyanduId" TEXT,
    "nama" TEXT NOT NULL,
    "nikAnak" TEXT,
    "noKIA" TEXT,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "jenisKelamin" "Sex" NOT NULL,
    "anakKe" INTEGER,
    "bbLahirKg" DECIMAL(4,1),
    "tbLahirCm" DECIMAL(5,1),
    "alamat" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kodeWilayah" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timbang" (
    "id" TEXT NOT NULL,
    "balitaId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "beratKg" DECIMAL(5,2) NOT NULL,
    "tinggiCm" DECIMAL(5,2) NOT NULL,
    "lilaCm" DECIMAL(5,2),
    "lkCm" DECIMAL(5,2),
    "source" "Source" NOT NULL DEFAULT 'PUSKESMAS',
    "pencatatId" TEXT,
    "zWFA" DECIMAL(5,2),
    "zHFA" DECIMAL(5,2),
    "zWFH" DECIMAL(5,2),
    "statusBBU" "NutritionStatus",
    "statusTBU" "NutritionStatus",
    "statusBBTB" "NutritionStatus",
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timbang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jenis" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balita_kunjungan" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "balitaId" TEXT NOT NULL,
    "hadir" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "balita_kunjungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balita_guardian" (
    "balitaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "relation" TEXT,

    CONSTRAINT "balita_guardian_pkey" PRIMARY KEY ("balitaId","userId")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_stats" (
    "id" TEXT NOT NULL,
    "bulan" TIMESTAMP(3) NOT NULL,
    "posyanduId" TEXT,
    "totalBalita" INTEGER NOT NULL,
    "stunted" INTEGER NOT NULL,
    "underweight" INTEGER NOT NULL,
    "wasting" INTEGER NOT NULL,
    "obese" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posyandu_kode_key" ON "posyandu"("kode");

-- CreateIndex
CREATE INDEX "posyandu_kader_userId_idx" ON "posyandu_kader"("userId");

-- CreateIndex
CREATE INDEX "posyandu_petugas_userId_idx" ON "posyandu_petugas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "balita_nikAnak_key" ON "balita"("nikAnak");

-- CreateIndex
CREATE UNIQUE INDEX "balita_noKIA_key" ON "balita"("noKIA");

-- CreateIndex
CREATE INDEX "balita_orangTuaId_idx" ON "balita"("orangTuaId");

-- CreateIndex
CREATE INDEX "balita_posyanduId_idx" ON "balita"("posyanduId");

-- CreateIndex
CREATE INDEX "balita_kodeWilayah_idx" ON "balita"("kodeWilayah");

-- CreateIndex
CREATE INDEX "timbang_pencatatId_idx" ON "timbang"("pencatatId");

-- CreateIndex
CREATE INDEX "timbang_balitaId_idx" ON "timbang"("balitaId");

-- CreateIndex
CREATE UNIQUE INDEX "timbang_balitaId_tanggal_key" ON "timbang"("balitaId", "tanggal");

-- CreateIndex
CREATE INDEX "event_posyanduId_tanggal_idx" ON "event"("posyanduId", "tanggal");

-- CreateIndex
CREATE INDEX "balita_kunjungan_balitaId_idx" ON "balita_kunjungan"("balitaId");

-- CreateIndex
CREATE UNIQUE INDEX "balita_kunjungan_eventId_balitaId_key" ON "balita_kunjungan"("eventId", "balitaId");

-- CreateIndex
CREATE INDEX "balita_guardian_userId_idx" ON "balita_guardian"("userId");

-- CreateIndex
CREATE INDEX "notification_userId_status_scheduledAt_idx" ON "notification"("userId", "status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "device_token_token_key" ON "device_token"("token");

-- CreateIndex
CREATE INDEX "device_token_userId_idx" ON "device_token"("userId");

-- CreateIndex
CREATE INDEX "monthly_stats_bulan_idx" ON "monthly_stats"("bulan");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_stats_bulan_posyanduId_key" ON "monthly_stats"("bulan", "posyanduId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "authenticator_userId_idx" ON "authenticator"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_nik_key" ON "user"("nik");

-- AddForeignKey
ALTER TABLE "posyandu_kader" ADD CONSTRAINT "posyandu_kader_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_kader" ADD CONSTRAINT "posyandu_kader_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_petugas" ADD CONSTRAINT "posyandu_petugas_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_petugas" ADD CONSTRAINT "posyandu_petugas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita" ADD CONSTRAINT "balita_orangTuaId_fkey" FOREIGN KEY ("orangTuaId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita" ADD CONSTRAINT "balita_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timbang" ADD CONSTRAINT "timbang_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timbang" ADD CONSTRAINT "timbang_pencatatId_fkey" FOREIGN KEY ("pencatatId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita_kunjungan" ADD CONSTRAINT "balita_kunjungan_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita_kunjungan" ADD CONSTRAINT "balita_kunjungan_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita_guardian" ADD CONSTRAINT "balita_guardian_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita_guardian" ADD CONSTRAINT "balita_guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_token" ADD CONSTRAINT "device_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_stats" ADD CONSTRAINT "monthly_stats_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
