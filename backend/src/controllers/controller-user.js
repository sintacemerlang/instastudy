const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);



pool.on("error", (err) => {
    console.error(err);
});

module.exports = {
    registerUser(req, res) {
        let data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            namaLengkap: req.body.namaLengkap,
            alamat: req.body.alamat
        };

        // Periksa apakah username atau email sudah digunakan
        pool.getConnection((err, connection) => {
            if (err) {
                throw err;
            }
            connection.query(
                `SELECT * FROM user WHERE username = ? OR email = ?`,
                [data.username, data.email],
                (error, results) => {
                    if (error) {
                        connection.release();
                        res.status(500).send({
                            success: false,
                            message: "Gagal memeriksa data pengguna",
                            error: error.message
                        });
                        return;
                    }

                    if (results.length > 0) {
                        connection.release();
                        const existingUser = results[0];
                        if (existingUser.username === data.username) {
                            res.status(400).send({
                                success: false,
                                message: "Username sudah digunakan"
                            });
                        } else {
                            res.status(400).send({
                                success: false,
                                message: "Email sudah digunakan"
                            });
                        }
                        return;
                    }

                    // Jika username dan email unik, lakukan registrasi
                    connection.query(
                        `INSERT INTO user SET ?;`,
                        [data],
                        (insertError, insertResults) => {
                            connection.release();
                            if (insertError) {
                                res.status(500).send({
                                    success: false,
                                    message: "Gagal menyimpan data pengguna",
                                    error: insertError.message
                                });
                                return;
                            }
                            res.send({
                                success: true,
                                message: "Berhasil menyimpan data pengguna"
                            });
                        }
                    );
                }
            );
        });
    },
    checkUserLogin(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        const query = "SELECT * FROM user WHERE username = ?";
        let value = [username];

        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query(query, value, (error, results) => {
                connection.release();
                if (error) {
                    throw error;
                }

                //jika ada username
                if (results.length > 0) {
                    const user = results[0];
                    console.log("data user", user);
                    if (user.password === password) {
                        res.send({
                            success: true,
                            message: "Success Login",
                            loginuser: true,
                            data: results,
                        });
                    } else {
                        res.send({
                            success: false,
                            loginuser: false,
                            message: "Wrong password",
                        });
                    }
                }
                //jika tidak ada username
                else {
                    res.send({
                        success: false,
                        loginuser: false,
                        message: "Username not found",
                    });
                }
            })
        })
    }
}


