CREATE TABLE Mjesto
(
  sif_mjesto SERIAL,
  naziv_mjesto VARCHAR(100) NOT NULL,
  postanski_broj VARCHAR(10) NOT NULL,
  PRIMARY KEY (sif_mjesto)
);

CREATE TABLE Osoba
(
  sif_osoba SERIAL,
  ime VARCHAR(100) NOT NULL,
  prezime VARCHAR(100) NOT NULL,
  OIB VARCHAR(11) NOT NULL,
  ulica_i_broj VARCHAR(100) NOT NULL,
  broj_telefona VARCHAR(20) NOT NULL,
  sif_mjesto INT NOT NULL,
  PRIMARY KEY (sif_osoba),
  FOREIGN KEY (sif_mjesto) REFERENCES Mjesto(sif_mjesto)
);

CREATE TABLE Uloga
(
  sif_uloga INT NOT NULL,
  naziv_uloga VARCHAR(100) NOT NULL,
  PRIMARY KEY (sif_uloga)
);

CREATE TABLE ATK
(
  sif_ATK SERIAL,
  oznaka_ATK VARCHAR(5) NOT NULL,
  opis_ATK VARCHAR(100) NOT NULL,
  PRIMARY KEY (sif_ATK)
);

CREATE TABLE Proizvodac
(
  sif_proizvodac SERIAL,
  naziv_proizvodac VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  web_stranica VARCHAR(100),
  PRIMARY KEY (sif_proizvodac)
);

CREATE TABLE Djelotvorna_tvar
(
  sif_djel_tvar SERIAL,
  naziv_djel_tvar VARCHAR(200) NOT NULL,
  PRIMARY KEY (sif_djel_tvar)
);

CREATE TABLE Farmaceutski_oblik
(
  sif_farm_oblik SERIAL,
  naziv_farm_oblik VARCHAR(100) NOT NULL,
  PRIMARY KEY (sif_farm_oblik)
);

CREATE TABLE Ljekarna
(
  sif_ljekarna SERIAL,
  naziv VARCHAR(100) NOT NULL,
  OIB VARCHAR(11) NOT NULL,
  ulica_i_broj VARCHAR(100) NOT NULL,
  broj_telefona VARCHAR(20) NOT NULL,
  sif_mjesto INT NOT NULL,
  PRIMARY KEY (sif_ljekarna),
  FOREIGN KEY (sif_mjesto) REFERENCES Mjesto(sif_mjesto)
);

CREATE TABLE Status_kosarice
(
  sif_status INT NOT NULL,
  naziv_status VARCHAR(100) NOT NULL,
  PRIMARY KEY (sif_status)
);

CREATE TABLE Korisnik
(
  sif_korisnik SERIAL,
  email VARCHAR(100) NOT NULL UNIQUE,
  korisnicko_ime VARCHAR(100) NOT NULL UNIQUE,
  lozinka VARCHAR(200) NOT NULL,
  trenutak_stvaranja TIMESTAMP NOT NULL,
  sif_osoba INT NOT NULL,
  sif_uloga INT NOT NULL,
  PRIMARY KEY (sif_korisnik),
  FOREIGN KEY (sif_osoba) REFERENCES Osoba(sif_osoba),
  FOREIGN KEY (sif_uloga) REFERENCES Uloga(sif_uloga)
);

CREATE TABLE Zaposlenik_ljekarne
(
  sif_zaposlenik SERIAL,
  trenutak_dodavanja TIMESTAMP NOT NULL,
  aktivno boolean NOT NULL,
  sif_korisnik INT NOT NULL,
  sif_ljekarna INT NOT NULL,
  PRIMARY KEY (sif_zaposlenik),
  FOREIGN KEY (sif_korisnik) REFERENCES Korisnik(sif_korisnik),
  FOREIGN KEY (sif_ljekarna) REFERENCES Ljekarna(sif_ljekarna)
);

CREATE TABLE Status_promjene_ponude
(
  sif_status INT NOT NULL,
  naziv_status VARCHAR(50) NOT NULL,
  PRIMARY KEY (sif_status)
);

CREATE TABLE Lijek
(
  sif_lijek SERIAL,
  naziv_lijek VARCHAR(100) NOT NULL,
  raniji_naziv_lijek VARCHAR(100),
  pakiranje VARCHAR(100) NOT NULL,
  slika_URL VARCHAR(300),
  kolicina_djel_tvar INT NOT NULL,
  mjerna_jedinica VARCHAR(100) NOT NULL,
  sif_ATK INT NOT NULL,
  sif_djel_tvar INT NOT NULL,
  sif_farm_oblik INT NOT NULL,
  sif_proizvodac INT NOT NULL,
  PRIMARY KEY (sif_lijek),
  FOREIGN KEY (sif_ATK) REFERENCES ATK(sif_ATK),
  FOREIGN KEY (sif_djel_tvar) REFERENCES Djelotvorna_tvar(sif_djel_tvar),
  FOREIGN KEY (sif_farm_oblik) REFERENCES Farmaceutski_oblik(sif_farm_oblik),
  FOREIGN KEY (sif_proizvodac) REFERENCES Proizvodac(sif_proizvodac)
);

CREATE TABLE Pretplata
(
  obavijest_na_mail boolean NOT NULL,
  trenutak_dodavanja timestamp NOT NULL,
  trenutak_otkazivanja timestamp,
  sif_korisnik INT NOT NULL,
  sif_lijek INT NOT NULL,
  PRIMARY KEY (sif_korisnik, sif_lijek),
  FOREIGN KEY (sif_korisnik) REFERENCES Korisnik(sif_korisnik),
  FOREIGN KEY (sif_lijek) REFERENCES Lijek(sif_lijek)
);

CREATE TABLE Ponuda
(
  sif_ponuda SERIAL,
  cijena NUMERIC(10,2) NOT NULL,
  kolicina INT NOT NULL,
  datum_isteka_roka DATE NOT NULL,
  popust NUMERIC(5,2) NOT NULL,
  trenutak_dodavanja TIMESTAMP NOT NULL,
  aktivno boolean NOT NULL,
  sif_lijek INT NOT NULL,
  sif_ljekarna INT NOT NULL,
  PRIMARY KEY (sif_ponuda),
  FOREIGN KEY (sif_lijek) REFERENCES Lijek(sif_lijek),
  FOREIGN KEY (sif_ljekarna) REFERENCES Ljekarna(sif_ljekarna)
);

CREATE TABLE Kosarica
(
  sif_kosarica SERIAL,
  trenutak_preuzimanja TIMESTAMP,
  trenutak_stvaranja TIMESTAMP NOT NULL,
  sif_korisnik INT NOT NULL,
  PRIMARY KEY (sif_kosarica),
  FOREIGN KEY (sif_korisnik) REFERENCES Korisnik(sif_korisnik)
);

CREATE TABLE Stavka_kosarice
(
  kolicina INT NOT NULL,
  trenutak_dodavanja TIMESTAMP NOT NULL,
  sif_kosarica INT NOT NULL,
  sif_ponuda INT NOT NULL,
  PRIMARY KEY (sif_kosarica, sif_ponuda),
  FOREIGN KEY (sif_kosarica) REFERENCES Kosarica(sif_kosarica),
  FOREIGN KEY (sif_ponuda) REFERENCES Ponuda(sif_ponuda)
);

CREATE TABLE Promjene_statusa_kosarice
(
  trenutak_promjene TIMESTAMP NOT NULL,
  sif_kosarica INT NOT NULL,
  sif_status_prije INT NOT NULL,
  sif_status_nakon INT NOT NULL,
  PRIMARY KEY (trenutak_promjene, sif_kosarica),
  FOREIGN KEY (sif_kosarica) REFERENCES Kosarica(sif_kosarica),
  FOREIGN KEY (sif_status_prije) REFERENCES Status_kosarice(sif_status),
  FOREIGN KEY (sif_status_nakon) REFERENCES Status_kosarice(sif_status)
);

CREATE TABLE Promjene_ponude
(
  trenutak_promjene TIMESTAMP NOT NULL,
  sif_ponuda INT NOT NULL,
  sif_zaposlenik INT NOT NULL,
  sif_status INT NOT NULL,
  PRIMARY KEY (trenutak_promjene, sif_ponuda),
  FOREIGN KEY (sif_ponuda) REFERENCES Ponuda(sif_ponuda),
  FOREIGN KEY (sif_zaposlenik) REFERENCES Zaposlenik_ljekarne(sif_zaposlenik),
  FOREIGN KEY (sif_status) REFERENCES Status_promjene_ponude(sif_status)
);

CREATE TABLE korisnik_token
(
  sif_korisnik INT NOT NULL,
  token VARCHAR(200) NOT NULL,
  trenutak_stvaranja TIMESTAMP,
  PRIMARY KEY (sif_korisnik),
  FOREIGN KEY (sif_korisnik) REFERENCES Korisnik(sif_korisnik)
);

CREATE TABLE Status_racun(
  sif_status INT NOT NULL,
  naziv_status VARCHAR(30),
  PRIMARY KEY (sif_status)
);

CREATE TABLE racun (
  sif_kosarica INT NOT NULL,
  sif_ljekarna INT NOT NULL,
  kod_racun VARCHAR(30) NOT NULL,
  sif_status INT NOT NULL,
  trenutak_stvaranja TIMESTAMP NOT NULL,
  PRIMARY KEY (sif_kosarica,sif_ljekarna),
  FOREIGN KEY (sif_kosarica) REFERENCES Kosarica(sif_kosarica),
  FOREIGN KEY (sif_ljekarna) REFERENCES Ljekarna(sif_ljekarna),
  FOREIGN KEY (sif_status) REFERENCES Status_racun(sif_status)
);

