import React, {useEffect, useState} from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage } from "./Routes.js";
import {  ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {  loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
import axios from "axios";
import { server } from "./server";

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        {/* <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route path="/products" element={<ProductsPage/>}/>
         <Route path="/best-selling" element={<BestSellingPage/>}/>
          <Route path="/events" element={<EventsPage/>}/>
           <Route path="/faq" element={<FAQPage/>}/> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
