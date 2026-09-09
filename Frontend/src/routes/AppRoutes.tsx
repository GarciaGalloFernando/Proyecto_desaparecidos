import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import PersonaDetailPage from "../pages/PersonaDetailPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PersonasListPage from "../pages/admin/PersonasListPage";
import PersonaFormPage from "../pages/admin/PersonaFormPage";
import AdminPersonaDetailPage from "../pages/admin/PersonaDetailPage";
import UsuariosListPage from "../pages/admin/UsuariosListPage";
import UsuarioFormPage from "../pages/admin/UsuarioFormPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/personas/:id" element={<PersonaDetailPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="personas" element={<PersonasListPage />} />
          <Route path="personas/nueva" element={<PersonaFormPage />} />
          <Route path="personas/:id" element={<AdminPersonaDetailPage />} />
          <Route path="personas/:id/editar" element={<PersonaFormPage />} />

          <Route path="usuarios" element={<UsuariosListPage />} />
          <Route path="usuarios/nuevo" element={<UsuarioFormPage />} />
          <Route path="usuarios/:id/editar" element={<UsuarioFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;