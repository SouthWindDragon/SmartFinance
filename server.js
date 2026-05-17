
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('smartfinance.db');

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        description TEXT,
        amount REAL
    )`);

});

app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hash],
        function(err) {

            if(err){
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            res.json({ message: 'Cadastro realizado com sucesso' });

        }
    );

});

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, user) => {

            if(!user){
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const valid = await bcrypt.compare(password, user.password);

            if(!valid){
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            res.json({
                message: 'Login realizado',
                user: user.name
            });

        }
    );

});

app.post('/transaction', (req, res) => {

    const { type, description, amount } = req.body;

    db.run(
        'INSERT INTO transactions (type, description, amount) VALUES (?, ?, ?)',
        [type, description, amount],
        function(err){

            if(err){
                return res.status(500).json({ error: 'Erro ao salvar transação' });
            }

            res.json({ message: 'Transação adicionada' });

        }
    );

});

app.get('/transactions', (req, res) => {

    db.all('SELECT * FROM transactions ORDER BY id DESC', [], (err, rows) => {

        res.json(rows);

    });

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
