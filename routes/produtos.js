const express = require('express');
const db = require('../db');
const produtoRouter = express.Router();

// Rotas GET
produtoRouter.get('/', (req, res) => {
    try {
        db.query('SELECT * FROM produtos', (err, results) => {
            if (err) {
                console.error('Erro -> ', err)
                return res.status(500).json({ error: 'Erro interno no banco de dados' });
            } else {
                return res.status(200).json(results);
            }
        })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

produtoRouter.get('/view', (req, res) => {
    try {
        db.query('SELECT * FROM vw_estoque', (err, results) => {
            if (err) {
                console.error('Erro -> ', err)
                return res.status(500).json({ error: 'Erro interno no banco de dados' });
            } else {
                return res.status(200).json(results);
            }
        })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

produtoRouter.get('/valor-total', (req, res) => {
    try {
        db.query('SELECT categoria, SUM(valor * quantidade) as valor_total FROM produtos GROUP BY categoria', (err, results) => {
            if (err) {
                console.error('Erro -> ', err)
                return res.status(500).json({ error: 'Erro interno no banco de dados' });
            } else {
                return res.status(200).json(results);
            }
        })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

produtoRouter.get('/limite', (req, res) => {
    try {
        db.query('SELECT id, nome, valor, categoria, (quantidade / 100) * 100 as percentual FROM produtos WHERE quantidade <= 0 OR quantidade >= 100', (err, results) => {
            if (err) {
                console.error('Erro -> ', err)
                return res.status(500).json({ error: 'Erro interno no banco de dados' });
            } else {
                return res.status(200).json(results);
            }
        })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

// Rotas post

produtoRouter.post('/criar', (req, res) => {
    try {
        const { nome, valor, quantidade, categoria } = req.body;

        if (!nome || quantidade == null || valor == null || !categoria) {
            console.log("Erro! Algum item não foi identificado")
            return;
        }

        db.query('INSERT INTO produtos (nome, valor, quantidade, categoria) VALUES (?, ?, ?, ?)',
            [nome, valor, quantidade, categoria],
            (err, results) => {
                if (err) {
                    console.error('Erro -> ', err)
                    return res.status(500).json({ error: 'Erro interno no banco de dados' });
                } else {
                    return res.status(200).json(results);
                }
            })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

module.exports = produtoRouter;