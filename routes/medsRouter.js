const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');


//provjeri ovlasti pristupa
//router.use(auth[0]);

router.get('/all', auth([4]), async function(req, res) {
   let meds= await db.query("SELECT sif_lijek as id,\
                                    naziv_lijek as name,\
                                    raniji_naziv_lijek as formerName,\
                                    pakiranje as packing,\
                                    slika_url as pictureurl,\
                                    kolicina_djel_tvar as amount,\
                                    mjerna_jedinica as measuringunit,\
                                    sif_atk as atkid,\
                                    sif_djel_tvar as substanceid,\
                                    sif_farm_oblik as pharmaformid,\
                                    sif_proizvodac as manufacturerid FROM lijek ");

    let atk = await db.query("SELECT sif_atk as atkid, oznaka_atk as atkname, opis_atk as atkdescription FROM atk");
    let actsubstance = await db.query("SELECT sif_djel_tvar as substanceid, naziv_djel_tvar as substancename FROM djelotvorna_tvar");
    let form = await db.query("SELECT sif_farm_oblik formid, naziv_farm_oblik as formname FROM farmaceutski_oblik");
    let manufacturer = await db.query("SELECT sif_proizvodac as manufacturerid, naziv_proizvodac as manufacturername FROM proizvodac");
    res.json({
        meds: meds.rows,
        atk: atk.rows,
        actsubstance: actsubstance.rows,
        form: form.rows,
        manufacturer: manufacturer.rows
      });
    return;
});

router.get('/create', auth([2, 3, 4]), async function(req, res) {
  let atk = await db.query("SELECT sif_atk as atkid, oznaka_atk as atkname, opis_atk as atkdescription FROM atk");
  let actsubstance = await db.query("SELECT sif_djel_tvar as substanceid, naziv_djel_tvar as substancename FROM djelotvorna_tvar");
  let form = await db.query("SELECT sif_farm_oblik formid, naziv_farm_oblik as formname FROM farmaceutski_oblik");
  let manufacturer = await db.query("SELECT sif_proizvodac as manufacturerid, naziv_proizvodac as manufacturername FROM proizvodac");

  res.json({
    atk: atk.rows,
    actsubstance: actsubstance.rows,
    form: form.rows,
    manufacturer: manufacturer.rows
  });
});

router.post('/create', auth([2, 3, 4]), async function(req, res) {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    formerName: Joi.string().max(100),
    packing: Joi.string().max(100).required(),
    pictureUrl: Joi.string().max(100),
    amount: Joi.number().integer().required(),
    measuringUnit: Joi.string().max(100).required(),
    atkId: Joi.number().integer().required(),
    substanceId: Joi.number().integer().required(),
    formId: Joi.number().integer().required(),
    manufacturerId: Joi.number().integer().required()
});

let {name, formerName, packing, pictureUrl, amount, measuringUnit, atkId, substanceId, formId, manufacturerId } = req.body;

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

//ubaci to
let insert = "INSERT INTO lijek ( naziv_lijek,\
                                  raniji_naziv_lijek,\
                                  pakiranje,\
                                  slika_url,\
                                  kolicina_djel_tvar,\
                                  mjerna_jedinica,\
                                  sif_atk,\
                                  sif_djel_tvar,\
                                  sif_farm_oblik,\
                                  sif_proizvodac) VALUES(";

insert += "'" + name + "',";
formerName !== undefined ? insert += "'" + formerName + "'," : insert += "null,";
insert += "'" + packing + "',";
pictureUrl !== undefined ? insert += "'" + pictureUrl + "'," : insert += "null,";
insert += amount + ",";
insert += "'" + measuringUnit + "',";
insert += atkId + ",";
insert += substanceId + ",";
insert += formId + ",";
insert += manufacturerId + ");";

try{
  await db.query(insert);
}
catch (err) { 
  res.json({
      error: true,
      message: "Greška tijekom unosa u bazu"
  });
  return;
}


res.json({
  error: false,
  message: "Uspješno stvoreno"
});
});


router.delete('/edit/:id', auth([4]) , async function(req, res){
  let id = req.params.id;

  if(!id){
    res.json({
      error: true,
      message: "Id nije poslan"
  });
  return;
  }

  try{
    await db.query("DELETE FROM lijek where sif_lijek = " + id);
  }
  catch (err) { 
    res.json({
        error: true,
        message: "Greška tijekom unosa u bazu"
    });
    return;
  }

  res.json({
    error: false,
    message: "Uspješno obrisano"
  });
});

/*router.get('/edit/:id',async function(req, res) {
  let id=req.params.id;
  let atk = await db.query("SELECT sif_atk as atkid, oznaka_atk as atkname, opis_atk as atkdescription FROM atk");
  let actsubstance = await db.query("SELECT sif_djel_tvar as substanceid, naziv_djel_tvar as substancename FROM djelotvorna_tvar");
  let form = await db.query("SELECT sif_farm_oblik as formid, naziv_farm_oblik as formname FROM farmaceutski_oblik");
  let manufacturer = await db.query("SELECT sif_proizvodac as manufacturerid, naziv_proizvodac as manufacturername FROM proizvodac");
  let medicine= await db.query("SELECT sif_lijek as id,\
                                    naziv_lijek as name,\
                                    raniji_naziv_lijek as formerName,\
                                    pakiranje as packing,\
                                    slika_url as pictureurl,\
                                    kolicina_djel_tvar as amount,\
                                    mjerna_jedinica as measuringunit,\
                                    sif_atk as atkId,\
                                    sif_djel_tvar substanceId,\
                                    sif_farm_oblik as formId,\
                                    sif_proizvodac as manufacturerId FROM lijek  WHERE sif_lijek = " + id);

  res.json({
    atk: atk.rows,
    actsubstance: actsubstance.rows,
    form: form.rows,
    manufacturer: manufacturer.rows,
    medicine: medicine.rows[0]
  });
});*/

router.post('/edit/:id', auth([4]), async function(req, res) {

  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    formerName: Joi.string().max(100),
    packing: Joi.string().max(100).required(),
    pictureUrl: Joi.string().max(100).allow(""),
    amount: Joi.number().integer().required(),
    measuringUnit: Joi.string().max(100).required(),
    atkId: Joi.number().integer().required(),
    substanceId: Joi.number().integer().required(),
    formId: Joi.number().integer().required(),
    manufacturerId: Joi.number().integer().required()
  });
  

  let id = req.params.id;
  let {name, formerName, packing, pictureUrl, amount, measuringUnit, atkId, substanceId, formId, manufacturerId } = req.body;


  if(id != parseInt(id)){
    res.json({
      error: true,
      message: "Neispravan id lijeka"
  });
  return;
  }
  
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

  let update = `UPDATE lijek SET naziv_lijek='${name}', pakiranje='${packing}', kolicina_djel_tvar=${amount}`;
  if(formerName){
    update+= `, raniji_naziv_lijek='${formerName}'`
  }
  update+= `, mjerna_jedinica='${measuringUnit}', sif_ATK=${atkId}, sif_djel_tvar=${substanceId}, sif_farm_oblik=${formId}, sif_proizvodac=${manufacturerId}`;
  if(pictureUrl!=null){
    if(pictureUrl=="") update+= `, slika_URL=null`;
    else update+= `, slika_URL='${pictureUrl}'`;
  }
  
  update+=` WHERE sif_lijek=${id}`;

  try{
    await db.query(update);
  }
  catch (err) { 
    res.json({
        error: true,
        message: "Greška tijekom unosa u bazu"
    });
    return;
  }
  
  
  res.json({
    error: false,
    message: "Uspješno izmijenjeno"
  });
});


router.get('/search' ,async function(req, res) {
  let atk = await db.query("SELECT sif_atk as atkid, oznaka_atk as atkname, opis_atk as atkdescription FROM atk");
  let actsubstance = await db.query("SELECT sif_djel_tvar as substanceid, naziv_djel_tvar as substancename FROM djelotvorna_tvar");
  let form = await db.query("SELECT sif_farm_oblik formid, naziv_farm_oblik as formname FROM farmaceutski_oblik");
  let manufacturer = await db.query("SELECT sif_proizvodac as manufacturerid, naziv_proizvodac as manufacturername FROM proizvodac");
  let city = await db.query("SELECT sif_mjesto as cityid, naziv_mjesto as cityname, postanski_broj as postalcode FROM mjesto");

  res.json({
    atk: atk.rows,
    actsubstance: actsubstance.rows,
    form: form.rows,
    manufacturer: manufacturer.rows,
    city: city.rows
  });
});


router.post('/search' ,async function (req, res) {
  const schema = Joi.object({
    name: Joi.string().allow('').max(100),
    lowestPrice: Joi.number().integer(),
    highestPrice: Joi.number().integer(),
    atkId: Joi.number().integer(),
    substanceId: Joi.number().integer(), //aktivna tvar
    formId: Joi.number().integer(),
    manufacturerId: Joi.number().integer(),
    cityId: Joi.number().integer(),
    dateOfExpiry: Joi.date()
  });

  let {name, lowestPrice, highestPrice, atkId, substanceId, formId, manufacturerId, cityId, dateOfExpiry } = req.body;

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




  let select = "select sif_ljekarna as farmacyid, sif_lijek as medid, sif_ponuda as offerid, cijena as price, kolicina as availableAmount, datum_isteka_roka as dateofexpiry,";
  select += " popust as discount, trenutak_dodavanja as addedtimestamp, aktivno as active, naziv_lijek as medname, raniji_naziv_lijek as formername,";
  select += " pakiranje as packing, slika_url as pictureurl, kolicina_djel_tvar as amount, mjerna_jedinica as measuringunit, sif_atk as atkid, oznaka_ATK as atkName, opis_ATK as atkdescription,";
  select += " sif_djel_tvar as substanceId, naziv_djel_tvar as substanceName,"
  select += " sif_farm_oblik as formId, sif_proizvodac as manufacturerId, naziv_proizvodac as manufacturerName, naziv as farmacyname, oib, ulica_i_broj as streetandnumber, broj_telefona as phonenumber, sif_mjesto as cityid";
  select += " from ponuda NATURAL JOIN lijek NATURAL JOIN ljekarna NATURAL JOIN Proizvodac NATURAL JOIN ATK NATURAL JOIN Djelotvorna_tvar"
  let prvi = true;

  let counter = 1;
  let argsArray = [];

  if(lowestPrice !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += (" (cijena - cijena * popust / 100.0) >= " + `\$${counter++}`);
    argsArray.push(lowestPrice);
  }

  if(highestPrice !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " (cijena - cijena * popust / 100.0) <= " + `\$${counter++}`;
    argsArray.push(highestPrice);
  }

  if(atkId !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " sif_atk = " + `\$${counter++}`;
    argsArray.push(atkId);
  }

  if(substanceId !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " sif_djel_tvar = " + `\$${counter++}`;
    argsArray.push(substanceId);
  }

  if(formId !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " sif_farm_oblik = " + `\$${counter++}`;
    argsArray.push(formId);
  }

  if(manufacturerId !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " sif_proizvodac = " + `\$${counter++}`;
    argsArray.push(manufacturerId);
  }

  if(cityId !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " sif_mjesto = " + `\$${counter++}`;
    argsArray.push(cityId);
  }

  if(dateOfExpiry !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    prvi = false;

    select += " datum_isteka_roka <= to_timestamp(" + `\$${counter++}` + ")::DATE";
    argsArray.push(dateOfExpiry);
  }

  if(name !== undefined){
    if(prvi == true){
      select += " where"
      prvi = false;
    }
    else{
      select += " AND"
    }
    select += ` naziv_lijek ilike \$${counter++}`;
    argsArray.push(`${name}%`);
  }

  let queryResult
  try{
    queryResult = await db.query(select, argsArray);
  }
  catch (err) { 
    res.json({
        error: true,
        message: "Greška tijekom citanja iz baze"
    });
    return;
  }
  
  
  res.json({
    error: false,
    meds: queryResult.rows
  });


});


module.exports=router;
