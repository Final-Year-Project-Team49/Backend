const express = require("express");
const ejs = require("ejs");
const cookie_parser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const auth_routes = require("./routes/auth_routes");
const producer_routes = require("./routes/producer_routes");
const quality_certifier_routes = require("./routes/quality_certifier_routes");
const collection_center_routes = require("./routes/collection_center_routes");
const home_routes = require("./routes/home_routes");
const logistic_routes = require("./routes/logistic_routes");
const tracking_routes = require("./routes/tracking_routes");

const app = express();

// express middlewares

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie_parser());


// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected.."))
  .catch((err) => console.log(err));

// test route
app.get("/", home_routes);
app.use("/auth", auth_routes);
app.use("/producer", producer_routes);
app.use("/quality_certifier", quality_certifier_routes);
app.use("/collection_center", collection_center_routes);
app.use("/logistic", logistic_routes);
app.use("/track", tracking_routes);

// Start server
app.listen(process.env.PORT || 8000, ()=> {
    console.log(`Server is running on port : ${process.env.PORT || 8000}`)
})