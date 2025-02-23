/* eslint-disable no-unused-vars */
import "./components/learn/todo.css";
import Footer from "./components/layout/footer";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import Menus from "./components/layout/menu";
import { Col, Row, Spin } from "antd";
import HeaderViet from "./components/layout/header";
import { accountFromTokenAPI } from "./components/login/api";

const App = () => {
  const { setUser, isAppLoading, setIsAppLoading } = useContext(AuthContext);

  useEffect(() => {
    fetchUserInfo();
  }, [])

  const delay = (milSeconds) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, milSeconds)
    })
  }

  const fetchUserInfo = async () => {
    const res = await accountFromTokenAPI();
    await delay(1000)
    if (res.data) {
      //success
      setUser(res.data)
      console.log(">>> check user data: ", res.data)
    }
    setIsAppLoading(false);
  }

  return (
    <>
      {isAppLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <Spin />
        </div>
        :
        (
          <>
            <Row>
              <HeaderViet />
            </Row>
            <Row>
              <Col span={4}>
                <Menus />
              </Col>
              <Col span={20}>
                <Outlet />
              </Col>
            </Row>
            <Footer />
          </>
        )
      }
    </>
  );
};

export default App;
