import { useContext, useState } from "react";
import { AppContextContainer } from "../Context";
import { HOST_LINK } from "../../envVariables";
import { Link } from "react-router-dom";
import "../scss/Header.scss"

export default function Header() {
  const { setUserData, userData, setToken, setValidToken } = useContext(AppContextContainer);
  const [file, setFile] = useState("");

  function logOut() {
    setUserData("");
    localStorage.removeItem("Token")
    setToken("");
    setValidToken(false);
  }
  return <header>
    <Link to={`/user/${userData._id}`}>
      <img src={userData.isOauthUser ? `${userData.path}` : `${HOST_LINK}/${userData.path}`} alt="profilepic" />
    </Link>
    <p>{userData.name}</p>
    <Link to="/home">
      <button>HomePage</button>
    </Link>
    <Link to="/changeDetails">
      <button>
        Change Details
      </button>
    </Link>
    <Link to="/create">
      <button>
        Create New Post
      </button>
    </Link>
    <button onClick={logOut}>
      Log Out
    </button>
  </header>
}
