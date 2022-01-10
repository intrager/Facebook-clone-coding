const http = require("http");

const session = {};
const sesskey = new Date();
session[sesskey] = { name: "roadbook" };

http
  .createServer((req, res) => {
    res.writeHead(200, { "Set-cookie": "session=${sesskey}" });
    res.end("Session-Cookie --> Header");
  })
  .listen(3030, () => {
    console.log("3030포트에서 서버 연결 중");
  });
