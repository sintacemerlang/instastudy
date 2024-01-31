const { connection } = require("./database/database");

const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/register", (req, res) => {
    const user = req.body;

    connection.query("INSERT INTO user SET ?", user, function (error) {
        if (error) throw error;
        // Neat!
    });

    res.send({
        message: "Berhasil mendaftar",
    });
});

app.post("/login", (req, res) => {
    // Desctructering request body
    const { username, password } = req.body;

    // TODO: Memeriksa kiriman data ke database

    // TODO: Validasi password

    // TODO: Send message success

    const query = connection.query(
        "SELECT * FROM user WHERE username = ?",
        [username],
        function (error) {
            if (error) throw error;
        }
    );

    console.log(query);

    res.send({
        message: "Berhasil login",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});