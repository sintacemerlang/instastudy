import React, { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => {
        //console.log("datauser", e.target.value)
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = "http://localhost:8080/user/login"
        const userData = {
            username: username,
            password: password,
        }

        //console.log("data user", userData);
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            //jika respon dari server adalah 200(OK)
            if (response.ok) {
                const data = await response.json();
                //console.log("data response", data);

                if (data.loginuser === false) {
                    alert(data.message);
                } else {
                    // kondisi jika username dan password sesuai
                    localStorage.setItem("user", JSON.stringify(data.data[0]));
                    localStorage.setItem("isLoggedIn", "login");
                    window.location.replace("/home");
                    //alert(data.message);
                }
            } else {
                console.log("test")

            }

        } catch (error) {
            // Tangani kesalahan yang terjadi selama proses permintaan, misalnya kesalahan jaringan
            console.error("Error:", error);
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Website Galeri Foto</h1>
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
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
                &nbsp;
                <a href="/register" className="btn btn-info">
                    Register
                </a>
            </form>
        </div>
    );
}

export default Login;