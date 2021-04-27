const express = require('express');
const router = express.Router();
const Joi = require('joi')
const db = require('../db');
const crypto = require('crypto');
/*
router.post('/user', async function(req, res, next) {
    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let OIB = req.body.OIB;
    let email = req.body.email;
    let password = req.body.password;
    let address = req.body.address;
    let phone = req.body.phone;

    if(username == null
        || firstName == null
        || lastName == null
        || OIB == null
        || email == null
        || password == null
        || address == null
        || phone == null){
            res.json({
                message: "Error during registration"
            });
        }

    res.json({
        token: "123456",
        message: "All Good"
    });
});*/


router.get('/user', async function(req, res, next) {
    let mjesta= await db.query("SELECT naziv_mjesto as city, postanski_broj as postalNumber FROM mjesto");

    res.json({
        cities: mjesta.rows
      });
    return;
});

router.post('/user', async function(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(100).required(),
        email: Joi.string().pattern(new RegExp("\\s*\\S+@\\S+.\\S+")).required(),
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        password: Joi.string().max(200).required(),
        address: Joi.string().max(100).required(),
        phone: Joi.string().pattern(new RegExp("\\+*[0-9]+\\s*$")).required(),
        OIB: Joi.string().length(11).required(),
        city: Joi.string().required(),
        postalCode: Joi.required()
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

    let { username,email,firstName,lastName,password,address,phone,OIB,city,postalCode } = req.body;
    
    try{
        let checkUser= await db.query("SELECT * FROM korisnik WHERE email = $1;", [email]);
        if(checkUser.rows.length!=0){
            res.json({
                error: true,
                message : "Već postoji račun s navedenom email adresom."
            });
            return;
        }
       let sifMjestaQuery = await db.query("SELECT sif_mjesto FROM mjesto WHERE naziv_mjesto = $1 AND postanski_broj = $2;", [city, postalCode]);

       if(sifMjestaQuery.rows.length == 0){
        res.json({
            error: true,
            message : "Navedeno mjesto ne postoji."
          });
          return;
       }

       let sifMjesta = sifMjestaQuery.rows[0].sif_mjesto;

       let insert = "INSERT INTO osoba (ime,prezime,OIB,ulica_i_broj,broj_telefona,sif_mjesto) VALUES ($1, $2, $3, $4, $5, $6)";
       await db.query(insert, [firstName, lastName, OIB, address, phone, sifMjesta]);

       let sifOsobeQuery = await db.query("SELECT sif_osoba FROM osoba WHERE OIB = $1", [OIB]);
       let sifOsobe = sifOsobeQuery.rows[0].sif_osoba;

       insert = "INSERT INTO korisnik (korisnicko_ime,email,lozinka,trenutak_stvaranja,sif_osoba,sif_uloga) VALUES ($1, $2, $3,to_timestamp($4 / 1000.0), $5, 1)";
       await db.query(insert, [username, email, password, Date.now(), sifOsobe]);
    }
    catch(err){
      console.log(err);
      res.json({
        error: true,
        message : "Greška tijekom spajanja na bazu."
      });
      return;
    }

    let korisnik = (await db.query("SELECT * FROM korisnik WHERE email = $1 AND lozinka = $2", [email, password])).rows;

    let tokenSend = crypto.randomBytes(64).toString('hex');
    await db.query(`INSERT INTO korisnik_token (sif_korisnik, token, trenutak_stvaranja) VALUES ($1, $2, to_timestamp($3))`, [korisnik[0].sif_korisnik, tokenSend, Date.now()  / 1000]);

    res.json({
        token: tokenSend,
        message: "Uspjesna registracija!.",
        userId : korisnik[0].sif_korisnik
    })
});


module.exports=router;