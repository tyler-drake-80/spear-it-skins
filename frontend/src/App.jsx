import React from 'react';
import './App.css';
import NavBar from "./components/NavigationBar.jsx";
import {Routes, Route} from "react-router-dom";
import CategoryPage from "./pages/categoryPage.jsx";
import HomePage    from "./pages/homePage.jsx";
import GunPage from "./pages/gunPage.jsx";
import SkinPage from "./pages/skinPage.jsx";
import GlovesPage from "./pages/glovesPage.jsx"

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"                 element={<HomePage />} />
        <Route path="/category/gloves"  element = {<GlovesPage />} />
        <Route path="/category/:type"   element={<CategoryPage />} />
        <Route path="/category/:type/:itemId"        element={<GunPage />} />
        <Route path="/category/:type/:itemId/:gunId" element={<SkinPage />} />


      </Routes>
   </>
  );
}

export default App;

