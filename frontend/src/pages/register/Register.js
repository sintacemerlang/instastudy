import React, { useState } from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [namaLengkap, setNamaLengkap] = useState("");
    const [alamat, setAlamat] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNamaLengkapChange = (e) => {
        setNamaLengkap(e.target.value);
    };

    const handleAlamatChange = (e) => {
        setAlamat(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = "http://localhost:8080/user/register";
        const userData = {
            username: username,
            password: password,
            email: email,
            namaLengkap: namaLengkap,
            alamat: alamat,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            // Jika respons dari server adalah 200 (OK), lakukan sesuatu
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                if (data.success) {
                    alert("Berhasil Melakukan Registrasi");
                    window.location.replace("/");
                } else {
                    alert(data.message);
                    return false;
                }
            }
        } catch (error) {
            // Tangani kesalahan yang terjadi selama proses permintaan, misalnya kesalahan jaringan
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Register Username</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Masukan Username Anda"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Masukan Password Anda"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="namaLengkap" className="form-label">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="nama"
                        value={namaLengkap}
                        onChange={handleNamaLengkapChange}
                        placeholder="Masukan Nama Anda"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Masukan Email Anda"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="alamat" className="form-label">
                        Alamat
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="alamat"
                        value={alamat}
                        onChange={handleAlamatChange}
                        placeholder="Masukan Alamat Anda"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
            <br />
            <br />
        </div>
    );
}

export default Register;