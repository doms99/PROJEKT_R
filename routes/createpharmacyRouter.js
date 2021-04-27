const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');


router.post('/', async function (req, res, next) {
  const schema = Joi.object({
    pharmacyName: Joi.string().min(3).max(100).required(),
    OIB: Joi.string().length(11).required(),
    address: Joi.string().max(100).required(),
    city: Joi.string().required(),
    postalCode: Joi.required(),
    phone: Joi.string().pattern(new RegExp("\\+*[0-9]+\\s*$")).required()
  });


  let result;
  try {
    result = await schema.validateAsync(req.body);
  } catch (err) {
    console.log(err)
    res.json({
      error: true,
      message: err.details[0].message
    });
    return;
  }

  let {pharmacyName, address, phone, OIB, city, postalCode} = req.body;
  let sifLjekarna;

  try {
    let checkPharmacy = await db.query(`SELECT * FROM ljekarna WHERE OIB = '${OIB}';`, []);
    if (checkPharmacy.rows.length != 0) {
      res.json({
        error: true,
        message: "Već postoji ljekarna sa tim OIB-om."
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

    let insert = `INSERT INTO Ljekarna (naziv,OIB,ulica_i_broj,broj_telefona,sif_mjesto) VALUES ('${pharmacyName}','${OIB}','${address}','${phone}','${sifMjesta}');`;
    await db.query(insert, []);
    let sifLjekarnaQuery = await db.query(`SELECT sif_ljekarna FROM Ljekarna WHERE oib = '${OIB}';`,[]);
    sifLjekarna = sifLjekarnaQuery.rows[0].sif_ljekarna;

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
    message: "Uspjesna registracija!.",
    pharmacyId : sifLjekarna
  })
});

module.exports = router;