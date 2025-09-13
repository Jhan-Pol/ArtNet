import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Cambia la URL por la de tu backend (asegúrate de configurar CORS en backend)
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );

      if (response.data.success) {
        setSuccess("Usuario registrado correctamente");
        navigate("/login"); // Redirige al login después del registro exitoso
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    }
  };

  return (
    //-----------------------
    <div className={styles.container}>
      <h1 className={["mb-4", styles.tittle_form].join(" ")}>
        Registro en ArtNet
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form
        onSubmit={handleSubmit}
        // className={["p-4 border rounded shadow-sm bg-light", styles.form].join(
        //   " "
        // )}
        className={styles.form}
      >
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Signup;
