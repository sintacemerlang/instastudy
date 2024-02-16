const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
    console.error(err);
});

function generateDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

module.exports = {
    getPhoto(req, res) {
        const photoId = req.params.id //Ambil id foto dari parameter URL

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }

            connection.query(
                `SELECT * FROM foto WHERE userID = ?`,
                [photoId],
                function (error, results) {
                    if (err) {
                        console.error("Error connecting to database", err);
                        return res.status(500).json({
                            success: false,
                            message: "Internal server error",
                        });
                    } else {
                        if (results.length === 0) {
                            return res.status(404).json({
                                success: false,
                                message: "Data not found",
                                data: null,
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Success get data",
                                data: results,
                            });
                        }
                    }

                }

            )
        })
    },
    addPhoto(req, res) {
        let jsonData;
        try {
            jsonData = JSON.parse(req.body.data);
        } catch (err) {
            // Tangani kesalahan jika JSON tidak dapat diparsing
            // console.log(req.body.data);
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format in request body",
            });
        }

        const data = {
            judulFoto: jsonData.judulFoto,
            deskripsiFoto: jsonData.deskripsiFoto,
            tanggalUnggah: generateDate(),
            pathPhoto: req.file ? req.file.path : "",
            photoName: req.file ? req.file.filename : "",
            userId: jsonData.userId,
        };

        console.log("data yang akan dikirim", data);

        pool.getConnection(function (err, connection) {
            if (err) {
                // Tangani kesalahan koneksi database
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }

            connection.query(
                `INSERT INTO foto SET ?;`,
                [data],
                function (error, results) {
                    connection.release();
                    if (error) {
                        // Tangani kesalahan saat menjalankan query
                        console.error("Error executing SQL query:", error);
                        return res.status(500).json({
                            success: false,
                            message: "Error inserting data into database",
                        });
                    }
                    // Kirim tanggapan berhasil jika tidak ada kesalahan
                    res.status(200).json({
                        success: true,
                        message: "Data Foto berhasil ditambahkan",
                    });
                }
            );
        });
    },
    showPhoto(req, res) {
        const photoId = req.params.id //Ambil id foto dari parameter URL
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }

            connection.query(
                `SELECT * FROM foto WHERE fotoID = ?`,
                [photoId],
                function (error, results) {
                    if (err) {
                        console.error("Error connecting to database", err);
                        return res.status(500).json({
                            success: false,
                            message: "Internal server error",
                        });
                    } else {
                        if (results.length === 0) {
                            return res.status(404).json({
                                success: false,
                                message: "Data not found",
                                data: null,
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Success show data",
                                data: results,
                            });
                        }
                    }
                }

            )
        })
    },
    deletePhoto(req, res) {
        const photoId = req.params.id //Ambil id foto dari parameter URL

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
            connection.query(
                `SELECT pathPhoto FROM foto WHERE fotoID = ?`,
                [photoId],
                function (error, results) {
                    if (error) {
                        // Tangani kesalahan saat menjalankan query
                        console.error("Error executing SQL query:", error);
                        return res.status(500).json({
                            success: false,
                            message: "Error fetching photo data from database",
                        });
                    }
                    if (results.length === 0) {
                        connection.release();
                        return res.status(404).json({
                            success: false,
                            message: "Photo not found",
                        });
                    }
                    //data path photo yang existing di db
                    const photoPath = results[0].pathPhoto;

                    //hapus file photo dari direktori
                    fs.unlink(photoPath, function (err) {
                        if (err) {
                            console.error("Error deleting file:", err);
                            return res.status(500).json({
                                success: false,
                                message: "Error deleting photo file",
                            });
                        }
                        //setelah file dihapus, hapus juga data foto dari tabel
                        connection.query(
                            `DELETE FROM foto WHERE fotoID = ?`,
                            [photoId],
                            function (deleteError, deleteResults) {
                                if (deleteError) {
                                    console.error("Error executing SQL query:", deleteError);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Error deleting photo from database",
                                    });
                                }
                                res.status(200).json({
                                    success: true,
                                    message: "Data foto berhasil dihapus",
                                });
                            }
                        )
                    })
                }

            )
        });

    },
    updatePhoto(req, res) {
        const photoId = req.params.id; //Ambil id foto dari parameter URL

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
            connection.query(
                `SELECT pathPhoto, photoName FROM foto WHERE fotoId = ?`,
                [photoId],
                function (error, results) {
                    if (error) {
                        connection.release();
                        console.error("Error executing SQL query:", error);
                        return res.status(500).json({
                            success: false,
                            message: "Error fetching photo data from database",
                        });
                    }

                    if (results.length === 0) {
                        connection.release();
                        return res.status(404).json({
                            success: false,
                            message: "Photo not found",
                        });
                    }

                    const oldPhotoPath = results[0].pathPhoto;
                    const oldPhotoName = results[0].photoName;

                    //hapus file foto lama dari direktori uploads menggunakan fs.unlink jika dia mengupdate photo
                    if (req.file) {
                        fs.unlink(oldPhotoPath, function (err) {
                            if (err) {
                                console.error("Error deleting file:", err);
                                return res.status(500).json({
                                    success: false,
                                    message: "Error deleting old photo file",
                                });
                            }
                            let jsonData;
                            try {
                                jsonData = JSON.parse(req.body.data);
                            } catch (err) {
                                // Tangani kesalahan jika JSON tidak dapat diparsing
                                // console.log(req.body.data);
                                return res.status(400).json({
                                    success: false,
                                    message: "Invalid JSON format in request bod",
                                });
                            }
                            // Lakukan proses update data foto di database
                            const newdata = {
                                judulFoto: jsonData.judulFoto,
                                deskripsiFoto: jsonData.deskripsiFoto,
                                tanggalUnggah: generateDate(),
                                pathPhoto: req.file ? req.file.path : "",
                                photoName: req.file ? req.file.filename : "",
                            };
                            connection.query(
                                `UPDATE foto SET ? WHERE fotoId = ?`,
                                [newdata, photoId],
                                function (updateError, updateResults) {
                                    connection.release();
                                    if (updateError) {
                                        console.error("Error executing SQL query:", updateError);
                                        return res.status(500).json({
                                            success: false,
                                            message: "Error updating photo data in database",
                                        });
                                    }
                                    res.status(200).json({
                                        success: true,
                                        message: "Data Foto berhasil diubah",
                                    });
                                }
                            )
                        })
                    }
                    //kondisi edit tanpa ganti foto 
                    else {
                        let jsonData;
                        try {
                            jsonData = JSON.parse(req.body.data);
                        } catch (err) {
                            // Tangani kesalahan jika JSON tidak dapat diparsing
                            // console.log(req.body.data);
                            return res.status(400).json({
                                success: false,
                                message: "Invalid JSON format in request bod",
                            });
                        }
                        // Lakukan proses update data foto di database
                        const newdata = {
                            judulFoto: jsonData.judulFoto,
                            deskripsiFoto: jsonData.deskripsiFoto,
                            tanggalUnggah: generateDate(),
                            pathPhoto: oldPhotoPath,
                            photoName: oldPhotoName,
                        };
                        connection.query(
                            `UPDATE foto SET ? WHERE fotoId = ?`,
                            [newdata, photoId],
                            function (updateError, updateResults) {
                                connection.release();
                                if (updateError) {
                                    console.error("Error executing SQL query:", updateError);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Error updating photo data in database",
                                    });
                                }
                                res.status(200).json({
                                    success: true,
                                    message: "Data foto berhasil diubah",
                                });
                            }
                        )
                    }

                }
            )
        })
    },
    likeDislikePhoto(req, res) {
        const photoId = req.params.id; //Ambil id foto dari parameter URL

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error connecting to database:", err);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }

            const newdata = {
                like: req.body.like
            }
            connection.query(
                `UPDATE foto SET ? WHERE fotoId = ?`,
                [newdata, photoId],
                function (updateError, updateResults) {
                    connection.release();
                    if (updateError) {
                        console.error("Error executing SQL query:", updateError);
                        return res.status(500).json({
                            success: false,
                            message: "Error updating like photo data in database",
                        });
                    }
                    res.status(200).json({
                        success: true,
                        message: "Success updating like photo data",
                    });
                }
            )
        });
    }

};