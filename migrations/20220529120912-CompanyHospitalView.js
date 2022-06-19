'use strict';

const viewName = 'CompanyHospitalView'
const query = `select compId, image, compName, address, tel, HospType, content, todayClosed, earlyClosed, vacation, latitude, longitude, type, mon, tue, wed, thu, fri, sat, sun,
HospOpenMon, HospCloseMon, HospOpenTue, HospCloseTue, HospOpenWed, HospCloseWed, HospOpenThu, HospCloseThu, HospOpenFri, HospCloseFri, 
HospOpenSat, HospCloseSat, HospOpenSun, HospCloseSun, HospOpenVac, HospCloseVac, breakStart, breakEnd
from Company join Hospital on compId=CompanyCompId`

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`create view ${viewName} as ${query}`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`drop view ${viewName}`);
  }
};
