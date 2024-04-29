CREATE DATABASE harrypotterbackend;

\c harrypotterbackend;

CREATE TABLE bruxos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL, 
    data_nascimento DATE NOT NULL,
    casa VARCHAR(100) NOT NULL,
    habilidade_especial VARCHAR(100) NOT NULL,
    sangue VARCHAR(100) NOT NULL,
    patrono VARCHAR(100) NOT NULL
);

CREATE TABLE varinhas(
    id SERIAL PRIMARY KEY,
    material VARCHAR(100) NOT NULL,
    comprimento INTEGER NOT NULL,
    nucleo VARCHAR(100) NOT NULL,
    data_fabricacao DATE NOT NULL
);