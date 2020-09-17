import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const SignUp = () => {
  const history = useHistory();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);
  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instargram-clone");
    data.append("cloud_name", "din6v2it9");
    fetch("https://api.cloudinary.com/v1_1/din6v2it9/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Email không hợp lệ!", classes: "#e53935 red darken-1" });
      return;
    }
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({ html: data.message, classes: "#388e3c green darken-2" });
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <h6>Đăng ký để xem ảnh và video từ bạn bè.</h6>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <div className="file-field input-field" style={{ marginTop: "0" }}>
            <div
              className="btn #ffffff white"
              style={{
                height: "35px",
                lineHeight: "35px",
                boxShadow: "none",
                border: "1px solid #999",
              }}
            >
              <span style={{ textTransform: "none", color: "#8e8e8e" }}>
                Tải lên avatar
              </span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            type="submit"
            className="btn waves-effect waves-light #2196f3 blue"
            onClick={() => PostData()}
          >
            Đăng ký
          </button>
          <p>
            Bằng cách đăng ký, bạn đồng ý với
            <Link className="policy-link" to="">
              {" "}
              Điều khoản,
            </Link>
            <Link className="policy-link" to="">
              {" "}
              Chính sách dữ liệu{" "}
            </Link>
            và
            <Link className="policy-link" to="">
              {" "}
              Chính sách cookie{" "}
            </Link>
            của chúng tôi.
          </p>
        </div>
        <div className="card auth-card input-field">
          <h5>
            Bạn có tài khoản?
            <Link to="/signin"> Đăng nhập</Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
