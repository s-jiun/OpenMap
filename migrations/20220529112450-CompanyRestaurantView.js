'use strict';

const viewName = 'CompanyRestaurantView'
const query = `select compId, image, compName, address, tel, restType, restOpen, restClosed, breakStart, breakEnd, todayClosed, earlyClosed, vacation, latitude, longitude, type, mon, tue, wed, thu, fri, sat, sun 
from Company join Restaurant on compId=CompanyCompId`

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`create view ${viewName} as ${query}`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`drop view ${viewName}`);
  }
};
