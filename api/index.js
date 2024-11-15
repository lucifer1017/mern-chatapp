const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const ws = require('ws');
dotenv.config();
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGO_URL);
const app = express();
app.use(express.json());
const User = require('./models/User')
const cors = require('cors');
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                    id: foundUser?._id,
                })
            })
        }
    }
})
app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData)
        })
    }
    else {
        res.status(401).json('no token');
    }

})

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username
            , password: hashedPassword
        });
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
                username,
            });
        })
    } catch (error) {
        if (error)
            throw error;
        res.status(500).json('error');

    }
})

const server = app.listen(8000);

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, req) => {
    const cookies = req.headers.cookie;

    if (cookies) {

        const tokenCookieString = cookies.split(';').find(str => str.startsWith(' token='));

        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];

            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err)
                        throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;


                })

            }
            else {
                res.status(401).json('no token');
            }
        }
    }
    connection.on('message', (message, isBinary) => {
        messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(JSON.stringify({
                    text,
                    sender: connection.userId,
                }))
        }
    });

    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            { online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username })) }
        ))
    })


})