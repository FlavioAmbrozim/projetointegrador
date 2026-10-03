const Produto = require("../models/produto.model");

function listar() {
  return Produto.findAll({ order: [["id", "ASC"]] });
}

function buscarPorId(id) {
  return Produto.findByPk(id);
}

function validar(dados) {
  if (!dados.nome || dados.preco == null) {
    throw new Error("nome e preco são obrigatórios");
  }
  if (typeof dados.nome !== "string" || !dados.nome.trim()) {
    throw new Error("nome e preco são obrigatórios");
  }
  if (typeof dados.preco !== "number" || Number.isNaN(dados.preco) || dados.preco < 0) {
    throw new Error("preco deve ser um número maior ou igual a zero");
  }
}

async function criar(dados) {
  validar(dados);
  return Produto.create({ nome: dados.nome.trim(), preco: dados.preco });
}

async function atualizar(id, dados) {
  validar(dados);
  const produto = await Produto.findByPk(id);
  if (!produto) return null;
  await produto.update({ nome: dados.nome.trim(), preco: dados.preco });
  return produto;
}

async function excluir(id) {
  const produto = await Produto.findByPk(id);
  if (!produto) return false;
  await produto.destroy();
  return true;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
