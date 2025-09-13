import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Main from "./components/Intro/main.tsx";
import Feed from "./components/Feed";
import Signup from "./components/Auth/signUp.jsx";
import Login from "./components/Auth/login.jsx";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/Routes/privateRoute.jsx";
import DataPublication from "./components/Feed/dataPublication.jsx";
import AllPublications from "./components/Feed/allPublications.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas protegidas */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed Component={AllPublications} />
            </PrivateRoute>
          }
        />
        <Route
          path="/publication/:id"
          element={
            <PrivateRoute>
              <DataPublication />
            </PrivateRoute>
          }
        />
        {/* rutas de autenticación */}
        <Route path="/" element={<Main />}>
          <Route path="login" element={<Login />} />
          <Route index element={<Signup />} />
        </Route>

        {/* ruta de no encontrado (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
