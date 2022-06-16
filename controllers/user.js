const models = require('./../models');
const crypto = require('crypto');
let session = require('express-session');
const passport = require('passport');
const sgMail = require('@sendgrid/mail')

exports.getUsers = function(req, res, next) {
    res.send('respond with a resource');
};

exports.getSignup = function(req, res, next) {
    res.render("users/signup");
  };

exports.postSignup = async function(req,res,next){
    let body = req.body;
  
    if(!body.userid){
      res.status(400).send(`<script>alert('내용을 모두 입력하세요');history.go(-1);</script>`);
      return;
    }
    
    let exUser = await models.Users.findOne({ // 아이디 중복여부 체크
      where:{
        id : body.userid
      }
    })
  
    if(exUser){
      res.status(500).send(`<script>alert('중복된 아이디입니다');history.go(-1);</script>`);
      return;
    }
  
    let inputPassword = body.password; // 비밀번호 암호화 저장 유저 정보가 저장된 salt 사용
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
  
    const userInfo = ({
      id : body.userid,
      name: body.username,
      password: hashPassword,
      email: body.email,
      salt: salt,
      isOwner: body.isOwner // 업주인지 아닌지 
    })
  
    models.Users.create(userInfo)
    .then( result => {
      req.session.user_id = body.userid;
      res.json({ status: 'success', data: result, message: '회원가입이 완료되었습니다!' });

    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: err.message || "Some error occurred while creating the Tutorial." });
    });
}


  exports.postCheckID = async function(req, res, next){
    let body = req.body;
  
    if(!body.userid){
      res.status(400).send({
        message : "Content can not be empty!"
      });
      return;
    }
    
    let exUser = await models.Users.findOne({ // 아이디 중복여부 체크
      where:{
        id : body.userid
      }
    })
  
    if (exUser) {
      res.send({
        code: "success",
        message: "중복된 아이디입니다!",
      });
      return;
    } else {
      res.send({
        code: "error",
        message: "사용 가능한 아이디입니다",
      });
      return;
    }
  }

  exports.getLogin = function(req, res, next) {
    let session = req.session;
  
      res.render("users/login", {
        session : session
    });
  };

  exports.postLogin = async function(req,res,next){
    let body = req.body;
  
    if(!body.userid){
      res.status(500).send(`<script>alert('아이디가 입력되지 않았습니다');history.go(-1);</script>`);
      return;
    }
  
    try { // 에러가 나도 무조건 실행
      let result = await models.Users.findOne({
        where: {
          id: body.userid,
        },
      });
    
      let dbPassword = result.dataValues.password;
      let inputPassword = body.password;
      let salt = result.dataValues.salt;
      let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    
      if (dbPassword === hashPassword) {
        console.log("비밀번호 일치");
        req.session.user_id = body.userid;
        res.send(`<script>alert('로그인 성공입니다!');window.location.href="/";</script>`);
      } else {
        res.status(500).send(`<script>alert('잘못된 비밀번호입니다');history.go(-1);</script>`);
        return;
      }
      
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

exports.getLogout = (req, res, next)=>{ // 로그아웃
    req.session.destroy();
    res.clearCookie('sid');
  
    res.redirect('/');
  }

exports.getFindID =  (req, res, next) =>{
  res.render('users/findID');
}

exports.getFindIDResult = (req, res, next) =>{
  res.render('users/findIDResult');
}

exports.postFindIDResult = async(req, res, next)=>{
  var uemail = req.body.email;

  try {
    const user = await models.Users.findOne({ where: { email: uemail }, raw: true }); // User 이외의 interface 값이 안들어오고 실제 데이터 값만 raw :true
    
    if (user) {
      res.render("users/findIDResult", {
        FindID: user.id,
      });

    } else {
      console.log("cannot findID");
      res.send(`
      <a href='/users/findID'>Back</a>
      <h2>찾을 수 없는 아이디입니다!</h2>`);
    }
  } catch (error) {
    console.log(`findIdResult Error -> ${error}`);
      res.send(`
      <a href='/users/findID'>Back</a>
      <h1>server error</h1>`);
  }
}

exports.getFindPassword = async(req, res, next)=>{
  res.render('users/findPassword');
};

exports.postFindPassword = async (req, res, next) => {
  const { userid } = req.body;
  try {
    const user = await models.Users.findOne({ // 유저가 존재하면 유저 정보를 가져옴
      where: { id: userid }, raw:true,
    });
    if (user) { // 유저가 있다면?
      const token = crypto.randomBytes(20).toString('hex'); // token 생성(인증코드)
      const data = {
        // 인증코드 테이블에 넣을 데이터 정리
        token,
        userid: user.id,
        ttl: 300, // ttl 값 설정 (5분) email 인증에 대한 유효시간
      };
      
      models.EmailAuth.create(data); // 인증 코드 테이블에 데이터 입력

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email, // Change to your recipient
        from: process.env.GOOGLE_ID, // Change to your verified sender
        subject: 'Password search authentication code transmission',
        text: 'This is the authentication code to find the password!',
        html:`<p>비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요.<p>` +
          `<a href='http://localhost:3000/users/changePassword?token=${token}'>비밀번호 새로 입력하기</a>`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error.body)
        })
            return res.render('users/speakChangePassword');
          } else {
            return res.status(403).send('This account does not exist');
          }

        } catch (e) {
          // try에서 result 결과값이 null일때 catch에서 에러로 잡지 않음 이유는?..
          res.send(e);
        }
      };

exports.getChangePassword = async(req, res, next)=>{
  res.render("users/changePassword", {
    Token: req.query.token,
  });
};

exports.postChangePassword = async(req, res, next)=>{
  var password = req.body.newpassword;
  var token = req.body.token;

  console.log(token);
  console.log(password);


  try {
    const emailAuth = await models.EmailAuth.findOne({ where: { token:token }, raw: true }); 
    
    if (emailAuth) {
      const savedDate = emailAuth.created_at;
      const now = new Date();
      const diff = now - savedDate;
      const diffMin = Math.floor(diff / 1000 / 60);
      if (diffMin > 5) {
        // 5분 초과
        res.send(`
          <script>alert('토큰이 만료되었습니다')</script>`);
        return;
      }
    
      const user = await models.Users.findOne({ where: { id: emailAuth.userid } }); // 실제 있는 유저인지 조회

    
      if (user.dataValues) {
        let inputPassword = password; // 비밀번호 암호화 저장 유저 정보가 저장된 salt 사용
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        
        await user.update({ // password 업데이트
          password: hashPassword,
          salt : salt,
        });
        res.send(`
            <script>alert('비밀번호가 변경 되었습니다'); window.location.href="/users/login"</script>`);
            
      } else {
        res.send(`
          <script>alert('일치하는 계정이 없습니다.')</script>`);
      }
    }
  } catch (error) {
    console.log(`findIdResult Error -> ${error}`);
      res.send(`
      <a href='/users/findID'>Back</a>
      <h1>server error</h1>`);
  }
};

