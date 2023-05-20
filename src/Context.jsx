import { createContext, useContext, useEffect, useState } from "react";
import { API_LINK } from "../envVariables";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import loadingAnimation from "./assets/99264-loading.json"

const AppContextContainer = createContext();


function AppContext({ children }) {
  const { View } = useLottie({
    animationData: loadingAnimation,
  })
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("Token")));
  const [validToken, setValidToken] = useState(false)
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token) {
      axios.get(`${API_LINK}/user/verify`, { headers: { "Authorization": token } })
        .then(res => {
          if (res.data?.msg) {
            alert(res.data.msg)
            localStorage.removeItem("Token")
            setToken("")
            setValidToken(false);
            setLoading(false);
          } else {
            setLoading(false)
            setUserData(res.data)
            setValidToken(true)
          }
        });
    } else {
      setLoading(false)
    }
  }, [])

  return <AppContextContainer.Provider value={{
    token,
    setToken,
    setUserData,
    userData,
    validToken,
    setValidToken,
    loading,
    setLoading,
    View
  }}>
    {children}
  </AppContextContainer.Provider>
}

export { AppContext, AppContextContainer };
