const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const listarProdutos = async (req, res) => {

    const { id } = req.usuario;

    try {
        const { rows: produtos } = await conexao.query('select * from produtos where usuario_id = $1', [id]);

        return res.status(200).json(produtos);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

};

const detalharProduto = async (req, res) => {
    const { id } = req.usuario;
    const produtoBuscado = req.params;
    const idProdutoBuscado = Number(produtoBuscado.id)


    if (isNaN(idProdutoBuscado)) {
        res.status(400).json({ mensagem: 'O valor do parâmetro ID deve ser um número inteiro' })
    }

    try {
        const query = 'select * from produtos where id = $1'
        const produto = await conexao.query(query, [idProdutoBuscado])

        if (produto.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' })
        }

        if (produto.rows[0].usuario_id !== id) {
            return res.status(403).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' })
        }

        return res.status(200).json(produto.rows[0])

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}


const cadastrarProduto = async (req, res) => {
    const { id } = req.usuario;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
    }
    if (!quantidade) {
        return res.status(400).json({ mensagem: 'O campo quantidade é obrigatório' })
    }
    if (!preco) {
        return res.status(400).json({ mensagem: 'O campo preco é obrigatório' })
    }
    if (!descricao) {
        return res.status(400).json({ mensagem: 'O campo descricao é obrigatório' })
    }

    if (quantidade <= 0) {
        return res.status(400).json({ mensagem: 'O campo quantidade deve ser maior que zero.' })
    }

    try {
        const queryCadastrarProduto = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';

        const produtoCadastrado = await conexao.query(queryCadastrarProduto, [id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (produtoCadastrado.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o produto.' })
        }

        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
};


const atualizarProduto = async (req, res) => {
    const { id } = req.usuario;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const produtoBuscado = req.params;
    const idProdutoBuscado = parseInt(produtoBuscado.id)

    if (isNaN(idProdutoBuscado)) {
        res.status(400).json({ mensagem: 'O valor do parâmetro ID deve ser um número inteiro' })
    }

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
    }
    if (!quantidade) {
        return res.status(400).json({ mensagem: 'O campo quantidade é obrigatório' })
    }
    if (!preco) {
        return res.status(400).json({ mensagem: 'O campo preco é obrigatório' })
    }
    if (!descricao) {
        return res.status(400).json({ mensagem: 'O campo descricao é obrigatório' })
    }
    if (quantidade <= 0) {
        return res.status(400).json({ mensagem: 'O campo quantidade deve ser maior que zero.' })
    }

    try {
        const queryConsultar = 'select * from produtos where id = $1'
        const produto = await conexao.query(queryConsultar, [idProdutoBuscado])

        if (produto.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Produto não encontrado.' })
        }

        if (produto.rows[0].usuario_id !== id) {
            return res.status(403).json({ mensagem: 'O usuário autenticado não ter permissão para alterar este produto.' })
        }

        const queryAtualizar = 'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7';

        const produtoAtualizado = await conexao.query(queryAtualizar, [nome, quantidade, categoria, preco, descricao, imagem, idProdutoBuscado]);

        if (produtoAtualizado.rowCount === 0) {
            res.status(400).json({ mensagem: 'O produto não pode ser atualizado.' })
        };
        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}


const excluirProduto = async (req, res) => {
    const { id } = req.usuario;
    const produtoBuscado = req.params;
    const idProdutoBuscado = parseInt(produtoBuscado.id)

    if (isNaN(idProdutoBuscado)) {
        res.status(400).json({ mensagem: 'O valor do parâmetro ID deve ser um número inteiro' })
    }

    try {
        const queryConsultar = 'select * from produtos where id = $1'
        const produto = await conexao.query(queryConsultar, [idProdutoBuscado])

        if (produto.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Produto não encontrado.' })
        }

        if (produto.rows[0].usuario_id !== id) {
            return res.status(403).json({ mensagem: 'O usuário autenticado não ter permissão para excluir este produto.' })
        }

        const queryDeletar = 'delete from produtos where id = $1';

        const produtoDeletado = await conexao.query(queryDeletar, [idProdutoBuscado]);

        if (produtoDeletado.rowCount === 0) {
            res.status(400).json({ mensagem: 'O produto não pode ser excluído.' })
        };

        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

}

module.exports = {
    listarProdutos,
    detalharProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}

