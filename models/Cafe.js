module.exports = (sequelize, DataTypes) => {
    const Cafe = sequelize.define(
        "Cafe",
        {
            cafeOpen: {
                type: DataTypes.INTEGER,
                comment: "오픈시각",
            },
            cafeClosed: {
                type: DataTypes.INTEGER,
                comment: "마감시각",
            },
            cafeType:{
                type: DataTypes.STRING,
                allowNull: false,
                comment: "업종종류"
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "Cafe", // 테이블 이름
            timestamps: true, // createAt & updateAt 활성화
            paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
        }
    );

    return Cafe;
};