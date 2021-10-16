const conexao = require('../conexao');
const bcrypt = require('bcrypt');



const cadastrarUsuario = async (req, res) => {

    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório' })
    }
    if (!nome_loja) {
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório' })
    }

    try {
        const queryConsultarEmail = 'select * from usuarios where email = $1'
        const usuarioConsulta = await conexao.query(queryConsultarEmail, [email]);

        if (usuarioConsulta.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastrar = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
        const usuario = await conexao.query(queryCadastrar, [nome, email, senhaCriptografada, nome_loja]);

        if (usuario.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o usuário.' })
        }

        return res.status(201).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
};


const detalharUsuario = async (req, res) => {

    try {
        const { id, nome, email, nome_loja } = req.usuario

        return res.json({ id, nome, email, nome_loja })

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

};


const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { nome, email, senha, nome_loja } = req.body;

    try {
        const usuarioLogado = await conexao.query('select * from usuarios where id = $1', [id]);

        const usuarioConsultado = await conexao.query('select * from usuarios where email = $1', [email]);

        if (usuarioConsultado.rowCount !== 0) {
            return res.status(400).json({ mensagem: 'O email informado já está em uso' })
        }

        if (!nome) {
            return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
        }
        if (!email) {
            return res.status(400).json({ mensagem: 'O campo email é obrigatório.' });
        }
        if (!senha) {
            return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' });
        }
        if (!nome_loja) {
            return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioAtualizado = await conexao.query('update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5', [nome, email, senhaCriptografada, nome_loja, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Não foi possível atualizar o usuario.' })
        }

        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}


module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}

