module.exports = (sequelize, DataTypes) => {
    const Hospital = sequelize.define(
        "Hospital",
        {
            HospType: {
                type: DataTypes.STRING,
                comment: "병원분류명",
            },

            HospOpenMon: {
                type: DataTypes.INTEGER,
                comment: "월오픈시각",
            },

            HospCloseMon: {
                type: DataTypes.INTEGER,
                comment: "월마감시각",
            },

            HospOpenTue: {
                type: DataTypes.INTEGER,
                comment: "화오픈시각",
            },

            HospCloseTue: {
                type: DataTypes.INTEGER,
                comment: "화마감시각",
            },

            HospOpenWed: {
                type: DataTypes.INTEGER,
                comment: "수오픈시각",
            },

            HospCloseWed: {
                type: DataTypes.INTEGER,
                comment: "수마감시각",
            },

            HospOpenThu: {
                type: DataTypes.INTEGER,
                comment: "목오픈시각",
            },

            HospCloseThu: {
                type: DataTypes.INTEGER,
                comment: "목마감시각",
            },

            HospOpenFri: {
                type: DataTypes.INTEGER,
                comment: "금오픈시각",
            },

            HospCloseFri: {
                type: DataTypes.INTEGER,
                comment: "금마감시각",
            },

            HospOpenSat: {
                type: DataTypes.INTEGER,
                comment: "토오픈시각",
            },

            HospCloseSat: {
                type: DataTypes.INTEGER,
                comment: "토마감시각",
            },

            HospOpenSun: {
                type: DataTypes.INTEGER,
                comment: "일오픈시각",
            },

            HospCloseSun: {
                type: DataTypes.INTEGER,
                comment: "일마감시각",
            },

            HospOpenVac: {
                type: DataTypes.INTEGER,
                comment: "공휴일오픈시각",
            },

            HospCloseVac: {
                type: DataTypes.INTEGER,
                comment: "공휴일마감시각",
            },
            
            content:{
                type: DataTypes.STRING,
                comment: "비고",
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
            tableName: "Hospital", // 테이블 이름
            timestamps: true, // createAt & updateAt 활성화
            paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
        }
    );

    return Hospital;
};