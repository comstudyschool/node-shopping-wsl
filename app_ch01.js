const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql2');
const { Item } = require('./models');
const { Op } = require('sequelize');

const PORT = 3000;

// body-parser 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// mysql 접속 설정
const coonnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3307,
    database: 'shopping_mall'
});

// mysql DB와 연결
coonnection.connect((err) => {
    if(err) throw err;
    console.log(">>> MySQL 연동 성공!");
});

router.route("/").get( (req, res) => {
    res.end("<h1>Hello NodeJS Shopping mall</h1>");
});

router.route('/items').post( async(req, res)=>{
    const { name, price, description } = req.body;
    const item = await Item.create({ name, price, description });
    res.status(201).json(item);
});

router.route('/items').get(async (req, res)=>{
    const items = await Item.findAll();
    res.status(200).json(items);
});

router.route('/items/:id').get(async (req, res)=>{
    const item = await Item.findByPk(req.params.id);
    if(item)
        res.status(200).json(item);
    else 
    res.status(404).send('404 Error: 내용이 없습니다!');
});

app.get('/items/gte/:price', async (req, res) => {
    const items = await Item.findAll({
      where: {
        price: {
          [Op.gte]: req.params.price,  // 가격이 :price 이상인 상품 조회
        }
      }
    });
    res.status(200).json(items);
});

app.get('/items3', async (req, res) => {
    const items = await Item.findAll({
      order: [['price', 'DESC']],  // 가격 내림차순 정렬
      limit: 10,                   // 최대 10개까지 조회
    });
    res.status(200).json(items);
});

app.use("/", router);
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`>>> 서버 실행 중 http://localhost:${PORT}`);
});