const {Pool} = require('pg');
const {dbConstants} = require('../constants');

const pool = new Pool(dbConstants);

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                return res;
            });
    },
    pool: pool
}