const db = require('mysql2');

const connection = db.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "estoque",
    port: 3307
});

connection.getConnection((err) => {
    if(err) {
        console.error('Erro ao se conectar ao banco de dados! ', err);
        return;
    } else {
        console.log('Conexão feita!');
    }
})

module.exports = connection;