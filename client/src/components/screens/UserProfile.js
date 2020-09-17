import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
  }, []);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "935px", margin: "80px auto" }}>
          <div className="profile-user">
            <div>
              <img className="profile-img" src={userProfile.user.pic}></img>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <h4 style={{ marginRight: "20px" }}>
                  {userProfile.user.username}
                </h4>
                {showfollow ? (
                  <button
                    style={{
                      color: "#8e8e8e",
                      boxShadow: "none",
                      border: "1px solid #999",
                    }}
                    className="btn waves-effect waves-light #ffffff white"
                    onClick={() => followUser()}
                  >
                    Theo dõi
                  </button>
                ) : (
                  <button
                    style={{
                      color: "#8e8e8e",
                      boxShadow: "none",
                      border: "1px solid #999",
                    }}
                    className="btn waves-effect waves-light #ffffff white"
                    onClick={() => unfollowUser()}
                  >
                    Hủy theo dõi
                  </button>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <h6>{userProfile.posts.length} bài viết</h6>
                <h6>{userProfile.user.followers.length} người theo dõi</h6>
                <h6>
                  Đang theo dõi {userProfile.user.following.length} người dùng
                </h6>
              </div>

              <div>
                <h5>Ton Ton</h5>
                <p>Hello</p>
              </div>
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  style={{ width: "250px", margin: "30px 20px 30px 20px" }}
                  key={item._id}
                  className="item"
                  src={item.image}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          Loading...
        </h2>
      )}
    </>
  );
};

export default Profile;
