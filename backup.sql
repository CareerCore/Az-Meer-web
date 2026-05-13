-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 13, 2026 at 11:04 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ezyro_41821031_azmeer`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `summary` text,
  `content` longtext,
  `image` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `author`, `summary`, `content`, `image`, `created_at`, `category`) VALUES
(2, 'The Future of AI in Web', 'Admin', 'How AI is changing the landscape of development.', 'Artificial intelligence is no longer a buzzword...', '', '2026-05-07 01:17:37', 'Web Site'),
(3, 'Why Laragon is Great', 'Abdul Basit', 'Comparing Laragon vs XAMPP for local dev.', 'Laragon provides a much smoother experience...', '', '2026-05-07 01:17:37', 'Hosting');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int NOT NULL,
  `question` text,
  `answer` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `created_at`) VALUES
(1, 'q1', 'ac', '2026-05-07 01:14:26'),
(2, 'What services do you offer?', 'We offer Web, Mobile, and Digital Marketing services.', '2026-05-07 01:17:37'),
(3, 'How can I contact support?', 'You can email us at teamabhpk@gmail.com.', '2026-05-07 01:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `live_chats`
--

CREATE TABLE `live_chats` (
  `id` int NOT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT 'open',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `live_chats`
--

INSERT INTO `live_chats` (`id`, `guest_name`, `guest_email`, `session_id`, `assigned_to`, `order_id`, `status`, `created_at`) VALUES
(14, 'Client', 'client@azmeer.com', '12b39e23f215cf8aad8a94a4833b2d2a', 4, NULL, 'open', '2026-05-12 21:00:28'),
(15, 'Admin', 'admin@azmeer.com', '839bd85ce3dd71df2b91f2dab0fd0bdb', NULL, NULL, 'open', '2026-05-12 21:08:38'),
(16, 'owner', 'ownwer@azmeer.com', 'f3277a00f0455c89729599eb1494020f', NULL, NULL, 'open', '2026-05-12 21:11:07'),
(17, 'Freelancer', 'freelancer@azmeer.com', 'df6b57265d147ab8c8965206236e1124', NULL, NULL, 'open', '2026-05-12 21:12:57');

-- --------------------------------------------------------

--
-- Table structure for table `live_messages`
--

CREATE TABLE `live_messages` (
  `id` int NOT NULL,
  `chat_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `live_messages`
--

INSERT INTO `live_messages` (`id`, `chat_id`, `sender_id`, `message`, `created_at`) VALUES
(20, 14, 3, 'hi', '2026-05-12 21:08:06'),
(21, 14, 2, 'i m manager', '2026-05-12 21:10:24'),
(22, 14, 5, 'i am owner', '2026-05-12 21:12:21'),
(23, 14, 3, 'hiii', '2026-05-13 10:07:34');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `project_description` text,
  `assigned_to` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `service_id`, `price`, `status`, `project_description`, `assigned_to`, `created_at`) VALUES
(9, 3, 106, 600.00, 'completed', 'rer', 4, '2026-05-12 21:07:13');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `image` text,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `client` text,
  `duration` text,
  `technologies` text,
  `team_size` text,
  `overview` text,
  `features` text,
  `results` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `title`, `category`, `description`, `image`, `link`, `created_at`, `client`, `duration`, `technologies`, `team_size`, `overview`, `features`, `results`) VALUES
(2, 'Grozy Mart', 'Application', 'This web application serves as a comprehensive platform for managing a grocery store, offering features for inventory control, order processing, and customer relationship management, all developed using the [specific technology/framework/language] platform.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 'https://play.google.com/store/apps/details?id=com.grozymart', '2026-05-10 17:37:34', 'Adnan Ali', '7 weeks', 'Android Studio , java', '1', 'Grocery Application', 'Shopping Online', '100%');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `rating` decimal(3,1) DEFAULT '5.0',
  `reviews` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `category`, `description`, `price`, `image`, `created_at`, `rating`, `reviews`) VALUES
(3, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-07 19:14:13', 5.0, 0),
(4, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-07 19:14:13', 5.0, 0),
(5, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-07 19:14:13', 5.0, 0),
(6, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-07 19:14:13', 5.0, 0),
(7, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-07 19:14:13', 5.0, 0),
(8, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-07 19:14:13', 5.0, 0),
(9, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-07 19:14:13', 5.0, 0),
(10, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-07 19:14:13', 5.0, 0),
(11, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-07 19:32:14', 5.0, 0),
(12, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-07 19:32:14', 5.0, 0),
(13, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-07 19:32:14', 5.0, 0),
(14, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-07 19:32:14', 5.0, 0),
(15, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-07 19:32:14', 5.0, 0),
(16, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-07 19:32:14', 5.0, 0),
(17, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-07 19:32:14', 5.0, 0),
(18, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-07 19:32:14', 5.0, 0),
(19, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-07 19:32:25', 5.0, 0),
(20, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-07 19:32:25', 5.0, 0),
(21, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-07 19:32:25', 5.0, 0),
(22, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-07 19:32:25', 5.0, 0),
(23, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-07 19:32:25', 5.0, 0),
(24, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-07 19:32:25', 5.0, 0),
(25, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-07 19:32:25', 5.0, 0),
(26, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-07 19:32:25', 5.0, 0),
(27, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 16:24:04', 5.0, 0),
(28, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 16:24:04', 5.0, 0),
(29, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 16:24:04', 5.0, 0),
(30, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 16:24:04', 5.0, 0),
(31, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 16:24:04', 5.0, 0),
(32, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 16:24:04', 5.0, 0),
(33, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 16:24:04', 5.0, 0),
(34, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 16:24:04', 5.0, 0),
(35, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 17:03:36', 5.0, 0),
(36, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 17:03:36', 5.0, 0),
(37, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 17:03:36', 5.0, 0),
(38, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 17:03:36', 5.0, 0),
(39, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 17:03:36', 5.0, 0),
(40, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 17:03:36', 5.0, 0),
(41, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 17:03:36', 5.0, 0),
(42, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 17:03:36', 5.0, 0),
(43, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 17:47:34', 5.0, 0),
(44, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 17:47:34', 5.0, 0),
(45, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 17:47:34', 5.0, 0),
(46, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 17:47:34', 5.0, 0),
(47, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 17:47:34', 5.0, 0),
(48, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 17:47:34', 5.0, 0),
(49, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 17:47:34', 5.0, 0),
(50, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 17:47:34', 5.0, 0),
(51, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 18:27:08', 5.0, 0),
(52, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:27:08', 5.0, 0),
(53, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 18:27:08', 5.0, 0),
(54, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 18:27:08', 5.0, 0),
(55, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 18:27:08', 5.0, 0),
(56, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 18:27:08', 5.0, 0),
(57, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 18:27:08', 5.0, 0),
(58, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 18:27:08', 5.0, 0),
(59, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 18:29:19', 5.0, 0),
(60, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:29:19', 5.0, 0),
(61, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 18:29:19', 5.0, 0),
(62, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 18:29:19', 5.0, 0),
(63, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 18:29:19', 5.0, 0),
(64, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 18:29:19', 5.0, 0),
(65, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 18:29:19', 5.0, 0),
(66, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 18:29:19', 5.0, 0),
(67, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 18:32:06', 5.0, 0),
(68, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:32:06', 5.0, 0),
(69, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 18:32:06', 5.0, 0),
(70, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 18:32:06', 5.0, 0),
(71, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 18:32:06', 5.0, 0),
(72, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 18:32:06', 5.0, 0),
(73, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 18:32:06', 5.0, 0),
(74, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 18:32:06', 5.0, 0),
(75, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 18:39:40', 5.0, 0),
(76, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:39:40', 5.0, 0),
(77, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 18:39:40', 5.0, 0),
(78, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 18:39:40', 5.0, 0),
(79, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 18:39:40', 5.0, 0),
(80, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 18:39:40', 5.0, 0),
(81, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 18:39:40', 5.0, 0),
(82, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 18:39:40', 5.0, 0),
(83, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 19:06:05', 5.0, 0),
(84, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:06:05', 5.0, 0),
(85, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 19:06:05', 5.0, 0),
(86, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 19:06:05', 5.0, 0),
(87, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 19:06:05', 5.0, 0),
(88, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 19:06:05', 5.0, 0),
(89, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 19:06:05', 5.0, 0),
(90, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 19:06:05', 5.0, 0),
(91, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 19:34:15', 5.0, 0),
(92, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:34:15', 5.0, 0),
(93, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 19:34:15', 5.0, 0),
(94, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 19:34:15', 5.0, 0),
(95, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 19:34:15', 5.0, 0),
(96, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 19:34:15', 5.0, 0),
(97, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 19:34:15', 5.0, 0),
(98, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 19:34:15', 5.0, 0),
(99, 'Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '2026-05-10 19:38:40', 5.0, 0),
(100, 'Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500.00, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:38:40', 5.0, 0),
(101, 'UI/UX Design', 'Design', 'Professional user interface and experience design.', 800.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5', '2026-05-10 19:38:40', 5.0, 0),
(102, 'SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500.00, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', '2026-05-10 19:38:40', 5.0, 0),
(103, 'Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', '2026-05-10 19:38:40', 5.0, 0),
(104, 'Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d', '2026-05-10 19:38:40', 5.0, 0),
(105, 'Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200.00, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '2026-05-10 19:38:40', 5.0, 0),
(106, 'Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', '2026-05-10 19:38:40', 5.0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int NOT NULL,
  `setting_key` varchar(255) DEFAULT NULL,
  `setting_value` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`) VALUES
(1, 'site_name', 'xxx'),
(2, 'hero_title', 'xxx'),
(3, 'hero_subtitle', 'xxx'),
(4, '3d_blob_1', '#2563eb'),
(5, '3d_blob_2', '#4f46e5'),
(6, '3d_speed', '1.0');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `bio` text,
  `email` varchar(255) DEFAULT NULL,
  `image` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `username`, `role`, `bio`, `email`, `image`, `created_at`) VALUES
(5, 'Muhammad Zafar', 'CTO & Co-Founder', 'Full-stack architect with expertise in scalable systems. Ex-Netflix engineer.', 'zafar@azmeer.com', NULL, '2026-05-07 01:19:48'),
(6, 'Ahmad Ihsan', 'Lead Frontend Developer', 'React specialist with a passion for performance optimization.', 'ihsan@azmeer.com', NULL, '2026-05-07 01:19:48'),
(12, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://scontent.flhe38-1.fna.fbcdn.net/v/t39.30808-1/666637601_1631458841628953_191256200965558566_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeEUyogkHiQVYM4wNeAWbCyyJwapsnEKwg0nBqmycQrCDdDM3VDrGVOTjiU5g6npUTK0cGM3cm05ljsZ9kpzwl9s&_nc_ohc=5LmikST3cU0Q7kNvwF-QKe1&_nc_oc=AdoV1SRqR-AfPaxUeyPn9ti9oD0y6kvLHyxg-FO61tp0RHzR_y8JqBob5q0RdIjgj9I&_nc_zt=24&_nc_ht=scontent.flhe38-1.fna&_nc_gid=6GBGUoNNm-Oic8LqMt2fnw&_nc_ss=7b2a8&oh=00_Af7WIlGlxz8ixIJh1sXkb4hDLvD3es0dImSn-Bl8LvcAEQ&oe=6A0292B5', '2026-05-07 19:32:14'),
(20, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 16:24:04'),
(21, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 16:24:05'),
(22, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 16:24:05'),
(23, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 16:24:05'),
(24, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 17:03:36'),
(25, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 17:03:36'),
(26, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 17:03:36'),
(27, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 17:03:36'),
(28, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 17:47:34'),
(29, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 17:47:34'),
(30, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 17:47:34'),
(31, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 17:47:34'),
(32, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 18:27:08'),
(33, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 18:27:08'),
(34, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 18:27:08'),
(35, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 18:27:08'),
(36, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 18:29:19'),
(37, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 18:29:19'),
(38, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 18:29:19'),
(39, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 18:29:19'),
(40, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 18:32:06'),
(41, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 18:32:06'),
(42, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 18:32:06'),
(43, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 18:32:06'),
(44, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 18:39:40'),
(45, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 18:39:40'),
(46, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 18:39:40'),
(47, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 18:39:40'),
(48, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 19:06:05'),
(49, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 19:06:05'),
(50, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 19:06:05'),
(51, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 19:06:05'),
(52, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 19:34:15'),
(53, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 19:34:15'),
(54, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 19:34:15'),
(55, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 19:34:15'),
(56, 'Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '2026-05-10 19:38:40'),
(57, 'Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '2026-05-10 19:38:40'),
(58, 'John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2026-05-10 19:38:40'),
(59, 'Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '2026-05-10 19:38:40');

-- --------------------------------------------------------

--
-- Table structure for table `top_services`
--

CREATE TABLE `top_services` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `icon` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `rating` decimal(3,1) DEFAULT '5.0',
  `reviews` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `top_services`
--

INSERT INTO `top_services` (`id`, `title`, `description`, `icon`, `created_at`, `rating`, `reviews`) VALUES
(1, 'T1', 'top 1', 'tyd', '2026-05-07 01:13:16', 5.0, 0),
(2, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 16:24:05', 5.0, 0),
(3, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 16:24:05', 5.0, 0),
(4, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 16:24:05', 5.0, 0),
(5, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 17:03:36', 5.0, 0),
(6, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 17:03:36', 5.0, 0),
(7, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 17:03:36', 5.0, 0),
(8, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 17:47:34', 5.0, 0),
(9, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 17:47:34', 5.0, 0),
(10, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 17:47:34', 5.0, 0),
(11, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 18:27:08', 5.0, 0),
(12, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:27:08', 5.0, 0),
(13, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 18:27:08', 5.0, 0),
(14, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 18:29:19', 5.0, 0),
(15, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:29:19', 5.0, 0),
(16, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 18:29:19', 5.0, 0),
(17, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 18:32:06', 5.0, 0),
(18, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:32:06', 5.0, 0),
(19, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 18:32:06', 5.0, 0),
(20, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 18:39:40', 5.0, 0),
(21, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 18:39:40', 5.0, 0),
(22, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 18:39:40', 5.0, 0),
(23, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 19:06:05', 5.0, 0),
(24, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:06:05', 5.0, 0),
(25, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 19:06:05', 5.0, 0),
(26, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 19:34:16', 5.0, 0),
(27, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:34:16', 5.0, 0),
(28, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 19:34:16', 5.0, 0),
(29, 'I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', '2026-05-10 19:38:40', 5.0, 0),
(30, 'I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', '2026-05-10 19:38:40', 5.0, 0),
(31, 'I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7', '2026-05-10 19:38:40', 5.0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `image` text,
  `bio` text,
  `display_name` varchar(255) DEFAULT NULL,
  `info` text,
  `about` longtext,
  `skills` text,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `competencies` text,
  `experience` text,
  `education` text,
  `projects` text,
  `awards` text,
  `languages` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `image`, `bio`, `display_name`, `info`, `about`, `skills`, `linkedin`, `github`, `twitter`, `competencies`, `experience`, `education`, `projects`, `awards`, `languages`) VALUES
(2, 'Admin', 'admin@azmeer.com', '$2y$10$ywaQFXUW0xG9OozvHBRL6OoCom9yytXnB1yRNvA49haLBlrvecbJC', 'admin', '2026-05-07 01:10:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Client', 'client@azmeer.com', '$2y$10$BZU61r2qgJXbBvNV.FGP5OGd6X.LD4UW/1Z2RchW7nV.DpZibiegy', 'user', '2026-05-07 01:41:32', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(4, 'Freelancer', 'freelancer@azmeer.com', '$2y$10$CqUzEOtGRRFnLEZV3xCFDOu2psyugUfJ98.nzVCAVEmRUSt6K5IcW', 'freelancer', '2026-05-07 02:03:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'owner', 'ownwer@azmeer.com', '$2y$10$Lt0Oyx.cxnoAGjc4Yl3mu.uP2kqbcTLgTJeNjzugZvEVSNUARFo0m', 'owner', '2026-05-07 02:37:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `live_chats`
--
ALTER TABLE `live_chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `live_messages`
--
ALTER TABLE `live_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `top_services`
--
ALTER TABLE `top_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `live_chats`
--
ALTER TABLE `live_chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `live_messages`
--
ALTER TABLE `live_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `top_services`
--
ALTER TABLE `top_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `live_messages`
--
ALTER TABLE `live_messages`
  ADD CONSTRAINT `live_messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `live_chats` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
