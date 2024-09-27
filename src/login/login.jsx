import React from "react";
import { Form, Input, Button } from "antd";
import "./login.css";
import { auth, googleprovider } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleprovider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential =
          GoogleAuthProviderrovider.credentialFromResult(result);
        console.log(credential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>LOGIN</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input type="email" placeholder="Enter Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <div className="forgot-password">
            <a href="/">Forgot password?</a>
          </div>

          <Form.Item>
            <Button
              className="signin-button"
              type="primary"
              htmlType="submit"
              block
            >
              SIGN IN
            </Button>
          </Form.Item>
        </Form>

        <div className="login-google">
          <Button
            className="google-button"
            type="default"
            block
            onClick={handleLoginGoogle}
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACoCAMAAACPKThEAAABklBMVEX////+/v40qFP///1FhPXqQjf4vA
              TtQTfsQjUzp1RFhPZFhfP8uwc+fvqYufFChfUzqFA3eu7e7v4zeefk8PzpQzP7///3vQH73d3oRDf+//r6uAAxq1PoPC/vQjbsOy7eOS3bOjR
              DhvA0qkvh8+n89vj/7+z95OH+9/D249nrx8PpopbpiIHjZ13aSTbdNSHkLiLeRz7qZWPppaDnmZXYa1veRCvhb2fwzcrqr6jpQCfpuLXosKDq
              NR/ZMCTlbWrpeXbmh4rlgnXmcGbyxrvfkZDeOTf129Dvvq7gW1L36eDkno/gaFfjMxr33+LcTU7binndWTH74JHtdSLykxX56KjyrRjhTSb1x
              j/tYiL78snyhCP503H+/eH0vCT577n5pSDz6Jv62KTyyC9ypvBWjua4zO344qL70F6fv+b123nl36Ahb+KDrSpgr3fkwBNeqzvF1/XEwSeOyq
              CitS3X8NxIqWiBn/BrtoZbqU+w4rnF58k2iLY9mJ2BwJU6n3Q/itw+lqo4nYg/jdQ7lqjH4d8NdAbXAAAMiElEQVR4nO3djV/bxhkH8JMPyZJ
              tsAz4jM6WbWzzGgiiyUISSpJ2WdKyptv6sqU0JO0KbZKttJTaY3FLX/d/7znJGL9IlmSQHAn92tIWbBDfz3OnR3e2glCUKFGiRIkSJUqUKFGi
              RIkSJUqUKFGiRIkS3HCvSUbt4CSjNjrNqB06whH9gDoOiRDc+uxrkdHR9IVwiMC/5uYXZvQszM9h5vXaFNaogYxg9mFxafnKyurV8tqaZqQ8u
              /7GyrXl9+f0h4xa6jWwwpQjCM8tX//DDU1TVbVYLIp6iiylUknTZjeu31xkdXd2tJfTChG6dOu98pamKiLP82I7RSMir/C3S+Xyvc3tjiddPi
              sCJbX95uralqqKYlZRTK3ELF8U4/HS1p27m/OgBKPx8lmxnz2zUi6VACabzcJHM6ui2PooKnFt/fqC8bxLZcVBSaHlu5oa55V4y4o3tSrGdS7
              4qsJn1Tv3ZmCOG00fMSIqjBFeXl1T2bDjeb2oDKuzxLtz+lVVu7eEjOO+DFYcaxEe3gUpRWkJ2Fp1fL5UfmseXRIr+Klk8W1NVTpgXFhBSuVb
              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
              /x+uSEhH5QAAAABJRU5ErkJggg=="
              alt="Google logo"
              width={50}
            />
            <span>Login with Google</span>
          </Button>
        </div>

        <div className="register-link">
          Not a member? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
