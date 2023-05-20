import axios from "axios";
import { useContext, useState, useEffect } from "react"
import { API_LINK, HOST_LINK } from "../../envVariables";
import { AppContextContainer } from "../Context";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import "../scss/Guest.scss"

function Login() {
  const { View, loading, setLoading, validToken, setToken, setUserData, setValidToken, token } = useContext(AppContextContainer);
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate("");
  useEffect(() => {
    if (!loading) {
      if (validToken) {
        navigate("/home");
      }
    }
  }, [validToken])
  function submitHandler(e) {
    e.preventDefault();

    if (password && mail) {
      setLoading(true)
      axios.post(`${API_LINK}/user/login`, {
        mail: mail,
        password: password
      }).then(res => {
        setLoading(false)
        const userData = res.data;
        if (userData.msg) return setError(userData.msg);

        localStorage.setItem("Token", JSON.stringify(userData.token));
        setToken(userData.token);
        setUserData(userData.user)
        setValidToken(true);
        navigate("/");
      });
    }
  }

  if (loading) {
    return <section className="loadingScreen">
      {View}
    </section>
  }
  return (<section className="formContainer">
    <form className="Form" onSubmit={submitHandler}>
      <div>
        <label htmlFor="mail">Mail</label>
        <input type="email" name="mail" id="mail"
          value={mail} onChange={(e) => setMail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <p>{error}</p>
      <button type='submit'>Log In</button>
      <h5>Not signed up yet ? <Link style={{ textDecoration: "none" }} to="/register">Register</Link></h5>
    </form >
  </section>
  )
}

export default Login 
