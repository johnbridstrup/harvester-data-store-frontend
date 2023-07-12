import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/app/hooks";
import { persistCSRFToken } from "@/features/base/services";
import { authListener } from "@/features/auth/authSlice";
import BaseRoutes from "@/routes";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    persistCSRFToken();
    dispatch(authListener());
  }, [dispatch]);
  return (
    <>
      <BaseRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
