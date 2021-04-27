const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const auth = require('../components/authFunctions');

// Dohvat svih mjesta
router.get('/all', auth([1, 2, 3, 4]), async function(req, res) {
    const query = "SELECT sif_mjesto AS id, naziv_mjesto AS name, postanski_broj AS postalcode FROM mjesto;";
    let result = await db.query(query);

    res.json({
        cities: result.rows
    });
});

// Dohvat jednog mjesta
router.get('/:id', auth([1, 2, 3, 4]) , async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id mjesta"
        });
        return;
    }

    const query = `SELECT sif_mjesto AS id, naziv_mjesto AS name, postanski_broj AS postalcode FROM mjesto WHERE sif_mjesto = $1`;
    let result = await db.query(query, [id]);

    res.json(result.rows[0]);
});

// Stvaranje mjesta
router.post('/create', auth([4]) , async function(req, res) {
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        postalcode: Joi.string().max(10).required()
    });

    let {name, postalcode} = req.body;

    try {
        await schema.validateAsync(req.body);
    } catch (err) {
        res.json({
            error: true,
            message: err.details[0].message
        });
        return;
    }

    const query = `INSERT INTO mjesto (naziv_mjesto, postanski_broj) VALUES ($1, $2);`;
    try {
        await db.query(query, [name, postalcode]);
    } catch (err) {
        res.json({
            error: true,
            message: "Greška tijekom unosa u bazu"
        });
        return;
    }

    let createdSelect = `select sif_mjesto as id, naziv_mjesto as name, postanski_broj as postalcode from mjesto where naziv_mjesto = $1 and postanski_broj = $2 order by sif_mjesto desc limit 1`;
    let created = await db.query(createdSelect, [name, postalcode]);

    res.json({
        error: false,
        message: "Uspješno stvoreno",
        city: created.rows[0]
    });
});

// Izmjena mjesta
router.post('/edit/:id', auth([4]) , async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        postalcode: Joi.string().max(10).required()
    });

    let id = req.params.id;
    let {name, postalcode} = req.body;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id mjesta"
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

    const query = `UPDATE mjesto SET naziv_mjesto = $1, postanski_broj = $2 WHERE sif_mjesto = $3;`;
    try {
        await db.query(query, [name, postalcode, id]);
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

// Brisanje mjesta
router.delete('/:id', auth([4]), async (req, res) => {
    let id = req.params.id;

    if (id != parseInt(id)) {
        res.json({
            error: true,
            message: "Neispravan id mjesta"
        });
        return;
    }

    try {
        await db.query(`DELETE FROM mjesto WHERE sif_mjesto = $1`, [id]);
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