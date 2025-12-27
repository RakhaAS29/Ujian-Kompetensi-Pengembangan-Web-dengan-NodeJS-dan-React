CREATE DATABASE db_simulasi;
USE db_simulasi;

CREATE TABLE siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_siswa VARCHAR(255) NOT NULL UNIQUE,
  nama VARCHAR(255),
  alamat VARCHAR(255),
  jurusan VARCHAR(255),
  tgl_lahir datetime
);

ALTER TABLE siswa MODIFY kode_siswa VARCHAR(10);

DROP TRIGGER IF EXISTS tg_kode_siswa;

DELIMITER $$

CREATE TRIGGER tg_kode_siswa
BEFORE INSERT ON siswa
FOR EACH ROW
BEGIN  
    DECLARE random_code INT;
    DECLARE code_exists INT DEFAULT 1;

    -- Loop sampai menemukan angka yang belum dipakai
    WHILE code_exists = 1 DO
        SET random_code = FLOOR(1000000 + RAND() * 9000000);  -- 7 digit

        SELECT COUNT(*)
        INTO code_exists
        FROM siswa
        WHERE kode_siswa = random_code;
    END WHILE;

    SET NEW.kode_siswa = random_code;
END $$

DELIMITER ;

================================================================

CREATE DATABASE db_simulasi;
USE db_simulasi;

CREATE TABLE siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_siswa VARCHAR(255) NOT NULL UNIQUE,
  nama VARCHAR(255),
  alamat VARCHAR(255),
  jenis_kelamin VARCHAR(255),
  umur INT
);

ALTER TABLE siswa MODIFY kode_siswa VARCHAR(10);

DROP TRIGGER IF EXISTS tg_kode_siswa;

DELIMITER $$

CREATE TRIGGER tg_kode_siswa
BEFORE INSERT ON siswa
FOR EACH ROW
BEGIN  
    DECLARE random_code INT;
    DECLARE code_exists INT DEFAULT 1;

    -- Loop sampai menemukan angka yang belum dipakai
    WHILE code_exists = 1 DO
        SET random_code = FLOOR(1000000 + RAND() * 9000000);  -- 7 digit

        SELECT COUNT(*)
        INTO code_exists
        FROM siswa
        WHERE kode_siswa = random_code;
    END WHILE;

    SET NEW.kode_siswa = random_code;
END $$

DELIMITER ;