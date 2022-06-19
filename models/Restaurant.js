module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define(
        "Restaurant",
        {

            restOpen: {
                type: DataTypes.INTEGER,
                comment: "오픈시각",
            },
            restClosed: {
                type: DataTypes.INTEGER,
                comment: "마감시각",
            },
            restType:{
                type: DataTypes.STRING,
                allowNull: false,
                comment: "업종종류"
            },
            breakStart:{
                type: DataTypes.INTEGER,
                comment: "휴게시간시작"
            },
            breakEnd:{
                type: DataTypes.INTEGER,
                comment: "휴게시간끝"
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "Restaurant", // 테이블 이름
            timestamps: true, // createAt & updateAt 활성화
            paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
        }
    );

    return Restaurant;
};
