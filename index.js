const express =  require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 8080;

const loginRouter = require('./routes/loginRouter');
const signupRouter = require('./routes/signupRouter');
const logoutRouter = require('./routes/logoutRouter');
const medsRouter = require('./routes/medsRouter');
const atkRouter = require('./routes/atkRouter');
const pharmaformRouter = require('./routes/pharmaformRouter');
const actsubstanceRouter = require('./routes/actsubstanceRouter');
const manufacturerRouter = require('./routes/manufacturerRouter');
const cityRouter = require('./routes/cityRouter');
const createpharmacyRouter = require('./routes/createpharmacyRouter');
const employeeRouter = require('./routes/employeeRouter');
const offerRouter = require('./routes/offerRouter');
const cartRouter = require('./routes/cartRouter');
const pharmacyRouter = require('./routes/pharmacyRouter');
const profileRouter = require('./routes/profileRouter');

app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/logout', logoutRouter);
app.use('/meds',medsRouter);
app.use('/atk', atkRouter);
app.use('/pharmaform', pharmaformRouter);
app.use('/actsubstance', actsubstanceRouter);
app.use('/manufacturer', manufacturerRouter);
app.use('/city', cityRouter);
app.use('/create-pharmacy', createpharmacyRouter);
app.use('/employee', employeeRouter);
app.use('/offer',offerRouter);
app.use('/cart',cartRouter);
app.use('/pharmacy', pharmacyRouter);
app.use('/profile', profileRouter);

// Runs every day at 1:00 am
cron.schedule('0 1 * * *', async () => {
  try {
    await db.query('UPDATE ponuda SET aktivno = false WHERE datum_isteka_roka < CURRENT_DATE', []);
    console.log(`Table 'ponuda' successfully updated!`);

    const kosariceQuery = `SELECT DISTINCT(sif_kosarica) AS kosarice
      FROM kosarica 
      JOIN stavka_kosarice USING (sif_kosarica)
      JOIN ponuda USING (sif_ponuda)
      WHERE trenutak_preuzimanja IS NOT NULL
      AND ponuda.aktivno = false`
    let kosarice = (await db.query(kosariceQuery, [])).rows[0].kosarice;
    console.log(`Found carts to update!`);

    for (let kosarica of kosarice) {
      let status = `INSERT INTO promjene_statusa_kosarice 
        (sif_kosarica, trenutak_promjene, sif_status_prije, sif_status_nakon) 
        VALUES (${kosarica}, CURRENT_TIMESTAMP, 6, 6)`;
      await db.query(status, []);
    }
    console.log(`Carts updated!`);
  } catch (err) {
    console.log(`There was an error while updating 'ponuda' table! Error: ${err}`);
  }
});

app.listen(port, (err) => {
  if (!err) {
     console.log(`App started on port ${port}`);
  } else {
    console.log(err);
  }
});

module.exports = app;