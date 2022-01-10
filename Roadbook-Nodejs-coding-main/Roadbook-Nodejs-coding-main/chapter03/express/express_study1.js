const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3030, () => console.log("3030 포트에서 서버 실행 중"));
