const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");
const options = {
  swaggerDefinition: {
    info: {
      title: "Wordle",
      version: "1.0.0",
      description: "wordle 프로젝트",
    },
    host: "localhost:3000", // 요청 URL
    basePath: "/",
  },
  apis: ["./routes/*.js", "index.js"], //@Swagger 적용한 js 파일 연동 (상대 경로는 index.js 기준)
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
