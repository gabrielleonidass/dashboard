const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3571',
    database: 'banco'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/renewables.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'renewables.html'));
});

app.get('/tips.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'tips.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/comunity.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'comunity.html'));
});

app.post('/posts', (req, res) => {
  const { user_id, content } = req.body;
  const query = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
  db.query(query, [user_id, content], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar postagem', error: err });
    }
    res.status(201).json({ message: 'Postagem criada com sucesso!', postId: result.insertId });
  });
});

// Rota para curtir uma postagem
app.post('/likes', (req, res) => {
  const { user_id, post_id } = req.body;
  const query = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
  db.query(query, [user_id, post_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao curtir postagem', error: err });
    }
    res.status(200).json({ message: 'Postagem curtida com sucesso!' });
  });
});

// Rota para comentar em uma postagem
app.post('/comments', (req, res) => {
  const { user_id, post_id, comment } = req.body;
  const query = 'INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)';
  db.query(query, [user_id, post_id, comment], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao comentar na postagem', error: err });
    }
    res.status(200).json({ message: 'Comentário publicado com sucesso!' });
  });
});

// Rota para buscar postagens
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar postagens', error: err });
    }
    res.status(200).json(results);
  });
});

app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
        db.query(query, [nome, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
            }
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuario WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida.' });
        }

        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    });
});

// Servidor rodando
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
