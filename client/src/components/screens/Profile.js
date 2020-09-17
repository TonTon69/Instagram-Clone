import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              // console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div style={{ maxWidth: "935px", margin: "80px auto" }}>
      <div className="profile-user">
        <div>
          <img className="profile-img" src={state ? state.pic : "Loading..."} />

          <div className="file-field input-field">
            <div
              style={{
                color: "#333",
                boxShadow: "none",
                border: "1px solid #999",
              }}
              className="btn #ffffff white"
            >
              <span style={{ textTransform: "none" }}>Tải ảnh lên</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state ? state.username : "loading"}</h4>
          <div style={{ display: "flex" }}>
            <h6>{mypics.length} bài viết</h6>
            <h6>{state ? state.followers.length : "0"} người theo dõi</h6>
            <h6>
              Đang theo dõi {state ? state.following.length : "0"} người dùng
            </h6>
          </div>
          {/* <div>
            <h5>Ton Ton</h5>
            <p>Hello</p>
          </div> */}
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              style={{ width: "250px", margin: "30px 30px 0 30px" }}
              key={item._id}
              className="item"
              src={item.image}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
