'use strict';

const fs = require('fs');
const path = require('path');
const { SequelizeScopeError } = require('sequelize');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.users = require("./User.js")(sequelize, Sequelize);
db.restaurant = require("./Restaurant.js")(sequelize, Sequelize);
db.cafe = require("./Cafe.js")(sequelize, Sequelize);
db.hospital = require("./Hospital.js")(sequelize, Sequelize);
db.company = require("./Company.js")(sequelize, Sequelize);
db.companyRestaurantView = require("./CompanyRestaurantView.js")(sequelize, Sequelize);
db.companyCafeView = require("./CompanyCafeView.js")(sequelize, Sequelize);
db.companyHospitalView = require("./CompanyHospitalView.js")(sequelize, Sequelize);
db.menu = require("./Menu.js")(sequelize, Sequelize);
db.myPlace = require("./MyPlace.js")(sequelize, Sequelize);


db.company.belongsTo(db.users, {onDelete: 'cascade'});
db.restaurant.belongsTo(db.company, {onDelete: 'cascade'});
db.cafe.belongsTo(db.company, {onDelete: 'cascade'});
db.hospital.belongsTo(db.company, {onDelete: 'cascade'});
db.menu.belongsTo(db.company, {onDelete: 'cascade'});
db.company.hasMany(db.cafe);
db.company.hasMany(db.restaurant);
db.company.hasMany(db.hospital);
db.company.hasMany(db.menu);

db.users.belongsToMany(db.company, {through: db.myPlace});
db.company.belongsToMany(db.users, {through: db.myPlace}); 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;