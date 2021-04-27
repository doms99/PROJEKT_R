const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

// Dohvat svih atk-ova
router.get('/all', auth([1, 2, 3, 4]), async function(req, res) {
    const query = "SELECT sif_atk AS id, oznaka_atk AS name, opis_atk AS description FROM atk;";
    let atks = await db.query(query);

    res.json({
        atk: atks.rows
    });
});

// Dohvat jednog atk-a
router.get('/:id', auth([1, 2, 3, 4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id atk-a"
        });
        return;
    }

    const query = `SELECT sif_atk AS id, oznaka_atk AS name, opis_atk AS description FROM atk WHERE sif_atk = $1`;
    let atks = await db.query(query, [id]);

    res.json(atks.rows[0]);
});

// Stvaranje atk-a
//router.post('/create', auth([4]) , async function(req, res) {
    router.post('/create' , async function(req, res) {
    const schema = Joi.object({
        name: Joi.string().max(5).required(),
        description: Joi.string().max(100).required()
    });

    let {name, description} = req.body;

    try {
        await schema.validateAsync(req.body);
    } catch (err) {
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    const query = `INSERT INTO atk (oznaka_atk, opis_atk) VALUES ($1, $2);`;
    try {
        await db.query(query, [name, description]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    let createdSelect = `select sif_atk as id, oznaka_atk as name, opis_atk as description from atk where oznaka_atk = $1 and opis_atk = $2  order by sif_atk desc limit 1`;
    let created = await db.query(createdSelect, [name, description]);

    res.json({
        error: false,
        message: "Uspješno stvoreno",
        atk: created.rows[0]
    });
});

// Izmjena atk-a
router.post('/edit/:id', auth([4]) , async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().max(5).required(),
        description: Joi.string().max(100).required()
    });

    let id = req.params.id;
    let {name, description} = req.body;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id atk-a"
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

    const query = `UPDATE atk SET oznaka_atk = $1, opis_atk = $2 WHERE sif_atk = $3;`;
    try {
        await db.query(query, [name, description, id]);
    } catch (err) {
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

// Brisanje atk-a
router.delete('/:id', auth([4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id atk-a"
        });
        return;
    }

    try {
        await db.query(`DELETE FROM atk WHERE sif_atk = $1`, [id]);
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