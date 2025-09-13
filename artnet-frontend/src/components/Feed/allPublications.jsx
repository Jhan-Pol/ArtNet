import styles from "./Feed.module.css";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchPublications,
  fetchUserLikes,
  sendLike,
  removeLike,
} from "../../services/publicationService";

const AllPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPublications, setLikedPublications] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const pubs = await fetchPublications();
        setPublications(pubs);

        const { likes, userId } = await fetchUserLikes();
        setLikedPublications(likes);
        setUserId(userId);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <>
      {loading ? (
        <p className={styles.text_loading}>Cargando publicaciones...</p>
      ) : (
        <div className={styles.publications_container}>
          {publications.map((pub) => (
            <div
              className={styles.publication_card}
              onClick={() => {
                navigate(`/publication/${pub.id}`);
              }}
              key={pub.id}
            >
              <img
                className={styles.publication_image}
                src={pub.image}
                alt={pub.title}
              />
              <div className={styles.publication_stats}>
                <div className={styles.container_likes}>
                  <FaHeart
                    className={`${styles.publication_stats_items} ${
                      likedPublications[pub.id] ? styles.heartLiked : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (likedPublications[pub.id]) {
                        removeLike(userId, pub.id).then(() => {
                          setLikedPublications((prev) => ({
                            ...prev,
                            [pub.id]: false,
                          }));
                        });
                      } else {
                        sendLike(userId, pub.id).then(() => {
                          setLikedPublications((prev) => ({
                            ...prev,
                            [pub.id]: true,
                          }));
                        });
                      }
                    }}
                  />
                </div>
                <FaCommentDots className={styles.publication_stats_items} />
              </div>
            </div>
          ))}
        </div>
      )}
      ;
    </>
  );
};

export default AllPublications;
