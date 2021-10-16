const express = require('express');
const produtos = require('./controladores/produtos');
const usuario = require('./controladores/usuario');
const login = require('./controladores/login');
const verificaLogin = require('./filtros/verificaLogin');
const rotas = express();

//Rotas de Login
rotas.post('/login', login.login);


// Rotas de usuário
rotas.post('/usuario', usuario.cadastrarUsuario);

rotas.use(verificaLogin);

rotas.get('/usuario', usuario.detalharUsuario);
rotas.put('/usuario', usuario.atualizarUsuario);


// Rotas de produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);


module.exports = rotas;