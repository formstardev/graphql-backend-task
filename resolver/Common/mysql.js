const { Sequelize, DataTypes } = require("sequelize");

exports.init = async (client) => {
  const ApiKey = client.define("ApiKeysTable", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    apiKey: {
      type: Sequelize.STRING,
    },
  });
  await ApiKey.sync();
};
exports.getApiKey = async (client, apiKey) => {
  if (!apiKey) {
    return null;
  }
  var data = {};

  const ApiKey = client.models.ApiKeysTable;

  var dataFromDb = await ApiKey.findOne({ where: { apiKey: apiKey } });

  if (dataFromDb === null) {
    return null;
  }
  data.apiKey = dataFromDb.dataValues.apiKey;
  return data;
};
