const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql2');
const { Item } = require('./models');
const { Op } = require('sequelize');

const PORT = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');

// 사용자 정의 캐싱 미들웨어 설정
app.use( (req, res, next)=> {
	res.set('Cashe-Control', 'public, max-age=300');
});

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
    const dataObj = {
        message: 'Hello EJS Templage',
        title: '컴스터디 쇼핑몰'
    }
    res.render('index', dataObj);
});
// 데이터 저장
router.route('/items').post( async(req, res)=>{
    const { name, price, description } = req.body;
    const item = await Item.create({ name, price, description });
    //res.status(201).json(item);
    res.redirect('/items');
});
// 목록 출력
router.route('/items').get(async (req, res)=>{
    const items = await Item.findAll();
    //res.status(200).json(items);
    // 테스트용 임시 데이터 준비
    const itemList = [
        {
          "id": 1,
          "name": "그랜저",
          "price": 2300,
          "description": "2019년식 그랜저"
        },
        {
          "id": 2,
          "name": "소나타",
          "price": 2000,
          "description": "2018년식 소나타"
        },
        ,
        {
          "id": 3,
          "name": "아반떼",
          "price": 1000,
          "description": "2018년식 소나타"
        }
    ];
    res.render('item_list', {items: itemList});
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