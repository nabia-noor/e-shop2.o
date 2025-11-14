import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  TrackOrderPage,
} from "./routes/Routes.js";
import { ShopDashboardPage, ShopCreateProduct, ShopAllProducts, ShopCreateEvent, ShopAllEvents, ShopAllCoupouns, ShopAllOrders, ShopOrderDetails, OrderDetailsPage, } from "./routes/ShopRoutes";
import ShopDashboardProfile from "./pages/Shop/ShopDashboardProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadUser, loadSeller } from "./redux/actions/user";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { useSelector } from "react-redux";
import { ShopHomePage } from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import axiosInstance from "./axios";
import { server } from "./server";

const stripePromise = loadStripe(
  "pk_test_12345_yahan_apna_publishable_key_lagao"
);

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const location = useLocation();


  async function getStripeApiKey() {
    try {
      const { data } = await axiosInstance.get("/payment/stripeapikey");
      if (data && data.stripeApikey) {
        setStripeApiKey(data.stripeApikey);
      }
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
      // Don't set error state, just log it - app can still work without it
    }
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    getStripeApiKey();
  }, []);

  useEffect(() => {
    if (isSeller && seller?._id) {
      if (location.pathname === "/shop-login" || location.pathname === "/shop-create") {
        navigate(`/shop/${seller._id}`);
      }
    }
  }, [isSeller, seller, navigate, location.pathname]);


  console.log(isSeller, seller)
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order/success/:id" element={<OrderSuccessPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        {/* shop Routes */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/shop/:id" element={
          <SellerProtectedRoute isSeller={isSeller}>
            <ShopHomePage />
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard" element={<ShopDashboardPage />} />
        <Route path="/dashboard/profile" element={<ShopDashboardProfile />} />
        <Route path="/dashboard-create-product" element={<ShopCreateProduct />} />
        <Route path="/dashboard-products" element={<ShopAllProducts />} />
        <Route path="/dashboard-create-event" element={<ShopCreateEvent />} />
        <Route path="/dashboard-events" element={<ShopAllEvents />} />
        <Route path="/dashboard-coupouns" element={<ShopAllCoupouns />} />
        <Route path="/dashboard-orders" element={<ShopAllOrders />} />
        <Route path="/order/:id" element={<ShopOrderDetails />} />


        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          }
        />
      </Routes>

      {/* Toastify notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
