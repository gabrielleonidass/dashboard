const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer')

const app = express();
app.use(bodyParser.json());
app.use('/img', express.static(path.join(__dirname, 'img')));


// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
<<<<<<< HEAD
    password: 'cimatec',
=======
    password: '3571',
>>>>>>> 3ca792db081b7e64b7bdb0b1443dc37a5d0b6b40
    database: 'banco'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// configuração da sessão
app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'img')); 
  },
  filename: (req, file, cb) => {
      const userId = req.session.user.id;
      const ext = path.extname(file.originalname);
      cb(null, `profile_${userId}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true);
      }
      cb(new Error('Apenas imagens são permitidas!'));
  }
});

// middleware para verificar autenticação em rotas protegidas
function verificarAutenticacao(req, res, next) {
if (!req.session.user) {
  return res.status(401).json({ message: 'Usuário não autenticado' });
} else{
  next(); // usuário autenticado, segue para a rota
}
};

app.get('/', (req, res) => {
<<<<<<< HEAD
  res.sendFile(path.join(__dirname, 'scream1.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html')); 
=======
  res.sendFile(path.join(__dirname, 'login.html'));
>>>>>>> 3ca792db081b7e64b7bdb0b1443dc37a5d0b6b40
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

app.get('/conversion.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'conversion.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
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

          req.session.user = {
              id: result.insertId, // ID do usuário gerado automaticamente
              nome: nome,
              email: email
          };

          res.status(201).json({
              message: 'Usuário cadastrado com sucesso!',
              user: req.session.user

          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro no servidor.' });
  }
});


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

          req.session.user = {
          id: user.id,
          nome: user.nome,
          email: user.email
      };

      res.status(200).json({
          message: 'Login bem-sucedido!',
          user: req.session.user
      });
      console.log('Usuário logado:', req.session.user);
  });
});

app.get('/getUserData', verificarAutenticacao, (req, res) => {
  const usuarioId = req.session.user.id;

  const query = 'SELECT nome, email, senha, profilePic FROM usuario WHERE id = ?';
  db.query(query, [usuarioId], (err, results) => {
    if (err) {
        return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
    }
    if (results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(results[0]);
});
});

app.get('/user', verificarAutenticacao, (req, res) => {
  const userId = req.session.user.id;

  const query = 'SELECT nome, email, senha, profilePic FROM usuario WHERE id = ?';
  db.query(query, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const user = results[0];
      user.profilePic = user.profilePic || 'default.jpg';
      res.json(user);
  });
});

app.post('/upload-profile-image', verificarAutenticacao, upload.single('profilePic'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
  }

  try {
      const userId = req.session.user.id;
      const imagePath = req.file.filename;

      const query = 'UPDATE usuario SET profilePic = ? WHERE id = ?';
      db.query(query, [imagePath, userId], (err) => {
          if (err) {
              console.error('Erro ao atualizar foto de perfil no banco:', err);
              return res.status(500).json({ message: 'Erro ao atualizar foto' });
          }
          res.json({
              message: 'Imagem atualizada com sucesso!',
              filename: imagePath
          });
      });
  } catch (error) {
      console.error('Erro no upload de imagem:', error);
      res.status(500).json({ message: 'Erro no upload de imagem' });
  }
});

app.post('/atualizarPerfil', verificarAutenticacao, async (req, res) => {
  const { nome, email, senha } = req.body;
  const userId = req.session.user.id;

  const hashedPassword = await bcrypt.hash(senha, 10);
   const query = 'UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?';
  db.query(query, [nome, email, senha, userId], (err) => {
      if (err) {
          console.error('Erro ao atualizar perfil:', err);
          return res.status(500).json({ message: 'Erro ao atualizar perfil' });
      }
      res.json({ message: 'Perfil atualizado com sucesso!' });
  });
});

app.post('/atualizarSenha', verificarAutenticacao, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  if (!novaSenha) {
      return res.status(400).json({ message: 'Nova senha não fornecida.' });
  }

  const userId = req.session.user.id;

  const query = 'SELECT senha FROM usuario WHERE id = ?';
  db.query(query, [userId], async (err, results) => {
      if (err) {
          console.error('Erro ao buscar senha atual:', err);
          return res.status(500).json({ message: 'Erro ao verificar senha atual.' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const senhaHash = results[0].senha;

      // Comparar senha atual
      const senhaCorreta = await bcrypt.compare(senhaAtual, senhaHash);
      if (!senhaCorreta) {
          return res.status(401).json({ message: 'Senha atual incorreta.' });
      }

      try {
          // Gerar hash da nova senha
          const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
          const updateQuery = 'UPDATE usuario SET senha = ? WHERE id = ?';

          db.query(updateQuery, [novaSenhaHash, userId], (err) => {
              if (err) {
                  console.error('Erro ao atualizar senha:', err);
                  return res.status(500).json({ message: 'Erro ao atualizar senha.' });
              }

              res.status(200).json({ message: 'Senha atualizada com sucesso!' });
          });
      } catch (error) {
          console.error('Erro ao hash a nova senha:', error);
          res.status(500).json({ message: 'Erro ao processar a nova senha.' });
      }
  });
});

// rota de logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao encerrar sessão.' });
      }
      res.status(200).json({ message: 'Logout realizado com sucesso!' });
  });
});

async function atualizarSenha(email, novaSenha) {
  const hashedPassword = await bcrypt.hash(novaSenha, 10);
  const query = 'UPDATE usuarios SET senha = ? WHERE email = ?';
  await db.query(query, [hashedPassword, email]);
}

// Servidor rodando
<<<<<<< HEAD
const PORT = 2006;
=======
const PORT = 300;
>>>>>>> 3ca792db081b7e64b7bdb0b1443dc37a5d0b6b40
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
