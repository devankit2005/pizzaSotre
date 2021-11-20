require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session"); // use for manage session in express app
const flash = require("express-flash"); // use for send cookie for all http request
const MongoDbStore = require("connect-mongo")(session); // use for store session in Mongodb
const passport = require("passport");
const bodyParser = require("body-parser");
const Emitter = require("events");
const url = process.env.MONGO_CONNECTION_URL;

// only testing comment 123

// Database connection
mongoose.connect(url);
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));

connection.once("open", function () {
  console.log("Connection Successful 🥳 🥳 🥳 🥳");
});

// Session store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //valid for 24 hour
  })
);

// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// passport config
const passportInit = require("./app/config/passport");
passportInit(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({extended: false}));

// Assets
app.use(express.static("public"));

// Global middleware
app.use((req, res, next) => {
  (res.locals.session = req.session), (res.locals.user = req.user);
  next();
});

// Set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// All routers
require("./routes/web")(app);
app.use((req, res) => {
  res.status(404).render("errors/404");
});

const server = app.listen(PORT, () => {
  console.log(`server is running PORT - ${PORT}`);
});

// Socket.io connection
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    // this "orderId" receive from client
    socket.join(orderId);
  });
});

// admin update order status then call this event
eventEmitter.on("orderUpdated", (data) => {
  console.log("orderUpdated emit call", data);
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

// user place new order then call this event
eventEmitter.on("orderPlaced", (data) => {
  console.log("orderPlaced emit call", data);
  io.to(`adminRoom`).emit("orderPlaced", data);
});

//  ssh://ubuntu@3.14.132.57/var/repo/ankitbharvad.com.git
// remote add origin ssh://ubuntu@ec2-3-14-132-57.us-east-2.compute.amazonaws.com/var/repo/ankitbharvad.com.git

// remote add origin ubuntu@3.14.132.57/home/ubuntu/git/REPO/gitfile.git

// remote add origin ubuntu@ec2-3-14-132-57/home/ubuntu/git/REPO/gitfile.git

// ubuntu@ec2-3-14-132-57.us-east-2.compute.amazonaws.com

// ssh -i "awsSshKey.pem" ubuntu@ec2-3-14-132-57.us-east-2.compute.amazonaws.com
