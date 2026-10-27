const app = require('./src/app');
const { connectDb } = require('./src/db');
const port = process.env.PORT || 4000;
connectDb().finally(() => {
  app.listen(port, () => console.log(`Question Rush API listening on port ${port}`));
});
