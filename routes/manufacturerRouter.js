const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

// Dohvat svih proizvodaca
router.get('/all', auth([1, 2, 3, 4]) , async function(req, res) {
    const query = "SELECT sif_proizvodac AS id, naziv_proizvodac AS name, email, web_stranica AS webpage FROM proizvodac;";
    let result = await db.query(query);

    res.json({
        manufactrers: result.rows
    });
});

// Dohvat jednog proizvodaca
router.get('/:id', auth([1, 2, 3, 4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id proizvođača"
        });
        return;
    }

    const query = `SELECT sif_proizvodac AS id, naziv_proizvodac AS name, email, web_stranica AS webpage FROM proizvodac WHERE sif_proizvodac = $1`;
    let result = await db.query(query, [id]);

    res.json(result.rows[0]);
});

// Stvaranje proizvodaca
router.post('/create', auth([4]) , async function(req, res) {
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        email: Joi.string().max(200).email().required(),
        webpage: Joi.string().max(200).required()
    });

    let {name, email, webpage} = req.body;

    try {
        await schema.validateAsync(req.body);
    } catch (err) {
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    const query = `INSERT INTO proizvodac (naziv_proizvodac, email, web_stranica) VALUES ($1, $2, $3);`;
    try {
        await db.query(query, [name, email, webpage]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    let createdSelect = `select sif_proizvodac as id, naziv_proizvodac as name, email, web_stranica as webpage from proizvodac where naziv_proizvodac = $1 and email = $2 and web_stranica = $3 order by sif_proizvodac desc limit 1`;
    let created = await db.query(createdSelect, [name, email, webpage]);

    res.json({
        error: false,
        message: "Uspješno stvoreno",
        manufacturer: created.rows[0]
    });
});

// Izmjena proizvodaca
router.post('/edit/:id', auth([4]) , async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        email: Joi.string().max(200).email().required(),
        webpage: Joi.string().max(200).required()
    });

    let id = req.params.id;
    let {name, email, webpage} = req.body;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id proizvođača"
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

    const query = `UPDATE proizvodac SET naziv_proizvodac = $1, email = $2, web_stranica = $3 WHERE sif_proizvodac = $4;`;
    try {
        await db.query(query, [name, email, webpage, id]);
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

// Brisanje proizvodaca
router.delete('/:id', auth([4]) , async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id proizvođača"
        });
        return;
    }

    try {
        await db.query(`DELETE FROM proizvodac WHERE sif_proizvodac = $1`, [id]);
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