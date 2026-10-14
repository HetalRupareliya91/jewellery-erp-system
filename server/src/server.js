const config = require('./config');
const db = require('./db');
const { createApp } = require('./app');

db.open();
const app = createApp();

app.listen(config.port, () => {
  console.log(`Jewellery ERP API listening on http://localhost:${config.port}`);
});
