const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('./../../models');
const models = require('./../../models/index');
const db = require("../../models/index");

const crypto = require('crypto');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, `${Date.now()}-${file.originalname}`);
  }
})
var upload = multer({ storage: _storage });
const request = require('request');


exports.showMyplaceList = async(req, res) => {
    let userid = req.session.user_id;
   
    if(!userid){
      res.redirect("/users/login");
    }

    myCafe = await sequelize.query(`SELECT * FROM company C JOIN cafe CA ON C.type = 'C' where C.compId in (SELECT CompanyCompId FROM myplace where UserId = '${userid}') AND CA.CompanyCompId = C.compId`, { type: QueryTypes.SELECT });
    myHosp = await sequelize.query(`SELECT * FROM company C JOIN hospital H ON C.type = 'H' where C.compId in (SELECT CompanyCompId FROM myplace where UserId = '${userid}') AND H.CompanyCompId = C.compId`, { type: QueryTypes.SELECT });
    myRest = await sequelize.query(`SELECT * FROM company C JOIN restaurant R ON C.type = 'R' where C.compId in (SELECT CompanyCompId FROM myplace where UserId = '${userid}') AND R.CompanyCompId = C.compId`, { type: QueryTypes.SELECT });
  
    let now = moment().tz("Asia/Seoul").format('Hmm') * 1;
    let today = moment().tz("Asia/Seoul").format('ddd').toLowerCase();

    myCafe.forEach(c => {
    
      if(c[today] || c.todayClosed || c.earlyClosed || c.vacation){
        c['status'] = "오늘휴무";
      } else if((now > c.cafeOpen && now < c.cafeClosed) || 
      (c.cafeClosed >=2400 && now+2400 > c.cafeOpen && now+2400 < c.cafeClosed)){
        c['status'] = '영업중'
      }
      else{
        c['status'] = "영업종료";
      }

      if(c.cafeClosed == 4000){
        c.cafeClosed = 2359;
      }
      if(c.cafeClosed >= 2400){
        c.cafeClosed -= 2400;
      }
      if(c.cafeOpen == 0){
        c.cafeOpen ='000';
      }
      if(c.cafeClosed == 0){
        c.cafeClosed ='000';
      }

      c.cafeOpen = moment(`${c.cafeOpen}`,"Hmm").format('H:mm');
      c.cafeClosed = moment(`${c.cafeClosed}`, "Hmm").format('H:mm');

      c.image = c.image ? c.image : "/images/baseimg.jpg";
    });
  
    myRest.forEach(c => {

      if(c[today] || c.todayClosed || c.earlyClosed || c.vacation){
        c['status'] = "오늘휴무";
      } else if(c.breakStart && now >= c.breakStart && now <= c.breakEnd){
        c['status'] = "휴게시간";
      } else if((now > c.restOpen && now < c.restClosed) || 
      (c.restClosed >=2400 && now+2400 > c.restOpen && now+2400 < c.restClosed)){
        c['status'] = "영업중";
      }
      else{
        c['status'] = "영업종료";
      }

      if(c.restClosed == 4000){
        c.restClosed = 2359;
      }
      if(c.restClosed >= 2400){
        c.restClosed -= 2400;
      }
      if(c.restOpen == 0){
        c.restOpen ='000';
      }
      if(c.restClosed == 0){
        c.restClosed ='000';
      }

      c.restOpen = moment(`${c.restOpen}`,"Hmm").format('H:mm');
      c.restClosed = moment(`${c.restClosed}`, "Hmm").format('H:mm');

      c.image = c.image ? c.image : "/images/baseimg.jpg";
      
    });
  
    let holiday_date = [];

    const a = function(){
      return new Promise(function (resolve, reject) {
        request({
          url: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${process.env.HOLIDAY_APIKEY}&solYear=${moment().year()}&solMonth=0${moment().month()+1}&_type=json`,
          method: 'GET'
        }, function (error, response, body) {
          try{
            //console.log(body);
            //resolve(body);
            resolve(JSON.parse(body).response.body.items.item);
          }
          catch(error){console.log(error)}
        });
      });
    }
    //var rawHoliday = await a();
    //const result = JSON.parse(rawHoliday).response.body.items.item;
    const result = await a();
    //console.log(result);
    for(let i=0; i < result.length; i++){
      holiday_date.push(result[i].locdate);
    }
    let todayFor_HolidayCheck = moment().tz("Asia/Seoul").format('YYYYMMDD');
    let isHoliday = holiday_date.includes(`${todayFor_HolidayCheck}`*1);

    today2 = moment().tz("Asia/Seoul").format('ddd');
    
    myHosp.forEach(c => {

      let HospOpen;
      let HospClosed;
      if(isHoliday){
        HospOpen = c[`HospOpenVac`];
        HospClosed = c[`HospCloseVac`];
      }else{
        HospOpen = c[`HospOpen${today2}`];
        HospClosed = c[`HospClose${today2}`];
      }
      

      if(c[today] || c.todayClosed || c.earlyClosed || c.vacation){
        c['status'] = "오늘휴무";
      } else if(c.breakStart && now >= c.breakStart && now <= c.breakEnd){
        c['status'] = "휴게시간";
      } else if((now > HospOpen && now < HospClosed) || 
      (HospClosed >=2400 && now+2400 > HospOpen && now+2400 < HospClosed)){
        c['status'] = "영업중";
      }
      else{
        c['status'] = "영업종료";
      }

      if(HospClosed == 4000){
        HospClosed = 2359;
      }
      if(HospClosed >= 2400){
        HospClosed -= 2400;
      }
      if(HospOpen == 0){
        HospOpen ='000';
      }
      if(HospClosed == 0){
        HospClosed ='000';
      }

      c['hospOpen'] = moment(`${HospOpen}`,"Hmm").format('H:mm');
      c['hospClosed'] = moment(`${HospClosed}`,"Hmm").format('H:mm');

      c.image = c.image ? c.image : "/images/baseimg.jpg";

    });
    res.render('mypage/MyPlaceList', {cafe:myCafe, hosp:myHosp, rest:myRest});
}


exports.deleteMyPlace = async(req, res) => {
  let compId = req.body.comp_id;
  await sequelize.query(`DELETE FROM myplace WHERE CompanyCompId = '${compId}'`, { type: QueryTypes.DELETE });
  res.redirect('/mypage/favorite');
}


exports.showMypage = async(req, res) => {
  let userid = req.session.user_id;
  if(!userid){
    res.redirect("/users/login");
  }
  else{
    let isOwner =  {isOwner:undefined}
    isOwner = await models.Users.findOne({
      attributes: ['isOwner'],
      where:{
        id:userid
      }
    });
    let myComp=[];
    if(Boolean(isOwner.isOwner)){
      myComp = await sequelize.query(`SELECT * FROM company where userId = '${userid}'`, { type: QueryTypes.SELECT });
      myComp.forEach(c =>{
        c.image = c.image ? c.image : "/images/baseimg.jpg";
      });
    }
    res.render('mypage/MyPage',{user:userid, myComp:myComp, isOwner:isOwner.isOwner});
  }

}

exports.configcomp = async(req, res) => {
  if(req.body.comp_type == 'C'){
    let compId = req.body.comp_id;

    myCafe = await sequelize.query(`SELECT * FROM company C JOIN cafe CA ON C.compid = CA.CompanyCompId WHERE C.compid=${compId}`, { type: QueryTypes.SELECT });
    myCafe = myCafe[0];

    if(myCafe.cafeClosed == 4000){
      myCafe.cafeClosed = 2359;
    }
    if(myCafe.cafeClosed >= 2400){
      myCafe.cafeClosed -= 2400;
    }
    if(myCafe.cafeOpen == 0){
      myCafe.cafeOpen ='000';
    }
    if(myCafe.cafeClosed == 0){
      myCafe.cafeClosed ='000';
    }
    myCafe.cafeOpen = moment(`${myCafe.cafeOpen}`,"Hmm").format('HH:mm');
    myCafe.cafeClosed = moment(`${myCafe.cafeClosed}`,"Hmm").format('HH:mm');
    
    menu = await sequelize.query(`SELECT * FROM menu WHERE CompanyCompId = '${compId}'`, { type: QueryTypes.SELECT });
    res.render('mypage/configCafe',{myCafe:myCafe, menu:menu});

  } else if(req.body.comp_type == "R") {
    let compId = req.body.comp_id;

    myRest = await sequelize.query(`SELECT * FROM company C JOIN restaurant R ON C.compid = R.CompanyCompId WHERE C.compid=${compId}`, { type: QueryTypes.SELECT });
    myRest = myRest[0];

    if(myRest.restClosed == 4000){
      myRest.restClosed = 2359;
    }
    if(myRest.restClosed >= 2400){
      myRest.restClosed -= 2400;
    }
    if(myRest.restOpen == 0){
      myRest.restOpen ='000';
    }
    if(myRest.restClosed == 0){
      myRest.restClosed ='000';
    }
    myRest.restOpen = moment(`${myRest.restOpen}`,"Hmm").format('HH:mm');
    myRest.restClosed = moment(`${myRest.restClosed}`,"Hmm").format('HH:mm');

    if(myRest.breakStart){
      myRest.breakStart = moment(`${myRest.breakStart}`,"Hmm").format('HH:mm');
      myRest.breakEnd = moment(`${myRest.breakEnd}`,"Hmm").format('HH:mm');
    }
    
    menu = await sequelize.query(`SELECT * FROM menu WHERE CompanyCompId = '${compId}'`, { type: QueryTypes.SELECT });
    res.render('mypage/configRest',{myRest:myRest, menu:menu});
    
  } else if(req.body.comp_type == "H") {
    let compId = req.body.comp_id;
    myHosp = await sequelize.query(`SELECT * FROM company C JOIN hospital H ON C.compid = H.CompanyCompId WHERE C.compid=${compId}`, { type: QueryTypes.SELECT });
    myHosp = myHosp[0];
    
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Vac'];
    days.forEach(d => {
      
      if(myHosp[`HospClosed${d}`] == 4000){
        myHosp[`HospClosed${d}`] = 2359;
      }
      if(myHosp[`HospOpen${d}`] == 0){
        myHosp[`HospOpen${d}`] ='000';
      }
      if(myHosp[`HospClosed${d}`] == 0){
        myHosp[`HospClosed${d}`] ='000';
      }
      myHosp[`HospOpen${d}`] = moment(myHosp[`HospOpen${d}`],"Hmm").format('HH:mm');
      myHosp[`HospClose${d}`] = moment(myHosp[`HospClose${d}`],"Hmm").format('HH:mm');
    });
    if(myHosp.breakStart){
      myHosp.breakStart = moment(`${myHosp.breakStart}`,"Hmm").format('HH:mm');
      myHosp.breakEnd = moment(`${myHosp.breakEnd}`,"Hmm").format('HH:mm');
    }
    res.render('mypage/configHosp',{myHosp:myHosp});
  }
}

exports.configCafe = async(req, res) => {
  let compId = req.body.comp_id;
  let imagepath;
  
    if(req.file){
      imagepath = `/${req.file.filename}`;
    }
    else{
      imagepath = null;
    }
  
    await models.company.update(
      {
        tel:req.body.telNum,
        image:imagepath,
        todayClosed:Boolean(req.body.todayClosed),
        earlyClosed:Boolean(req.body.earlyClosed),
        vacation:Boolean(req.body.vacation),
        mon:Boolean(req.body.mon),
        tue:Boolean(req.body.tue),
        wed:Boolean(req.body.wed),
        thu:Boolean(req.body.thu),
        fri:Boolean(req.body.fri),
        sat:Boolean(req.body.sat),
        sun:Boolean(req.body.sun)
      },
      {where: {
        compId:compId
      }}
    );
  
    let open;
    let closed;
    if(Boolean(req.body._24hours)){
      open = 0;
      closed = 4000;
    }else if(Boolean(req.body.tomorrow)){
      closed = `${req.body.closedTime}`.replaceAll(":","") *1 + 2400;
      open = `${req.body.openTime}`.replaceAll(":","");
    }else{
      open = `${req.body.openTime}`.replaceAll(":","");
      closed = `${req.body.closedTime}`.replaceAll(":","");
    }

    await models.cafe.update(
      {
        cafeType:req.body.cafeType,
        cafeOpen:open,
        cafeClosed:closed
      },
      {where:{
        CompanyCompId:compId
      }}
    );
  
    await sequelize.query(`DELETE FROM menu WHERE CompanyCompId = '${compId}'`, { type: QueryTypes.DELETE });
    
 
    if(req.body.menu && !(typeof(req.body.menu)=='string')){
      let menu = Object.values(req.body.menu);
      let price = Object.values(req.body.price);
      var menuAndPrice = menu.map(function(menu, i) {
        return [menu, price[i]];
      });
  
      for await (const e of menuAndPrice){
        if(e[0]=="" || e[1]==""){continue;}
        await models.menu.create({
          menuName:e[0],
          price:e[1],
          CompanyCompId:compId
        });
      }
      
    }else{
      if(req.body.menu){
        await models.Menu.create({
          menuName:req.body.menu,
          price:req.body.price,
          CompanyCompId:compId
        });
      }
    }

    res.redirect('/mypage');
}

exports.configRest = async(req, res) => {
  
  let compId = req.body.comp_id;
  let imagepath;

  if(req.file){
    imagepath = `/${req.file.filename}`;
  }
  else{
    imagepath = null;
  }
  await models.company.update(
    {
      tel:req.body.telNum,
      image:imagepath,
      todayClosed:Boolean(req.body.todayClosed),
      earlyClosed:Boolean(req.body.earlyClosed),
      vacation:Boolean(req.body.vacation),
      mon:Boolean(req.body.mon),
      tue:Boolean(req.body.tue),
      wed:Boolean(req.body.wed),
      thu:Boolean(req.body.thu),
      fri:Boolean(req.body.fri),
      sat:Boolean(req.body.sat),
      sun:Boolean(req.body.sun)
    },
    {where: {
      compId:compId
    }}
  );
  
  let open;
  let closed;
  if(Boolean(req.body._24hours)){
    open = 0;
    closed = 4000;
  }else if(Boolean(req.body.tomorrow)){
    closed = `${req.body.closedTime}`.replaceAll(":","") *1 + 2400;
    open = `${req.body.openTime}`.replaceAll(":","");
  }else{
    open = `${req.body.openTime}`.replaceAll(":","");
    closed = `${req.body.closedTime}`.replaceAll(":","");
  }

  let breakStart = req.body.breakStart;
  if(Boolean(req.body.noBreak)){
    breakStart = null;
  }else{
    breakStart = `${req.body.breakStart}`.replaceAll(":","");
  }

  let breakEnd = req.body.breakEnd;
  if(Boolean(req.body.noBreak)){
    breakEnd = null;
  }else{
    breakEnd = `${req.body.breakEnd}`.replaceAll(":","");
  }
  
  await models.restaurant.update(
    {
      restType:req.body.restType,
      restOpen:open,
      restClosed:closed,
      breakStart:(breakStart ? breakStart : null) ,
      breakEnd:(breakEnd ? breakEnd : null)
    },
    {where:{
      CompanyCompId:compId
    }}
  );
  
  await sequelize.query(`DELETE FROM menu WHERE CompanyCompId = '${compId}'`, { type: QueryTypes.DELETE });

  if(req.body.menu && !(typeof(req.body.menu)=='string')){
    let menu = Object.values(req.body.menu);
    let price = Object.values(req.body.price);
    var menuAndPrice = menu.map(function(menu, i) {
      return [menu, price[i]];
    });

    for await (const e of menuAndPrice){
      if(e[0]=="" || e[1]==""){continue;}
      await models.menu.create({
        menuName:e[0],
        price:e[1],
        CompanyCompId:compId
      });
    }
    
  }else if(typeof(req.body.menu) == "string"){
    await models.menu.create({
      menuName:req.body.menu,
      price:req.body.price,
      CompanyCompId:compId
    });
    
  }
  res.redirect('/mypage');
}

exports.configHosp = async(req, res) => {
  let compId = req.body.comp_id;
  let imagepath;

  if(req.file){
    imagepath = `/${req.file.filename}`;
  }
  else{
    imagepath = null;
  }

  await models.company.update(
    {
      tel:req.body.telNum,
      image:imagepath,
      todayClosed:Boolean(req.body.todayClosed),
      earlyClosed:Boolean(req.body.earlyClosed),
      vacation:Boolean(req.body.vacation),
      mon:Boolean(req.body.mon),
      tue:Boolean(req.body.tue),
      wed:Boolean(req.body.wed),
      thu:Boolean(req.body.thu),
      fri:Boolean(req.body.fri),
      sat:Boolean(req.body.sat),
      sun:Boolean(req.body.sun)
    },
    {where: {
      compId:compId
    }}
  );

  let breakStart;
  if(Boolean(req.body.noBreak)){
    breakStart = null;
  }else{
    breakStart = `${req.body.breakStart}`.replaceAll(":","");
  }

  let breakEnd;
  if(Boolean(req.body.noBreak)){
    breakEnd = null;
  }else{
    breakEnd = `${req.body.breakEnd}`.replaceAll(":","");
  }

  let daysOpen = {Mon:null, Tue:null, Wed:null, Thu:null, Fri:null, Sat:null, Sun:null, Vac:null};
  let daysClosed = {Mon:null, Tue:null, Wed:null, Thu:null, Fri:null, Sat:null, Sun:null, Vac:null};

  if(Boolean(req.body._24hours)){
    Object.keys(daysOpen).forEach(e => {daysOpen[e] = 0});
    Object.keys(daysClosed).forEach(e => {daysClosed[e] = 4000});
  }else{
    Object.keys(daysClosed).forEach(e => {daysOpen[e] = `${req.body[`open${e}`]}`.replaceAll(":","")});
    Object.keys(daysClosed).forEach(e => {daysClosed[e] = `${req.body[`closed${e}`]}`.replaceAll(":","")});
  }

  await models.hospital.update(
    {
      HospType:req.body.HospType,
      content:req.body.content,
      
      HospOpenMon:daysOpen['Mon'],
      HospCloseMon:daysClosed['Mon'],

      HospOpenTue:daysOpen['Tue'],
      HospCloseTue:daysClosed['Tue'],

      HospOpenWed:daysOpen['Wed'],
      HospCloseWed:daysClosed['Wed'],

      HospOpenThu:daysOpen['Thu'],
      HospCloseThu:daysClosed['Thu'],

      HospOpenFri:daysOpen['Fri'],
      HospCloseFri:daysClosed['Fri'],

      HospOpenSat:daysOpen['Sat'],
      HospCloseSat:daysClosed['Sat'],

      HospOpenSun:daysOpen['Sun'],
      HospCloseSun:daysClosed['Sun'],

      HospOpenVac:daysOpen['Vac'],
      HospCloseVac:daysClosed['Vac'],
     
      breakStart:(breakStart ? breakStart : null) ,
      breakEnd:(breakEnd ? breakEnd : null)
    },
    {where:{
      CompanyCompId:compId
    }}
  );
  res.redirect('/mypage');
}

exports.settingEmail = async(req, res) => {
  let userid = req.session.user_id;
  if(!userid){
    res.redirect("/users/login");
  }
  
  let result = await models.Users.findOne({
    where:{
      id:userid
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = req.body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
    res.render('mypage/settingEmail2',{oldEmail:result.dataValues.email});
  }
  else{
      res.render('mypage/settingEmail');
    
  }
}

exports.settingEmail2 = async(req, res) => {
  let userid = req.session.user_id;
  if(!userid){
    res.redirect("/users/login");
  }
  
  let exEmail = await models.Users.findOne({
    where:{
      email : req.body.new_email
    }
  });

  if(exEmail){
    res.status(500).send(`<script>alert('이미 가입되어있는 이메일입니다.');history.go(-1);</script>`);
    return;
  } else {
    await sequelize.query(`UPDATE users SET email = ? WHERE id = '${userid}'`, {replacements:[`${req.body.new_email}`], type: QueryTypes.UPDATE });
    res.redirect('/mypage');
  }
}

exports.leave_confirmPwd = async(req, res) => {
  let userid = req.session.user_id;
  if(!userid){
    res.redirect("/users/login");
  }
  
  let result = await models.Users.findOne({
    where:{
      id:userid
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = req.body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
    res.render('mypage/leaveMember2',{oldEmail:result.dataValues.email});
  }
  else{
      res.render('mypage/leaveMember');
    
  }

}
exports.leave_thanks = async(req, res) => {
  let userid = req.session.user_id;
  if(!userid){
    res.redirect("/users/login");
  }

  try {
    await sequelize.query(`DELETE FROM users WHERE id = '${userid}'`, { type: QueryTypes.DELETE });
  } catch (e) {
    res.send(e);
  }
  req.session.destroy();
  res.clearCookie('sid');

  res.render('mypage/leaveMemberConfirm');
}

exports.delete_comp = async(req,res) => {
  let compId = req.body.comp_id;
  await sequelize.query(`DELETE FROM company WHERE compId = '${compId}'`, { type: QueryTypes.DELETE });
  res.redirect('/mypage');
}