import { useContext, useEffect, useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const HeaderViet = () => {
  const [current, setCurrent] = useState("warehouse"); // Đổi giá trị mặc định thành 'warehouse'
  const checkOut = localStorage.getItem("access_token");

  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location && location.pathname) {
      if (location.pathname === '/') {
        setCurrent('warehouse');
      } else {
        const path = location.pathname.slice(1); // Bỏ dấu '/' ở đầu
        setCurrent(path);
      }
    }
  }, [location]);

  useEffect(() => {
    if (checkOut === null) {
      navigate("/login");
    }
  }, [checkOut, navigate]);

  const items = [
    {
      label: <Link to="/" style={{ textDecoration: 'none' }}>WareHouse Manager</Link>,
      key: 'warehouse',
    },
    ...(user?._id ? [{
      label: `${user.username}`,
      key: 'setting',
      icon: <UserOutlined />,
      children: [
        {
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          key: 'logout',
        },
      ],
    }] : []),
  ];

  const onClick = (e) => {
    setCurrent(e.key);

    if (e.key === 'logout') {
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/login");
      message.success("Đăng xuất thành công!");
    }
  };

  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <Menu
        theme="light"
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[current]}
        items={items}
        style={{ display: 'inline-block', width: "200vh" }}
      />
    </div>
    
  );
};

export default HeaderViet;