import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_LINK, HOST_LINK } from "../../envVariables";
import { useNavigate, Link } from "react-router-dom";
import { AppContextContainer } from "../Context";
import "../scss/Guest.scss"
function Register() {
  const { View, loading, setLoading, token, validToken } = useContext(AppContextContainer)
  const [name, setName] = useState("")
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate("")
  useEffect(() => {
    if (!loading) {
      if (validToken) {
        navigate("/home");
      }
    }
  }, [loading, validToken])

  function submitHandler(e) {
    e.preventDefault()
    if (name && mail && password == passwordConfirm) {
      setLoading(true)
      axios.post(`${API_LINK}/user/register`, {
        username: name,
        mail: mail,
        password: password
      }).then(res => {
        setLoading(false)
        if (res.data != "User Created") {
          Object.keys(res.data.keyValue).forEach(error =>
            setErrors(prev => [...prev, `${error} ${res.data.keyValue[error]} is already in use.`]))
        } else {
          navigate("/")
          setErrors([]);
        }
      })

    } else {
      setErrors([])
      if (!name) {
        setErrors(prev => [...prev, "Fill the name field!"])
      }
      if (!mail) {
        setErrors(prev => [...prev, "Fill the mail field!"])
      }
      if (password != passwordConfirm) {
        setErrors(prev => [...prev, "Passwords don't match!"])
      }
    }
  }
  function ErrorContainer() {
    if (errors.length >= 1) {
      return <ul>
        {errors.map(each => <li>{each}</li>)}
      </ul>
    }
  }
  function googleRegisterHandler() {
    window.open(`${API_LINK}/user/auth/google`, "_self")
  }

  if (loading) {
    return <section className="loadingScreen">
      {View}
    </section>
  }
  return <section className="formContainer">
    <form className="Form" onSubmit={submitHandler}>
      <div>
        <label htmlFor="#username">Username</label>
        <input type="text" id="username" name="username" value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="#mail">Mail</label>
        <input type="email" id="mail" name="mail"
          value={mail} onChange={(e) => setMail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="#password">Password</label>
        <input type="password" id="password" name="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="#passwordConfirmation">Confirm Password</label>
        <input type="password" id="passwordConfirmation" name="passwordConfirm"
          value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
      </div>
      <ErrorContainer />
      <button type="submit">Register</button>
      <div class="google-btn" onClick={googleRegisterHandler}>
        <div class="google-icon-wrapper">
          <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
        </div>
        <p class="btn-text"><b>Register with Google</b></p>
      </div>
      <h5>Already signed up ? <Link to="/" style={{ textDecoration: "none" }}>Log In</Link></h5>
    </form>
  </section>
}

export default Register;
