const service = require("../services/produto.service");

exports.listar = async (req, res) => {
  try {
    const produtos = await service.listar();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar produtos" });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await service.buscarPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar produto" });
  }
};

exports.criar = async (req, res) => {
  try {
    const produto = await service.criar(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const produto = await service.atualizar(req.params.id, req.body);
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

exports.excluir = async (req, res) => {
  try {
    const excluido = await service.excluir(req.params.id);
    if (!excluido) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir produto" });
  }
};
