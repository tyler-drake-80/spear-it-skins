import React from 'react';
import './App.css';
import NavBar from "./components/NavigationBar.jsx";
import {Routes, Route} from "react-router-dom";
import CategoryPage from "./pages/categoryPage.jsx";
import HomePage    from "./pages/homePage.jsx";
import GunPage from "./pages/gunPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path ="/"      element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/category/:type/:itemId" element={<GunPage />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/category/:type/:itemId/:gunId" element={<SkinPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

