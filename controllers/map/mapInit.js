require('dotenv').config();
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const { QueryTypes } = require('sequelize');
const request = require('request');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

exports.Initialize = async (req, res) => {
    try{

        // 접속한 유저의 마이플레이스 불러오기
        let myPlaces = await sequelize.query(`SELECT * FROM MyPlace WHERE UserId='${req.session.user_id}';`, { type: QueryTypes.SELECT });
        let myPlaceId = [];
        myPlaces.forEach(p => {
            myPlaceId.push(p.CompanyCompId);
        });

        if(req.session.user_id){
            res.render("main/index", {myPlaces : myPlaceId, apikey : process.env.KAKAO_JS_KEY, isLogin: 'true'});
        }else{
            res.render("main/index", {myPlaces : myPlaceId, apikey : process.env.KAKAO_JS_KEY, isLogin: 'false'});
        }

    }catch(err){
        res.status(500).send({
            message: err.message
        });
    }
};