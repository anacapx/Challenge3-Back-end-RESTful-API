
DROP TABLE IF EXISTS usuarios;

create table usuarios (
  id serial primary key,
  nome varchar(100),
  nome_loja text,
  email varchar(80) UNIQUE,
  senha text
);

drop table if exists produtos;
  
create table produtos (
  id serial primary key,
  usuario_id integer references usuarios(id),
  nome varchar(100),
  quantidade integer,
  categoria varchar(100),
  preco bigint,
  descricao text,
  imagem text
);