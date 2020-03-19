const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.get('/api/customers', (req,res) => {
    connection.query(
        "SELECT * FROM CUSTOMER",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});
//1. client가 '/api/customers'에 접속하면 고객정보를 담고있는 배열 데이터를 json으로 받을수있도록 해야됨
//  (json데이터를 받아와서 화면에 출력할수있도록 해야됨)
//2. 먼저 server에서 보낼 정보가 Json형식이랑 맞는지 jsonlint에서 saurce찍어서 확인
//3. react에서 해당 api접속해서 데이터 가져오기
//  (client의 json파일에 proxy설정. react에선 3000포트로 가지만 proxy를 5000번 설정했기땜에 5000포트에 접근해서 데이터 받아옴)
//4. react에가서 만들어진 api서버에 접근할수있도록 처리

app.listen(port, ()=> console.log(`Listening on port ${port}`));