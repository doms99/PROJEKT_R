const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');


// Dohvat svih djelotvornih tvari
router.get('/all', auth([1, 2, 3, 4]), async function(req, res) {
    const query = "SELECT sif_djel_tvar AS id, naziv_djel_tvar AS name FROM djelotvorna_tvar;";
    let result = await db.query(query);

    res.json({
        actsubstances: result.rows
    });
});

// Dohvat jedne djelotvorne tvari
router.get('/:id', auth([1, 2, 3, 4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id djelotvorne tvari"
        });
        return;
    }

    const query = `SELECT sif_djel_tvar AS id, naziv_djel_tvar AS name FROM djelotvorna_tvar WHERE sif_djel_tvar = $1`;
    let result = await db.query(query, [id]);

    res.json(result.rows[0]);
});

// Stvaranje djelotvorne tvari
router.post('/create', auth([4]), async function(req, res) {
    const schema = Joi.object({
        name: Joi.string().max(200).required()
    });

    let {name} = req.body;

    try {
        await schema.validateAsync(req.body);
    } catch (err) {
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    const query = `INSERT INTO djelotvorna_tvar (naziv_djel_tvar) VALUES ($1);`;
    try {
        let test = await db.query(query, [name]);
        console.log("test");
    } catch (err) {
        console.log(err)
        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    let createdSelect = `select sif_djel_tvar as id, naziv_djel_tvar as name from djelotvorna_tvar where naziv_djel_tvar = $1 order by sif_djel_tvar desc limit 1`;
    let created = await db.query(createdSelect, [name]);

    res.json({
        error: false,
        actsubstance: created.rows[0],
        message: "Uspješno stvoreno"
    });
});

// Izmjena djelotvorne tvari
router.post('/edit/:id', auth([4]), async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().max(200).required()
    });

    let id = req.params.id;
    let {name} = req.body;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id djelotvorne tvari"
        });
        return;
    }

    let result;
    try {
        result = await schema.validateAsync(req.body);
    } catch (err) {
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    const query = `UPDATE djelotvorna_tvar SET naziv_djel_tvar = $1 WHERE sif_djel_tvar = $2;`;
    try {
        await db.query(query, [name, id]);
    } catch (err) {
        console.log(err)

        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    res.json({
        error: false,
        message: "Uspješno izmjenjeno"
    });
});

// Brisanje djelotvorne tvari
router.delete('/:id', auth([4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id djelotvorne tvari"
        });
        return;
    }

    try {
        await db.query(`DELETE FROM djelotvorna_tvar WHERE sif_djel_tvar = $1`, [id]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška tijekom brisanja u bazi"
        });
        return;
    }

    res.json({
        error: false,
        message: "Uspješno obrisano"
    });
});

module.exports = router;