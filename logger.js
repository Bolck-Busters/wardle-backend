const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const process = require("process");

const { combine, timestamp, label, printf } = winston.format;

// 로그 파일 경로
const logDir = __dirname + "/logs";

// log 출력 포맷 정의 함수
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨: 메세지
});

const logger = winston.createLogger({
  // 로그 출력 형식 정의
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 날짜 데이터 형식
    label({ label: "Wordle 로그" }), // 어플리케이션 이름
    logFormat // log 출력 포맷
  ),

  // 로그 출력 형식 정의 (레벨별 설정)
  transports: [
    // error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],

  // uncaughtException 발생 시 설정
  // uncaughtException = 예측하지 못한 에러들을 하나로 모은 것
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

module.exports = logger;
