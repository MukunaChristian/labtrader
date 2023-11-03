import './App.css'
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard'
import { Layout } from './pages/layout';
import { Login } from './pages/login';
import { Details } from './pages/Details';
import store from './store';
import axios from 'axios';
import { HashRouter } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_DATA_PROVIDER_URL;

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default App
