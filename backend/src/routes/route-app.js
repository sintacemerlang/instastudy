const express = require("express");
const router = express.Router();
const { user, photo } = require("../controllers");

const multer = require("multer");
const path = require("path");

// Ini adalah fungsi untuk mengenerate filename acak untuk
// disimpan didalam server agar supaya tidak sama
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + extname);
    },
});

const upload = multer({ storage: storage });

//Routes untuk user
router.post("/user/register", user.registerUser);
router.post("/user/login", user.checkUserLogin);

//Routes untuk photo
router.get("/photo/getphoto/:id", photo.getPhoto);
router.post("/photo/add", upload.single("photo"), photo.addPhoto);
router.get("/photo/show/:id", photo.showPhoto);
router.delete("/photo/delete/:id", photo.deletePhoto);
router.put("/photo/update/:id", upload.single("photo"), photo.updatePhoto);
router.put("/photo/like/:id", photo.likeDislikePhoto);


module.exports = router;