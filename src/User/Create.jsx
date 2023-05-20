import { useContext, useEffect, useState } from "react"
import { API_LINK } from "../../envVariables";
import axios from "axios";
import { AppContextContainer } from "../Context"
import { Link, useNavigate } from "react-router-dom";
import "../scss/PostCreate.scss"
export default function Create() {
  const { View, loading, setLoading, token, validToken } = useContext(AppContextContainer)
  const navigate = useNavigate("");
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [story, setStory] = useState("")
  const [error, setError] = useState("");
  useEffect(() => {
    if (!loading) {
      if (!token || !validToken) {
        navigate("/");
      }
    }
  }, [loading, token, validToken])


  function submitStory(e) {
    e.preventDefault();
    if (name && file && story) {
      const form = new FormData();
      form.append("file", file);
      form.append("name", name);
      form.append("story", story);
      axios.post(`${API_LINK}/story/create`,
        form, { headers: { "Content-Type": "multipart/form-data", "Authorization": token } }
      )
        .then(res => {
          if (res.data?.msg) {
            setError(err.response.data.msg)
            setFile("");
            return;
          }
          setFile("");
          setName("");
          setStory("");
          alert("You posted it successfuly");
          navigate("/home");
        }).catch(err => {
          if (err.response.data.msg) {
            setError(err.response.data.msg)
            setFile("");
            return;
          }
        })
    }
  }
  if (loading) {
    return <section className="loadingScreen">
      {View}
    </section>
  }
  return <section className="formContainer">
    <form onSubmit={submitStory} className="postCreateForm">
      <input type="file" name="file" className="fileUpload" onChange={(e) => {
        setFile(e.target.files[0])
      }} />
      <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}
        placeholder="place your story's name here" />
      <textarea name="story" id="" value={story} onChange={(e) => setStory(e.target.value)}
        cols="30" rows="10" placeholder="place your story here"></textarea>
      <button type="submit">Add your story</button>
      <p>{error}</p>
      <Link to="/home"><button>Go to Homepage</button></Link>
    </form>
  </section>
}
