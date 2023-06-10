import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AppContextContainer } from "../Context";
import Header from "../Components/Header";
import { API_LINK, HOST_LINK } from "../../envVariables";
import axios from "axios";
import { Link } from "react-router-dom";

const SinglePost = () => {
  const [story, setStory] = useState([])
  const [comment, setComment] = useState("")
  const { loading, userData, token, View, validToken } = useContext(AppContextContainer)
  const [pageLoading, setPageLoading] = useState(true)
  const { id } = useParams();
  const navigate = useNavigate("")
  useEffect(() => {
    setPageLoading(true)
    if (!loading) {
      if (!token || !validToken) {
        navigate("/");
        console.log("sdadsa")
        return;
      }
      axios.get(
        `${API_LINK}/story/post/${id}`,
        { headers: { "Authorization": token } }
      ).then(res => {
        setPageLoading(false)
        setStory(res.data.post)
      })
        .catch(err => {
          setPageLoading(false)
          console.log(err)
        })
    }
  }, [loading, token, validToken])
  function submitComment(id) {
    if (comment) {
      axios.patch(
        `${API_LINK}/story/commentOnPost/${id}`,
        { comment: comment },
        { headers: { "Authorization": token } }
      ).then(res => {
        if (res.data.success) {
          res.data.post.comments[res.data.post.comments.length - 1].author = userData;
          setStory(res.data.post)
          setComment("")
          return;
        }
        if (res.data?.msg) {
          alert(res.data.msg);
          return;
        }
      })
        .catch(err => console.log(err))
    }
  }
  function deletePost(id) {
    axios.delete(`${API_LINK}/story/delete/${id}`, {
      headers: {
        "Authorization": token,
      }
    }).then(res => {
      if (res.data?.msg) {
        alert(res.data.msg);
        return;
      }
      navigate("/")
    })
      .catch(err => console.log(err))
  }
  function deleteComment(id) {
    axios.delete(
      `${API_LINK}/story/deleteComment/${story._id}&${id}`,
      { headers: { Authorization: token } }
    ).then(res => {
      if (res.data?.msg) {
        alert(res.data.msg);
        return;
      }
      setStory(res.data.post);
    }).catch(err => console.log(err))
  }
  if (pageLoading) {
    return <section className="loadingScreen">{View}</section>
  }
  return <section >
    <Header />
    <main className="postsContainer" style={{ justifyContent: "center", alignItems: "center" }}>
      <div key={story._id} className="posts">
        <div className="postHeader">
          <div className="postAuthor">
            <img
              src={story.author.isOauthUser ? `${story.author.path}` : `${HOST_LINK}/${story.author.path}`}
              alt=""
              className="profilePic"
            />
            <h3>{story.author.name}</h3>
          </div>
          <div style={{ display: "flex", columnGap: "10px" }}>
            <Link to={`/edit/${story._id}`} className={story.author._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
              <button>
                Edit
              </button>
            </Link>
            <button onClick={() => deletePost(story._id)}
              className={story.author._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
              Delete
            </button>
          </div>
        </div>
        <h1>{story.name}</h1>
        <p>{story.story}</p>
        <img src={`${HOST_LINK}/${story.path}`}
          alt="" className="postImage" />

        <div className="commentsSection">
          {story.comments.length >= 1 && story.comments.map(comment => {
            return <div className="commentContainer" key={comment._id}>
              <div className="commentAuthorContainer">
                <div>
                  <Link to={`/user/${comment.author._id}`}>
                    <img
                      src={comment.author.isOauthUser ? `${comment.author.path}` : `${HOST_LINK}/${comment.author.path}`}
                    />
                  </Link>
                  <h4>{comment.author.name}</h4>
                </div>
                <button onClick={() => deleteComment(comment._id)}
                  className={userData._id == comment.author._id || userData._id == story.author._id ? "ButtonShow" : "ButtonDissapear"}>
                  Delete</button>
              </div>
              <p>{comment.text}</p>
            </div>
          })}
          <form className="newCommentContainer"
            onSubmit={(e) => {
              e.preventDefault()
              submitComment(story._id)
            }}>
            <img
              src={userData.isOauthUser ? `${userData.path}` : `${HOST_LINK}/${userData.path}`}
            />
            <input type="text"
              value={comment} onChange={(e) => setComment(e.target.value)} />
          </form>
        </div>
      </div>

    </main>
  </section>
}

export default SinglePost
