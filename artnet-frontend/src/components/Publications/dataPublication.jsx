import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IoMdSend } from "react-icons/io";
import { sendMessage } from "../../services/publicationService";
import styles from "./Publication.module.css";

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
    <>
      {loading ? (
        <div className="">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando publicación...</p>
        </div>
      ) : (
        <div className={styles.data_container}>
          <div>
            <img
              src={publications.image}
              alt={publications.title}
              className={styles.publication_image}
              // style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

          <div>
            <h3 className={styles.tittle_image}>{publications.title}</h3>
            <p className="">{publications.description}</p>
            <p className="">
              <strong>Autor:</strong> {publications.username}
            </p>
            <p className="">
              <strong>Fecha:</strong>{" "}
              {new Date(publications.created_at).toLocaleDateString()}
            </p>
            <hr />
            <h4 className="">Comentarios</h4>
            {comentarios.length === 0 ? (
              <p className="">Rompe el hielo, sé el primero en comentar 🙂</p>
            ) : (
              <ul className="">
                {comentarios.map((comentario) => (
                  <li key={comentario.id} className="">
                    <small className="">{comentario.username}</small>{" "}
                    <small className="">
                      {new Date(comentario.created_at).toLocaleDateString()}
                    </small>
                    <p className="mb-1">{comentario.content}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="">
              <label htmlFor="comment" className="form-label me-2">
                Comenta aquí:
              </label>
              <input
                type="text"
                id="comment"
                name="commentText"
                className=""
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ maxWidth: "400px" }}
              />
              <IoMdSend size={28} className="" onClick={handleSendComment} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataPublication;
