var express = require('express');
var router = express.Router();
const db = require('../db');
const crypto = require('crypto');

/*router.post('/', async function(req, res, next) {
    let email = req.body.email 
    let password = req.body.password;

    if(email == null || password == null){
        res.json({
            message: "error durign signup"
        });
    }

    res.json({
        email,
        token: '123456'
    });
});*/

router.post('/', async function(req, res, next) {

    let email  = req.body.email;
    let password = req.body.password;
    let korisnik;
    //console.log(email + " : " + password);
    if(email == null || password == null){
        res.json({
            error: true,
            message: "Email i lozinka ne smiju biti prazni."
        });
    }
     
    else {
        try{
            korisnik = (await db.query(`SELECT * FROM korisnik NATURAL JOIN uloga NATURAL JOIN osoba WHERE email = $1 AND lozinka = $2`, [email, password])).rows;

            if(korisnik.length==0){
                res.json({
                    error: true,
                    no_such_user : true,
                    message : "Pogrešan email ili lozinka."
                });
                return;
            }else{ 

                //stvaranje tokena za korisnika
                let addedToken = (await db.query(`SELECT * FROM korisnik_token WHERE sif_korisnik = $1`, [korisnik[0].sif_korisnik])).rows

                if(addedToken.length > 0) {
                    await db.query(`DELETE FROM korisnik_token WHERE sif_korisnik = $1`, [korisnik[0].sif_korisnik]);
                } 

                let tokenSend = crypto.randomBytes(64).toString('hex');
                await db.query(`INSERT INTO korisnik_token (sif_korisnik, token, trenutak_stvaranja) VALUES ($1, $2, to_timestamp($3))`, [korisnik[0].sif_korisnik, tokenSend, Date.now() / 1000]);
                console.log(korisnik[0]);
                res.json({
                    email : korisnik[0].email,
                    userType : korisnik[0].naziv_uloga,
                    firstName : korisnik[0].ime,
                    lastName : korisnik[0].prezime,
                    isAdmin : korisnik[0].sif_uloga == 4 ? true : false,
                    token : tokenSend
                });
                return;
            }
        }
        catch(err){
            console.log(err);
            res.json({
                error: true,
                message : "Greška tijekom spajanja na bazu"
            });
        }
    }

});

module.exports=router;