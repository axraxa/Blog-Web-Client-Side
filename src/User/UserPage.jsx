import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { API_LINK, HOST_LINK } from "../../envVariables";
import { AppContextContainer } from "../Context";
import "../scss/Homepage.scss"
import Header from "../Components/Header";

export default function UserPage() {
  const { View, loading, setLoading, token, validToken, userData } = useContext(AppContextContainer)
  const [stories, setStories] = useState([]);
  const [user, setUser] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const [currentScroll, setCurrentScroll] = useState(0)
  const [postsQuantity, setPostsQuantity] = useState(1)
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false)
  const navigate = useNavigate("");
  const { id } = useParams();

  useEffect(() => {
    setPageLoading(true)
    if (!loading) {
      if (!token || !validToken) {
        navigate("/");
        return;
      }
      axios.get(`${API_LINK}/story/UsersPosts/${id}&0`, { headers: { "Authorization": token } })
        .then(res => {
          setPageLoading(false)
          if (res.data?.msg) {
            return;
          }
          setStories(res.data.user.stories);
          setUser(res.data.user)
        })
        .catch(err => console.log(err));
    }
  }, [loading, token, validToken, id])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentScroll]);
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const maxScroll = scrollHeight - scrollTop;
    setCurrentScroll(maxScroll)

    if (maxScroll == clientHeight && !noMorePosts && !fetchingPosts) {
      setFetchingPosts(true)
      fetchPosts(postsQuantity);
    }
  };
  function fetchPosts(quantity) {
    axios.get(
      `${API_LINK}/story/UsersPosts/${id}&${quantity}`,
      { headers: { Authorization: token } }
    ).then(res => {
      setFetchingPosts(false)
      if (res.data?.msg) {
        alert(res.data.msg);
        return;
      }
      if (res.data.stories.length >= 1) {
        setPostsQuantity(prev => prev + 1)
        setStories(prev => [...prev, ...res.data.user.stories])
      } else {
        setNoMorePosts(true)
      }
    }).catch(err => {
      console.log(err)
      setFetchingPosts(false)
    })
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
      alert("You Deleted it successfully,Changes will apear after refreshing of page.")
    })
      .catch(err => console.log(err))
  }
  function NoPostsSituation() {
    if (stories.length < 1 && userData._id == user._id) {
      return <h1>You have not posts yet , post some.</h1>
    } else if (stories.length < 1) {
      return <h1>There is no posts from this user yet.</h1>
    }
  }
  if (pageLoading) {
    return <section className="loadingScreen">{View}</section>;
  }
  return <section style={{ width: "100%" }}>
    <Header />
    <main className="postsContainer" style={{ justifyContent: "center", alignItems: "center" }}>
      {stories.length >= 1 && stories.map((each, index) => {
        return <div key={each._id} className="posts">
          <div className="postHeader">
            <div className="postAuthor">
              <img src={user.isOauthUser ? `${user.path}` : `${HOST_LINK}/${user.path}`} className="profilePic" />
              <h3>{user.name}</h3>
            </div>
            <div style={{ display: "flex", columnGap: "10px" }}>
              <Link to={`/edit/${each._id}`} className={user._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
                <button>
                  Edit
                </button>
              </Link>
              <button onClick={() => deletePost(each._id)}
                className={user._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
                Delete
              </button>
            </div>
          </div>
          <h1>{each.name}</h1>
          <p>{each.story}</p>
          <img src={`${HOST_LINK}/${each.path}`}
            alt="" className="postImage" />

          <Link to={`/post/${each._id}`}>
            <button>comments</button >
          </Link>
        </div>
      })}
      <NoPostsSituation />
      {fetchingPosts && <h1>Loading More Posts...</h1>}
    </main>
  </section>
}
