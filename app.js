var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var port = process.env.PORT || 3000;

var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.post("/payment", function (req, res) {
    let data = req.body
    console.log(data);
    data.img = path.join(__dirname, data.img)
    data.order = "retojonatanuy@gmail.com"
    console.log(data);
    res.send(data);
});

app.listen(port);
