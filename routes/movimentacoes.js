const express = require('express');
const db = require('../db');
const { error } = require('selenium-webdriver');
const movimentoRouter = express.Router();

// Rotas GET
movimentoRouter.get('/', (req, res) => {
    try {
        db.query('SELECT * FROM movimentacoes', (err, results) => {
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

movimentoRouter.get('/saida', (req, res) => {
    try {
        db.query('SELECT * FROM movimentacoes WHERE tipo = "saida" ORDER BY data DESC', (err, results) => {
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

movimentoRouter.get('/entrada', (req, res) => {
    try {
        db.query('SELECT * FROM movimentacoes WHERE tipo = "entrada" ORDER BY data DESC', (err, results) => {
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

movimentoRouter.get('/movimentacoes', (req, res) => {
    try {
        const { data_inicial, data_final } = req.body;
        if (!data_inicial || !data_final) {
            console.log("Valores Nulos");
            return;
        };

        db.query('SELECT * FROM movimentacoes WHERE `data` BETWEEN ? AND ?', [data_inicial, data_final], (err, results) => {
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

movimentoRouter.get('/movimentacoes', (req, res) => {
    try {
        const { data_inicial, data_final } = req.body;
        if (!data_inicial || !data_final) {
            console.log("Valores Nulos");
            return;
        };

        db.query(`
            SELECT 
            p.nome AS nome_do_produto,
            p.unidade_medida,
            SUM(CASE WHEN m.tipo = 'entrada' THEN m.quantidade ELSE 0 END) AS total_de_entradas,
            SUM(CASE WHEN m.tipo = 'saida' THEN m.quantidade ELSE 0 END) AS total_de_saidas,
            SUM(CASE WHEN m.tipo = 'saida' THEN m.quantidade ELSE 0 END) AS saida_no_periodo,
            SUM(CASE WHEN m.tipo = 'entrada' THEN m.quantidade * p.valor ELSE 0 END) AS valor_total_financeiro_das_entradas,
            SUM(CASE WHEN m.tipo = 'saida' THEN m.quantidade * p.valor ELSE 0 END) AS valor_financeiro_das_saidas
            FROM produtos p
            INNER JOIN movimentacoes m ON p.id = m.produtos_id
            WHERE m.datas BETWEEN ? AND ?
            GROUP BY p.id, p.nome, p.unidade_medida
            `,
            [data_inicial, data_final],
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

movimentoRouter.get('/maiores-saidas', (req, res) => {
    try {
        const { data_inicial, data_final } = req.body;
        if (!data_inicial || !data_final) {
            return res.status(400).json({ error: 'Porfavor insire as datas iniciais e finais' });
        };

        db.query(`
            SELECT 
            produtos.nome AS nome_do_produto,
            SUM(movimentacoes.quantidade) AS quantidade_total_de_saidas,
            SUM(movimentacoes.quantidade * produtos.valor) AS valor_total_financeiro_das_saidas
            FROM produtos
            INNER JOIN movimentacoes ON produtos.id = movimentacoes.id_produto
            WHERE movimentacoes.tipo = 'saida' AND movimentacoes.data BETWEEN ? AND ?
            GROUP BY produtos.id, produtos.nome
            ORDER BY quantidade_total_de_saidas DESC
            `,
            [data_inicial, data_final],
            (err, results) => {
                if (err) {
                    console.error('Erro (rota 13) -> ', err)
                    return res.status(500).json({ error: 'Erro interno no banco de dados' });
                } else {
                    return res.json(results);
                }
            })
    } catch (err) {
        console.error('Erro severo: ', err)
    };
});

movimentoRouter.get('/maiores-saidas', (req, res) => {
    try {
        const { data_inicial, data_final } = req.body;
        if (!data_inicial || !data_final) {
            return res.status(400).json({ error: 'Deu merda' });
        };

        db.query("SELECT * FROM movimentacoes WHERE `data` BETWEEN ? AND ?",
            [data_inicial, data_final],
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

// Rotas post

movimentoRouter.post('/add-entrada', (req, res) => {
    try {
        const { quantidade, id_produto } = req.body;

        if (quantidade == null || id_produto == null) {
            console.log("Erro! Algum item não foi identificado")
            return;
        }

        db.query('INSERT INTO movimentacoes (data, tipo, quantidade, id_produto) VALUES (NOW(), "estrada", ?, ?)',
            [quantidade, id_produto],
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

module.exports = movimentoRouter;