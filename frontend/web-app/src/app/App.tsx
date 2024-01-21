import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from '../routes/Home'

export default function App() {
    return (
        <div className="App" style={{height:"100%"}}>
            <h1>Welcome to React Router!</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="about" element={<About />} /> */}
            </Routes>
        </div>
    );
}
