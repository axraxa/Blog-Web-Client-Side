import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { API_LINK, HOST_LINK } from "../../envVariables";
import { AppContextContainer } from "../Context";
import "../scss/Homepage.scss"
import Header from "../Components/Header";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const { View, loading, setLoading, token, validToken, userData } = useContext(AppContextContainer)
  const [pageLoading, setPageLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentScroll, setCurrentScroll] = useState(0)
  const [postsQuantity, setPostsQuantity] = useState(1)
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false)
  const [submittedSearch, setSubmittedSearch] = useState("")
  const navigate = useNavigate("");

  useEffect(() => {
    setPageLoading(true)
    if (!loading) {
      if (!token || !validToken) {
        navigate("/");
        return;
      }
      axios.get(`${API_LINK}/story/posts`, { headers: { "Authorization": token } })
        .then(res => {
          setPageLoading(false)
          if (res.data?.msg) {
            return;
          }
          setStories(res.data.stories);
        })
        .catch(err => console.log(err));
    }
  }, [loading, token, validToken])

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
    if (!submittedSearch) {
      axios.get(
        `${API_LINK}/story/posts/${quantity}`,
        { headers: { Authorization: token } }
      ).then(res => {
        setFetchingPosts(false)
        if (res.data?.msg) {
          alert(res.data.msg);
          return;
        }
        if (res.data.stories.length >= 1) {
          setPostsQuantity(prev => prev + 1)
          setStories(prev => [...prev, ...res.data.stories])
        } else {
          setNoMorePosts(true)
        }
      }).catch(err => {
        console.log(err)
        setFetchingPosts(false)
      })
    } else {
      axios.get(
        `${API_LINK}/story/postsSearch/${submittedSearch}&${quantity}`,
        { headers: { Authorization: token } }
      ).then(res => {
        setFetchingPosts(false)
        if (res.data?.msg) {
          alert(res.data.msg);
          return;
        }
        if (res.data.stories.length >= 1) {
          setPostsQuantity(prev => prev + 1)
          setStories(prev => [...prev, ...res.data.stories])
        } else {
          setNoMorePosts(true)
        }
      }).catch(err => {
        console.log(err)
        setFetchingPosts(false)
      })
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
      alert("You Deleted it successfully,Changes will apear after refreshing of page.")
    })
      .catch(err => console.log(err))
  }
  function searchHandler(e) {
    e.preventDefault();
    setSubmittedSearch(search)
    setPostsQuantity(1)
    if (search) {
      axios.get(`${API_LINK}/story/postsSearch/${search}&0`, { headers: { "Authorization": token } })
        .then(res => {
          if (res.data?.msg) {
            alert(res.data.msg)
            return;
          }
          setStories(res.data.stories)
        }).catch(err => console.log(err))
    } else {
      axios.get(`${API_LINK}/story/posts`, { headers: { "Authorization": token } })
        .then(res => {
          setPageLoading(false)
          if (res.data?.msg) {
            return;
          }
          setStories(res.data.stories);
        })
        .catch(err => console.log(err));
    }
  }
  if (pageLoading) {
    return <section className="loadingScreen">{View}</section>;
  }
  return <section style={{ width: "100%" }}>
    <Header />
    <form className="postsContainer" style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", columnGap: "10px" }}
      onSubmit={searchHandler}>
      <h1>Search Posts: </h1>
      <input type="text" name="search" id="" style={{ width: "300px" }}
        value={search} onChange={(e) => setSearch(e.target.value)} />
    </form>
    <main className="postsContainer" style={{ justifyContent: "center", alignItems: "center" }}>
      {stories.length >= 1 && stories.map((each, index) => {
        return <div key={each._id} className="posts">
          <div className="postHeader">
            <div className="postAuthor">
              <Link to={`/user/${each.author._id}`}>
                <img
                  src={each.author.isOauthUser ? `${each.author.path}` : `${HOST_LINK}/${each.author.path}`}
                  className="profilePic"
                />
              </Link>
              <h3>{each.author.name}</h3>
            </div>
            <div style={{ display: "flex", columnGap: "10px" }}>
              <Link to={`/edit/${each._id}`} className={each.author._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
                <button>
                  Edit
                </button>
              </Link>
              <button onClick={() => deletePost(each._id)}
                className={each.author._id == userData._id ? "ButtonShow" : "ButtonDissapear"}>
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
      {
        stories.length < 1 && <h1>There is no stories , post some.</h1>
      }
      {fetchingPosts && <h1>Loading More Posts...</h1>}
    </main>
  </section>
}
