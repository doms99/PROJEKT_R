const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

router.get('/admin', auth([4]), async function (req, res, next) {

  let pharmacies = await db.query(`SELECT sif_ljekarna as pharmacyId, naziv as pharmacyName FROM ljekarna`, []);
  let users = await db.query(`SELECT email ,ime as firstName, prezime as lastName, oib, sif_korisnik as userId FROM korisnik natural join osoba`, []);

  res.json({
    pharmacies: pharmacies.rows,
    users: users.rows
  })
});

router.post('/admin', auth([4]), async function (req, res, next) {
  const schema = Joi.object({
    pharmacyId: Joi.number().required(),
    userId: Joi.number().required(),
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

  let {
    pharmacyId,
    userId
  } = req.body;

  try {

    let insert = `INSERT INTO zaposlenik_ljekarne (trenutak_dodavanja,aktivno,sif_korisnik,sif_ljekarna) VALUES (to_timestamp(${Date.now()} / 1000),true,${userId},${pharmacyId});`;
    await db.query(insert, []);
    let update = `UPDATE korisnik SET sif_uloga = 3 WHERE sif_korisnik = ${userId};`
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
    message: "Uspjesno dodavanje admina ljekarne!."
  })
});


router.get('/worker', auth([3]), async function (req, res, next) {

  let users = await db.query(`SELECT email ,ime as firstName, prezime as lastName, oib, sif_korisnik as userId FROM korisnik natural join osoba WHERE sif_uloga=1`, []);

  res.json({
    users: users.rows
  })
});

router.post('/worker', auth([3]), async function (req, res, next) {
  const schema = Joi.object({
    userId: Joi.number().required(),
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

  let {
    userId
  } = req.body;
  let header = req.headers['authorization'];
  let token = header && header.split(' ')[1];

  try {
    let pharmacyId = (await db.query(`SELECT sif_ljekarna FROM korisnik_token JOIN zaposlenik_ljekarne ON zaposlenik_ljekarne.sif_korisnik = korisnik_token.sif_korisnik WHERE token = $1`, [token])).rows;
    pharmacyId = pharmacyId[0].sif_ljekarna;
    //console.log(pharmacyId);

    let insert = `INSERT INTO zaposlenik_ljekarne (trenutak_dodavanja,aktivno,sif_korisnik,sif_ljekarna) VALUES (to_timestamp(${Date.now()} / 1000),true,${userId},${pharmacyId});`;
    await db.query(insert, []);
    let update = `UPDATE korisnik SET sif_uloga = 2 WHERE sif_korisnik = ${userId};`
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
    message: "Uspjesno dodavanje admina ljekarne!."
  })
});

router.get('/employees', auth([3]), async function (req, res, next) {


  let header = req.headers['authorization'];
  let token = header && header.split(' ')[1];
  let employees;
  try {
    let pharmacyId = (await db.query(`SELECT sif_ljekarna FROM korisnik_token JOIN zaposlenik_ljekarne ON zaposlenik_ljekarne.sif_korisnik = korisnik_token.sif_korisnik WHERE token = $1`, [token])).rows;
    pharmacyId = pharmacyId[0].sif_ljekarna;
    //console.log(pharmacyId);
    employees = await db.query(`SELECT email ,ime as firstName, prezime as lastName, oib, sif_korisnik as userId FROM korisnik natural join osoba natural join zaposlenik_ljekarne 
    WHERE sif_uloga=2 AND zaposlenik_ljekarne.aktivno=true AND sif_ljekarna = $1`, [pharmacyId]);

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
    employees: employees.rows
  })
});

router.get('/pharmacyId', auth([2, 3]), async function (req, res, next) {


  let header = req.headers['authorization'];
  let token = header && header.split(' ')[1];
  let pharmacyId;
  try {
    pharmacyId = (await db.query(`SELECT sif_ljekarna FROM korisnik_token JOIN zaposlenik_ljekarne ON zaposlenik_ljekarne.sif_korisnik = korisnik_token.sif_korisnik WHERE token = $1`, [token])).rows;
    pharmacyId = pharmacyId[0].sif_ljekarna;

  } catch (err) {
    console.log(err);
    res.json({
      error: true,
      message: "Greška tijekom spajanja na bazu. pahrmid"
    });
    return;
  }

  res.json({
    error: false,
    pharmacyId: pharmacyId
  })
});


module.exports = router;