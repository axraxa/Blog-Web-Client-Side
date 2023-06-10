import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContextContainer } from './Context';
import axios from 'axios';
import { API_LINK, HOST_LINK } from '../envVariables';

export default function TokenVerify() {
  const { setUserData, setValidToken, setLoading, loading, setToken } = useContext(AppContextContainer)
  // const [currentToken, setCurrentToken] = useState("");
  const { currentToken } = useParams();
  const test = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentToken) {
      const passedToken = currentToken.replace(/jemaliBidzia/g, ".")
      axios.get(`${API_LINK}/user/verify`, { headers: { "Authorization": passedToken } })
        .then(res => {
          if (res.data?.msg) {
            localStorage.removeItem("Token")
            setToken("")
            setValidToken(false);
            setLoading(false);
            navigate("/")
          } else {
            setLoading(false)
            setUserData(res.data)
            setValidToken(true)
            localStorage.setItem("Token", JSON.stringify(passedToken))
            navigate("/home")
          }
        });
    } else {
      setLoading(false)
      navigate("/")
    }
  }, [currentToken])
  return (
    <h1>Wait here we are verifying your token!</h1>
  )
}
