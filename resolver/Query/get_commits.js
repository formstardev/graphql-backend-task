const { Octokit } = require("@octokit/core");
require("dotenv").config();
const Sequelize = require("sequelize");
var common = require("../Common/mysql");

exports.func = async (_, { sha, per_page, page }, http) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

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
  var resp = await common.getApiKey(sequelize, http.event.headers.apiKey);

  if (resp === null) {
    return [
      {
        sha: "Not Authenticated",
        message: "Not Authenticated",
        html_url: "Not Authenticated",
        committerInfo: {
          email: "Not Authenticated",
          name: "Not Authenticated",
        },
        date: "Not Authenticated",
      },
    ];
  }

  const addQueries = () => {
    var query = "?";

    if (sha) {
      query += "sha=" + sha + "&&";
    }
    if (per_page) {
      query += "per_page=" + per_page + "&&";
    }
    if (page) {
      query += "page=" + page;
    }

    return query;
  };

  let data = await octokit.request(
    "GET /repos/{owner}/{repo}/commits" + addQueries(),
    {
      owner: "facebook",
      repo: "react",
    }
  );

  data = data.data;

  data = data.map((commit) => {
    const processed = {
      sha: commit.sha,
      message: commit.commit.message,
      html_url: commit.html_url,
      committerInfo: {
        email: commit.commit.author.email,
        name: commit.commit.author.name,
      },
      date: commit.commit.author.date,
    };

    return processed;
  });

  return data;
};
