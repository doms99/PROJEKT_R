const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

// Dohvat svih farmaceutskih oblika
router.get('/all', auth([1, 2, 3, 4]) , async function(req, res) {
    const query = "SELECT sif_farm_oblik AS id, naziv_farm_oblik AS name FROM farmaceutski_oblik;";
    let forms = await db.query(query);

    res.json({
        forms: forms.rows
    });
});

// Dohvat jednog farmaceutskog oblika
router.get('/:id', auth([1, 2, 3, 4]) , async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id farmaceutskog oblika"
        });
        return;
    }

    const query = `SELECT sif_farm_oblik AS id, naziv_farm_oblik AS name FROM farmaceutski_oblik WHERE sif_farm_oblik = $1`;
    let forms = await db.query(query, [id]);

    res.json(forms.rows[0]);
});

// Stvaranje farmaceutskog oblika
router.post('/create', auth([4]) , async function(req, res) {
    const schema = Joi.object({
        name: Joi.string().max(100).required()
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

    const query = `INSERT INTO farmaceutski_oblik (naziv_farm_oblik) VALUES ($1);`;
    try {
        await db.query(query, [name]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    let createdSelect = `select sif_farm_oblik as id, naziv_farm_oblik as name from farmaceutski_oblik where naziv_farm_oblik = $1 order by sif_farm_oblik desc limit 1`;
    let created = await db.query(createdSelect, [name]);
    
    res.json({
        error: false,
        message: "Uspješno stvoreno",
        pharmaform: created.rows[0]
    });
});

// Izmjena farmaceutskog oblika
router.post('/edit/:id', auth([4]) , async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().max(100).required()
    });

    let id = req.params.id;
    let {name} = req.body;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id farmaceutskog oblika"
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

    const query = `UPDATE farmaceutski_oblik SET naziv_farm_oblik = $1 WHERE sif_farm_oblik = $2;`;
    try {
        await db.query(query, [name, id]);
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

// Brisanje farmaceutskog oblika
router.delete('/:id', auth([4]) , async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id farmaceutskog oblika"
        });
        return;
    }

    try {
        await db.query(`DELETE FROM farmaceutski_oblik WHERE sif_farm_oblik = $1`, [id]);
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