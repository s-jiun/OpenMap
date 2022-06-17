'use strict';

const viewName = 'CompanyCafeView'
const query = `select compId, image, compName, address, tel, cafeOpen, cafeClosed, cafeType, todayClosed, earlyClosed, vacation, latitude, longitude, type, mon, tue, wed, thu, fri, sat, sun 
from Company join Cafe on compId=CompanyCompId`

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`create view ${viewName} as ${query}`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`drop view ${viewName}`);
  }
};
