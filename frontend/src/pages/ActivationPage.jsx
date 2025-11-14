import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/actions/user";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          setLoading(true);
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          }, {
            withCredentials: true
          });

          console.log("Activation Response:", res.data);

          // Store token in localStorage if provided
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            console.log("Token stored in localStorage");
          }

          setMessage(res.data.message || "Account activated successfully!");
          toast.success("Account activated successfully!");

          // Load user data
          await dispatch(loadUser());

          // Wait a bit more for Redux state to update
          await new Promise(resolve => setTimeout(resolve, 200));

          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);

        } catch (error) {
          console.error("Activation Error:", error);
          const errorMessage = error.response?.data?.message || "Activation failed. Please try again.";
          setMessage(errorMessage);
          setError(true);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      activationEmail();
    } else {
      setError(true);
      setMessage("Invalid activation link");
      setLoading(false);
    }
  }, [activation_token, navigate, dispatch]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {loading ? (
        <div>
          <p>Activating your account...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red", fontSize: "18px", marginBottom: "10px" }}>
            {message || "Your token is expired!"}
          </p>
          <button
            onClick={() => navigate("/sign-up")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sign Up Again
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "green", fontSize: "18px", marginBottom: "10px" }}>
            {message || "Your account has been created successfully!"}
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Redirecting to home page...
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;