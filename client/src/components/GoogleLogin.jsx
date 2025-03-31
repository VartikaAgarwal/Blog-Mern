import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { RouteIndex } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import { useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      const apiUrl = `${getEnv("VITE_API_BASE_URL")}/auth/google-login`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }

      showToast("success", data.message);
      dispatch(setUser(data.user));
      navigate(RouteIndex);
    } catch (error) {
      showToast("error", `Request failed: ${error.message}`);
    }
  };
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      <FcGoogle />
      Continue With Google
    </Button>
  );
};

export default GoogleLogin;
