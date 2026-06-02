const express = require('express');
const app = express();
app.use(express.json());

const produtoRouter = require('./routes/produtos');
const movimentoRouter = require('./routes/movimentacoes');

app.use('/produtos', produtoRouter);
app.use('/movimento', movimentoRouter);

module.exports = app;