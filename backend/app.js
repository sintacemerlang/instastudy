const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//pemanggilan modul fungsi untuk upload
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files
const path = require("path");

const port = 8080;
const app = express();
app.use(cors()); //ditambahkan setelah ada frontend

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
const appRoute = require("./src/routes/route-app");
app.use("/", appRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

