import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AddPhoto() {
    const [userID, setUserID] = useState(null);
    const [photo, setPhoto] = useState({});
    const [temporaryImage, setTemporaryImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Mengambil data dari local storage
        const userDataString = localStorage.getItem("user");

        if (userDataString) {
            // Mengonversi data JSON menjadi objek JavaScript
            const userData = JSON.parse(userDataString);

            // Mengambil userID dari objek userData
            const { userID } = userData;

            // Menyimpan userID ke dalam state
            setUserID(userID);
        }
    }, []);

    const handleLogout = () => {
        // Menghapus semua item dari local storage
        localStorage.clear();

        // Redirect ke halaman
        window.location.replace("/");
    };

    //untuk menampung data dari form
    const handleInputAdd = (e) => {
        const { name, value } = e.target;
        setPhoto((prevPhoto) => ({
            ...prevPhoto,
            [name]: value,
            userId: userID, // Memasukkan userId ke dalam objek photo
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Membuat array yang berisi ekstensi yang diperbolehkan
        const allowedExtensions = ["jpg", "jpeg", "png"];

        // Mendapatkan ekstensi file
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

        // Memeriksa apakah ekstensi file valid
        if (allowedExtensions.includes(fileExtension)) {
            // Jika valid, set file dan tampilkan gambar temporary
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = function (e) {
                setTemporaryImage(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            // Jika tidak valid, munculkan alert dan set file ke null
            alert("File yang dimasukkan harus berupa gambar (jpg, jpeg, png)");
            return false;
            //   setFile(null);
        }
    };

    //pengiriman data ke API
    const handleAdd = async (e) => {
        e.preventDefault();

        // Validasi input
        if (!photo.judulFoto || !photo.deskripsiFoto || !file) {
            alert("Semua field harus diisi dan file foto harus diunggah.");
            return;
        }

        // Memeriksa tipe file
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            alert("File yang dimasukkan harus berupa gambar (jpg, jpeg, png)");
            return;
        }

        // Lakukan pengiriman data
        try {
            const formData = new FormData();
            formData.append("photo", file);
            formData.append("data", JSON.stringify(photo));

            const response = await fetch(`http://localhost:8080/photo/add/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            alert("Tambah data oke");
            window.location.replace("/home");
        } catch (error) {
            console.error("Error updating photo:", error);
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="/home">
                        Galeri Photo
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="btn btn-link nav-link">Tambah Data</a>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="d-flex justify-content-center">
                <div className="col-md-6">
                    <h2>
                        <center>Add Photo</center>
                    </h2>
                    <form onSubmit={handleAdd}>
                        {temporaryImage && (
                            <div className="mb-3">
                                <img
                                    src={temporaryImage}
                                    alt=""
                                    className="card-img-top"
                                    style={{ objectFit: 'cover' }}
                                    width={250}
                                    height={250}
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                                Update File Photo
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="judulFoto" className="form-label">
                                Judul Foto:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="judulFoto"
                                name="judulFoto"
                                onChange={handleInputAdd}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="deskripsiFoto" className="form-label">
                                Deskripsi Foto:
                            </label>
                            <textarea
                                className="form-control"
                                id="deskripsiFoto"
                                name="deskripsiFoto"
                                value={photo.deskripsiFoto}
                                onChange={handleInputAdd}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Tambah
                        </button>
                    </form>
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
}

export default AddPhoto;