var express = require("express");
var exphbs = require("express-handlebars");
var morgan = require('morgan');
var port = process.env.PORT || 3000;
// SDK de Mercado Pago
const mercadopago = require('mercadopago');

var app = express();

var itegrator_id = "dev_24c65fb163bf11ea96500242ac130004"

let vendedor = {
  collector_id: "469485398",
  public_Key: "APP_USR-7eb0138a-189f-4bec-87d1-c0504ead5626",
  access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398"
}

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(morgan('dev'));
app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

// Agrega credenciales
mercadopago.configure({
  access_token: vendedor.access_token
});

app.get("/", function (req, res) {
  res.render("home",{page: "home"});
});

app.get("/detail", function (req, res) {
  req.query.page= "item"
  res.render("detail", req.query);
});

//importamos el controller y service
const PaymentController = require("./controllers/controller");
const PaymentService = require("./controllers/service"); 

// Instanciamos el pago
// (Permitimos que el controller pueda usar el service)
const PaymentInstance = new PaymentController(new PaymentService()); 

//webhook del payment
app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

//obtener preferencia de mp
app.post("/create_preference", function (req, res) {
  PaymentInstance.getMercadoPagoLink(req, res);
});

app.listen(port);
