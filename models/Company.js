module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("Company",{
        compId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            allowNull: false,
            autoIncrement: true,
            comment: "업체 번호",
        },

        // userId: {
        //     type: DataTypes.STRING(100),
        //     comment: "업주 아이디"
        // },

        image: {
            type: DataTypes.BLOB,
            comment: "사진"
        },

        compName: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "업체명"
        },

        bNo: {
            type: DataTypes.INTEGER,
            comment: "사업자등록번호"
        },

        openDate: {
            type: DataTypes.INTEGER,
            comment: "개업일자"
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "주소"
        },

        tel:{
            type: DataTypes.STRING,
            comment:"전화번호"
        },

        todayClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment:"오늘 휴무"
        },

        earlyClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment:"조기마감"
        },

        vacation:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "단기휴무"
        },

        latitude:{
            type: DataTypes.DECIMAL(15,10),
            allowNull: false,
            comment: "위도"
        },

        longitude:{
            type: DataTypes.DECIMAL(15,10),
            allowNull: false,
            comment: "경도"
        },
        
        type:{
            type: DataTypes.STRING(1),
            allowNull: false,
            comment: "업체타입"
        },

        mon:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "월요일 휴무"
        },
        tue:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "화요일 휴무"
        },
        wed:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "수요일 휴무"
        },
        thu:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "목요일 휴무"
        },
        fri:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "금요일 휴무"
        },
        sat:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "토요일 휴무"
        },
        sun:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "일요일 휴무"
        },
    }, {
        charset: "utf8", // 한국어 설정
        collate: "utf8_general_ci", // 한국어 설정
        tableName: "Company", // 테이블 이름
        timestamps: true, // createAt & updateAt 활성화
        paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });

    return Company;
};