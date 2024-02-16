import React, { useState, useEffect } from "react";

function Home(params) {
    //state untuk menyimpan data foto
    const [photos, setPhotos] = useState([]);
    const [userID, setUserID] = useState(null);

    function formatDate(dateString) {
        const uploadDate = new Date(dateString);
        const year = uploadDate.getFullYear();
        const month = String(uploadDate.getMonth() + 1).padStart(2, "0");
        const date = String(uploadDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

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

    useEffect(() => {
        // Panggil fetchPhotos() hanya jika userID tidak null
        if (userID !== null) {
            fetchPhotos();
        }
    }, [userID]);

    const fetchPhotos = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/photo/getphoto/${userID}`
            );
            const data = await response.json();
            setPhotos(data.data); // Set data foto ke dalam state
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    };

    const handleDeletePhoto = async (id) => {
        // Konfirmasi penghapusan menggunakan alert
        const isConfirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus ini?"
        );
        if (isConfirmed) {
            try {
                await fetch(`http://localhost:8080/photo/delete/${id}`, {
                    method: "DELETE",
                });
                alert("data berhasil dihapus");
                // Panggil fetchPhotos lagi untuk memperbarui daftar foto setelah penghapusan
                fetchPhotos();
            } catch (error) {
                console.error("Error deleting photo:", error);
            }
        }
    };

    const handleLogout = () => {
        // Menghapus semua item dari local storage
        localStorage.clear();

        // Redirect ke halaman
        window.location.replace("/");
    };

    const handleLikeToggle = (id, currentLike) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.fotoID === id ? { ...photo, like: !currentLike } : photo
            )
        );
        // Hit the API to update like status
        fetch(`http://localhost:8080/photo/like/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ like: currentLike ? 0 : 1 }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log("Like status updated successfully");
            })
            .catch((error) => {
                console.error("Error updating like status:", error);
                // Revert the local state if API call fails
                setPhotos((prevPhotos) =>
                    prevPhotos.map((photo) =>
                        photo.fotoID === id ? { ...photo, like: currentLike } : photo
                    )
                );
            });
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg  navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="#">
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

            <div className="container mt-5">
                <center>
                    <h2>List Photo</h2>
                </center>
                <div className="row">
                    {photos &&
                        photos.map((photo, index) => ( //looping js
                            <div
                                className="col-4"
                                key={photo.fotoID}
                                style={{ marginTop: "15px" }}>
                                <div className="card" style={{ width: "18rem" }}>
                                    <img
                                        src={`http://localhost:8080/${photo.pathPhoto}`}
                                        alt={photo.photoName}
                                        className="card-img-top"
                                        width={30}
                                        height={250}
                                    />
                                    <div className="card-body">
                                        <p className="card-title">
                                            {photo.judulFoto} - {formatDate(photo.tanggalUnggah)} -{" "}
                                            {photo.like}
                                        </p>
                                        <p className="card-text">{photo.deskripsiFoto}</p>
                                        <button
                                            onClick={() => handleLikeToggle(photo.fotoID, photo.like)}
                                            className={`btn ${photo.like ? "btn-success" : "btn-outline-success"
                                                }`}>
                                            {photo.like ? "Unlike" : "Like"}
                                        </button>
                                        &nbsp;&nbsp;
                                        <a
                                            href={`/update/${photo.fotoID}`}
                                            className="btn btn-info">
                                            Edit
                                        </a>
                                        &nbsp;&nbsp;
                                        <button
                                            onClick={() => handleDeletePhoto(photo.fotoID)}
                                            className="btn btn-danger">
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
export default Home;