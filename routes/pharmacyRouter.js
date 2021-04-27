const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

// dohvati podatke o ljekarni
router.get('/:id', auth([1, 2, 3, 4]), async (req, res) => {
    const id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id ljekarne"
        });
        return;
    }

    try {
        const query = `SELECT sif_ljekarna AS pharmacyId,
                              naziv AS pharmacyName,
                              oib AS OIB,
                              ulica_i_broj AS address,
                              broj_telefona AS phone,
                              naziv_mjesto AS city,
                              postanski_broj AS postalCode
                        FROM ljekarna NATURAL JOIN mjesto
                        WHERE sif_ljekarna = $1`;
        let result = await db.query(query, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška kod selecta"
        });
    }
});

// uredi podatke ljekarne
router.post('/edit/:id', auth([3, 4]), async (req, res) => {
    const schema = Joi.object({
        pharmacyName: Joi.string().min(3).max(100).required(),
        OIB: Joi.string().length(11).required(),
        address: Joi.string().max(100).required(),
        city: Joi.string().required(),
        postalCode: Joi.required(),
        phone: Joi.string().pattern(new RegExp("\\+*[0-9]+\\s*$")).required()
    });

    try {
        await schema.validateAsync(req.body);
    } catch (err) {
        console.log(err)
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    let id = req.params.id;
    let {pharmacyName, address, phone, OIB, city, postalCode} = req.body;
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id"
        });
        return;
    }

    try {
        let role = (await db.query(`SELECT sif_uloga AS role \
            FROM korisnik JOIN korisnik_token USING(sif_korisnik)
            WHERE token = '${token}'`, [])).rows[0].role;
        if (role != 3 && role != 4) {
            res.json({
                error: true,
                message: `Nije vam dozvoljeno mijenjati ljekarnu`
            });
            return
        }

        if (role == 3) {
            let checkPharmacyAdmin = await db.query(`SELECT sif_ljekarna AS id FROM korisnik_token 
            JOIN korisnik USING (sif_korisnik) 
            JOIN zaposlenik_ljekarne USING (sif_korisnik)
            WHERE token = '${token}'`,[]);
            if(checkPharmacyAdmin.rows.length ==0){
                res.json({
                    error: true,
                    message: "Nije vam dozvoljeno mijenjati ljekarnu"
                }); 
                return;
            }
            checkPharmacyAdmin=checkPharmacyAdmin.rows[0].id;
            if (id != checkPharmacyAdmin) {
                res.json({
                    error: true,
                    message: "Nije vam dozvoljeno mijenjati ljekarnu"
                });
                return;
            }
        }
        

        let pharmacyExists = await db.query(`SELECT * FROM ljekarna WHERE sif_ljekarna = $1`, [id]);
        if (pharmacyExists.rows.length == 0) {
            res.json({
                error: true,
                message: `Ne postoji ljekarna koja ima id ${id}.`
            });
            return;
        }

        let checkPharmacy = await db.query(`SELECT * FROM ljekarna WHERE OIB = '${OIB}' AND sif_ljekarna != $1;`, [id]);
        if (checkPharmacy.rows.length != 0) {
            res.json({
                error: true,
                message: `Već postoji ljekarna koja ima OIB ${OIB}`
            });
            return;
        }

        let sifMjestaQuery = await db.query(`SELECT sif_mjesto FROM mjesto WHERE naziv_mjesto = '${city}' AND postanski_broj = '${postalCode}';`, []);
        if (sifMjestaQuery.rows.length == 0) {
            res.json({
                error: true,
                message: "Navedeno mjesto ne postoji."
            });
            return;
        }

        let sifMjesta = sifMjestaQuery.rows[0].sif_mjesto;

        let update = `UPDATE ljekarna 
                      SET   naziv = '${pharmacyName}',
                            OIB = '${OIB}',
                            ulica_i_broj = '${address}',
                            broj_telefona = '${phone}',
                            sif_mjesto = ${sifMjesta}
                      WHERE sif_ljekarna = ${id}`;
        await db.query(update, []);

    } catch (err) {
        console.log(err);
        res.json({
            error: true,
            message: "Greška tijekom spajanja na bazu."
        });
        return;
    }

    res.json({
        error: false,
        message: "Uspješno izmjenjeno"
    })
});

module.exports = router;