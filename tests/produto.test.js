process.env.DB_PATH = ":memory:";

const request = require("supertest");
const app = require("../app");
const Produto = require("../scr/models/produto.model");
const service = require("../scr/services/produto.service");

beforeAll(async () => {
  await Produto.sequelize.sync({ force: true });
});

afterEach(async () => {
  await Produto.destroy({ where: {}, truncate: true });
  jest.restoreAllMocks();
});

afterAll(async () => {
  await Produto.sequelize.close();
});

test("interface está disponível", async () => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
  expect(res.text).toContain("Cadastro de Produtos");
});

test("CRUD completo funciona", async () => {
  const criado = await request(app).post("/produtos").send({ nome: "Notebook", preco: 3500 });
  expect(criado.status).toBe(201);
  expect(criado.body.nome).toBe("Notebook");

  const id = criado.body.id;
  const lista = await request(app).get("/produtos");
  expect(lista.status).toBe(200);
  expect(lista.body).toHaveLength(1);

  const encontrado = await request(app).get(`/produtos/${id}`);
  expect(encontrado.status).toBe(200);
  expect(encontrado.body.preco).toBe(3500);

  const atualizado = await request(app).put(`/produtos/${id}`).send({ nome: "Notebook Gamer", preco: 4500 });
  expect(atualizado.status).toBe(200);
  expect(atualizado.body.nome).toBe("Notebook Gamer");

  const excluido = await request(app).delete(`/produtos/${id}`);
  expect(excluido.status).toBe(204);

  const depois = await request(app).get(`/produtos/${id}`);
  expect(depois.status).toBe(404);
});

test("não permite criar dados inválidos", async () => {
  const semNome = await request(app).post("/produtos").send({ preco: 100 });
  expect(semNome.status).toBe(400);

  const semPreco = await request(app).post("/produtos").send({ nome: "Mouse" });
  expect(semPreco.status).toBe(400);

  const precoInvalido = await request(app).post("/produtos").send({ nome: "Mouse", preco: -1 });
  expect(precoInvalido.status).toBe(400);
});

test("retorna 404 quando produto não existe", async () => {
  expect((await request(app).get("/produtos/999")).status).toBe(404);
  expect((await request(app).put("/produtos/999").send({ nome: "Mouse", preco: 100 })).status).toBe(404);
  expect((await request(app).delete("/produtos/999")).status).toBe(404);
});

test("trata erros inesperados nas operações", async () => {
  jest.spyOn(service, "listar").mockRejectedValueOnce(new Error("erro"));
  expect((await request(app).get("/produtos")).status).toBe(500);

  jest.spyOn(service, "buscarPorId").mockRejectedValueOnce(new Error("erro"));
  expect((await request(app).get("/produtos/1")).status).toBe(500);

  jest.spyOn(service, "excluir").mockRejectedValueOnce(new Error("erro"));
  expect((await request(app).delete("/produtos/1")).status).toBe(500);
});

test("service cria, atualiza e exclui produto", async () => {
  const produto = await service.criar({ nome: "Teclado", preco: 200 });
  expect(produto.nome).toBe("Teclado");
  expect((await service.buscarPorId(produto.id)).nome).toBe("Teclado");
  expect((await service.atualizar(produto.id, { nome: "Teclado Mecânico", preco: 300 })).nome).toBe("Teclado Mecânico");
  expect(await service.excluir(produto.id)).toBe(true);
  expect(await service.excluir(produto.id)).toBe(false);
});

test("service rejeita nome vazio e preço inválido", async () => {
  await expect(service.criar({ nome: "   ", preco: 10 })).rejects.toThrow();
  await expect(service.criar({ nome: "Mouse", preco: "10" })).rejects.toThrow();
});
