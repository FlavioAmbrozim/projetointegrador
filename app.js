const express = require("express");
const produtoRoutes = require("./scr/routes/produto.routes");
const { sequelize } = require("./scr/models/produto.model");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cadastro de Produtos</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;background:#f4f4f4;color:#222}
    h1{margin-bottom:8px} form,.produto{background:#fff;padding:20px;margin:15px 0;border-radius:8px}
    input{display:block;width:100%;box-sizing:border-box;padding:10px;margin:8px 0 15px}
    button{padding:9px 14px;margin-right:8px;cursor:pointer} .produto{display:flex;justify-content:space-between;gap:15px;align-items:center}
    #mensagem{min-height:20px} .erro{color:#b00020}
  </style>
</head>
<body>
  <h1>Cadastro de Produtos</h1>
  <p>CRUD de produtos com Express, Sequelize e SQLite.</p>
  <form id="form">
    <input id="nome" placeholder="Nome do produto" required>
    <input id="preco" type="number" step="0.01" min="0" placeholder="Preço" required>
    <button type="submit">Salvar</button>
    <button type="button" id="cancelar" hidden>Cancelar</button>
  </form>
  <p id="mensagem"></p>
  <h2>Produtos</h2>
  <div id="lista"></div>
  <script>
    const form=document.getElementById("form"),nome=document.getElementById("nome"),preco=document.getElementById("preco"),lista=document.getElementById("lista"),mensagem=document.getElementById("mensagem"),cancelar=document.getElementById("cancelar");
    let editando=null;
    async function requisicao(url,opcoes){const resposta=await fetch(url,opcoes);const dados=resposta.status===204?null:await resposta.json();if(!resposta.ok)throw new Error(dados.mensagem||"Erro na requisição");return dados;}
    function limpar(){editando=null;form.reset();cancelar.hidden=true;}
    async function carregar(){try{const produtos=await requisicao("/produtos");lista.innerHTML="";produtos.forEach(p=>{const div=document.createElement("div");div.className="produto";div.innerHTML="<span><strong>"+p.nome+"</strong> - R$ "+Number(p.preco).toFixed(2)+"</span>";const editar=document.createElement("button");editar.textContent="Editar";editar.onclick=()=>{editando=p.id;nome.value=p.nome;preco.value=p.preco;cancelar.hidden=false;window.scrollTo(0,0)};const excluir=document.createElement("button");excluir.textContent="Excluir";excluir.onclick=async()=>{if(!confirm("Excluir este produto?"))return;try{await requisicao("/produtos/"+p.id,{method:"DELETE"});limpar();await carregar()}catch(e){mensagem.textContent=e.message;mensagem.className="erro"}};div.append(editar,excluir);lista.appendChild(div)});if(!produtos.length)lista.textContent="Nenhum produto cadastrado."}catch(e){mensagem.textContent=e.message;mensagem.className="erro"}}
    form.onsubmit=async e=>{e.preventDefault();const dados={nome:nome.value,preco:Number(preco.value)};try{await requisicao("/produtos"+(editando===null?"":"/"+editando),{method:editando===null?"POST":"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(dados)});mensagem.textContent="";limpar();await carregar()}catch(e){mensagem.textContent=e.message;mensagem.className="erro"}};
    cancelar.onclick=limpar;carregar();
  </script>
</body>
</html>`);
});

app.use("/produtos", produtoRoutes);

/* istanbul ignore next */
if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Servidor disponível em http://localhost:3000"));
  }).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = app;
