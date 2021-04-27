const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

router.get('/create',auth([2,3]), async function(req, res, next) {
    let meds= await db.query("SELECT sif_lijek as id,\
                                    naziv_lijek as name,\
                                    raniji_naziv_lijek as formerName,\
                                    pakiranje as packing,\
                                    slika_url as pictureurl,\
                                    kolicina_djel_tvar as amount,\
                                    mjerna_jedinica as measuringunit,\
                                    oznaka_atk as atk,\
                                    naziv_djel_tvar activeingredient,\
                                    naziv_farm_oblik as pharmaform,\
                                    naziv_proizvodac as manufacturer FROM lijek NATURAL JOIN atk NATURAL JOIN djelotvorna_tvar \
                                                                                 NATURAL JOIN farmaceutski_oblik NATURAL JOIN proizvodac");

    res.json({
        meds: meds.rows
      });
    return;
});

router.post('/create',auth([2,3]), async function(req, res, next) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    let pharmacyId= await db.query(`SELECT sif_ljekarna FROM korisnik_token NATURAL JOIN zaposlenik_ljekarne WHERE token = '${token}'`);
    pharmacyId=pharmacyId.rows[0].sif_ljekarna;
    const schema = Joi.object({
        medId: Joi.number().required(),
        price: Joi.number().required(),
        amount: Joi.number().required(),
        expirationDate: Joi.date().iso().required(),
        discount: Joi.number().required()
    });

    
    let result;
    try {
        result = await schema.validateAsync(req.body);
    }
    catch (err) { 
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    let {medId,price,amount,expirationDate,discount} = req.body;

    try{
        await db.query(`INSERT INTO ponuda (cijena,kolicina,datum_isteka_roka,popust,trenutak_dodavanja,aktivno,sif_lijek,sif_ljekarna)
        VALUES ($1, $2, to_timestamp($3), $4, to_timestamp($5), true, $6, $7)`,[price,amount,new Date(expirationDate)/1000,discount,Date.now()/1000,medId,pharmacyId]);
    }
    catch(err) {
        console.log(err);
        res.json({
            error : true,
            message : "Greška tijekom spajanja na bazu"
        });
        return;
    }
    res.json({
        error: false,
        message : "Uspiješno dodano"
    });
});

module.exports = router;