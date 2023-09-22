import './App.css'
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard'
import { Layout } from './pages/layout';
import { Login } from './pages/login';


function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
