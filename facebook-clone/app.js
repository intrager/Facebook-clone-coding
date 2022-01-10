const express = require("express");
const morgan = require("morgan");
const models = require("./models");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const Localstrategy = require("passport-local");
const socket = require("socket.io");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const Post = require("./models/Post");
const User = require("./models/User");

const port = process.env.PORT || 3030;
const onlineChatUsers = {};

dotenv.config();

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const app = express();

app.set("view engine", "ejs");

/* 미들웨어 */
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

/* passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Middleware */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* MySQL Connection */
const { sequelize } = require("./models/index.js");

const driver = () => {
  sequelize
    .sync()
    .then(() => {
      console.log("초기화 완료");
    })
    .catch((err) => {
      console.error("초기화 실패");
      console.error(err);
    });
};
driver();

/* Template 파일에 변수 전송 */
app.use((req, res, next) => {
  res.locals.use = req.user;
  res.locals.login = req.isAuthenticated();
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

/* Routers */
app.use("/", userRoutes);
app.use("/", postRoutes);

const server = app.listen(port, () => {
  console.log("App is running on port " + port);
});

/* WebSocket setup */
const io = socket(server);

const room = io.of("/chat");
room.on("connection", (socket) => {
  console.log("new user : ", socket.id);

  room.emit("newUser", { socketID: socket.id });

  socket.on("newUser", (data) => {
    if (!(data.name in onlineChatUsers)) {
      onlineChatUsers[data.name] = data.socketID;
      socket.name = data.name;
      room.emit("updateUserList", Object.keys(onlineChatUsers));
      console.log("Online users: " + Object.keys(onlineChatUsers));
    }
  });

  socket.on("disconnect", () => {
    delete onlineChatUsers[socket.name];
    room.emit("updateUserList", Object.keys(onlinechatUsers));
    console.log(`user ${socket.name} disconnected`);
  });

  socket.on("chat", (data) => {
    console.log(data);
    if (data.to === "Global Chat") {
      room.emit("chat", data);
    } else if (data.to) {
      room.to(onlineChatUsers[data.name]).emit("chat", data);
      room.to(onlineChatUsers[data.to]).emit("chat", data);
    }
  });
});
