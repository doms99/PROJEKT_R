const db = require('../db');


function authentificator(roles) {
  return async function checkValid(req, res, next) {
    let header = req.headers['authorization'];
    let token = header && header.split(' ')[1];

    if (token == null) {
      //ako nije predan token
      res.status(401).send("Nije predan token");
      return;

    } else {

      try {
        let auth = (await db.query(`SELECT korisnik.sif_korisnik, token, korisnik_token.trenutak_stvaranja, sif_uloga 
                                    FROM korisnik_token JOIN korisnik ON korisnik.sif_korisnik = korisnik_token.sif_korisnik 
                                    WHERE token = $1`, [token])).rows;
        if (auth != undefined && auth.length > 0) {
          console.log((Date.now() / 1000) - (Date.parse(auth[0].trenutak_stvaranja) / 1000));

          if ((Date.now() / 1000) - (Date.parse(auth[0].trenutak_stvaranja) / 1000) > 43200) {
            await db.query(`DELETE FROM korisnik_token WHERE token = $1`, [token]);
            res.status(403).send("Token je istekao");
            return;
          }

          if (!roles.includes(auth[0].sif_uloga)) {
            res.status(403).send("Nemate ovlasti");
            return;
          }

          next();

        } else {

          res.status(403).send("Token ne postoji u sustavu");
          return;

        }
      } catch (error) {
        console.log(error);
        res.status(400).send("Greska u bazi podataka");
        return;
      }
    }
  }
}

module.exports = authentificator;