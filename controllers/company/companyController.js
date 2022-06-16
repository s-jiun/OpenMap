require("dotenv").config();
const db = require("../../models/index"),
    Company = db.company,
    User = db.users,
    Rest = db.restaurant,
    Cafe = db.cafe,
    Hosp = db.hospital,
    Menu = db.menu,
    Op = db.Sequelize.Op,
    geocoder = require("google-geocoder"),
    geo = geocoder({
        key: process.env.GOOGLE_API_KEY,
    });

var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

let compInfo = {
    compId: "",
    userId: null,
    image: null,
    compName: "", //not null
    bNo: null,
    openDate: null,
    address: "", //not null
    tel: null,
    todayClosed: 0,
    earlyClosed: 0,
    vacation: 0,
    latitude: "", //not null
    longitude: "", //not null
    type: "", //not null
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
};

let restInfo = {
    restOpen: "",
    restClosed: "",
};

let cafeInfo = {
    cafeOpen: "",
    cafeClosed: "",
    cafeType: "", //not null
};

let hospitalInfo = {
    HospOpenMon: "",
    HospCloseMon: "",

    HospOpenTue: "",
    HospCloseTue: "",

    HospOpenWed: "",
    HospCloseWed: "",

    HospOpenThu: "",
    HospCloseThu: "",

    HospOpenFri: "",
    HospCloseFri: "",

    HospOpenSat: "",
    HospCloseSat: "",

    HospOpenSun: "",
    HospCloseSun: "",

    HospOpenVac: "",
    HospCloseVac: "",

    HospType: "",

    content: "",

    breakStart: "",
    breakEnd: "",
};


// 업체등록 1 - 이미 존재하는지 확인
exports.checkExistComp = (req, res) => {
    if (!req.session.user_id) {
        res.redirect("/users/login");
    } else {
        res.render("compRegist/checkExistComp");
    }
};

// 업체 검색해서 데이터 불러오기
exports.searchExistComp = async (req, res, next) => {
    let searchWord = req.body.compName;
    Company.findAll({
        where: {
            compName: {
                [Op.like]: "%" + searchWord + "%",
            },
            UserId: null //업체에 userid가 등록되지 않은 것만 출력
        },
    })
        .then((result) => {
            // console.log(result);
            res.render("compRegist/searchExistComp", { searchComp: result });
        })
        .catch((err) => {
            console.log(err);
        });
};


// 존재하는 업체 클릭 시 해당 업체명과 주소를 서버로 보낸 뒤 그걸로 업체정보 받아옴

exports.existCompRegist = async (req, res) => {
    var cname = req.body.searchCompName;
    var caddr = req.body.searchCompAddr;
    if (typeof (cname) == "object") {
        cname = cname[0];
        caddr = caddr[0];
    }
    Company.findOne({
        where: {
            compName: {
                [Op.like]: "%" + cname + "%",
            },
            address: {
                [Op.like]: "%" + caddr + "%",
            }
        },
    })
        .then((result) => {
            res.render("compRegist/registExistComp", { compInfo: result, compkey: process.env.COMPANY_CHECK_KEY });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.existCompNext = async (req, res, next) => {
    if (await req.file) {
        imagepath = `/${req.file.filename}`;
        console.log(imagepath);
    }
    else {
        imagepath = "/images/baseimg.jpg";
        console.log(imagepath);
    }
    await User.update({ isOwner: 1 }, { where: { id: req.session.user_id } })
        .then(() => {
            Company.update({
                bNo: req.body.compNum,
                openDate: req.body.openDate,
                image: imagepath,
                UserId: req.session.user_id,
                tel: req.body.tel,
                mon: req.body.mon,
                tue: req.body.tue,
                wed: req.body.wed,
                thu: req.body.thu,
                fri: req.body.fri,
                sat: req.body.sat,
                sun: req.body.sun,
            },
                {
                    where: {
                        compName: req.body.compName,
                        address: req.body.addr
                    }
                })
        }).then(() => { res.render("compRegist/registExistCompEnd", { compInfo: req.body }); })
        .catch((err) => { console.log(err); });
}

// 일단 업체 공통 정보 입력 페이지
exports.registComp = (req, res) => {
    if (!req.session.user_id) {
        res.redirect("/users/login");
    } else {
        compInfo.userId = req.session.user_id;
        res.render("compRegist/registComp", { compkey: process.env.COMPANY_CHECK_KEY });
    }
};

exports.registCompNext = async (req, res) => {
    req.session.user_id=compInfo.userId;
    // 도로명주소로 위경도 변환해서 저장
    geo.find(req.body.addr, function (err, res) {
        console.log(res[0].location["lat"]);
        console.log(res[0].location["lng"]);
        compInfo.latitude = res[0].location["lat"];
        compInfo.longitude = res[0].location["lng"];
    });

    if (req.file) {
        imagepath = `/${req.file.filename}`;
    }
    else {
        imagepath = "/images/baseimg.jpg";
    }

    compInfo.address = req.body.addr;
    //compInfo.userId = req.session.user_id; //로그인 구현되면 수정하기 --> 공통정보 입력페이지에서 저장해둠
    compInfo.image = imagepath;
    compInfo.compName = req.body.compName; //not null
    compInfo.bNo = req.body.compNum;
    compInfo.openDate = req.body.openDate;
    compInfo.address = req.body.addr; //not null
    compInfo.tel = req.body.telNum;
    compInfo.type = req.body.compType; //not null
    compInfo.mon = req.body.mon;
    compInfo.tue = req.body.tue;
    compInfo.wed = req.body.wed;
    compInfo.thu = req.body.thu;
    compInfo.fri = req.body.fri;
    compInfo.sat = req.body.sat;
    compInfo.sun = req.body.sun;

    if (compInfo.type == "R") {
        res.render("compRegist/registRest");
    } else if (compInfo.type == "C") {
        res.render("compRegist/registCafe");
    }
    else if (compInfo.type == "H") {
        res.render("compRegist/registHospital")
    }
    else {
        res.send("업체 타입 오류");
    }
};

exports.registFinished = async (req, res) => {
    req.session.user_id = compInfo.userId;
    res.render("compRegist/registExistCompEnd");
    Company.create({
        image: compInfo.image,
        compName: compInfo.compName,
        bNo: compInfo.bNo,
        openDate: compInfo.openDate,
        address: compInfo.address,
        tel: compInfo.tel,
        todayClosed: 0,
        earlyClosed: 0,
        vacation: 0,
        latitude: compInfo.latitude,
        longitude: compInfo.longitude,
        type: compInfo.type,
        mon: compInfo.mon,
        tue: compInfo.tue,
        wed: compInfo.wed,
        thu: compInfo.thu,
        fri: compInfo.fri,
        sat: compInfo.sat,
        sun: compInfo.sun,
        UserId: compInfo.userId,
    }).then(() => {
        Company.findAll({
            attributes: ['compId'],
            where: {
                compName: compInfo.compName,
                address: compInfo.address,
                UserId: compInfo.userId
            }
        })
            .then((result) => {
                compInfo.compId = result[0].dataValues.compId * 1;
                console.log("업체번호: " + compInfo.compId);
            }).then(async () => {
                if (compInfo.type == "R") {
                    if (req.body.allDays == "true") {
                        restInfo.restOpen = 0;
                        restInfo.restClosed = 4000;
                    } else {
                        restInfo.restOpen = req.body.openTime[0] * 100 + req.body.openTime[1] * 1;
                        restInfo.restClosed = req.body.closedTime[0] * 100 + req.body.closedTime[1] * 1;
                        if (req.body.tomorrow == "true") {
                            restInfo.restClosed += 2400;
                        }
                    }

                    if (req.body.noBreak == "true") {
                        Rest.create({
                            restOpen: restInfo.restOpen,
                            restClosed: restInfo.restClosed,
                            restType: req.body.restType, //not null
                            breakStart: null,
                            breakEnd: null,
                            CompanyCompId: compInfo.compId,
                        });
                    } else {
                        Rest.create({
                            restOpen: restInfo.restOpen,
                            restClosed: restInfo.restClosed,
                            restType: req.body.restType, //not null
                            breakStart: req.body.breakStart[0] * 100 + req.body.breakStart[1] * 1,
                            breakEnd: req.body.breakEnd[0] * 100 + req.body.breakEnd[1] * 1,
                            CompanyCompId: compInfo.compId,
                        });
                    }

                    if (req.body.menu && !(typeof (req.body.menu) == 'string')) {
                        let menu = Object.values(req.body.menu);
                        let price = Object.values(req.body.price);
                        var menuAndPrice = menu.map(function (menu, i) {
                            return [menu, price[i]];
                        });

                        for await (const e of menuAndPrice) {
                            if (e[0] == "" || e[1] == "") { continue; }
                            await Menu.create({
                                menuName: e[0],
                                price: e[1],
                                CompanyCompId: compInfo.compId
                            });
                        }

                    } else {
                        if (req.body.menu) {
                            await Menu.create({
                                menuName: req.body.menu,
                                price: req.body.price,
                                CompanyCompId: compInfo.compId
                            });
                        }
                    }

                } else if (compInfo.type == "C") {
                    if (req.body.allDays == "true") {
                        cafeInfo.cafeOpen = 0;
                        cafeInfo.cafeClosed = 4000;
                    } else {
                        cafeInfo.cafeOpen = req.body.openTime[0] * 100 + req.body.openTime[1] * 1;
                        cafeInfo.cafeClosed = req.body.closedTime[0] * 100 + req.body.closedTime[1] * 1;
                        if (req.body.tomorrow == "true") {
                            cafeInfo.cafeClosed += 2400;
                        }
                    }
                    Cafe.create({
                        cafeOpen: cafeInfo.cafeOpen,
                        cafeClosed: cafeInfo.cafeClosed,
                        cafeType: req.body.cafeType, //not null
                        CompanyCompId: compInfo.compId,
                    });

                    if (req.body.menu && !(typeof (req.body.menu) == 'string')) {
                        let menu = Object.values(req.body.menu);
                        let price = Object.values(req.body.price);
                        var menuAndPrice = menu.map(function (menu, i) {
                            return [menu, price[i]];
                        });

                        for await (const e of menuAndPrice) {
                            if (e[0] == "" || e[1] == "") { continue; }
                            await Menu.create({
                                menuName: e[0],
                                price: e[1],
                                CompanyCompId: compInfo.compId
                            });
                        }

                    } else {
                        if (req.body.menu) {
                            await Menu.create({
                                menuName: req.body.menu,
                                price: req.body.price,
                                CompanyCompId: compInfo.compId
                            });
                        }
                        ///////병원///////////////////////////
                    }
                } else if (compInfo.type == "H") {
                    hospitalInfo.HospType = req.body.hospType;
                    hospitalInfo.content = req.body.content;

                    if (req.body.allDays == "true") {
                        hospitalInfo.HospOpenMon = 0;
                        hospitalInfo.HospCloseMon = 4000;

                        hospitalInfo.HospOpenTue = 0;
                        hospitalInfo.HospCloseTue = 4000;

                        hospitalInfo.HospOpenWed = 0;
                        hospitalInfo.HospCloseWed = 4000;

                        hospitalInfo.HospOpenThu = 0;
                        hospitalInfo.HospCloseThu = 4000;

                        hospitalInfo.HospOpenFri = 0;
                        hospitalInfo.HospCloseFri = 4000;

                        hospitalInfo.HospOpenSat = 0;
                        hospitalInfo.HospCloseSat = 4000;

                        hospitalInfo.HospOpenSun = 0;
                        hospitalInfo.HospCloseSun = 4000;

                        hospitalInfo.HospOpenVac = 0;
                        hospitalInfo.HospCloseVac = 4000
                    } else {
                        hospitalInfo.HospOpenMon = req.body.openTime[0] * 100 + req.body.openTime[1] * 1;
                        hospitalInfo.HospCloseMon = req.body.closedTime[0] * 100 + req.body.closedTime[1] * 1;

                        hospitalInfo.HospOpenTue = req.body.openTime[2] * 100 + req.body.openTime[3] * 1;
                        hospitalInfo.HospCloseTue = req.body.closedTime[2] * 100 + req.body.closedTime[3] * 1;

                        hospitalInfo.HospOpenWed = req.body.openTime[4] * 100 + req.body.openTime[5] * 1;
                        hospitalInfo.HospCloseWed = req.body.closedTime[4] * 100 + req.body.closedTime[5] * 1;

                        hospitalInfo.HospOpenThu = req.body.openTime[6] * 100 + req.body.openTime[7] * 1;
                        hospitalInfo.HospCloseThu = req.body.closedTime[6] * 100 + req.body.closedTime[7] * 1;

                        hospitalInfo.HospOpenFri = req.body.openTime[8] * 100 + req.body.openTime[9] * 1;
                        hospitalInfo.HospCloseFri = req.body.closedTime[8] * 100 + req.body.closedTime[9] * 1;

                        hospitalInfo.HospOpenSat = req.body.openTime[10] * 100 + req.body.openTime[11] * 1;
                        hospitalInfo.HospCloseSat = req.body.closedTime[10] * 100 + req.body.closedTime[11] * 1;

                        hospitalInfo.HospOpenSun = req.body.openTime[12] * 100 + req.body.openTime[13] * 1;
                        hospitalInfo.HospCloseSun = req.body.closedTime[12] * 100 + req.body.closedTime[13] * 1;

                        hospitalInfo.HospOpenVac = req.body.openTime[14] * 100 + req.body.openTime[15] * 1;
                        hospitalInfo.HospCloseVac = req.body.closedTime[14] * 100 + req.body.closedTime[15] * 1;

                    }

                    if (req.body.noBreak == "true") {
                        hospitalInfo.breakStart = null;
                        hospitalInfo.breakEnd = null;

                    } else {
                        hospitalInfo.breakStart = req.body.breakStart[0] * 100 + req.body.breakStart[1] * 1;
                        hospitalInfo.breakEnd = req.body.breakEnd[0] * 100 + req.body.breakEnd[1] * 1;
                    }

                    createHospital();
                }

                else {
                    res.send("compType 에러");
                }
            })
            .then(() => {
                ownerTrue();
            })
            .catch((err) => {
                Company.destroy({ where: { compId: compInfo.compId } }); // 업체별 정보 db 저장 에러 시 company 정보도 삭제
                console.log(err);
            })
    }).catch((err) => {
        console.log(err);
    })
};


function createHospital() {
    Hosp.create({
        HospOpenMon: hospitalInfo.HospOpenMon,
        HospCloseMon: hospitalInfo.HospCloseMon,

        HospOpenTue: hospitalInfo.HospOpenTue,
        HospCloseTue: hospitalInfo.HospCloseTue,

        HospOpenWed: hospitalInfo.HospOpenWed,
        HospCloseWed: hospitalInfo.HospCloseWed,

        HospOpenThu: hospitalInfo.HospOpenThu,
        HospCloseThu: hospitalInfo.HospCloseThu,

        HospOpenFri: hospitalInfo.HospOpenFri,
        HospCloseFri: hospitalInfo.HospCloseFri,

        HospOpenSat: hospitalInfo.HospOpenSat,
        HospCloseSat: hospitalInfo.HospCloseSat,

        HospOpenSun: hospitalInfo.HospOpenSun,
        HospCloseSun: hospitalInfo.HospCloseSun,

        HospOpenVac: hospitalInfo.HospOpenVac,
        HospCloseVac: hospitalInfo.HospCloseVac,

        HospType: hospitalInfo.HospType,

        content: hospitalInfo.content,

        breakStart: hospitalInfo.breakStart,
        breakEnd: hospitalInfo.breakEnd,

        CompanyCompId: compInfo.compId
    });
}

function ownerTrue() {
    User.update({ isOwner: 1 }, { where: { id: compInfo.userId } });
}