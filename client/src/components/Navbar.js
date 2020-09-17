import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link className="nav-menu-link" to="/profile">
            Hồ sơ
          </Link>
        </li>,
        <li>
          <Link className="nav-menu-link" to="/create">
            Tạo bài đăng
          </Link>
        </li>,

        <li>
          <button
            style={{
              color: "black",
              boxShadow: "none",
              border: "1px solid #999",
            }}
            className="btn waves-effect waves-light #ffffff white"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Đăng xuất
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link className="nav-menu-link" to="/signin">
            Đăng nhập
          </Link>
        </li>,
        <li>
          <Link className="nav-menu-link" to="/signup">
            Đăng ký
          </Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
