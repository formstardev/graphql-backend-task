const { v4: uuidv4 } = require("uuid");
var common = require("../Common/mysql");
const Sequelize = require("sequelize");

exports.func = async (_) => {
  const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME,
    process.env.MYSQL_DB_USERNAME,
    process.env.MYSQL_DB_PASSWORD,
    {
      dialect: "mysql",
      host: process.env.MYSQL_DB_HOST,
      port: 3306,
      logging: false,
    }
  );
  await common.init(sequelize);

  var apiKey = uuidv4();

  await sequelize.models.ApiKeysTable.create({ apiKey: apiKey });
  var resp = await common.getApiKey(sequelize, apiKey);
  return resp;
};
