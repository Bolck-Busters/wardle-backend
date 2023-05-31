const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Wordle",
      version: "1.0.0",
      description: "wordle 프로젝트",
    },
    host: "localhost:3300", // 요청 URL
    basePath: "/",
  },
  apis: ["./index.js"], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
