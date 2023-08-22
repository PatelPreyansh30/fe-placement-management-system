import {
  ApiConstant,
  ApplicationConstant,
} from "@/constant/applicationConstant";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import Captcha from "../captcha/Captcha";
import { LoginInputType } from "@/utils/types";
import { joiUtils } from "@/utils/joiValidation";
import authClient from "@/network/authClient";
import { useDispatch, useSelector } from "react-redux";
import { initialLoginState } from "@/store/slice/loginSlice";
import { RootState } from "@/store/store";

const Login = () => {
  const [loginInputState, setLoginInputState] = useState<LoginInputType>({
    email: "",
    password: "",
    captcha: "",
  });
  const captcha = useSelector((state: RootState) => state.extra.captchaValue);
  const dispatch = useDispatch();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setLoginInputState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClickLogin = () => {
    const { status, message } = joiUtils.validateLoginData(loginInputState);
    if (status) {
      if (captcha === loginInputState.captcha) {
        callLoginAPI();
      } else {
        // setFieldError("Invalid captcha value");
      }
    } else {
      // setFieldError(message);
    }
  };

  const callLoginAPI = async () => {
    const responce = await authClient.post(ApiConstant.AUTHENTICATE_USER, {
      email: loginInputState.email,
      password: loginInputState.password,
    });
    dispatch(initialLoginState({ ...responce.data, isAuthenticated: true }));
    localStorage.setItem(
      ApplicationConstant.REFRESH_TOKEN,
      responce.data.refresh
    );
  };

  return (
    <>
      <p className="mt-6 text-3xl font-bold">Login</p>
      <div className="grid grid-cols-1 gap-4 mt-3">
        <TextField
          value={loginInputState.email}
          name="email"
          label="Email"
          type="email"
          onChange={handleOnChange}
          required
          variant="standard"
        />
        <TextField
          value={loginInputState.password}
          name="password"
          label="Password"
          type="password"
          onChange={handleOnChange}
          required
          variant="standard"
        />
        <TextField
          value={loginInputState.captcha}
          name="captcha"
          label="Enter captcha here"
          onChange={handleOnChange}
          required
          variant="standard"
        />
      </div>
      <Captcha className="mt-2" />
      <Button variant="outlined" className="mt-4" onClick={handleClickLogin}>
        Log in
      </Button>
      <div className="mt-3.5">
        {`Don't have an student account?`}{" "}
        <Link
          href={ApplicationConstant.REGISTER_URL_PATH}
          className="font-semibold"
        >
          Register here
        </Link>
      </div>
    </>
  );
};

export default Login;
