-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2016 at 09:06 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `egzemplarz`
--

CREATE TABLE `egzemplarz` (
  `idegzemplarz` int(11) NOT NULL,
  `autor` varchar(45) NOT NULL,
  `tytul` varchar(45) NOT NULL,
  `wydawnictwo` varchar(25) DEFAULT NULL,
  `rok_wydania` int(4) DEFAULT NULL,
  `cena` float DEFAULT NULL,
  `format` varchar(45) DEFAULT NULL,
  `ilosc` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `egzemplarz`
--

INSERT INTO `egzemplarz` (`idegzemplarz`, `autor`, `tytul`, `wydawnictwo`, `rok_wydania`, `cena`, `format`, `ilosc`) VALUES
(2, 'John Bunyan', 'Pilgrim Progress', 'Stara Gwardia', 1990, 5.99, NULL, 5),
(3, 'Alice Murinio', 'Uciekinierka', 'Biblioteka Akustyczna', 2014, 31.67, 'mp3', 3),
(4, 'Michelle Maria Surat', 'Dragon Child', 'Picture Books', 2011, 21, NULL, 2),
(5, 'Miguel De Cervantes', 'Don Quixote ', 'Stara Gwardia', 1994, 10.99, NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `historia`
--

CREATE TABLE `historia` (
  `idhistoria` int(11) NOT NULL,
  `komentarz` varchar(45) DEFAULT NULL,
  `osoba_idosoba` int(11) NOT NULL,
  `egzemplarz_idegzemplarz` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `koszyk`
--

CREATE TABLE `koszyk` (
  `idkoszyk` int(11) NOT NULL,
  `osoba_idosoba` int(11) NOT NULL,
  `egzemplarz_idegzemplarz` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `koszyk`
--

INSERT INTO `koszyk` (`idkoszyk`, `osoba_idosoba`, `egzemplarz_idegzemplarz`) VALUES
(1, 10, 2),
(2, 11, 2);

-- --------------------------------------------------------

--
-- Table structure for table `osoba`
--

CREATE TABLE `osoba` (
  `idosoba` int(11) NOT NULL,
  `imie` varchar(15) DEFAULT NULL,
  `nazwisko` varchar(15) DEFAULT NULL,
  `wydzial` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `osoba`
--

INSERT INTO `osoba` (`idosoba`, `imie`, `nazwisko`, `wydzial`) VALUES
(0, 'Anna', 'Pracownik', 0),
(10, 'Marcin', 'Szyja', 2),
(11, 'Agnieszka', 'Warchoł', 1),
(12, 'Mendy', 'Waren', 1),
(13, 'Mamed', 'Khalidov', 2),
(14, 'Andrzej', 'Łaskawski', 5),
(15, 'Marcin', 'Wieczyk', 1),
(16, 'Kostanty', 'Kwasek', 4),
(17, 'Edward', 'Orkiesz', 2),
(20, 'Amanda', 'Wazon', 1),
(21, 'Marcin', 'Wieczko', 1),
(22, 'Piotr', 'Adamek', 3),
(24, 'Michał', 'Kucharski', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rezerwacja`
--

CREATE TABLE `rezerwacja` (
  `idrezerwacja` int(11) NOT NULL,
  `poczatek` date DEFAULT NULL,
  `koniec` date DEFAULT NULL,
  `osoba_idosoba` int(11) NOT NULL,
  `egzemplarz_idegzemplarz` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `rezerwacja`
--
DELIMITER $$
CREATE TRIGGER `wypozyczono_trigger` AFTER INSERT ON `rezerwacja` FOR EACH ROW BEGIN
        INSERT INTO `historia`(`idhistoria`, `komentarz`, `osoba_idosoba`, `egzemplarz_idegzemplarz`) VALUES(null, 'Dodano książkę do rezerwacji', new.osoba_idosoba, new.egzemplarz_idegzemplarz);
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `egzemplarz`
--
ALTER TABLE `egzemplarz`
  ADD PRIMARY KEY (`idegzemplarz`);

--
-- Indexes for table `historia`
--
ALTER TABLE `historia`
  ADD PRIMARY KEY (`idhistoria`),
  ADD KEY `fk_historia_osoba1_idx` (`osoba_idosoba`),
  ADD KEY `fk_historia_egzemplarz1_idx` (`egzemplarz_idegzemplarz`);

--
-- Indexes for table `koszyk`
--
ALTER TABLE `koszyk`
  ADD PRIMARY KEY (`idkoszyk`),
  ADD KEY `fk_koszyk_osoba_idx` (`osoba_idosoba`),
  ADD KEY `fk_koszyk_egzemplarz1_idx` (`egzemplarz_idegzemplarz`);

--
-- Indexes for table `osoba`
--
ALTER TABLE `osoba`
  ADD PRIMARY KEY (`idosoba`);

--
-- Indexes for table `rezerwacja`
--
ALTER TABLE `rezerwacja`
  ADD PRIMARY KEY (`idrezerwacja`),
  ADD KEY `fk_rezerwacja_osoba1_idx` (`osoba_idosoba`),
  ADD KEY `fk_rezerwacja_egzemplarz1_idx` (`egzemplarz_idegzemplarz`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `egzemplarz`
--
ALTER TABLE `egzemplarz`
  MODIFY `idegzemplarz` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `historia`
--
ALTER TABLE `historia`
  MODIFY `idhistoria` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `koszyk`
--
ALTER TABLE `koszyk`
  MODIFY `idkoszyk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `osoba`
--
ALTER TABLE `osoba`
  MODIFY `idosoba` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `rezerwacja`
--
ALTER TABLE `rezerwacja`
  MODIFY `idrezerwacja` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `koszyk`
--
ALTER TABLE `koszyk`
  ADD CONSTRAINT `fk_koszyk_egzemplarz1` FOREIGN KEY (`egzemplarz_idegzemplarz`) REFERENCES `egzemplarz` (`idegzemplarz`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_koszyk_osoba` FOREIGN KEY (`osoba_idosoba`) REFERENCES `osoba` (`idosoba`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rezerwacja`
--
ALTER TABLE `rezerwacja`
  ADD CONSTRAINT `fk_rezerwacja_egzemplarz1` FOREIGN KEY (`egzemplarz_idegzemplarz`) REFERENCES `egzemplarz` (`idegzemplarz`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rezerwacja_osoba1` FOREIGN KEY (`osoba_idosoba`) REFERENCES `osoba` (`idosoba`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
