import { Suspense, lazy } from "react";
import { Routes, Route, useLocation, useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navigation/Navbar";

const AdminPage = lazy(() => import("./pages/admin"));

function TempoRoutes() {
  // This component will only be rendered when VITE_TEMPO is true
  // and it properly uses useRoutes within a Router context
  if (import.meta.env.VITE_TEMPO === "true") {
    return useRoutes(routes);
  }
  return null;
}

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && <TempoRoutes />}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
