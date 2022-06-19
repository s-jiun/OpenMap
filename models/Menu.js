const Company = require("./Company");

module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define(
        "Menu",
        {

            price:{
                type: DataTypes.INTEGER,
                comment: "가격",
            },

            menuName: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "메뉴이름",
            },
        },

        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "Menu", // 테이블 이름
            timestamps: true, // createAt & updateAt 활성화
            paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
        }
    );

    return Menu;
};