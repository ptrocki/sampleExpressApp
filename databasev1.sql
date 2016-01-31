-- MySQL Script generated by MySQL Workbench
-- 12/30/15 13:43:59
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`egzemplarz`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`egzemplarz` ;

CREATE TABLE IF NOT EXISTS `mydb`.`egzemplarz` (
  `idegzemplarz` INT(11) NOT NULL,
  `wydawnictwo` VARCHAR(25) NULL DEFAULT NULL,
  `rok_wydania` DATE NULL DEFAULT NULL,
  `cena` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`idegzemplarz`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`historia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`historia` ;

CREATE TABLE IF NOT EXISTS `mydb`.`historia` (
  `idhistoria` INT(11) NOT NULL,
  `komentarz` VARCHAR(45) NULL DEFAULT NULL,
  `osoba_idosoba` INT(11) NOT NULL,
  `egzemplarz_idegzemplarz` INT(11) NOT NULL,
  PRIMARY KEY (`idhistoria`),
  INDEX `fk_historia_osoba1_idx` (`osoba_idosoba` ASC),
  INDEX `fk_historia_egzemplarz1_idx` (`egzemplarz_idegzemplarz` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`osoba`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`osoba` ;

CREATE TABLE IF NOT EXISTS `mydb`.`osoba` (
  `idosoba` INT(11) NOT NULL,
  `imie` VARCHAR(15) NULL DEFAULT NULL,
  `nazwisko` VARCHAR(15) NULL DEFAULT NULL,
  `wydzial` INT(2) NULL DEFAULT NULL,
  PRIMARY KEY (`idosoba`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`koszyk`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`koszyk` ;

CREATE TABLE IF NOT EXISTS `mydb`.`koszyk` (
  `idkoszyk` INT(11) NOT NULL,
  `osoba_idosoba` INT(11) NOT NULL,
  `egzemplarz_idegzemplarz` INT(11) NOT NULL,
  PRIMARY KEY (`idkoszyk`),
  INDEX `fk_koszyk_osoba_idx` (`osoba_idosoba` ASC),
  INDEX `fk_koszyk_egzemplarz1_idx` (`egzemplarz_idegzemplarz` ASC),
  CONSTRAINT `fk_koszyk_egzemplarz1`
    FOREIGN KEY (`egzemplarz_idegzemplarz`)
    REFERENCES `mydb`.`egzemplarz` (`idegzemplarz`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_koszyk_osoba`
    FOREIGN KEY (`osoba_idosoba`)
    REFERENCES `mydb`.`osoba` (`idosoba`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`rezerwacja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`rezerwacja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`rezerwacja` (
  `idrezerwacja` INT(11) NOT NULL,
  `poczatek` DATE NULL DEFAULT NULL,
  `koniec` DATE NULL DEFAULT NULL,
  `osoba_idosoba` INT(11) NOT NULL,
  `egzemplarz_idegzemplarz` INT(11) NOT NULL,
  PRIMARY KEY (`idrezerwacja`),
  INDEX `fk_rezerwacja_osoba1_idx` (`osoba_idosoba` ASC),
  INDEX `fk_rezerwacja_egzemplarz1_idx` (`egzemplarz_idegzemplarz` ASC),
  CONSTRAINT `fk_rezerwacja_egzemplarz1`
    FOREIGN KEY (`egzemplarz_idegzemplarz`)
    REFERENCES `mydb`.`egzemplarz` (`idegzemplarz`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rezerwacja_osoba1`
    FOREIGN KEY (`osoba_idosoba`)
    REFERENCES `mydb`.`osoba` (`idosoba`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

USE `mydb`;

DELIMITER $$

USE `mydb`$$
DROP TRIGGER IF EXISTS `mydb`.`wypozyczono_trigger` $$
USE `mydb`$$
CREATE TRIGGER `wypozyczono_trigger` AFTER INSERT ON `rezerwacja` FOR EACH ROW BEGIN
        INSERT INTO `historia`(`idhistoria`, `komentarz`, `osoba_idosoba`, `egzemplarz_idegzemplarz`) VALUES(null, 'Dodano książkę do rezerwacji', new.osoba_idosoba, new.egzemplarz_idegzemplarz);
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
