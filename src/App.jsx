import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Dashboard = lazy(() => import("./pages/dashboard"));

const Login = lazy(() => import("./pages/auth/login"));
import Loading from "@/components/Loading";

import Layout from "./layout/Layout";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { initializeUserState } from "./store/userSlice";
import Encuestas from "./pages/encuestas";
import ServiciosActivos from "./pages/servicios-activos";
import ServicioDetails from "./pages/servicios-activos/project-details";
import HistorialServicios from "./pages/historial-servicios";
import HistorialServicioDetails from "./pages/historial-servicios/project-details";
import EncuestaAnswerDetails from "./pages/encuestas/encuesta-details";
import ErrorPage from "./pages/404";
function App() {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);
  const tokenRedux = useSelector((state) => state.user.token);

  const isLogedIn = Boolean(userRedux && tokenRedux);

  useEffect(() => {
    if (window !== "undefined") {
      const tokenLocal = JSON.parse(localStorage.getItem("token"))
        ? JSON.parse(localStorage.getItem("token"))
        : null;
      const userLocal = JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      dispatch(
        initializeUserState({
          token: tokenLocal,
          user: userLocal,
        })
      );
    }
  }, []);
  return (
    <main className="App  relative">
      <Routes>
        {isLogedIn ? (
          <>
            <Route path="/*" element={<Layout />}>
              {/* <Route path="servicios-activos" element={<ServiciosActivos />} /> */}
              <Route
                path="servicios-activos"
                element={
                  <Suspense fallback={<Loading />}>
                    <ServiciosActivos />
                  </Suspense>
                }
              />
              <Route
                path="historial-servicios"
                element={
                  <Suspense fallback={<Loading />}>
                    <HistorialServicios />
                  </Suspense>
                }
              />
              <Route
                path={"servicios-activos/:id"}
                element={
                  <Suspense fallback={<Loading />}>
                    <ServicioDetails />
                  </Suspense>
                }
              />

              <Route
                path={"historial-servicios/:id"}
                element={
                  <Suspense fallback={<Loading />}>
                    <HistorialServicioDetails />
                  </Suspense>
                }
              />

              <Route
                path="encuestas"
                element={
                  <Suspense fallback={<Loading />}>
                    <Encuestas />
                  </Suspense>
                }
              />
              <Route
                path="encuestas/answer/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <EncuestaAnswerDetails />
                  </Suspense>
                }
              />

              <Route path="*" element={<Navigate to="/404" />} />
            </Route>
            <Route
              path="/404"
              element={
                <Suspense fallback={<Loading />}>
                  <ErrorPage />
                </Suspense>
              }
            />
          </>
        ) : (
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            }
          />
        )}
      </Routes>
    </main>
  );
}

export default App;
