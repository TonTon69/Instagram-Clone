import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //  console.log(result)
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home" style={{ marginTop: "100px" }}>
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5
              style={{
                margin: "0",
                padding: "6px 6px 15px 24px",
                cursor: "pointer",
              }}
            >
              <Link
                style={{ fontSize: "16px", fontWeight: "550", color: "black" }}
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.username}
              </Link>

              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.image} />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  favorite_border
                </i>
              )}

              <h6
                style={{
                  marginTop: "0",
                  fontSize: "16px",
                  fontWeight: "550",
                  cursor: "pointer",
                }}
              >
                {item.likes.length} lượt thích
              </h6>

              <h6
                style={{ margin: "0", display: "flex", alignItems: "center" }}
              >
                <Link
                  style={{
                    fontSize: "16px",
                    fontWeight: "550",
                    color: "black",
                    marginRight: "4px",
                  }}
                  to={
                    item.postedBy._id !== state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  {item.postedBy.username}
                </Link>{" "}
                <p style={{ fontSize: "16px" }}>{item.body}</p>
              </h6>
              <h6 style={{ marginBottom: "0" }}>
                <Link
                  style={{
                    marginTop: "0",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#8e8e8e",
                  }}
                >
                  Xem tất cả {item.comments.length} bình luận
                </Link>
              </h6>
              {item.comments.map((record) => {
                return (
                  <h6
                    key={record._id}
                    style={{ fontSize: "16px", marginBottom: "0" }}
                  >
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.username}
                    </span>{" "}
                    {record.text}
                  </h6>
                );
              })}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input
                  className="home-comment"
                  type="text"
                  placeholder="Thêm bình luận..."
                />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
