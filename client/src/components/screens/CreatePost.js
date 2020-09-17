import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          image: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          } else {
            M.toast({
              html: "Đăng thành công",
              classes: "#388e3c green darken-2",
            });
            // Đăng nhập thành công đẩy đến home
            history.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [url]);

  const postDetails = () => {
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

  return (
    <div
      className="card input-filed"
      style={{
        margin: "100px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nội dung"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div
          style={{ color: "#333", boxShadow: "none", border: "1px solid #999" }}
          className="btn #ffffff white"
        >
          <span
            style={{
              textTransform: "none",
            }}
          >
            Tải lên hình ảnh
          </span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        style={{
          width: "100px",
          textTransform: "none",
          color: "#333",
          boxShadow: "none",
          border: "1px solid #999",
        }}
        className="btn waves-effect waves-light #ffffff white"
        onClick={() => postDetails()}
      >
        Đăng
      </button>
    </div>
  );
};

export default CreatePost;
