const express = require("express");
const produtoRoutes = require("./scr/routes/produto.routes");

const app = express();

app.use(express.json());
app.use("/produtos", produtoRoutes);

app.listen(3000);
