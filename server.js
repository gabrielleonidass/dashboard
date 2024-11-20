// Importando o express
const express = require('express');
const app = express();
const port = 3000;  // Você pode alterar a porta se desejar

// Dados simulados de consumo e fatura
const dadosSimulados = {
  consumo: 250,  // Consumo de energia em kWh
  fatura: 150.75,  // Valor da fatura em R$
};

app.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
  });
  app.set('view engine', 'ejs');  // Usando EJS para renderizar HTML

// Servir o arquivo HTML do dashboard
app.get('/dashboard', (req, res) => {
  res.render('dashboard');  // O EJS irá procurar por 'dashboard.ejs' na pasta views
});

// Rota para fornecer dados simulados (você pode integrar com a API da Coelba aqui)
app.get('/dados', (req, res) => {
  const dados = {
    consumo: 150, // Exemplo de consumo
    valor: 120.50 // Exemplo de valor
  };
  
  // Retornar os dados como JSON
  res.json(dados);
});

// Rota para fornecer os dados de consumo e fatura
app.get('/api/consumo', (req, res) => {
  res.json(dadosSimulados);
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
