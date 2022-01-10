const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Set-cookie": "name=roadbook" });
    console.log(req.headers.cookie);
    res.end("Cookie --> Header");
  })
  .listen(3030, () => {
    console.log("3030포트에서 서버 연결 중");
  });
