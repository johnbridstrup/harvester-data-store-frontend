import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginData } from "@/features/auth/authTypes";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { persistCSRFToken } from "@/features/base/services";
import { FULLFILLED_PROMISE } from "@/features/base/constants";
import { login } from "@/features/auth/authSlice";
import { Loader } from "@/components/common";
import Logo from "@/assets/images/logo_full.png";
import "./styles.css";

function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    await persistCSRFToken();
    const res = await dispatch(login(loginData));
    if (res.type === FULLFILLED_PROMISE.auth) {
      navigate("/");
    } else {
      toast.error("invalid user credentials");
    }
  };

  const { username, password } = loginData;
  return (
    <div className="login-container">
      <div className="logo-full">
        <img src={Logo} alt="logo-full" />
      </div>
      <div>
        <form onSubmit={(e) => handleSubmit(e)} data-testid="login-form">
          <div className="form-wrapper">
            <div className="custom-form-group">
              <label className="custom-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                className="custom-form-control"
                name="username"
                id="username"
                value={username}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="custom-form-group">
              <label className="custom-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="custom-form-control"
                name="password"
                id="password"
                value={password}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="submit-group">
              <button type="submit" className="btn btn-md btn-primary">
                {loading ? <Loader size={25} /> : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
