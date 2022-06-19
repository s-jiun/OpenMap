const db = require("../../models/index");
const Menu = db.menu;

exports.getMenu = async (req, res) => {
    try{

        // 업체 선택 시 해당 업체 메뉴 비동기 호출
        var responseData = await Menu.findAll({
            attributes: ['id', 'price', 'menuName'],
            where:{
                CompanyCompId : req.body.id
            }
        });
        res.json(responseData);

    }catch(err){
        res.status(500).send({
            message: err.message
        });
    }
};