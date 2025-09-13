import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IoMdSend } from "react-icons/io";
import { sendMessage } from "../../services/publicationService";

const DataPublication = () => {
  const { id } = useParams();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);
  const [commentText, setCommentText] = useState(""); // ← Estado del comentario
  const [username, setUsername] = useState(null);
  const [idUser, setIdUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { username } = jwtDecode(token);
      const { id } = jwtDecode(token);
      setUsername(username);
      setIdUser(id);
    }
  }, []);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/publications/find/${id}`
        );
        setPublications(response.data.publicacion);
        setComentarios(response.data.comentarios);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    };

    fetchPublication();
  }, [id]);

  // Función para enviar comentario
  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      await sendMessage(commentText, idUser, id);
      setCommentText(""); // Limpiar el input

      // Recargar comentarios luego de enviar
      const response = await axios.get(
        `http://localhost:3000/api/publications/find/${id}`
      );
      setComentarios(response.data.comentarios);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Detalles de la publicación</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando publicación...</p>
        </div>
      ) : (
        <div className="card shadow-sm p-4">
          <h3 className="card-title mb-3">{publications.title}</h3>
          <img
            src={publications.image}
            alt={publications.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <p className="card-text">{publications.description}</p>
          <p className="text-muted">
            <strong>Autor:</strong> {publications.username}
          </p>
          <p className="text-muted">
            <strong>Fecha:</strong>{" "}
            {new Date(publications.created_at).toLocaleDateString()}
          </p>

          <hr />

          <h4 className="mt-4">Comentarios</h4>
          {comentarios.length === 0 ? (
            <p className="text-muted">
              Rompe el hielo, sé el primero en comentar 🙂
            </p>
          ) : (
            <ul className="list-group">
              {comentarios.map((comentario) => (
                <li key={comentario.id} className="list-group-item">
                  <small className="text-muted">{comentario.username}</small>{" "}
                  <small className="text-muted">
                    {new Date(comentario.created_at).toLocaleDateString()}
                  </small>
                  <p className="mb-1">{comentario.content}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 d-flex align-items-center">
            <label htmlFor="comment" className="form-label me-2">
              Comenta aquí:
            </label>
            <input
              type="text"
              id="comment"
              name="commentText"
              className="form-control me-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
            <IoMdSend
              size={28}
              className="text-primary cursor-pointer"
              onClick={handleSendComment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPublication;
