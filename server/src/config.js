const path = require('path');

const config = {
  port: Number(process.env.PORT || 4000),
  dbFile: process.env.DB_FILE || path.join(__dirname, '..', 'data', 'jewellery.db'),
  company: {
    name: process.env.COMPANY_NAME || 'Jewellery ERP Demo Store',
    gstin: process.env.COMPANY_GSTIN || '24ABCDE1234F1Z5',
    // GST state code of the business; 24 = Gujarat
    stateCode: process.env.COMPANY_STATE_CODE || '24',
  },
};

module.exports = config;
