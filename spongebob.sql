-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: spongebob
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `ActivityLog`
--

DROP TABLE IF EXISTS `ActivityLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivityLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `action` varchar(50) NOT NULL,
  `target_table` varchar(50) DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `metadata` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activitylog_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivityLog`
--

LOCK TABLES `ActivityLog` WRITE;
/*!40000 ALTER TABLE `ActivityLog` DISABLE KEYS */;
INSERT INTO `ActivityLog` VALUES (1,'profitah11','delete_letter','Letter',1,'{\"message\":\"사용자가 편지를 삭제\"}','2025-06-17 00:41:10');
/*!40000 ALTER TABLE `ActivityLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `no` int NOT NULL AUTO_INCREMENT,
  `letter_id` int NOT NULL,
  `content` text,
  `comment_author` varchar(20) NOT NULL,
  PRIMARY KEY (`no`),
  KEY `letter_id` (`letter_id`),
  KEY `comment_author` (`comment_author`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`letter_id`) REFERENCES `Letter` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`comment_author`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `JWT_Token`
--

DROP TABLE IF EXISTS `JWT_Token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JWT_Token` (
  `user_id` varchar(20) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `issued_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `jwt_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JWT_Token`
--

LOCK TABLES `JWT_Token` WRITE;
/*!40000 ALTER TABLE `JWT_Token` DISABLE KEYS */;
/*!40000 ALTER TABLE `JWT_Token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Letter`
--

DROP TABLE IF EXISTS `Letter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Letter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `author` varchar(20) NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_author_receiver` (`author`,`receiver`),
  KEY `receiver` (`receiver`),
  CONSTRAINT `letter_ibfk_1` FOREIGN KEY (`author`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `letter_ibfk_2` FOREIGN KEY (`receiver`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Letter`
--

LOCK TABLES `Letter` WRITE;
/*!40000 ALTER TABLE `Letter` DISABLE KEYS */;
INSERT INTO `Letter` VALUES (1,'수정된 제목','수정된 내용입니다','profitah11','profitah','2025-06-17 00:10:04','2025-06-17 00:41:10'),(2,'생일 축하해요!','오늘 하루 행복 가득하길 바라요 🎉','admin','admin','2025-06-18 12:11:04',NULL);
/*!40000 ALTER TABLE `Letter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` varchar(20) NOT NULL,
  `user_pw` varchar(60) DEFAULT NULL,
  `user_nickname` varchar(40) DEFAULT NULL,
  `birth` date NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('11233','aa1234','Iyoonah','2025-06-17'),('1123399','aa1234','Iyoonah','2025-06-16'),('12345','aa1234','Iyoonah','2025-06-16'),('333','aa1234','Iyoonah','2025-06-16'),('8878','aa1234','Iyoonah','2025-06-16'),('888','aa1234','Iyoonah','2025-06-16'),('abc','aa1234','Iyoonah','2025-06-16'),('admin','1234','김재현','2025-06-21'),('newid','aa5678','newnick','2025-06-20'),('profitah','aa1234','Iyoonah','2001-12-05'),('profitah1','aa1234','Iyoonah','2001-12-05'),('profitah11','aa1234','Iyoonah','2001-12-05'),('profitah122','aa1234','Iyoonah','2001-12-05'),('yuna1205','1234','Iyoonah','2001-12-05'),('yuna1223','1234','이윤아','2000-01-01'),('yuna123','1234','윤아','2000-01-01'),('yuna123323','1234','이윤아','2000-01-01'),('yuna240616',NULL,'lyoonah','2025-06-16'),('윤아','aa1234','Iyoonah','2025-06-17'),('이윤','aa1234','Iyoonah','2025-06-17'),('이윤아','aa1234','Iyoonah','2001-12-05');
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

-- Dump completed on 2025-06-18 22:46:59
