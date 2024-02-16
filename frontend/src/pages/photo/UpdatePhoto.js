import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function UpdatePhoto() {
    const { id } = useParams();

    const [photo, setPhoto] = useState({});
    const [temporaryImage, setTemporaryImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Menggunakan fetch untuk melakukan permintaan API
        fetch(`http://localhost:8080/photo/show/${id}`)
            .then((response) => response.json())
            .then((data) => {
                // Mengatur data foto yang diterima dari API ke dalam state
                setPhoto(data.data[0]);
            })
            .catch((error) => {
                console.error("Error fetching photo:", error);
            });
    }, [id]);

    const handleLogout = () => {
        // Menghapus semua item dari local storage
        localStorage.clear();

        // Redirect ke halaman
        window.location.replace("/");
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

    const handleInputUpdate = (e) => {
        const { name, value } = e.target;
        setPhoto((prevPhoto) => ({
            ...prevPhoto,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validasi input
        if (!photo.judulFoto || !photo.deskripsiFoto) {
            alert("Field judul foto dan deskripsi foto harus di isi ya");
            return;
        }

        // Memeriksa tipe file
        if (file) {
            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                alert("File yang dimasukkan harus berupa gambar (jpg, jpeg, png)");
                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append("photo", file);
            formData.append("data", JSON.stringify(photo));

            const response = await fetch(`http://localhost:8080/photo/update/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // console.log("Update successful");
            alert("Update data oke");
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
                                <a className="btn btn-link nav-link" href="/add">
                                    Tambah Data
                                </a>
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
                {photo ? (
                    <div className="col-md-6">
                        <h2>
                            <center>Update Photo</center>
                        </h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <img
                                    src={
                                        temporaryImage
                                            ? temporaryImage
                                            : `http://localhost:8080/${photo.pathPhoto}`
                                    }
                                    alt={photo.photoName}
                                    className="card-img-top"

                                    width={250}
                                    height={250}
                                />
                            </div>
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
                                    value={photo.judulFoto}
                                    onChange={handleInputUpdate}
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
                                    onChange={handleInputUpdate}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </form>
                        <br />
                        <br />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default UpdatePhoto;