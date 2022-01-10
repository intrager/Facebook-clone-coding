const http = require("http");

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.write("Hello");
      res.end();
    }
  })
  .listen(3030, () => {
    console.log("3030 포트에서 서버 연결");
  });
