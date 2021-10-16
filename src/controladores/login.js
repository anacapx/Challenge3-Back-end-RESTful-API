const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const bcrypt = require('bcrypt');


const login = async (req, res) => {

    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' })
    }

    try {
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const usuarioVerificado = await conexao.query(queryVerificaEmail, [email]);

        if (usuarioVerificado.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const usuario = usuarioVerificado.rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(400).json({ mensagem: 'E-mail e senha não conferem.' });
        }

        const token = jwt.sign({
            id: usuario.id,
        }, jwtSecret, {
            expiresIn: '8h'
        });


        return res.status(200).json({
            token
        })

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }


}

module.exports = {
    login
};