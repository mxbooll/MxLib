import { Routes, Route, Link } from "react-router-dom";
import React from "react";

import Home from './Home/Home'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
