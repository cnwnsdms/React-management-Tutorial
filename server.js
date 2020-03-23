const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
// 가지고 있는 데이터를 내가 원하는 형태의 데이터로 ‘가공'하는 과정을 parsing(req.body 사용가능)
app.use(bodyParser.urlencoded({extended: true}));


/////////////////////////////////////////////////////////////
                    // Databse 연동 //
////////////////////////////////////////////////////////////

const data = fs.readFileSync('./database.json');
// fs 모듈안에있는 기능. file을 읽어오는 기능. database.json에는 json형태로 mysql정보가 담김
const conf = JSON.parse(data);
// json형식의 문자열을 객체로 변환
const mysql = require('mysql');
// npm install mysql 후에 가능함

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const multer = require('multer');
const upload = multer({dest: './upload'})
// 이 서버에 기본 root폴더에있는 업로드 폴더를 사용자의 파일이 업로드가 되는 공간으로 설정

app.get('/api/customers', (req,res) => {
    connection.query(
        "SELECT * FROM CUSTOMER WHERE isDeleted = 0",//WHERE은 없었지만 삭제되지않은것만 보여주기위해 추가함
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

app.use('/image', express.static('./upload'));
// upload란 이름의 folder를 사용자가 실제로 접근해서 프로필이미지를 확인할수있도록 하기위해 express.static사용하여 upload파일 공유하도록 함
// 사용자는 '/image' 경로로 접근하지만 실제로는 server의 ./upload로 가게됨
app.post('/api/customers', upload.single('image'), (req, res) =>{
    // 'image'는 form을 통해 전송되는 파일의 name속성
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let image = '/image/' + req.file.filename; //filename=destination에 저장된 파일명. multer에 의해 설정됨
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    //Multer는 body 객체와 한 개의 file 혹은 여러개의 files 객체를 request 객체에 추가함.
    console.log(req.body,'this is req.body')
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields)=>{
            res.send(rows);
        }
    );
})
// server가 client에게 /api/customers 경로로 정보를 post로 받아오면 처리

app.delete('/api/customers/:id', (req, res)=>{
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});
//CustomerDeleted 에서 deleteCustomer라는 함수가 실행되면 DELETE method로 정보 보내기로 함

app.listen(port, ()=> console.log(`Listening on port ${port}`));