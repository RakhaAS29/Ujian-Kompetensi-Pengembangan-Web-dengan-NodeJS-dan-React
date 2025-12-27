import { Routes, Route } from "react-router-dom";
import Beranda from "../pages/beranda";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Beranda />} />
        </Routes>
    )
}

export default App