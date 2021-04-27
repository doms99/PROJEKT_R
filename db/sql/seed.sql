/* ATK */
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('A', 'Lijekovi s djelovanjem na probavni sustav i mijenu tvari');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('B', 'Lijekovi s djelovanjem na krv i krvotvorne organe');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('C', 'Lijekovi s djelovanjem na srce i krvožilje');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('D', 'Lijekovi s djelovanjem na kožu');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('G', 'Lijekovi s djelovanjem na mokraćni sustav i spolni hormoni');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('H', 'Lijekovi s djelovanjem na sustav žlijezda s unutarnjim lučenjem (izuzev spolnih hormona)');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('J', 'Lijekovi za liječenje sustavnih infekcija (izuzuev infekcija uzrukovanih parazitima)');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('L', 'Lijekovi za liječenje zloćudnih bolesti i imunomodulatori');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('M', 'Lijekovi s djelovanjem na koštano-mišićni sustav');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('N', 'Lijekovi s djelovanjem na živčani sustav');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('P', 'Lijekovi za liječenje infekcija uzrokovanih parazitima');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('R', 'Lijekovi s djelovanjem na sustav dišnih organa');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('S', 'Lijekovi s djelovanjem na osjetila');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('U', 'DERMATICI');
INSERT INTO atk (oznaka_atk, opis_atk) VALUES('V', 'Različito');

/* Uloge */
INSERT INTO uloga VALUES(1, 'korisnik');
INSERT INTO uloga VALUES(2, 'zaposlenik');
INSERT INTO uloga VALUES(3, 'admin_ljekarne');
INSERT INTO uloga VALUES(4, 'admin');

/* Statusi kosarice */
INSERT INTO status_kosarice VALUES(1, 'stvorena');
INSERT INTO status_kosarice VALUES(2, 'dodana stavka');
INSERT INTO status_kosarice VALUES(3, 'uklonjena stavka');
INSERT INTO status_kosarice VALUES(4, 'narucena');
INSERT INTO status_kosarice VALUES(5, 'preuzeta');
INSERT INTO status_kosarice VALUES(6, 'istekla');

/* Statusi promjene ponude */
INSERT INTO status_promjene_ponude VALUES (1, 'stvorena');
INSERT INTO status_promjene_ponude VALUES (2, 'promijenjena');
INSERT INTO status_promjene_ponude VALUES (3, 'obrisana');

/* Farmaceutski oblik */
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('tableta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('filmom obložena tableta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('obložena tableta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('raspadljiva tableta za usta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('tableta za žvakanje');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('šumeća tableta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('šumeće granule');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('sirup');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('čaj');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('otopina');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('mješavina');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('emulzija');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('pasta');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('puder');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('čepić');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('vaginalete');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('kapi za oči');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('injekcija');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('infuzija');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('ljekovita mast');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('oralne kapi');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('oralna otopina');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('oralna suspenzija');
INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES('kapsula');

/* Proizvodaci */
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('Pliva', 'info@pliva.hr', 'https://www.pliva.hr/');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('Belupo', 'belupo@belupo.hr', 'https://www.belupo.hr/hr/');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('JGL', 'jgl@jgl.hr', 'https://www.jgl.hr/');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('PharmaS', 'info@pharmas.hr', 'http://www.pharmas-group.com');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('Krka-farma', 'info.hr@krka.biz', 'https://www.krka.biz/hr/');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('Johnson & Johnson', 'media-relations@its.jnj.com', 'https://www.jnj.com/');
INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ('Pfizer', 'info@pfizer.com', 'https://www.pfizer.com/');

/* Lijekovi*/
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Peptoran', NULL, 'kutija', 'https://www.grude.com/thumb.ashx?i=19-11-12-peptoran-150mg.png.jpg&f=/Datoteke/Novosti/&w=660&h=370', 150, 'mg', 1, 4, 2, 1);
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Ranix', NULL, 'kutija', 'https://uploads.jgl.hr/uploads/2017/08/RANIX-150-1.png', 150, 'mg', 1, 4, 2, 3);
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Ortalox', NULL, 'kutija', 'https://uploads.jgl.hr/uploads/2017/08/ortalox-28x20.jpg', 20, 'mg', 1, 6, 24, 3);
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Fromilid', NULL, 'kutija', 'http://undoctorenlinea.com/dbimageb3ca.jpg?id=324676', 250, 'mg', 7, 1187, 2, 1);
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Azimed', NULL, 'kutija', 'https://lh3.googleusercontent.com/proxy/fHLoNF06um0wHglxABYP1y1RYSY31KW_RyA-LCVbNTk-G0iHbY4kx7raV5mI1c1uQL1ijbTpFcqUtesLw3h0fUCsdZHXoWnwRnMTFuu-HKSR2D6LYK3yO43-OLm3o8VLZSBbc1Aa4vBOxM4A1CJTrYLo3v-YboTyQuGa8fNZ1A58hcX6Fe9CFUPTTwRg', 500, 'mg', 7, 1188, 2, 1);
INSERT INTO lijek (naziv_lijek, raniji_naziv_lijek, pakiranje, slika_url, kolicina_djel_tvar, mjerna_jedinica, sif_atk, sif_djel_tvar, sif_farm_oblik, sif_proizvodac) VALUES ('Azibiot', NULL, 'kutija', 'https://www.aversi.ge/image.php?path=uploads/matimg/3c17fe08746e9fdefe7c0cd2d26def91.png&width=469&height=', 500, 'mg', 7, 1187, 2, 5);

/*Status racuna */
INSERT INTO Status_racun VALUES(1, 'aktivan');
INSERT INTO Status_racun VALUES(2, 'preuzet');
INSERT INTO Status_racun VALUES(3, 'istekao');