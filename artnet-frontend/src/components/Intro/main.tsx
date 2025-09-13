import React from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Intro from "../Intro";
import Signup from "../Auth/signUp";
import Login from "../Auth/login";
import styles from "./Intro.module.css";
import { useMatch } from "react-router-dom";

export default function Main() {
  let description = "";

  const isLogin = useMatch("/login");
  const isRoot = useMatch("/");

  if (isLogin) {
    description = `✨ Vuelve al lugar donde tus ideas toman forma. Inicia sesión y sigue explorando lo que te inspira.

🌟 Tu mundo visual comienza con un solo clic`;
  } else if (isRoot) {
    description = `🎨 Bienvenido a ArtNet.
Descubre un mundo visual lleno de ideas, estilos y creatividad.🌆

🌟Comparte tu visión, crea tableros únicos y conecta con una comunidad creativa que no deja de imaginar.🌎`;
  }

  return (
    <div className={styles.sesion_container}>
      <div className={styles.intro}>
        <Intro description={description} />
      </div>
      <div className={styles.form}>
        <Outlet />
      </div>
    </div>
  );
}
