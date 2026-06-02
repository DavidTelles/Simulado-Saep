DROP DATABASE IF EXISTS estoque;
CREATE DATABASE estoque;
USE estoque;

CREATE TABLE estoque.produtos (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(20)
);

CREATE TABLE estoque.movimentacoes (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `data` DATETIME NOT NULL,
    quantidade INT NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    id_produto INT NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

INSERT INTO produtos (nome, quantidade, valor, categoria) VALUES 
("Monitor", 20, 120.00, "Periferico"),
("Moletom", 10, 50.00, "Roupa"),
("Batom", 20, 10.00, "beleza");

INSERT INTO movimentacoes(data, tipo, quantidade, id_produto) VALUES 
('2026-09-10', "saida", 10, 1),
('2026-04-12', "entrada", 20, 2),
('2026-05-09', "saida", 9, 3);

CREATE VIEW vw_estoque AS
SELECT nome, (quantidade * valor) AS valor_total, categoria
FROM produtos;