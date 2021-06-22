var express = require("express");
var exphbs = require("express-handlebars");
// var morgan = require('morgan');

//importamos el controller y service
const PaymentController = require("./controllers/controller");
const PaymentService = require("./controllers/service");

var port = process.env.PORT || 3000;
var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//app.use(morgan('dev'));

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname +"/assets"));

app.use(express.urlencoded({
  extended: false
}))

app.get("/", function (req, res) {
  res.render("home",{page: "home"});
});

app.get("/detail", function (req, res) {
  req.query.page= "item"
  res.render("detail", req.query);
});

// Instanciamos el pago
// (Permitimos que el controller pueda usar el service)
const PaymentInstance = new PaymentController(new PaymentService()); 

//webhook del pago
app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

//obtener preferencia de mp
app.post("/create_preference", function (req, res) {
  PaymentInstance.getMercadoPagoLink(req, res);
});

app.get("/success", (req, res) => {
  res.render("success", req.query);
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/pending", (req, res) => {
  res.render("pending");
});

app.listen(port);
