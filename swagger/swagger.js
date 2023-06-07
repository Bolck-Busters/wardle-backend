const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");
const options = {
  swaggerDefinition: {
    info: {
      title: "Wordle",
      version: "1.0.0",
      description: "wordle 프로젝트",
    },
    host: "35.216.70.231:3000", // 백엔드 서버 URL
    basePath: "/",
  },
  apis: ["./routes/*.js"], //@Swagger 적용한 js 파일 연동 (상대 경로는 index.js 기준)
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
