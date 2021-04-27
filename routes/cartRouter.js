const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');
const createPdf = require('../components/receiptFunction');
const crypto = require('crypto');

router.post('/', auth([1, 2, 3, 4]), async function (req, res) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    let userId = await db.query(`SELECT sif_korisnik FROM korisnik_token WHERE token = '${token}'`);
    userId = userId.rows[0].sif_korisnik;

    let { offers } = req.body;

    try{
        for(let i = 0 ; i < offers.length ; i++){
            let offer_id = offers[i].offer_id;
            let amount = offers[i].amount;
            let stanje = await db.query('SELECT kolicina FROM ponuda WHERE sif_ponuda = $1 AND aktivno = true',[offer_id]); 
            stanje=stanje.rows[0].kolicina;
            if(amount > stanje){
                res.json({
                    error : true,
                    message : "Na stanju nema dovoljna količina lijeka " + offer_id 
                });
                return;
            }
        }
        
        let cartId=await db.query(`SELECT sif_kosarica FROM promjene_statusa_kosarice NATURAL JOIN kosarica WHERE sif_korisnik = $1 AND
        sif_status_nakon IN (1,2,3) AND trenutak_promjene = (SELECT MAX(trenutak_promjene) from promjene_statusa_kosarice promjene2 WHERE promjene2.sif_kosarica=promjene_statusa_kosarice.sif_kosarica)`,[userId]);
        console.log(cartId.rows);
        if (cartId.rows == null || cartId.rows.length == 0) {
            console.log("Kosarica ne postoji");
            let creation = Date.now() / 1000;
            await db.query(`INSERT into kosarica (trenutak_stvaranja,sif_korisnik) VALUES (to_timestamp($1),$2)`, [creation, userId]);
            let cart = await db.query(`SELECT sif_kosarica from kosarica WHERE trenutak_stvaranja = to_timestamp($1) AND sif_korisnik=$2`, [creation, userId]);
            console.log(cart.rows);
            cartId = cart.rows[0].sif_kosarica;
            await db.query(`INSERT INTO promjene_statusa_kosarice VALUES (to_timestamp($1),$2,1,1)`, [creation, cartId]);
        } else {
            cartId = cartId.rows[0].sif_kosarica;
            console.log(cartId)
        }
        for (let i = 0; i < offers.length; i++) {
            let offer_id = offers[i].offer_id;
            let amount = offers[i].amount;
            let stanje = await db.query('SELECT kolicina FROM ponuda WHERE sif_ponuda = $1 AND aktivno = true', [offer_id]);
            stanje = stanje.rows[0].kolicina;
            if (amount > stanje) {
                res.json({
                    error: true,
                    message: "Na stanju nema dovoljna količina lijeka " + offer_id
                });
                return;
            }
        }
        for (let i = 0; i < offers.length; i++) {
            let offer_id = offers[i].offer_id;
            let amount = offers[i].amount;

            let stanjeKosarica = await db.query(`SELECT kolicina FROM stavka_kosarice WHERE sif_kosarica = $1 AND sif_ponuda=$2`, [cartId, offer_id]);
            if (stanjeKosarica.rows == null || stanjeKosarica.rows.length == 0) {
                await db.query(`INSERT INTO stavka_kosarice VALUES($1,to_timestamp($2),$3,$4)`, [amount, Date.now() / 1000, cartId, offer_id]);
            } else {
                await db.query(`UPDATE stavka_kosarice SET kolicina = kolicina + $1 WHERE sif_kosarica = $2`, [amount, cartId]);
            }
            let lastStatus = await db.query(`SELECT sif_status_nakon FROM promjene_statusa_kosarice WHERE sif_kosarica = $1 AND sif_status_nakon IN (1,2,3) ORDER BY trenutak_promjene DESC`, [cartId]);
            lastStatus = lastStatus.rows[0].sif_status_nakon;
            await db.query(`UPDATE ponuda SET kolicina = kolicina - $1 WHERE sif_ponuda = $2`, [amount, offer_id]);
            await db.query(`INSERT INTO promjene_statusa_kosarice VALUES (to_timestamp($1),$2,$3,2)`, [Date.now() / 1000, cartId, lastStatus]);
        }
        res.json({
            error: false,
            message: "Uspješno dodano"
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            error: true,
            message: "Greška tijekom spajanja na bazu"
        });
        return;
    }
});

router.get('/racuni/:kod', async function (req, res) {
    let kod = req.params.kod;
    console.log("Trazenje koda : " + kod);

    let racunPodaci = (await db.query(`SELECT * FROM racun WHERE kod_racun = $1`, [kod])).rows[0];
    let cartId = racunPodaci.sif_kosarica;
    let ljekarnaId = racunPodaci.sif_ljekarna;

    let lijekoviObj = (await db.query(`SELECT naziv_lijek, stavka_kosarice.kolicina, ROUND((cijena - (cijena * (popust / 100))), 3) as cijena
            FROM stavka_kosarice
            JOIN ponuda ON stavka_kosarice.sif_ponuda = ponuda.sif_ponuda 
            JOIN lijek ON lijek.sif_lijek = ponuda.sif_lijek
            WHERE sif_ljekarna = $1 AND sif_kosarica = $2;`, [ljekarnaId, cartId])).rows;

    let lijekovi = [];
    for (let i = 0; i < lijekoviObj.length; i++) {
        let temp = [];
        temp.push(lijekoviObj[i].naziv_lijek);
        temp.push(lijekoviObj[i].kolicina);
        temp.push(lijekoviObj[i].cijena);

        lijekovi.push(temp);
    }

    let ljekarnaNaziv = (await db.query(`SELECT naziv FROM ljekarna WHERE sif_ljekarna = $1`, [ljekarnaId])).rows;
    ljekarnaNaziv = ljekarnaNaziv[0].naziv;

    let ukCijena = 0;
    for (let i = 0; i < lijekovi.length; i++) {
        ukCijena += lijekovi[i][1] * lijekovi[i][2];
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=racunELijekovi'+ ljekarnaNaziv  + new Date().toISOString().replace('T', '')+ '.pdf');
    createPdf(lijekovi, ljekarnaNaziv, kod, ukCijena, res);
})

router.get('/buy', auth([1, 2, 3, 4]), async function (req, res) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    let userId = await db.query(`SELECT sif_korisnik FROM korisnik_token WHERE token = '${token}'`);
    userId = userId.rows[0].sif_korisnik;

    try {
        let cartId = await db.query(`SELECT sif_kosarica FROM promjene_statusa_kosarice NATURAL JOIN kosarica WHERE sif_korisnik = $1
         AND sif_status_nakon IN (1,2,3) AND trenutak_promjene = (SELECT MAX(trenutak_promjene) from promjene_statusa_kosarice promjene2 WHERE promjene2.sif_kosarica=promjene_statusa_kosarice.sif_kosarica)`, [userId]);
        if (cartId.rows == null) {
            res.json({
                error: true,
                message: "Košarica ne postoji"
            })
            return;
        } else {
            cartId = cartId.rows[0].sif_kosarica;
            console.log(cartId)
        }
        let lastStatus = await db.query(`SELECT sif_status_nakon FROM promjene_statusa_kosarice WHERE sif_kosarica = $1 AND sif_status_nakon IN (1,2,3) AND trenutak_promjene = (SELECT MAX(trenutak_promjene) from promjene_statusa_kosarice promjene2 WHERE promjene2.sif_kosarica=promjene_statusa_kosarice.sif_kosarica)`, [cartId]);
        lastStatus = lastStatus.rows[0].sif_status_nakon;
        await db.query(`INSERT INTO promjene_statusa_kosarice VALUES (to_timestamp($1),$2,$3,4)`, [Date.now() / 1000, cartId, lastStatus])

        let ljekarne = (await db.query(`SELECT DISTINCT sif_ljekarna 
        FROM stavka_kosarice
        JOIN ponuda ON stavka_kosarice.sif_ponuda = ponuda.sif_ponuda
        WHERE sif_kosarica = $1;`, [cartId])).rows

        let kodovi = [];

        for (let i = 0; i < ljekarne.length; i++) {
            let kod = crypto.randomBytes(15).toString('hex');
            kodovi.push(kod);

            //spremanje podataka o racunu u bazu
            await db.query(`INSERT INTO racun VALUES($1, $2, $3, $4, to_timestamp($5))`, [cartId, ljekarne[i].sif_ljekarna, kod, 1, Date.now() / 1000]);
        }

        res.json({
            error: false,
            message: "Uspješno naručeno",
            orderId: cartId,
            receiptCode: kodovi
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            error: true,
            message: "Greška tijekom spajanja na bazu"
        });
        return;
    }

});

router.get('/active', auth([1, 2, 3, 4]), async function (req, res) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    let userId = await db.query(`SELECT sif_korisnik FROM korisnik_token WHERE token = '${token}'`);
    userId = userId.rows[0].sif_korisnik;
    try {
        let cartId = await db.query(`SELECT DISTINCT sif_kosarica FROM promjene_statusa_kosarice NATURAL JOIN kosarica WHERE sif_korisnik = $1 AND sif_status_nakon = 4 AND 
        trenutak_promjene = (SELECT MAX(trenutak_promjene) from promjene_statusa_kosarice promjene2 WHERE promjene2.sif_kosarica=promjene_statusa_kosarice.sif_kosarica)`, [userId]);
        console.log(cartId.rows);
        let reservations = [];
        for (let i = 0; i < cartId.rows.length; i++) {
            let orderNumber = cartId.rows[i].sif_kosarica;
            console.log("kosarica  " + orderNumber);
            let kodovi = await db.query(`
                select kod_racun as code, naziv as pharmacyname 
                from racun
                natural join ljekarna
                where sif_kosarica = ${orderNumber};
            `);
            kodovi = kodovi.rows;
            let items = await db.query(`SELECT stavka_kosarice.kolicina as amount, ponuda.cijena as price,ponuda.datum_isteka_roka as expirationDate,
            ponuda.popust as discount,lijek.naziv_lijek as medname, lijek.pakiranje as packaging, lijek.kolicina_djel_tvar as activeSubstanceAmount, lijek.mjerna_jedinica as activeSubstanceUnit,
            djelotvorna_tvar.naziv_djel_tvar as activeSubstance, proizvodac.naziv_proizvodac as manufacturer,ljekarna.naziv as pharmacyName,
            ljekarna.ulica_i_broj as adress,ljekarna.broj_telefona as phone, mjesto.naziv_mjesto as city, mjesto.postanski_broj as postalCode, lijek.slika_url as pictureurl
            from stavka_kosarice JOIN ponuda ON stavka_kosarice.sif_ponuda=ponuda.sif_ponuda 
            JOIN lijek ON lijek.sif_lijek=ponuda.sif_lijek JOIN proizvodac ON lijek.sif_proizvodac=proizvodac.sif_proizvodac JOIN farmaceutski_oblik ON lijek.sif_farm_oblik = farmaceutski_oblik.sif_farm_oblik 
            JOIN djelotvorna_tvar ON djelotvorna_tvar.sif_djel_tvar=lijek.sif_djel_tvar JOIN ljekarna ON ponuda.sif_ljekarna=ljekarna.sif_ljekarna JOIN mjesto ON ljekarna.sif_mjesto=mjesto.sif_mjesto WHERE stavka_kosarice.sif_kosarica = $1`, [orderNumber]);
            
            console.log(kodovi)
            
            let order = { orderId: orderNumber, items: items.rows, codes: kodovi }
            reservations.push(order);
        }
         
        



        res.json({
            error: false,
            reservations: reservations,

        });
    }
    catch (err) {
        console.log(err);
        res.json({
            error: true,
            message: "Greška tijekom spajanja na bazu"
        });
        return;
    }
});

router.get('/history', auth([1, 2, 3, 4]), async function (req, res) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    let userId = await db.query(`SELECT sif_korisnik FROM korisnik_token WHERE token = '${token}'`);
    userId = userId.rows[0].sif_korisnik;
    try {
        let cartId = await db.query(`SELECT DISTINCT sif_kosarica FROM promjene_statusa_kosarice NATURAL JOIN kosarica WHERE sif_korisnik = $1 AND sif_status_nakon = 5 AND 
        trenutak_promjene = (SELECT MAX(trenutak_promjene) from promjene_statusa_kosarice promjene2 WHERE promjene2.sif_kosarica=promjene_statusa_kosarice.sif_kosarica)`, [userId]);
        console.log(cartId.rows);
        let reservations = [];
        for (let i = 0; i < cartId.rows.length; i++) {
            let orderNumber = cartId.rows[i].sif_kosarica;
            console.log("kosarica  " + orderNumber);
            let items = await db.query(`SELECT stavka_kosarice.kolicina as amount, ponuda.cijena as price,ponuda.datum_isteka_roka as expirationDate,
            ponuda.popust as discount,lijek.naziv_lijek as medname, lijek.pakiranje as packaging, lijek.kolicina_djel_tvar as activeSubstanceAmount, lijek.mjerna_jedinica as activeSubstanceUnit,
            djelotvorna_tvar.naziv_djel_tvar as activeSubstance, proizvodac.naziv_proizvodac as manufacturer,ljekarna.naziv as pharmacyName,
            ljekarna.ulica_i_broj as adress,ljekarna.broj_telefona as phone, mjesto.naziv_mjesto as city, mjesto.postanski_broj as postalCode,lijek.slika_url as pictureurl 
            from stavka_kosarice JOIN ponuda ON stavka_kosarice.sif_ponuda=ponuda.sif_ponuda 
            JOIN lijek ON lijek.sif_lijek=ponuda.sif_lijek JOIN proizvodac ON lijek.sif_proizvodac=proizvodac.sif_proizvodac JOIN farmaceutski_oblik ON lijek.sif_farm_oblik = farmaceutski_oblik.sif_farm_oblik 
            JOIN djelotvorna_tvar ON djelotvorna_tvar.sif_djel_tvar=lijek.sif_djel_tvar JOIN ljekarna ON ponuda.sif_ljekarna=ljekarna.sif_ljekarna JOIN mjesto ON ljekarna.sif_mjesto=mjesto.sif_mjesto WHERE stavka_kosarice.sif_kosarica = $1`, [orderNumber]);
            let order = { orderId: orderNumber, items: items.rows }
            reservations.push(order);
        }
        res.json({
            error: false,
            orders: reservations
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            error: true,
            message: "Greška tijekom spajanja na bazu"
        });
        return;
    }
});

module.exports = router;