import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const PostData = (e) => {
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            class="btn waves-effect waves-light #2196f3 blue"
            type="submit"
            name="action"
            onClick={() => PostData()}
          >
            Đăng nhập
          </button>

          <Link to="">Quên mật khẩu?</Link>
        </div>
        <div className="card auth-card input-field">
          <h5>
            Bạn chưa có tài khoản?
            <Link to="/signup"> Đăng ký</Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
