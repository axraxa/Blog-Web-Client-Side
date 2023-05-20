import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_LINK, HOST_LINK } from "../../envVariables";
import { AppContextContainer } from "../Context";
import { Link } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const { userData, loading, setLoading, token } = useContext(AppContextContainer)
  const [file, setFile] = useState("")
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [postId, setPostId] = useState("")
  const [newTitle, setNewTitle] = useState("");
  const [newStory, setNewStory] = useState("")
  const [newFile, setNewFile] = useState("")
  const [pageLoading,setPageLoading] = useState(true)
  const navigate = useNavigate("");

  useEffect(() => {
      setPageLoading(true)
    if (!loading && !userData?.stories?.includes(`${id}`)) {
      navigate("/home")
      return;
    }
    if (!loading) {
      axios.get(`${API_LINK}/story/post/${id}`, { headers: { "Authorization": token } })
        .then(res => {
          if (res.data?.msg) return console.log(res.data.msg);
          setTitle(res.data.post.name)
          setStory(res.data.post.story)
          setFile(res.data.post.path)
          setPostId(res.data.post._id)
          setPageLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    }

  }, [loading])

  function postTitleChange() {
    if (newTitle != title) {
      axios.patch(`${API_LINK}/story/titleUpdate`, { name: newTitle, id: postId }, {
        headers: {
          "Authorization": token,
        },
      })
        .then(res => alert(res.data.msg))
        .catch(err => console.log(err))
    }
  }
  function postStoryChange() {
    if (newStory != story) {
      axios.patch(`${API_LINK}/story/storyUpdate`, { story: newStory, id: postId }, {
        headers: {
          "Authorization": token,
        }
      })
        .then(res => alert(res.data.msg))
        .catch(err => console.log(err))
    }
  }

  function postImageChange() {
    if (newFile) {
      const form = new FormData();
      form.append("file", newFile);
      axios.patch(`${API_LINK}/story/imageUpdate/${postId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": token,
        }
      }).then(res => alert(res.data.msg))
        .catch(err => alert(err.response.data.msg))
    }
  }
  if (pageLoading) {
    return <section className="loadingScreen">
      Loading ...
    </section>
  }
  return <section className="formContainer">
    <div className="userDetails">
      <div>
        <input type="text" name="title" placeholder="Your new title"
          defaultValue={title} onChange={(e) => setNewTitle(e.target.value)} />
        <button onClick={postTitleChange}>Change Your Title</button>
      </div>
      <div>
        <textarea defaultValue={story} onChange={(e) => setNewStory(e.target.value)}
          name="story" id="" cols="30" rows="10" placeholder="Your new story here">
        </textarea>
        <button onClick={postStoryChange}>Change Your Story</button>
      </div>
      <div>
        <img src={`${HOST_LINK}/${file}`} alt="" style={{ width: "60%" }} />
        <input type="file" name="file" id=""
          onChange={(e) => setNewFile(e.target.files[0])} />
        <button onClick={postImageChange}>Change Your Post Image</button>
      </div>
      <Link to="/">
        <button>
          Go To Homepage
        </button>
      </Link>
    </div>
  </section>
}
