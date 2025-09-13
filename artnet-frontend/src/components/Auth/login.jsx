import axios from "axios";
import { use, useState } from "react";
import styles from "./Auth.module.css";
import Feed from "../Feed/index.jsx"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        setSuccess("Usuario autenticado correctamente");
        navigate("/feed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al autenticar");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={["mb-4", styles.tittle_form].join(" ")}>
        Login en ArtNet
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
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
          Iniciar sesion
        </button>
        <p>¿Aun no tienes una cuenta?</p>
        <a href="/">Registrate aqui</a>
      </form>
    </div>
  );
};
export default Login;
