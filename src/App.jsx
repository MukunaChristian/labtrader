import './App.css'
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/Dashboard'
import { Layout } from './pages/Layout';
import { Login } from './pages/Login';
import { Details } from './pages/Details';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Company } from './pages/Company';
import store from './store';
import axios from 'axios';


axios.defaults.baseURL = import.meta.env.VITE_DATA_PROVIDER_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company" element={<Company />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default App
