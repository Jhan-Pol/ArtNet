import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const fetchPublications = async () => {
  const res = await axios.get("http://localhost:3000/api/publications/index");
  return res.data;
};

export const fetchUserLikes = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { likes: {}, userId: null };

  const { id: userId } = jwtDecode(token);
  const res = await axios.get(`http://localhost:3000/api/likes/user/${userId}`);
  const likesObj = {};
  res.data.forEach((pubId) => {
    likesObj[pubId] = true;
  });

  return { likes: likesObj, userId };
};

export const sendLike = async (userId, publicationId) => {
  await axios.post("http://localhost:3000/api/likes/create", {
    user_id: userId,
    publication_id: publicationId,
  });
};

export const removeLike = async (userId, publicationId) => {
  await axios.delete("http://localhost:3000/api/likes/delete", {
    data: {
      user_id: userId,
      publication_id: publicationId,
    },
  });
};

export const sendMessage = async (content, userId, publicationId) => {
  await axios.post("http://localhost:3000/api/comments/create", {
    content: content,
    userId: userId,
    publicationId: publicationId,
  });
};
