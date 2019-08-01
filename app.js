var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");
var db = require("./models/db");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var multer = require("multer");
let upload = multer({ dest: "public/images" });
const exphbs = require("express-handlebars");

var app = express();

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "layout",
    extname: ".hbs",
    helpers: require("./hbshelpers"), // same file that gets used on our client
    partialsDir: "views/partials/", // same as default, I just like to be explicit
    layoutsDir: "views" // same as default, I just like to be explicit
  })
);
app.set("view engine", "hbs");

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/signup", upload.single("doc"), require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/profile", require("./routes/profile"));
app.use("/bike", upload.single("image"), require("./routes/bikes"));
app.use("/reserve", require("./routes/booking"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
