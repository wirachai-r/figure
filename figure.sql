-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2025 at 07:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `figure`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `subdistrict` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `address`, `subdistrict`, `district`, `province`, `postal_code`, `is_default`, `created_at`, `updated_at`) VALUES
(3, 1, '123/45 หมู่ 6 ถนนสุขุมวิท', 'ตำบลบางนา', 'บางนา', 'กรุงเทพมหานคร', '10260', 1, '2025-02-20 12:14:54', '2025-03-02 18:24:39'),
(4, 2, '123/45 หมู่ 6 ถนนสุขุมวิท', 'ตำบลบางนา', 'บางนา', 'กรุงเทพมหานคร', '10260', 1, '2025-02-25 16:41:45', '2025-02-25 16:41:45'),
(32, 2, '231 ม.6', 'ศรีเมืองชุม', 'แม่สาย', 'เชียงราย', '57130', 1, '2025-03-02 18:33:10', '2025-03-02 18:33:10'),
(33, 3, '238', 'บ้านดู่', 'เมือง', 'เชียงราย', '57110', 1, '2025-03-02 18:34:30', '2025-03-02 18:34:30');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `cart_total` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `cart_total`, `created_at`, `updated_at`) VALUES
(1, 2, 0, '2025-02-20 10:19:03', '2025-03-02 18:33:19'),
(2, 3, 0, '2025-02-20 10:19:03', '2025-03-02 18:37:17'),
(3, 1, 0, '2025-03-01 09:07:01', '2025-03-02 18:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `created_at`, `updated_at`) VALUES
(2, ' GUNDAM GUNPLA', '2025-02-20 10:19:03', '2025-03-02 16:54:35'),
(3, 'DRAGONBALL', '2025-02-20 10:19:03', '2025-03-02 17:04:56'),
(14, 'EVANGELION', '2025-02-23 11:35:52', '2025-03-02 17:11:34'),
(15, 'MAZINGER Z', '2025-02-23 16:39:00', '2025-03-02 17:13:59'),
(17, 'ULTRAMAN', '2025-03-02 17:18:34', '2025-03-02 17:18:34'),
(18, 'GO-SAURER', '2025-03-02 17:23:53', '2025-03-02 17:23:53'),
(19, 'DIGIMON ADVENTURE', '2025-03-02 17:25:47', '2025-03-02 17:25:47'),
(20, 'SAKURA WARS 2', '2025-03-02 17:34:49', '2025-03-02 17:34:49'),
(21, 'NEW SAKURA WARS', '2025-03-02 17:37:52', '2025-03-02 17:37:52'),
(22, 'MARVEL', '2025-03-02 17:40:10', '2025-03-02 17:40:10'),
(23, 'STAR WARS', '2025-03-02 18:10:49', '2025-03-02 18:10:49'),
(24, 'MASHIN HERO WATARU', '2025-03-02 18:16:04', '2025-03-02 18:16:04');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `cart_total` double NOT NULL,
  `order_status` varchar(50) DEFAULT 'Not Process',
  `address_id` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `cart_total`, `order_status`, `address_id`, `created_at`, `updated_at`) VALUES
(67, 1, 6310, 'Not Process', 3, '2025-03-02 18:32:17', '2025-03-02 18:32:17'),
(68, 2, 23450, 'Completed', 32, '2025-03-02 18:33:19', '2025-03-02 18:46:35'),
(69, 3, 6080, 'Not Process', 33, '2025-03-02 18:34:36', '2025-03-02 18:34:36'),
(70, 3, 17750, 'Not Process', 33, '2025-03-02 18:34:57', '2025-03-02 18:34:57'),
(71, 3, 1700, 'Processing', 33, '2025-03-02 18:37:17', '2025-03-02 18:37:57');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` double NOT NULL,
  `sold` int(11) DEFAULT 0,
  `quantity` int(11) NOT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `series` varchar(100) DEFAULT NULL,
  `character_name` varchar(100) DEFAULT NULL,
  `scale` varchar(20) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `sold`, `quantity`, `manufacturer`, `series`, `character_name`, `scale`, `release_date`, `category_id`, `created_at`, `updated_at`) VALUES
(48, 'RG MS-06S ZAKU II', 'Bandai® Real Grade (RG) 1/144 MS-06S ZAKU II ซาคุ 2 gunpla model kit. Similiar to the #01 Real Grade Series, the RG Gundam RX-78-2, the Char\'s Zaku II packs with an amazing level of details (MG+PG) into a size of a 1/144 (HG) kit, complete with dynamic action and moving features, The perfect counterpart to the RG Gundam RX-78-2, the Char\'s Zaku 2 comes iwth the same kind of posable inner frame, piping, and many sticker markings to keep you busy for some time.', 850, 69, 99, 'BANDAI CO., LTD.', 'Gunpla® Real Grade (RG)', 'MS-06S ZAKU II', '1/144', '0000-00-00', 2, '2025-03-02 16:58:11', '2025-03-02 18:34:36'),
(49, 'RG AILE STRIKE GUNDAM', 'Bandai® Gunpla Real Grade 1/144 Model Kit RG GAT-X105+AQM/E-X01 AILE STRIKE GUNDAM เอิล สไตร์ค กันดั้ม\r\nThe third kit in the Real Grade line is the GAT-X105 Aile Strike Gundam. Bandai gives the Strike some REAL attention! It comes with a shield, beamrifle, two beam sabers, plenty of marking stickers, and an adaptor so it can fit on an Action Base 1, and most importantly off all, that amazingly engineered Advanced MS Joint frame!', 850, 4, 46, 'BANDAI CO., LTD.', 'MOBILE SUIT GUNDAM SEED', '-', '1/144', '0000-00-00', 2, '2025-03-02 17:02:01', '2025-03-02 18:34:57'),
(50, 'RG MS-06F ZAKU II', 'Bandai® Gunpla Real Grade 1/144 Model Kit RG-04 RG MS-06F ZAKU II ซาคุ 2\r\nSimiliar to the Char\'s, this Real Grade MS-06F Real Grade model kit is assembled using a flexible inner frame which comes molded on a runner, and different shades of green armor.', 850, 76, 56, '	BANDAI CO., LTD.', '	MOBILE SUIT GUNDAM 0079', '-', '1/144', '0000-00-00', 2, '2025-03-02 17:03:53', '2025-03-02 18:34:36'),
(51, 'FRS LEGENDARY SUPER SAIYAN BROLY', 'Bandai® Figure-Rise Standard mDragon Ball Character Plastic Model Kit FRS LEGENDARY SUPER SAIYAN BROLY\r\nFrom \"Dragon Ball Z\" comes a Figure-rise Standard kit of the legendary Super Saiyan, Broly! He comes with two expressions to choose from (standard, yelling), optional hand parts, and a sticker sheet for details. In addition, this kit also includes damaged facial expressions for both Super Saiyan Goku and Super Saiyan Vegeta so you can display them getting beaten by this overpowered warrior! Be sure to add this legendary Saiyan to your collection!', 1630, 2, 44, 'BANDAI CO., LTD.', 'DRAGON BALL Z', 'LEGENDARY SUPER SAIYAN BROLY', '-', '0000-00-00', 3, '2025-03-02 17:07:36', '2025-03-02 18:34:36'),
(52, 'FRS SUPER SAIYAN 4 VEGETA', 'Bandai® Figure-Rise Standard Dragon Ball Character Plastic Model Kit FRS SUPER SAIYAN 4 VEGETA\r\nThe Figure-rise Standard kit of Super Saiyan 4 Vegeta from \"Dragon Ball GT\" is molded in color and assembles easily into a fully posable figure! He comes with two interchangeable facial expressions (standard and angry), interchangeable hands, and effects part for his Final Shine Attack, too.', 950, 9, 120, 'BANDAI CO., LTD.', 'DRAGON BALL Z', 'SUPER SAIYAN 4 VEGETA', '-', '0000-00-00', 3, '2025-03-02 17:09:29', '2025-03-02 18:34:36'),
(53, 'RG EVA-00 EVANGELION UNIT 00', 'Bandai® Evangelion 2020 Real Grade 1/144 Model Kit RG EVA-00 EVANGELION UNIT 00 อีวานเกเลียน\r\nRG presents the second addition to their Evangelion line up, ProtoType Unit-00. Jointed in the spine and shoulders, this Real-Grade kit provides all sorts of flexibility in selecting and attaching parts. Pieces from \"Evangelion: 1.0 You Can Assemble\" are also compatible and can be used with this kit. With seven different types of hands, two handknives, and a handrifle included, you can customize and recreate any scene you want. Order today!', 1530, 0, 150, 'BANDAI CO., LTD.', 'NEON GENESIS EVANGELION', 'EVA-00 EVANGELION', '-', '0000-00-00', 14, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(54, 'HG GRENDIZER BLACK VER (INFINITISM)', 'Bandai® Mazinger Z High Grade 1/144 Model Kit HG GRENDIZER BLACK VER INFINITISM\r\nThe special color sheme of Black and Gold version of the ever popular Grendizer in Infinitism design form.\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 1700, 82, 40, 'BANDAI CO., LTD.', 'UFO ROBOT GRENDIZER', 'GRENDIZER BLACK VER (INFINITISM)', '1/144', '0000-00-00', 15, '2025-03-02 17:16:55', '2025-03-02 18:37:17'),
(55, 'Figure-Rise Standard ULTRAMAN Z ORIGINAL', 'RELEASE ส.ค. AUG 2023 : Bandai® Plastic Model Kit Figure-Rise Standard Ultraman Series ULTRAMAN Z ORIGINAL\r\nUltraman Z Original from \"Ultraman Z\" joins the \"Figure-rise Standard\" figure-kit lineup from Bandai! He\'s molded in color so you don\'t need to worry about paint or stickers; his eyes and color timer have been subjected to a \"reflection cut\" process to give them a realistic gleam! Both red and blue color timers are included. The movement of the head is expanded by sinking the parts behind the neck, and the shoulder base is also movable for more natural posing. The Beliarok sword can be held in both his straight and reversed hands; the opening and closing gimmick of the mouth allows you to reproduce the conversation scene. PET sheets are included for Zestium Ray effect parts, as are interchangeable hands. Order him for your own collection today!\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 1130, 92, 45, 'Bandai® Japan', 'Figure-Rise Standard Plastic Model Kits', '-', '-', '0000-00-00', 17, '2025-03-02 17:20:32', '2025-03-02 18:30:28'),
(56, 'Figure-rise Standard ULTRAMAN GEED PRIMITIVE', 'Ultraman Geed Primitive from \"Ultraman Geed\" joins the \"Figure-Rise Standard\" action figure model kit lineup from Bandai! You can reproduce the charging and firing pose for the Wrecking Burst with abundant effect parts and an incredible range of motion! Effect parts that can be attached to the hands and head for the charging pose are included, as is an effect part for the firing of the Wrecking Burst. The parts at the back of the neck sink into the head to allow for increased movement, and the base of the shoulder is movable for more natural poses. New hand parts are included for Geed\'s unique poses. The chest uses \"core back molding,\" the first of its kind in this lineup! \"Core-back molding\" is a technology that controls the flow of resin by moving and deforming the inside of the mold during the multicolor molding process, and molds a single part that combines resins of different colors. This allows for both complex color coding and ease of assembly! Order him for your own collection today!\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 1130, 125, 145, 'Bandai® Japan', 'Figure-Rise Standard Plastic Model Kits', '-', '-', '0000-00-00', 17, '2025-03-02 17:22:32', '2025-03-02 18:30:33'),
(57, 'HG MAGNA-SAURER', 'Bandai® High Grade Go-Saurer 1/300 Scale Character Plastic Model Kit HG MAGNA-SAURER\r\nThe mighty Magnasaurer from \"Gosaurer\" gets an HG kit from Bandai! It can be transformed into the Magna Tyranno form with parts replacement, and it\'s highly posable after assembly thanks to its extensive joints! Combine it with Go-Saurer (sold separately) to recreate the impressive Super Saurer jet and Magna Buster!', 1840, 32, 175, 'BANDAI CO., LTD.', 'GO-SAURER', 'MAGNA-SAURER', '1/300', '0000-00-00', 18, '2025-03-02 17:25:14', '2025-03-02 18:30:38'),
(58, 'FRS MACHINEDRAMON (AMPLIFIED)', '	\r\nBandai® Figure-Rise Standard Digimon Adventure Character Plastic Model Kit FRS MACHINEDRAMON AMPLIFIED\r\nMugendramon from \"Digimon\" joins Bandai\'s Figure-rise Standard Amplified model-kit lineup! He\'s the largest kit in the series so far, at a total height of 25cm once assembled! He\'s fully posable after assembly; the neck and tail adopt a bellows structure using lead wires. He also has an opening and closing gimmick in his chest, with the image of the Giga Destroyer. Foil seals are also included. Order him today!', 2040, 56, 240, 'BANDAI CO., LTD.', 'DIGIMON ADVENTURE', 'MACHINEDRAMON AMPLIFIED', '-', '0000-00-00', 19, '2025-03-02 17:27:55', '2025-03-02 18:29:56'),
(59, 'Figure-Rise Standard ALPHAMON', 'Bandai® Plastic Model Kit Figure-Rise Standard Amplified Digimon Series ALPHAMON AMPLIFIED\r\nBandai brings us a new Figure-rise Standard Amplified model kit of the Alphamon from \"Digimon X-Evolution\"! The parts division is carefully designed to make the different-colored areas on the Alphamon stand out; the booster on its back is equipped with a movable fin that\'s original to this model! The cloak is made of an ultra-thin PET sheet for expressive posability. An effect sheet is included, too. Order this impressive beast for your own collection now!\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 1530, 8, 147, 'Bandai® Japan', 'Figure-Rise Standard Plastic Model Kits', '-', '-', '0000-00-00', 19, '2025-03-02 17:30:27', '2025-03-02 18:29:58'),
(60, 'Figure-Rise Standard Amplified SHINEGREYMON', 'Bandai® Plastic Model Kit Figure-Rise Standard Amplified Digimon Series SHINEGREYMON AMPLIFIED\r\nShineGreymon from \"Digimon Savers\" joins the \"Figure-rise Standard Amplified\" model-kit series from Bandai! This light dragon type Digimon features pull-out shoulder joints to expand the range of movement, enabling him to hold the Geo Gray Sword with both hands! A movable axis in the tip of each foot enables him to stand firmly; the armor behind the knees is linked to the legs for a greater range of motion. The enormous Geo Gray Sword features jewel seals and PET seals, and in an original gimmick for this model, it can transform into a twin sword mode with parts replacement! When in twin sword mode, it can be mounted on each of ShineGreymon\'s legs. Each of the feathers on his wings can be individually moved, and a lead wire is built into his tail for flexibility. Hard points are placed in various areas throughout his body for expandability, too. Order him for your own collection today!\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 1700, 41, 145, 'Bandai® Japan', 'Figure-Rise Standard Plastic Model Kits', '-', '-', '0000-00-00', 19, '2025-03-02 17:33:10', '2025-03-02 18:29:51'),
(61, 'HG 1/24 SPIRICLE STRIKER PROTOTYPE OBU (SAKURA AMAMIYA TYPE)', 'Bandai® High Grade New Sakura Wars Character Model Kit HG SPIRICLE STRIKER PROTOTYPE OBU SAKURA AMAMIYA TYPE\r\nThe Spiricle Striker Shiseiobu from \"New Sakura Wars,\" as used by Sakura Amamiya, joins the HG model kit lineup from Bandai! This distinctive-looking mecha features a cockpit hatch that opens and closes in a unique way, and it\'s also equipped with a blade deployment gimmick and an extension gimmick that allows expansion and contraction at the joints of its limbs for a wider range of action poses. A figure of Sakura is also included. Order yours today!', 2190, 72, 419, 'BANDAI CO., LTD.', 'NEW SAKURA WARS', '1/24 SPIRICLE STRIKER PROTOTYPE OBU (SAKURA AMAMIYA TYPE)', '1/24', '0000-00-00', 20, '2025-03-02 17:36:56', '2025-03-02 18:33:19'),
(62, 'HG 1/24 SPIRICLE STRIKER MUGEN (HATSUHO SHINONOME TYPE)', 'Bandai® High Grade New Sakura Wars Character Model Kit HG SPIRICLE STRIKER MUGEN HATSUHO SHINONOME TYPE\r\nReiko Fighter Mugen (Shinonome Hatsuko) from \"New Sakura Wars\" gets an HG model kit release from Bandai! The cockpit hatch can be opened and closed; a figure of Maaya Uchida is included. The interior of the cockpit is fully reproduced, and the robot is equipped with an extension gimmick to expand and contract the joints in the hands and feet for a wider range of action poses. The characteristic huge hammer weapon is also included. Order yours now!', 1880, 8, 233, 'BANDAI CO., LTD.', 'NEW SAKURA WARS', '1/24 SPIRICLE STRIKER PROTOTYPE OBU (SAKURA AMAMIYA TYPE)', '1/24', '0000-00-00', 21, '2025-03-02 17:39:17', '2025-03-02 18:33:19'),
(63, 'TOYLAXY MARVEL AVENGERS ENDGAME THOR', 'ToyLaxy™ Premium PVC Desktop Statue Marvel Avengers Endgame Premium PVC Statue THOR\r\nToylaxy ภูมิใจนำเสนอไลน์ใหม่ของเราที่ร่วมมือกับทีม qlay by igloo ในการออกแบบออกมาเป็นไลน์ Premium PVC ที่เปิดตัวพร้อมกับหนังที่คนรอคอยมากที่สุดอย่าง Marvel\'s Avengers: End Game ไลน์นี้ไม่ใช้เป็นแค่งานฟิกเกอร์ PVC ธรรมดา เพราะเราได้ออกแบบและลงทุนลงไปในรายละเอียด ท่า Action ฐานที่เป็น Diorama และเนื้อของ PVC ที่แข็งและทดทาน ในราคาที่ทุกๆ คนจับต้องได้ โดยตัวละครที่จะออกมาคือ', 1190, 15, 122, 'LION HOUSE CO., LTD.', 'MARVEL AVENGERS ENDGAME', 'THOR', '-', '0000-00-00', 22, '2025-03-02 17:47:50', '2025-03-02 18:33:19'),
(64, 'TOYLAXY MARVEL AVENGERS ENDGAME THANOS', 'ToyLaxy™ Premium PVC Desktop Statue Marvel Avengers Endgame Premium PVC Statue THANOS\r\nToylaxy ภูมิใจนำเสนอไลน์ใหม่ของเราที่ร่วมมือกับทีม qlay by igloo ในการออกแบบออกมาเป็นไลน์ Premium PVC ที่เปิดตัวพร้อมกับหนังที่คนรอคอยมากที่สุดอย่าง Marvel\'s Avengers: End Game ไลน์นี้ไม่ใช้เป็นแค่งานฟิกเกอร์ PVC ธรรมดา เพราะเราได้ออกแบบและลงทุนลงไปในรายละเอียด ท่า Action ฐานที่เป็น Diorama และเนื้อของ PVC ที่แข็งและทดทาน ในราคาที่ทุกๆ คนจับต้องได้ โดยตัวละครที่จะออกมาคือ', 1290, 74, 244, 'LION HOUSE CO., LTD.', 'MARVEL AVENGERS ENDGAME', 'THANOS', '-', '0000-00-00', 22, '2025-03-02 18:10:00', '2025-03-02 18:33:19'),
(65, 'PG 1/72 MILLENNIUM FALCON', 'Bandai® Star Wars Premium Scale Plastic Model Kit PERFECT GRADE 1/72 MILLENNIUM FALCON\r\nThe Millennium Falcon, as seen in the celebrated first 1977 film Star Wars: A New Hope joins the Perfect Grade series, Bandai\'s flagship line of premium grade, ultra-detailed plastic model kits.\r\nDesigned with total accuracy in mind, the kit is based on thorough research of the 67-inch studio model used in the film. It features faithful detail such as the cockpit and laser cannons, no compromises were made in the sculpting of the kit.\r\nThis model kit includes an LED unit to illumiate the engines, landing gear, cockpit, and boarding ramp; it also features Photo-Etched parts, water-transfer decals, a custom display base, and instructions to put this snap-fit mammoth together.\r\nYou can also seat the Han, Luke, Leia, Chewbacca, Obi-Wan, and C-3PO mini figures into the Millennium Falcon\'s cockpit to replicate iconic scenes in the film!', 16900, 80, 54, 'BANDAI CO., LTD.', 'STAR WARS', '1/72 MILLENNIUM FALCON', '1/72', '0000-00-00', 23, '2025-03-02 18:12:51', '2025-03-02 18:34:57'),
(66, '1/48 AT-ST', 'Bandai® Star Wars 1/48 AT-ST model kit from STAR WARS Episode IV / V / VI. ', 820, 45, 450, 'BANDAI CO., LTD.', 'STAR WARS EPISODE IV / V / VI', 'AT-ST', '1/48', '0000-00-00', 23, '2025-03-02 18:15:11', '2025-03-02 18:29:34'),
(67, 'HG CHO MASHIN RYUJINMARU', 'Bandai® High Grade Mashin Hero Wataru Plastic Model Kit HG CHO MASHIN RYUJINMARU\r\nRyujinmaru (龍神丸) is the primary mashin of Wataru Homurabe in the Chou Mashin Hero Wataru: Another Step game/side-story. His real form and true soul is that of the \"Gold Dragon\" of Shinbukai\'s Shinbu Dragon Gods.', 1650, 57, 41, 'BANDAI CO., LTD.', 'MASHIN HERO WATARU', 'CHO MASHIN RYUJINMARU', '-', '0000-00-00', 24, '2025-03-02 18:17:38', '2025-03-02 18:32:17'),
(68, 'HG AMPLIFIED IMGN RYUJINMARU', '	\r\nBandai® High Grade Amplified IMGN Plastic Model Kits Series HG IMGN RYUJINMARU\r\nThe Amplified IMGN Fyujinmaru from \"Mashin Eiyuuden Wataru\" gets a new HG model kit from Bandai! Glossy injection-molded parts and gold-plated parts give the completed robot a luxurious look; its huge sssword is gold-plated as well, and can be attached to its back. Various interchangable hands are also included. Order yours now!', 1700, 16, 48, 'BANDAI CO., LTD.', '-', '-', '-', '0000-00-00', 24, '2025-03-02 18:19:17', '2025-03-02 18:32:17'),
(69, 'HG AMPLIFIED IMGN RYUOUMARU', 'Ryuoumaru from \"Mashin Eiyuuden Wataru\" has been made into a High Grade model kit by Bandai! The \"HG Amplified IMGN\" series imagines new arrangements based on the concept of a plastic model kit, and amplies the charm of the characters. This kit\'s posability takes advantage of his long limbs; the forehead can be built with or without a pattern. Gloss injection molding and gold-plated parts are used to express a vivid texture; the blade of the Horyuken is gold-plated, and the original design pattern is reproduced with 3D metallic stickers. The scabbard shield is equipped with an opening and closing gimmick for the Phoenix form, and it can also store the Horyuken. The Ryuoumaru can transform into its Houou form, and a PET effect sheet is included for the Houou form! Attach the Dragon Claw on the shoulder to the included base to reproduce the Ryuga Fist! Order this incredible mech for your own collection today!\r\n⚠️ This is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 2040, 76, 51, 'Bandai® Japan', '-', '-', '-', '0000-00-00', 24, '2025-03-02 18:21:27', '2025-03-02 18:32:17'),
(70, 'HG JYAKOMARU', 'The Jyakomaru from \"Mashin Hero Wataru\" is now an HG model kit from Bandai! It\'s carefully designed to be faithful to its design in the anime; replacement parts and built-in slide and rotation gimmicks mean it can transform into its Ferocious Tiger Mode! The shoulder joints are structured so that it can reproduce the pose where he pulls out the Tiger Sword; the Tiger Sword can be stored in the Tiger Shield, and the Tiger Shield can be attached to Jyakomaru\'s arm with connecting parts. The shield attaches to the back when in Ferocious Tiger Mode. The Evil Tiger Missile is also included, and a special base is included to display it after firing! Interchangeable hands are also included. Order it for your own collection today!\r\n⚠️ IMPORTANT NOTE\r\nสินค้าเป็นพลาสติกโมเดลต้องต่อเองนะคะ ลูกค้าจะได้รับเป็นแผงรันเนอร์พร้อมคู่มือในการต่อค่ะ\r\nThis is Bandai\'s highly detailed plastic model kit which self assembly is required. No glue or paint necessary. Official product visuals shown are provided by Official Bandai which may be painted and clear coated. Final product may be slightly different upon completion.', 920, 15, 58, 'Bandai® Japan', '-', '-', '-', '0000-00-00', 24, '2025-03-02 18:23:07', '2025-03-02 18:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_name`, `is_primary`, `created_at`, `updated_at`) VALUES
(49, 48, 'Product-1740934691105fo.jpg', 0, '2025-03-02 16:58:11', '2025-03-02 16:58:11'),
(50, 48, 'Product-1740934691128r3.jpg', 0, '2025-03-02 16:58:11', '2025-03-02 16:58:11'),
(51, 48, 'Product-1740934691130sq.jpg', 0, '2025-03-02 16:58:11', '2025-03-02 16:58:11'),
(52, 48, 'Product-1740934691131v7.jpg', 0, '2025-03-02 16:58:11', '2025-03-02 16:58:11'),
(53, 49, 'Product-174093492161327.jpg', 0, '2025-03-02 17:02:01', '2025-03-02 17:02:01'),
(54, 49, 'Product-1740934921614b2.jpg', 0, '2025-03-02 17:02:01', '2025-03-02 17:02:01'),
(55, 49, 'Product-1740934921616ej.jpg', 0, '2025-03-02 17:02:01', '2025-03-02 17:02:01'),
(56, 49, 'Product-1740934921617tf.jpg', 0, '2025-03-02 17:02:01', '2025-03-02 17:02:01'),
(57, 50, 'Product-17409350334483v.jpg', 0, '2025-03-02 17:03:53', '2025-03-02 17:03:53'),
(58, 50, 'Product-1740935033449e4.jpg', 0, '2025-03-02 17:03:53', '2025-03-02 17:03:53'),
(59, 50, 'Product-1740935033450yb.jpg', 0, '2025-03-02 17:03:53', '2025-03-02 17:03:53'),
(60, 50, 'Product-1740935033450z4.jpg', 0, '2025-03-02 17:03:53', '2025-03-02 17:03:53'),
(61, 51, 'Product-1740935256006fu.jpg', 0, '2025-03-02 17:07:36', '2025-03-02 17:07:36'),
(62, 51, 'Product-1740935256007qs.jpg', 0, '2025-03-02 17:07:36', '2025-03-02 17:07:36'),
(63, 51, 'Product-1740935256008rs.jpg', 0, '2025-03-02 17:07:36', '2025-03-02 17:07:36'),
(64, 51, 'Product-1740935256008s1.jpg', 0, '2025-03-02 17:07:36', '2025-03-02 17:07:36'),
(65, 52, 'Product-17409354105831a.jpg', 0, '2025-03-02 17:10:10', '2025-03-02 17:10:10'),
(66, 52, 'Product-17409354105837p.jpg', 0, '2025-03-02 17:10:10', '2025-03-02 17:10:10'),
(67, 52, 'Product-1740935410584ip.jpg', 0, '2025-03-02 17:10:10', '2025-03-02 17:10:10'),
(68, 52, 'Product-1740935410585p1.jpg', 0, '2025-03-02 17:10:10', '2025-03-02 17:10:10'),
(69, 53, 'Product-17409356056466z.jpg', 0, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(70, 53, 'Product-1740935605647cc.jpg', 0, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(71, 53, 'Product-1740935605647hr.jpg', 0, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(72, 53, 'Product-1740935605648jm.jpg', 0, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(73, 53, 'Product-1740935605648ke.jpg', 0, '2025-03-02 17:13:25', '2025-03-02 17:13:25'),
(74, 54, 'Product-1740935815085cg.jpg', 0, '2025-03-02 17:16:55', '2025-03-02 17:16:55'),
(75, 54, 'Product-1740935815086fx.jpg', 0, '2025-03-02 17:16:55', '2025-03-02 17:16:55'),
(76, 54, 'Product-1740935815086nq.jpg', 0, '2025-03-02 17:16:55', '2025-03-02 17:16:55'),
(77, 54, 'Product-1740935815087x6.jpg', 0, '2025-03-02 17:16:55', '2025-03-02 17:16:55'),
(78, 54, 'Product-1740935815088yg.jpg', 0, '2025-03-02 17:16:55', '2025-03-02 17:16:55'),
(80, 55, 'Product-1740936032973ep.jpg', 0, '2025-03-02 17:20:32', '2025-03-02 17:20:32'),
(81, 55, 'Product-1740936032976u1.jpg', 0, '2025-03-02 17:20:32', '2025-03-02 17:20:32'),
(82, 55, 'Product-1740936043642c2.jpg', 0, '2025-03-02 17:20:43', '2025-03-02 17:20:43'),
(83, 56, 'Product-17409361526864o.jpg', 0, '2025-03-02 17:22:32', '2025-03-02 17:22:32'),
(84, 56, 'Product-1740936152687h6.jpg', 0, '2025-03-02 17:22:32', '2025-03-02 17:22:32'),
(85, 56, 'Product-1740936152687qn.jpg', 0, '2025-03-02 17:22:32', '2025-03-02 17:22:32'),
(86, 56, 'Product-1740936152688z0.jpg', 0, '2025-03-02 17:22:32', '2025-03-02 17:22:32'),
(87, 57, 'Product-17409363141349f.jpg', 0, '2025-03-02 17:25:14', '2025-03-02 17:25:14'),
(88, 57, 'Product-1740936314135e9.jpg', 0, '2025-03-02 17:25:14', '2025-03-02 17:25:14'),
(89, 57, 'Product-1740936314136fm.jpg', 0, '2025-03-02 17:25:14', '2025-03-02 17:25:14'),
(90, 57, 'Product-1740936314164m2.jpg', 0, '2025-03-02 17:25:14', '2025-03-02 17:25:14'),
(91, 57, 'Product-1740936314165m4.jpg', 0, '2025-03-02 17:25:14', '2025-03-02 17:25:14'),
(92, 58, 'Product-1740936475974kb.jpg', 0, '2025-03-02 17:27:55', '2025-03-02 17:27:55'),
(93, 58, 'Product-1740936475975u6.jpg', 0, '2025-03-02 17:27:55', '2025-03-02 17:27:55'),
(94, 58, 'Product-1740936475976uf.jpg', 0, '2025-03-02 17:27:55', '2025-03-02 17:27:55'),
(95, 58, 'Product-1740936475978ws.jpg', 0, '2025-03-02 17:27:55', '2025-03-02 17:27:55'),
(96, 59, 'Product-1740936627047a4.jpg', 0, '2025-03-02 17:30:27', '2025-03-02 17:30:27'),
(97, 59, 'Product-1740936627048ib.jpg', 0, '2025-03-02 17:30:27', '2025-03-02 17:30:27'),
(98, 59, 'Product-1740936627050ln.jpg', 0, '2025-03-02 17:30:27', '2025-03-02 17:30:27'),
(99, 59, 'Product-1740936627051nr.jpg', 0, '2025-03-02 17:30:27', '2025-03-02 17:30:27'),
(100, 60, 'Product-1740936790276n1.jpg', 0, '2025-03-02 17:33:10', '2025-03-02 17:33:10'),
(101, 60, 'Product-1740936790283nb.jpg', 0, '2025-03-02 17:33:10', '2025-03-02 17:33:10'),
(102, 60, 'Product-1740936790286ay.jpg', 0, '2025-03-02 17:33:10', '2025-03-02 17:33:10'),
(103, 61, 'Product-1740937016390qu.jpg', 0, '2025-03-02 17:36:56', '2025-03-02 17:36:56'),
(104, 61, 'Product-17409370163923p.jpg', 0, '2025-03-02 17:36:56', '2025-03-02 17:36:56'),
(105, 61, 'Product-174093701639346.jpg', 0, '2025-03-02 17:36:56', '2025-03-02 17:36:56'),
(106, 61, 'Product-1740937016393qu.jpg', 0, '2025-03-02 17:36:56', '2025-03-02 17:36:56'),
(107, 62, 'Product-17409371572042r.jpg', 0, '2025-03-02 17:39:17', '2025-03-02 17:39:17'),
(108, 62, 'Product-17409371572059p.jpg', 0, '2025-03-02 17:39:17', '2025-03-02 17:39:17'),
(109, 62, 'Product-174093715720612.jpg', 0, '2025-03-02 17:39:17', '2025-03-02 17:39:17'),
(110, 62, 'Product-1740937157209mk.jpg', 0, '2025-03-02 17:39:17', '2025-03-02 17:39:17'),
(113, 63, 'Product-1740937670192pf.jpg', 0, '2025-03-02 17:47:50', '2025-03-02 17:47:50'),
(114, 63, 'Product-1740937670192ue.jpg', 0, '2025-03-02 17:47:50', '2025-03-02 17:47:50'),
(115, 63, 'Product-1740938904867j5.jpg', 0, '2025-03-02 18:08:24', '2025-03-02 18:08:24'),
(116, 63, 'Product-1740938904869k5.jpg', 0, '2025-03-02 18:08:24', '2025-03-02 18:08:24'),
(117, 64, 'Product-1740939000633gu.jpg', 0, '2025-03-02 18:10:00', '2025-03-02 18:10:00'),
(118, 64, 'Product-1740939000634qb.jpg', 0, '2025-03-02 18:10:00', '2025-03-02 18:10:00'),
(119, 64, 'Product-1740939000635rk.jpg', 0, '2025-03-02 18:10:00', '2025-03-02 18:10:00'),
(120, 64, 'Product-1740939000637yh.jpg', 0, '2025-03-02 18:10:00', '2025-03-02 18:10:00'),
(121, 65, 'Product-174093917173750.jpg', 0, '2025-03-02 18:12:51', '2025-03-02 18:12:51'),
(122, 65, 'Product-1740939171738ju.jpg', 0, '2025-03-02 18:12:51', '2025-03-02 18:12:51'),
(123, 65, 'Product-1740939171739r1.jpg', 0, '2025-03-02 18:12:51', '2025-03-02 18:12:51'),
(124, 65, 'Product-1740939171753tz.jpg', 0, '2025-03-02 18:12:51', '2025-03-02 18:12:51'),
(125, 66, 'Product-1740939311854do.jpg', 0, '2025-03-02 18:15:11', '2025-03-02 18:15:11'),
(126, 66, 'Product-1740939311854go.jpg', 0, '2025-03-02 18:15:11', '2025-03-02 18:15:11'),
(127, 66, 'Product-17409393118542i.jpg', 0, '2025-03-02 18:15:11', '2025-03-02 18:15:11'),
(128, 67, 'Product-1740939458824ca.jpg', 0, '2025-03-02 18:17:38', '2025-03-02 18:17:38'),
(129, 67, 'Product-1740939458826ck.jpg', 0, '2025-03-02 18:17:38', '2025-03-02 18:17:38'),
(130, 67, 'Product-1740939458827f4.jpg', 0, '2025-03-02 18:17:38', '2025-03-02 18:17:38'),
(131, 67, 'Product-1740939458827g1.jpg', 0, '2025-03-02 18:17:38', '2025-03-02 18:17:38'),
(132, 68, 'Product-17409395572149n.jpg', 0, '2025-03-02 18:19:17', '2025-03-02 18:19:17'),
(133, 68, 'Product-1740939557216bw.jpg', 0, '2025-03-02 18:19:17', '2025-03-02 18:19:17'),
(134, 68, 'Product-1740939557218e1.jpg', 0, '2025-03-02 18:19:17', '2025-03-02 18:19:17'),
(135, 68, 'Product-1740939557219vs.jpg', 0, '2025-03-02 18:19:17', '2025-03-02 18:19:17'),
(136, 69, 'Product-1740939687209fq.jpg', 0, '2025-03-02 18:21:27', '2025-03-02 18:21:27'),
(137, 69, 'Product-1740939687210yu.jpg', 0, '2025-03-02 18:21:27', '2025-03-02 18:21:27'),
(138, 69, 'Product-17409396872110d.jpg', 0, '2025-03-02 18:21:27', '2025-03-02 18:21:27'),
(139, 69, 'Product-174093968721113.jpg', 0, '2025-03-02 18:21:27', '2025-03-02 18:21:27'),
(140, 70, 'Product-17409397879104f.jpg', 0, '2025-03-02 18:23:07', '2025-03-02 18:23:07'),
(141, 70, 'Product-1740939787914qa.jpg', 0, '2025-03-02 18:23:07', '2025-03-02 18:23:07'),
(142, 70, 'Product-1740939787917uu.jpg', 0, '2025-03-02 18:23:07', '2025-03-02 18:23:07'),
(143, 70, 'Product-1740939787918yq.jpg', 0, '2025-03-02 18:23:07', '2025-03-02 18:23:07');

-- --------------------------------------------------------

--
-- Table structure for table `product_on_cart`
--

CREATE TABLE `product_on_cart` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `count` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_on_order`
--

CREATE TABLE `product_on_order` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `count` int(11) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product_on_order`
--

INSERT INTO `product_on_order` (`order_id`, `product_id`, `count`, `price`) VALUES
(67, 70, 1, 920),
(67, 69, 1, 2040),
(67, 68, 1, 1700),
(67, 67, 1, 1650),
(68, 65, 1, 16900),
(68, 64, 1, 1290),
(68, 63, 1, 1190),
(68, 62, 1, 1880),
(68, 61, 1, 2190),
(69, 50, 1, 850),
(69, 49, 1, 850),
(69, 48, 1, 850),
(69, 52, 2, 950),
(69, 51, 1, 1630),
(70, 65, 1, 16900),
(70, 49, 1, 850),
(71, 54, 1, 1700);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user',
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `phone_number`, `role`, `enabled`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$DqKJk2XRg3Ls9/mW9SdCZuniJeZdiJvRP15Jb46H62tKGhC.KY196', 'John12', 'Doe12', '0000000000', 'admin', 1, '2025-02-20 10:19:03', '2025-03-02 18:37:45'),
(2, 'user1', 'user1@example.com', '$2b$10$DqKJk2XRg3Ls9/mW9SdCZuniJeZdiJvRP15Jb46H62tKGhC.KY196', 'Alice', 'Smith', '0987654321', 'user', 1, '2025-02-20 10:19:03', '2025-03-02 18:47:26'),
(3, 'user2', 'user2@example.com', '$2b$10$DqKJk2XRg3Ls9/mW9SdCZuniJeZdiJvRP15Jb46H62tKGhC.KY196', 'Bob', 'Johnson', '0000000000', 'user', 1, '2025-02-20 10:19:03', '2025-03-02 16:48:23'),
(14, 'user3', 'user3@user3.com', '$2b$10$S5B9nrbXipCZGriFcvGuaer1kj4rCSnakrseNzmIr0H3EQ4F1ikNS', 'user3', 'user3', '0000000000', 'user', 1, '2025-03-01 09:39:18', '2025-03-02 16:48:54'),
(15, 'user4', 'user4@user4.com', '$2b$10$.q28wpOtDwbksSbyZIQlQu0UdU8k7XCbinfM2neSQ3GDwLrxGEWUG', 'user4', 'user4', '0000000000', 'user', 1, '2025-03-01 09:42:18', '2025-03-02 16:48:34'),
(16, 'user5', 'user5@user5.com', '$2b$10$bBWbMgPbMsKTZp.Gqfa8fesJk9c6wn8iuwFs02r9cg3DZH9wj.2ae', 'user5', 'user5', '0000000000', 'user', 1, '2025-03-01 15:26:18', '2025-03-01 15:26:18'),
(17, 'user6', 'user6@user6.com', '$2b$10$vyTW8a3IafwT7594zSpWAOXqSUpNqXzn26DQ9JkUyWpvEBf/sHC.W', 'user5', 'user5', '0000000000', 'user', 1, '2025-03-01 15:26:32', '2025-03-01 15:26:32'),
(18, 'user7', 'user7@user7.com', '$2b$10$GNeeZ/Yr5AHfsRbKfy.IfuvI2y8vD5OSqo.3AdHB3l.Tyv1BsQhiW', 'user7', 'user5', '0000000000', 'user', 1, '2025-03-01 15:26:55', '2025-03-01 15:26:55'),
(19, 'user8', 'user8@user8.com', '$2b$10$cZuJ24EC9HgmLjQmZKBsWOBLeX5f7P3U.hNFMCoa5LOFioiklfO5C', 'user7', 'user5', '0000000000', 'user', 1, '2025-03-01 15:27:39', '2025-03-01 15:27:39'),
(20, 'user9', 'user9@user9.com', '$2b$10$7.8zDzz3lHh2Oqr5tfRwKeQxeNPdwN8eNyTI5ja.j90h8a9ftEF42', 'user7', 'user5', '0000000000', 'user', 1, '2025-03-01 15:28:23', '2025-03-01 15:28:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_on_cart`
--
ALTER TABLE `product_on_cart`
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_on_order`
--
ALTER TABLE `product_on_order`
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_on_cart`
--
ALTER TABLE `product_on_cart`
  ADD CONSTRAINT `product_on_cart_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_on_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_on_order`
--
ALTER TABLE `product_on_order`
  ADD CONSTRAINT `product_on_order_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_on_order_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
