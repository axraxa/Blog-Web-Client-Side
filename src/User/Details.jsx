import { useContext, useState, useEffect } from "react";
import { AppContextContainer } from "../Context";
import { API_LINK, HOST_LINK } from "../../envVariables";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../scss/changeDetails.scss"

export default function Details() {
  const { View, loading, setLoading, validToken, token, setToken, userData, setUserData } = useContext(AppContextContainer)
  const navigate = useNavigate("");
  const { mail, name } = userData;
  const [newMail, setNewMail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConf, setNewPasswordConf] = useState("")
  const [newName, setNewName] = useState("");
  const [file, setFile] = useState("");
  useEffect(() => {
    if (!loading) {
      if (!token || !validToken) {
        navigate("/");
      }
    }
  }, [loading, token, validToken])

  function changeMail() {
    if (newMail) {
      axios.patch(`${API_LINK}/user/updateMail`, {
        mail: newMail,
      }, {
        headers: { Authorization: token }
      }).then(res => {
        if (res.data?.msg) return alert("This mail is already in use")
        const { newToken, user } = res.data;
        setToken(newToken);
        setUserData(user);
        localStorage.setItem("Token", JSON.stringify(newToken))
        setNewMail("");
      })
    }
  }
  function changePassword() {
    if (newPassword) {
      if (newPassword == newPasswordConf) {
        axios.patch(`${API_LINK}/user/updatePassword`, {
          password: currentPassword,
          newPassword: newPassword,
        }, { headers: { Authorization: token } }).then(res => {
          if (res.data?.msg) {
            return alert(res.data.msg);
          }
          const { newToken, user } = res.data;
          setToken(newToken);
          setUserData(user);
          localStorage.setItem("Token", JSON.stringify(newToken))
          setNewPassword("");
          setNewPasswordConf("");
          setCurrentPassword("");
          alert("Password successfuly changed.")
        })
      } else {
        alert("Passwords don't match");
      }
    }
  }
  function changeName() {
    if (newName) {
      axios.patch(
        `${API_LINK}/user/updateName`,
        { name: newName },
        { headers: { Authorization: token } }
      ).then(res => {
        const { newToken, user } = res.data;
        setUserData(user);
        setToken(newToken);
        localStorage.setItem("Token", JSON.stringify(newToken))
        setNewName("");
      })
    }
  }
  function changePicture() {
    if (file) {
      const form = new FormData();
      form.append("file", file);
      axios.patch(
        `${API_LINK}/user/updateProfilePicture`,
        form,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then(res => {
          if (res.data?.msg) {
            alert(res.data.msg);
            setFile("");
            return;
          }
          setUserData(res.data.user);
          setToken(res.data.newToken)
          setFile("")
        })
        .catch(err => console.log(err))
    }
  }
  return (<section className="formContainer">
    <div className="userDetails">
      <input type="password" name="" id="hidden" style={{
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
      }} />

      <div>
      <img src={userData.isOauthUser ? `${userData.path}` : `${HOST_LINK}/${userData.path}`} alt="profilepic" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} name="file" />
        <button onClick={changePicture}>Change Profile Picture</button>
      </div>


      <div>
        <h3>Mail:{mail}</h3>
        <label htmlFor="newMail">New Mail</label>
        <input type="email" name="newMail" id="newMail"
          value={newMail} onChange={(e) => setNewMail(e.target.value)} />
        <button onClick={changeMail}>Change Mail</button>
      </div>
      <div>
        <h3>Name:{name}</h3>
        <label htmlFor="name">New name</label>
        <input type="text" id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button onClick={changeName}>Change Name</button>
      </div>
      <div className="password">
        <div>
          <label htmlFor="current">Current password</label>
          <input type="password" id="current" autoComplete="off"
            value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="new">New password</label>
          <input type="password" name="" id="new"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="newConf">Confirm new password</label>
          <input type="password" name="" id="newConf"
            value={newPasswordConf} onChange={(e) => setNewPasswordConf(e.target.value)} />
        </div>
        <button onClick={changePassword}>Change Password</button>
      </div>
      <Link to="/home">
        <button>
          Go To Homepage
        </button>
      </Link>
    </div>
  </section>)
}
