require('dotenv').config();
const db = require("../../models/index");
const { Op } = require("sequelize");
const Company = db.company;
const CompanyRestaurantView = db.companyRestaurantView;
const CompanyCafeView = db.CompanyCafeView;
const CompanyHospitalView = db.companyHospitalView;
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
let holiday_date = [];

const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

let today = new Date(utc + (KR_TIME_DIFF));
const day = today.getDay();
const date = today.getDate();
let hour = today.getHours();
if(hour < 6){
    hour += 24;
}
let minute = today.getMinutes();
if(minute < 10){
    minute = '0' + minute;
}
let now = String(hour) + minute;

request({
    url: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${process.env.HOLIDAY_APIKEY}&solYear=${today.getFullYear()}&solMonth=0${today.getMonth()+1}&_type=json`,
    method: 'GET'
}, async function (error, response, body) {
    try{
        const result = JSON.parse(body).response.body.items.item;
        for(let i=0; i < result.length; i++){
            holiday_date.push(result[i].locdate%100);
        }
        console.log('holiday / ' + holiday_date);
    }catch(err){
        console.log('body / ' + body);
        console.log('Error: ', err.message);
    }
});

exports.getAllPositions = async (req, res) => {
    try{
        console.log('hour: ' + hour);
        if(day == 0){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { sun:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1},
                        { sun:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { sun:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    [Op.and]: [
                        { todayClosed:0},
                        { sun:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 1){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { mon:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { mon:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { mon:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { mon:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 2){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { tue:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { tue:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { tue:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { tue:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 3){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { wed:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { wed:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'HospOpenMon', 'HospCloseMon', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { wed:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { wed:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 4){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { thu:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { thu:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { thu:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { thu:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 5){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { fri:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { fri:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { fri:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { fri:0 },
                        { vacation:0 }
                    ]
                }
            });
        }else if(day == 6){
            todayClosedRestaurantPosition = await CompanyRestaurantView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { sat:1 },
                        { vacation:1 }
                    ],
                    type: 'R'
                }
            });
            todayClosedCafePosition = await CompanyCafeView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { sat:1 },
                        { vacation:1 }
                    ],
                    type: 'C'
                }
            });
            todayClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'todayClosed', 'earlyClosed', 'vacation', 'latitude', 'longitude', 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.or]: [
                        { todayClosed:1 },
                        { sat:1 },
                        { vacation:1 }
                    ],
                    type: 'H'
                }
            });
            todayOpened = await Company.findAll({
                attributes: ['compId'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    [Op.and]: [
                        { todayClosed:0 },
                        { sat:0 },
                        { vacation:0 }
                    ]
                }
            });
        };

        todayOpenedCompId = [];
        for(let i = 0; i < todayOpened.length; i++){
            todayOpenedCompId.push(todayOpened[i].compId);
        };

        earlyClosedRestaurantPosition = await CompanyRestaurantView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
            where:{
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                earlyClosed:1,
                type: 'R'
            }
        });
        earlyClosedCafePosition = await CompanyCafeView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
            where:{
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                earlyClosed:1,
                type: 'C'
            }
        });
        if(day == 0){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSun', 'hospitalOpen'], ['HospCloseSun', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 1){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenMon', 'hospitalOpen'], ['HospCloseMon', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 2){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenTue', 'hospitalOpen'], ['HospCloseTue', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 3){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenWed', 'hospitalOpen'], ['HospCloseWed', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 4){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenThu', 'hospitalOpen'], ['HospCloseThu', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 5){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenFri', 'hospitalOpen'], ['HospCloseFri', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }else if(day == 6){
            earlyClosedHospitalPosition = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSat', 'hospitalOpen'], ['HospCloseSat', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where:{
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    earlyClosed:1,
                    type: 'H'
                }
            });
        }

        openedRestaurant = await CompanyRestaurantView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
            where: {
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                compId:{
                    [Op.in]: [...todayOpenedCompId],
                },
                restOpen:{
                    [Op.lte]: parseInt(now)
                },
                restClosed:{
                    [Op.gt]: parseInt(now)
                }
            }
        });
        closedRestaurant = await CompanyRestaurantView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'restType', 'restOpen', 'restClosed', 'breakStart', 'breakEnd', 'latitude', 'longitude'],
            where: {
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                compId:{
                    [Op.in]: [...todayOpenedCompId],
                },
                [Op.or]: {
                    restOpen:{
                        [Op.gt]: parseInt(now)
                    },
                    restClosed:{
                        [Op.lte]: parseInt(now)
                    }
                }
            }
        });

        openedCafe = await CompanyCafeView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
            where: {
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                compId:{
                    [Op.in]: [...todayOpenedCompId]
                },
                cafeOpen:{
                    [Op.lte]: parseInt(now)
                },
                cafeClosed:{
                    [Op.gt]: parseInt(now)
                }
            }
        });

        closedCafe = await CompanyCafeView.findAll({
            attributes: ['compId', 'image', 'compName', 'address', 'tel', 'cafeOpen', 'cafeClosed', 'cafeType', 'latitude', 'longitude'],
            where: {
                latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                compId:{
                    [Op.in]: [...todayOpenedCompId],
                },
                [Op.or]: {
                    cafeOpen:{
                        [Op.gt]: parseInt(now)
                    },
                    cafeClosed:{
                        [Op.lte]: parseInt(now)
                    }
                }
            }
        });

        if(holiday_date.includes(date)){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenVac', 'hospitalOpen'], ['HospCloseVac', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenSun:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseSun:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenVac', 'hospitalOpen'], ['HospCloseVac', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenSun:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseSun:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 0){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSun', 'hospitalOpen'], ['HospCloseSun', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenSun:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseSun:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSun', 'hospitalOpen'], ['HospCloseSun', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenSun:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseSun:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 1){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenMon', 'hospitalOpen'], ['HospCloseMon', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenMon:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseMon:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenMon', 'hospitalOpen'], ['HospCloseMon', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenMon:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseMon:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 2){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenTue', 'hospitalOpen'], ['HospCloseTue', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenTue:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseTue:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenTue', 'hospitalOpen'], ['HospCloseTue', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenTue:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseTue:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 3){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenWed', 'hospitalOpen'], ['HospCloseWed', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenWed:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseWed:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenWed', 'hospitalOpen'], ['HospCloseWed', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenWed:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseWed:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 4){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenThu', 'hospitalOpen'], ['HospCloseThu', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenThu:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseThu:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenThu', 'hospitalOpen'], ['HospCloseThu', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenThu:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseThu:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 5){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenFri', 'hospitalOpen'], ['HospCloseFri', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenFri:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseFri:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenFri', 'hospitalOpen'], ['HospCloseFri', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenFri:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseFri:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }else if(day == 6){
            openedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSat', 'hospitalOpen'], ['HospCloseSat', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId]
                    },
                    HospOpenSat:{
                        [Op.lte]: parseInt(now)
                    },
                    HospCloseSat:{
                        [Op.gt]: parseInt(now)
                    }
                }
            });
            closedHospital = await CompanyHospitalView.findAll({
                attributes: ['compId', 'image', 'compName', 'address', 'tel', 'HospType', 'content', 'latitude', 'longitude', ['HospOpenSat', 'hospitalOpen'], ['HospCloseSat', 'hospitalClosed'], 'breakStart', 'breakEnd'],
                where: {
                    latitude : {[Op.between]: [req.body.swLat, req.body.neLat]},
                    longitude : {[Op.between]: [req.body.swLng, req.body.neLng]},
                    compId:{
                        [Op.in]: [...todayOpenedCompId],
                    },
                    [Op.or]:{
                        HospOpenSat:{
                            [Op.gt]: parseInt(now)
                        },
                        HospCloseSat:{
                            [Op.lte]: parseInt(now)
                        }
                    }
                }
            });
        }

        let closedRestaurantPositionTotal = new Array(earlyClosedRestaurantPosition);
        closedRestaurantPositionTotal = [...closedRestaurant];
        let closedCafePositionTotal = new Array(earlyClosedCafePosition);
        closedCafePositionTotal = [...closedCafe];
        let closedHospitalPositionTotal = new Array(earlyClosedHospitalPosition);
        closedHospitalPositionTotal = [...closedHospital];

        for(let i=0; i < todayClosedRestaurantPosition.length; i++){
            todayClosedRestaurantPosition[i].dataValues.type = 'tcr';
            todayClosedRestaurantPosition[i].dataValues.isMyPlace = false;
            todayClosedRestaurantPosition[i].dataValues.image = todayClosedRestaurantPosition[i].dataValues.image ? todayClosedRestaurantPosition[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < todayClosedCafePosition.length; i++){
            todayClosedCafePosition[i].dataValues.type = 'tcc';
            todayClosedCafePosition[i].dataValues.isMyPlace = false;
            todayClosedCafePosition[i].dataValues.image = todayClosedCafePosition[i].dataValues.image ? todayClosedCafePosition[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < todayClosedHospitalPosition.length; i++){
            todayClosedHospitalPosition[i].dataValues.type = 'tch';
            todayClosedHospitalPosition[i].dataValues.isMyPlace = false;
            todayClosedHospitalPosition[i].dataValues.image = todayClosedHospitalPosition[i].dataValues.image ? todayClosedHospitalPosition[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < openedRestaurant.length; i++){
            openedRestaurant[i].dataValues.type = 'or';
            openedRestaurant[i].dataValues.isMyPlace = false;
            openedRestaurant[i].dataValues.image = openedRestaurant[i].dataValues.image ? openedRestaurant[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < openedCafe.length; i++){
            openedCafe[i].dataValues.type = 'oc';
            openedCafe[i].dataValues.isMyPlace = false;
            openedCafe[i].dataValues.image = openedCafe[i].dataValues.image ? openedCafe[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < openedHospital.length; i++){
            openedHospital[i].dataValues.type = 'oh';
            openedHospital[i].dataValues.isMyPlace = false;
            openedHospital[i].dataValues.image = openedHospital[i].dataValues.image ? openedHospital[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < closedRestaurantPositionTotal.length; i++){
            closedRestaurantPositionTotal[i].dataValues.type = 'cr';
            closedRestaurantPositionTotal[i].dataValues.isMyPlace = false;
            closedRestaurantPositionTotal[i].dataValues.image = closedRestaurantPositionTotal[i].dataValues.image ? closedRestaurantPositionTotal[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < closedCafePositionTotal.length; i++){
            closedCafePositionTotal[i].dataValues.type = 'cc';
            closedCafePositionTotal[i].dataValues.isMyPlace = false;
            closedCafePositionTotal[i].dataValues.image = closedCafePositionTotal[i].dataValues.image ? closedCafePositionTotal[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        for(let i=0; i < closedHospitalPositionTotal.length; i++){
            closedHospitalPositionTotal[i].dataValues.type = 'ch';
            closedHospitalPositionTotal[i].dataValues.isMyPlace = false;
            closedHospitalPositionTotal[i].dataValues.image = closedHospitalPositionTotal[i].dataValues.image ? closedHospitalPositionTotal[i].dataValues.image.toString() : "/images/baseimg.jpg";
        }

        res.json({
            todayClosedRestaurant : todayClosedRestaurantPosition, todayClosedCafe :  todayClosedCafePosition, todayClosedHospital : todayClosedHospitalPosition , 
            openedRestaurant : openedRestaurant, openedCafe : openedCafe, openedHospital : openedHospital,
            closedRestaurantTotal : closedRestaurantPositionTotal, closedCafeTotal : closedCafePositionTotal, closedHospitalTotal : closedHospitalPositionTotal,
        });

    }catch(err){
        res.status(500).send({
            message: err.message
        });
    }
};