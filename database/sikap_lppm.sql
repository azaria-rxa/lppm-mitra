-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: sikap_lppm
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sikap_lppm`
--

/*!40000 DROP DATABASE IF EXISTS `sikap_lppm`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sikap_lppm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sikap_lppm`;

--
-- Table structure for table `JawabanResponse`
--

DROP TABLE IF EXISTS `JawabanResponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JawabanResponse` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surveiResponseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pertanyaanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nilaiSkala` int DEFAULT NULL,
  `opsiId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teksBebas` text COLLATE utf8mb4_unicode_ci,
  `sentimen` enum('POSITIF','NETRAL','NEGATIF') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `JawabanResponse_surveiResponseId_idx` (`surveiResponseId`),
  KEY `JawabanResponse_pertanyaanId_fkey` (`pertanyaanId`),
  KEY `JawabanResponse_opsiId_fkey` (`opsiId`),
  CONSTRAINT `JawabanResponse_opsiId_fkey` FOREIGN KEY (`opsiId`) REFERENCES `Opsi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `JawabanResponse_pertanyaanId_fkey` FOREIGN KEY (`pertanyaanId`) REFERENCES `Pertanyaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `JawabanResponse_surveiResponseId_fkey` FOREIGN KEY (`surveiResponseId`) REFERENCES `SurveiResponse` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JawabanResponse`
--

LOCK TABLES `JawabanResponse` WRITE;
/*!40000 ALTER TABLE `JawabanResponse` DISABLE KEYS */;
INSERT INTO `JawabanResponse` VALUES ('cmszhdst3000pynosv7nqngte','cmszhdst3000nynosdk2fts0b','cmszhdss6000cynosma8cy5i5',5,NULL,NULL,NULL,'2026-08-19 02:37:09.015'),('cmszhdst3000qynos39i9sgpq','cmszhdst3000nynosdk2fts0b','cmszhdss6000dynosrty4rj9u',4,NULL,NULL,NULL,'2026-08-19 02:37:09.015'),('cmszhdst3000rynosmc85310e','cmszhdst3000nynosdk2fts0b','cmszhdss6000eynosgyvvxawo',NULL,'cmszhdss6000gynoscr5u0jwx',NULL,NULL,'2026-08-19 02:37:09.015'),('cmszhdst3000synos43rk0e16','cmszhdst3000nynosdk2fts0b','cmszhdss6000kynosx3pkje0c',5,NULL,NULL,NULL,'2026-08-19 02:37:09.015'),('cmszhdst3000tynosiwfpej2p','cmszhdst3000nynosdk2fts0b','cmszhdss6000lynosvaaqf3wz',NULL,NULL,'Layanan sangat membantu dan responsif. Terima kasih!','POSITIF','2026-08-19 02:37:09.015'),('cmszhdsti000xynosy7eiri5l','cmszhdsti000vynosb7t5chew','cmszhdss6000cynosma8cy5i5',4,NULL,NULL,NULL,'2026-08-19 02:37:09.031'),('cmszhdsti000yynosc0nb0u77','cmszhdsti000vynosb7t5chew','cmszhdss6000dynosrty4rj9u',4,NULL,NULL,NULL,'2026-08-19 02:37:09.031'),('cmszhdsti000zynoszqw6wzc8','cmszhdsti000vynosb7t5chew','cmszhdss6000eynosgyvvxawo',NULL,'cmszhdss6000gynoscr5u0jwx',NULL,NULL,'2026-08-19 02:37:09.031'),('cmszhdsti0010ynosr05kn8dj','cmszhdsti000vynosb7t5chew','cmszhdss6000kynosx3pkje0c',4,NULL,NULL,NULL,'2026-08-19 02:37:09.031'),('cmszhdsti0011ynos732gk1x9','cmszhdsti000vynosb7t5chew','cmszhdss6000lynosvaaqf3wz',NULL,NULL,'Kerja sama cukup lancar, hanya butuh kecepatan tindak lanjut.','NETRAL','2026-08-19 02:37:09.031'),('cmszhdstx0015ynoscohsjzhp','cmszhdstx0013ynosig1y82sr','cmszhdss6000cynosma8cy5i5',3,NULL,NULL,NULL,'2026-08-19 02:37:09.045'),('cmszhdstx0016ynosxicrcx9o','cmszhdstx0013ynosig1y82sr','cmszhdss6000dynosrty4rj9u',4,NULL,NULL,NULL,'2026-08-19 02:37:09.045'),('cmszhdstx0017ynosmtqfacu2','cmszhdstx0013ynosig1y82sr','cmszhdss6000eynosgyvvxawo',NULL,'cmszhdss6000hynosmlsj5fp9',NULL,NULL,'2026-08-19 02:37:09.045'),('cmszhdstx0018ynoszagyj0jr','cmszhdstx0013ynosig1y82sr','cmszhdss6000kynosx3pkje0c',4,NULL,NULL,NULL,'2026-08-19 02:37:09.045'),('cmszhdstx0019ynosaw9pccqn','cmszhdstx0013ynosig1y82sr','cmszhdss6000lynosvaaqf3wz',NULL,NULL,'Beberapa dokumen lambat diproses, mohon diperbaiki.','NEGATIF','2026-08-19 02:37:09.045'),('cmszhn2lr0003ynpgbo79cd6r','cmszhn2lr0001ynpghq8i4gge','cmszhdss6000cynosma8cy5i5',5,NULL,NULL,NULL,'2026-08-19 02:44:21.615'),('cmszhn2lr0004ynpg7ee9zyxz','cmszhn2lr0001ynpghq8i4gge','cmszhdss6000dynosrty4rj9u',5,NULL,NULL,NULL,'2026-08-19 02:44:21.615'),('cmszhn2lr0005ynpgo5k2v8c2','cmszhn2lr0001ynpghq8i4gge','cmszhdss6000eynosgyvvxawo',NULL,'cmszhdss6000fynosxf5ft5my',NULL,NULL,'2026-08-19 02:44:21.615'),('cmszhn2lr0006ynpgunyqn320','cmszhn2lr0001ynpghq8i4gge','cmszhdss6000kynosx3pkje0c',5,NULL,NULL,NULL,'2026-08-19 02:44:21.615'),('cmszhn2lr0007ynpgk6f3orsh','cmszhn2lr0001ynpghq8i4gge','cmszhdss6000lynosvaaqf3wz',NULL,NULL,'Kerja sama sangat baik dan membantu sekali.','POSITIF','2026-08-19 02:44:21.615');
/*!40000 ALTER TABLE `JawabanResponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kuesioner`
--

DROP TABLE IF EXISTS `Kuesioner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Kuesioner` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Kuesioner_createdById_fkey` (`createdById`),
  CONSTRAINT `Kuesioner_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kuesioner`
--

LOCK TABLES `Kuesioner` WRITE;
/*!40000 ALTER TABLE `Kuesioner` DISABLE KEYS */;
INSERT INTO `Kuesioner` VALUES ('cmszhdss6000bynosh0raa3vh','Survey Kepuasan Mitra LPPM 2026','Mohon berikan penilaian Anda terhadap kerja sama, pendampingan, dan layanan LPPM kepada mitra. Setiap masukan sangat kami hargai.',1,'cmszhds4t0000ynosa1yl20gd','2026-08-19 02:37:08.982','2026-08-19 02:37:08.982');
/*!40000 ALTER TABLE `Kuesioner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mitra`
--

DROP TABLE IF EXISTS `Mitra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mitra` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('DESA_BINAAN','INDUSTRI','INSTANSI_PEMERINTAH') COLLATE utf8mb4_unicode_ci NOT NULL,
  `kontak` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qrToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Mitra_userId_key` (`userId`),
  UNIQUE KEY `Mitra_qrToken_key` (`qrToken`),
  CONSTRAINT `Mitra_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mitra`
--

LOCK TABLES `Mitra` WRITE;
/*!40000 ALTER TABLE `Mitra` DISABLE KEYS */;
INSERT INTO `Mitra` VALUES ('cmszhdsbb0002ynoswo1oyu7k','Desa Binaan Sejahtera','DESA_BINAAN','0852-1111-0001','cmszhdsbb0003ynose0j54n87','qr-desabinaan.sejahtera-1787107028276','2026-08-19 02:37:08.375','2026-08-19 02:37:08.375'),('cmszhdsl50004ynosqxb6nvzt','PT Maju Bersama Industri','INDUSTRI','0852-1111-0002','cmszhdsl50005ynosol2pb0mb','qr-humas-1787107028594','2026-08-19 02:37:08.729','2026-08-19 02:37:08.729'),('cmszhdsol0006ynosd7h29riu','Dinas Koperasi Kab. Contoh','INSTANSI_PEMERINTAH','0852-1111-0003','cmszhdsol0007ynosp65iwna6','qr-dinaskop-1787107028749','2026-08-19 02:37:08.853','2026-08-19 02:37:08.853'),('cmszhdsrn0008ynoscngznea2','Desa Binaan Kreatif','DESA_BINAAN','0852-1111-0004','cmszhdsrn0009ynos58x376e3','qr-kreatif.desa-1787107028867','2026-08-19 02:37:08.964','2026-08-19 02:37:08.964');
/*!40000 ALTER TABLE `Mitra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotifikasiEmail`
--

DROP TABLE IF EXISTS `NotifikasiEmail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotifikasiEmail` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mitraId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kuesionerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERKIRIM',
  `dikirimAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `NotifikasiEmail_kuesionerId_mitraId_idx` (`kuesionerId`,`mitraId`),
  KEY `NotifikasiEmail_mitraId_fkey` (`mitraId`),
  CONSTRAINT `NotifikasiEmail_kuesionerId_fkey` FOREIGN KEY (`kuesionerId`) REFERENCES `Kuesioner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `NotifikasiEmail_mitraId_fkey` FOREIGN KEY (`mitraId`) REFERENCES `Mitra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NotifikasiEmail`
--

LOCK TABLES `NotifikasiEmail` WRITE;
/*!40000 ALTER TABLE `NotifikasiEmail` DISABLE KEYS */;
/*!40000 ALTER TABLE `NotifikasiEmail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Opsi`
--

DROP TABLE IF EXISTS `Opsi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Opsi` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pertanyaanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teks` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Opsi_pertanyaanId_fkey` (`pertanyaanId`),
  CONSTRAINT `Opsi_pertanyaanId_fkey` FOREIGN KEY (`pertanyaanId`) REFERENCES `Pertanyaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Opsi`
--

LOCK TABLES `Opsi` WRITE;
/*!40000 ALTER TABLE `Opsi` DISABLE KEYS */;
INSERT INTO `Opsi` VALUES ('cmszhdss6000fynosxf5ft5my','cmszhdss6000eynosgyvvxawo','Sangat sesuai'),('cmszhdss6000gynoscr5u0jwx','cmszhdss6000eynosgyvvxawo','Sesuai'),('cmszhdss6000hynosmlsj5fp9','cmszhdss6000eynosgyvvxawo','Cukup sesuai'),('cmszhdss6000iynos4dje7y8e','cmszhdss6000eynosgyvvxawo','Kurang sesuai'),('cmszhdss6000jynosj4u08l8q','cmszhdss6000eynosgyvvxawo','Tidak sesuai');
/*!40000 ALTER TABLE `Opsi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pertanyaan`
--

DROP TABLE IF EXISTS `Pertanyaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pertanyaan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kuesionerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teks` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` enum('SKALA_1_5','PILIHAN_GANDA','TEKS_BEBAS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `urutan` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pertanyaan_kuesionerId_urutan_idx` (`kuesionerId`,`urutan`),
  CONSTRAINT `Pertanyaan_kuesionerId_fkey` FOREIGN KEY (`kuesionerId`) REFERENCES `Kuesioner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pertanyaan`
--

LOCK TABLES `Pertanyaan` WRITE;
/*!40000 ALTER TABLE `Pertanyaan` DISABLE KEYS */;
INSERT INTO `Pertanyaan` VALUES ('cmszhdss6000cynosma8cy5i5','cmszhdss6000bynosh0raa3vh','Bagaimana tingkat kepuasan Anda terhadap proses kerja sama dengan LPPM?','SKALA_1_5',0,'2026-08-19 02:37:08.982','2026-08-19 02:37:08.982'),('cmszhdss6000dynosrty4rj9u','cmszhdss6000bynosh0raa3vh','Bagaimana respons dan kecepatan layanan staf/program LPPM?','SKALA_1_5',1,'2026-08-19 02:37:08.982','2026-08-19 02:37:08.982'),('cmszhdss6000eynosgyvvxawo','cmszhdss6000bynosh0raa3vh','Apakah output kegiatan (pelatihan, pendampingan, pendampingan desa) sesuai harapan?','PILIHAN_GANDA',2,'2026-08-19 02:37:08.982','2026-08-19 02:37:08.982'),('cmszhdss6000kynosx3pkje0c','cmszhdss6000bynosh0raa3vh','Seberapa besar manfaat kegiatan LPPM bagi mitra Anda?','SKALA_1_5',3,'2026-08-19 02:37:08.982','2026-08-19 02:37:08.982'),('cmszhdss6000lynosvaaqf3wz','cmszhdss6000bynosh0raa3vh','Berikan saran atau kritik untuk perbaikan layanan LPPM ke depan.','TEKS_BEBAS',4,'2026-08-19 02:37:08.982','2026-08-19 02:37:08.982');
/*!40000 ALTER TABLE `Pertanyaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveiResponse`
--

DROP TABLE IF EXISTS `SurveiResponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SurveiResponse` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kuesionerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mitraId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submittedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `SurveiResponse_kuesionerId_mitraId_key` (`kuesionerId`,`mitraId`),
  KEY `SurveiResponse_kuesionerId_submittedAt_idx` (`kuesionerId`,`submittedAt`),
  KEY `SurveiResponse_mitraId_fkey` (`mitraId`),
  CONSTRAINT `SurveiResponse_kuesionerId_fkey` FOREIGN KEY (`kuesionerId`) REFERENCES `Kuesioner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SurveiResponse_mitraId_fkey` FOREIGN KEY (`mitraId`) REFERENCES `Mitra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveiResponse`
--

LOCK TABLES `SurveiResponse` WRITE;
/*!40000 ALTER TABLE `SurveiResponse` DISABLE KEYS */;
INSERT INTO `SurveiResponse` VALUES ('cmszhdst3000nynosdk2fts0b','cmszhdss6000bynosh0raa3vh','cmszhdsbb0002ynoswo1oyu7k','2026-08-19 02:37:09.015'),('cmszhdsti000vynosb7t5chew','cmszhdss6000bynosh0raa3vh','cmszhdsl50004ynosqxb6nvzt','2026-08-19 02:37:09.031'),('cmszhdstx0013ynosig1y82sr','cmszhdss6000bynosh0raa3vh','cmszhdsol0006ynosd7h29riu','2026-08-19 02:37:09.045'),('cmszhn2lr0001ynpghq8i4gge','cmszhdss6000bynosh0raa3vh','cmszhdsrn0008ynoscngznea2','2026-08-19 02:44:21.615');
/*!40000 ALTER TABLE `SurveiResponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','PIMPINAN','MITRA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MITRA',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmszhds4t0000ynosa1yl20gd','Admin LPPM','admin@lppm.ac.id','$2a$10$lRyXoUflr/2aJ4YokBdp4uO1rwY9DgmpYV/7cxL4yJoJAOPRC91VW','ADMIN','2026-08-19 02:37:08.140','2026-08-19 02:37:08.140'),('cmszhds880001ynos7k8pf1t2','Drs. Pimpinan, M.Si.','pimpinan@lppm.ac.id','$2a$10$4I/A4mZ2dQPIj778XRMPouv7WPVHuETVVQxwEMi0ffY40W8ZxVqOq','PIMPINAN','2026-08-19 02:37:08.264','2026-08-19 02:37:08.264'),('cmszhdsbb0003ynose0j54n87','Desa Binaan Sejahtera','desabinaan.sejahtera@example.com','$2a$10$j21A0zwbgDeoW0QAIIKMmOE/BHNDVDBas7yYi4.WR6ZgVB68X.lKm','MITRA','2026-08-19 02:37:08.375','2026-08-19 02:37:08.375'),('cmszhdsl50005ynosol2pb0mb','PT Maju Bersama Industri','humas@majubersama.co.id','$2a$10$QlhWR9.SwL61fQiEuAG8P.EgkaMKIQ.YTtTe41AP4W3idv.EechjW','MITRA','2026-08-19 02:37:08.729','2026-08-19 02:37:08.729'),('cmszhdsol0007ynosp65iwna6','Dinas Koperasi Kab. Contoh','dinaskop@example.go.id','$2a$10$Ja5tRjzMhrJ5oc8MzR6xCudonj66uO1btzrjltes3rBwZE3lUJku6','MITRA','2026-08-19 02:37:08.853','2026-08-19 02:37:08.853'),('cmszhdsrn0009ynos58x376e3','Desa Binaan Kreatif','kreatif.desa@example.com','$2a$10$oJf3QgkR0r5wv4xw4ojUU.R4W6Ms5HlsE.JqTIWPNCLwf.OZ7SPNy','MITRA','2026-08-19 02:37:08.964','2026-08-19 02:37:08.964');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-21  7:45:59
