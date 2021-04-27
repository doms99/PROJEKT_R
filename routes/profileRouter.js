const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi')


router.get('/', async(req, res) => {
   let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

   if(token == null) {
      res.json({
         error: true,
         message: "Token nije dodijeljen ni jednom korisniku"
       });
       return;
   }

   let userIdQuery = await db.query(`SELECT sif_korisnik from korisnik_token where token = $1`, [token]);

   if(userIdQuery.rows.length == 0) {
      res.json({
         error: true,
         message: "Token nije dodijeljen ni jednom korisniku"
       });
       return;
   }

   let id = userIdQuery.rows[0].sif_korisnik;
   
   let query = `SELECT ime as firstname, prezime as lastname, sif_korisnik as userid, email, korisnicko_ime as username, lozinka as password, trenutak_stvaranja as timeofcreation`;
   query += `, sif_osoba as personid, sif_uloga as roleid FROM korisnik natural join osoba where sif_korisnik = ${id}`;

   let userQuery = await db.query(query);

   if(userQuery.rows.length == 0) {
      res.json({
         error: true,
         message: "Token je dodjeljen korisniku koji ne postoji"
       });
       return;
   }

   let user = userQuery.rows[0];

   let roleId = user.roleid;
   let roleQuery = await db.query(`SELECT naziv_uloga FROM uloga WHERE sif_uloga = ${roleId}`);

   if(roleQuery.rows.length == 0) {
      res.json({
         error: true,
         message: "Token je dodjeljen korisniku koji ima ulogu koja ne postoji"
       });
       return;
   }

   let role = roleQuery.rows[0].naziv_uloga;

   user.role = role;
   res.json({
      error: false,
      user: user
   });

});

router.post('/edit', async function(req, res) {
   let header = req.headers['authorization'];
   let token = header && header.split(' ')[1];

   const schema = Joi.object({
      username: Joi.string().min(3).max(100),
      email: Joi.string().pattern(new RegExp("\\s*\\S+@\\S+.\\S+")),
      firstName: Joi.string().max(100),
      lastName: Joi.string().max(100),
      password: Joi.string().max(200)
   });

   let {email, username, firstName, lastName, password} = req.body;

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

  if(email == null && username == null && firstName == null && lastName == null && password == null){
   res.json({
      error: false
   });
   return;
  }

  let userIdQuery = await db.query(`SELECT sif_korisnik from korisnik_token where token = $1`, [token]);
  

   if(userIdQuery.rows.length == 0) {
      res.json({
         error: true,
         message: "Token nije dodijeljen ni jednom korisniku"
       });
       return;
   }

   let idUser = userIdQuery.rows[0].sif_korisnik;


   let personIdQuery = await db.query(`SELECT sif_osoba from korisnik where sif_korisnik = $1`, [idUser]);

   let idPerson = personIdQuery.rows[0].sif_osoba;

  await db.query("BEGIN");

  try
   {
      if(email != null)
         await db.query(`UPDATE korisnik SET email = $1 WHERE sif_korisnik = ${idUser}`, [email]);

      if(username != null)
         await db.query(`UPDATE korisnik SET korisnicko_ime = $1 WHERE sif_korisnik = ${idUser}`, [username]);

      if(password != null)
         await db.query(`UPDATE korisnik SET lozinka = $1 WHERE sif_korisnik = ${idUser}`, [password]);

      if(firstName != null)
         await db.query(`UPDATE osoba SET ime = $1 WHERE sif_osoba = ${idPerson}`, [firstName]);

      if(lastName != null)
         await db.query(`UPDATE osoba SET prezime = $1 WHERE sif_osoba = ${idPerson}`, [lastName]);
   }
   catch(err){
      await db.query("ROLLBACK");
      res.json({
         error: true,
         message: "Greška pri komunikaciji s bazom"
      });
      return;
   }     
   
   await db.query("COMMIT");
   res.json({
      error: false,
      message: "Uspjesna izmjena podataka"
   });
});

  


module.exports=router;