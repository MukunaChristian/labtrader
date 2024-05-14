import './App.css'
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard'
import { Layout } from './pages/layout';
import { Login } from './pages/login';
import { ResetPassword } from './pages/ResetPassword';
import { Details } from './pages/Details';
import { Cart } from './pages/Cart';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Company } from './pages/Company';
import { Report } from './pages/Reports';
import { Confirm } from './pages/Confirm';
import { Orders } from './pages/Orders';
import { OrdersDetails } from './pages/OrdersDetails';
import {Checkout} from './pages/Checkout';
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company" element={<Company />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/details/:id" element={<OrdersDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default App
