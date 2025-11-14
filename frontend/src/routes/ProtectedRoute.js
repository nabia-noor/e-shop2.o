import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/actions/user";

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    const loadAttempted = useRef(false);
    const [hasWaitedForInitialLoad, setHasWaitedForInitialLoad] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // If already authenticated, we're good
            if (isAuthenticated && user) {
                setHasWaitedForInitialLoad(true);
                return;
            }

            // Once loading completes for the first time, mark that we've waited
            if (!loading && !hasWaitedForInitialLoad) {
                setHasWaitedForInitialLoad(true);
            }

            // If we have a token, user is not authenticated, not loading, and we haven't tried yet
            if (!isAuthenticated && !loading && !loadAttempted.current && hasWaitedForInitialLoad) {
                loadAttempted.current = true;
                dispatch(loadUser());
            }
        } else {
            // No token, no need to wait
            setHasWaitedForInitialLoad(true);
        }
    }, [dispatch, isAuthenticated, user, loading, hasWaitedForInitialLoad]);

    // Check if we have a token
    const token = localStorage.getItem("token");

    // If no token, redirect to login immediately
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Wait for initial load to complete OR if still loading
    if (!hasWaitedForInitialLoad || loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    // After loading completes, if authenticated and user exists, render children
    if (isAuthenticated && user) {
        return children;
    }

    // If not authenticated after loading completes, redirect to login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;


