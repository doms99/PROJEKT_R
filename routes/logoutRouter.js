var express = require('express');
var router = express.Router();
const db = require('../db');

router.post('/', async function(req, res, next) {
  let header = req.headers['authorization'];
  let token = header && header.split(' ')[1];

   if(token != null) {
     await db.query(`DELETE FROM korisnik_token WHERE token=$1`, [token]);
     res.sendStatus(204);
   } else {
     res.sendStatus(400);
   }
});

module.exports = router;