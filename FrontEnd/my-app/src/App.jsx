import React from 'react';
import './App.css';
import NavBar from "./components/NavigationBar.jsx";
import BasicButtonExample from './components/dropdown.jsx';
import {Routes, Route} from "react-router-dom";
import CategoryPage from "./pages/pistolsPage.jsx";
import HomePage    from "./pages/homePage.jsx";
import GunPage from "./pages/gunPage.jsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path ="/"      element={<HomePage />} />
        <Route path="/category/:type/:itemId" element={<GunPage />} />
        <Route path="/category/:type" element={<CategoryPage />} />


      </Routes>
   </>
  );
}

export default App;

//home page 