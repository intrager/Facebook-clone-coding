const http = require("http");

http
  .createServer((req, res) => {
    console.log(req);
    console.log(res);
  })
  .listen(3030, () => {
    console.log("3030포트에서 서버 연결");
  });
