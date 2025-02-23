import { useContext, useEffect, useState } from "react";
import {
  CloudUploadOutlined,
  DollarOutlined,
  LinkOutlined,
  SettingOutlined,
  TeamOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Menus = () => {
  const [current, setCurrent] = useState("home");
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (location && location.pathname) {
      // Lấy path từ URL
      const path = location.pathname.substring(1); // Bỏ dấu / ở đầu
      setCurrent(path);
    }
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      key: 'sub1',
      icon: <TeamOutlined />,
      label: 'Quản Lý',
      children: [
        ...(user?.role_id === "1" ? [{
          key: 'accounts', // Key phải khớp với path trong URL
          icon: <TeamOutlined />,
          label: <Link to="/accounts" style={{ textDecoration: 'none' }}>Quản lý tài khoản</Link>,
        }] : []),
        ...(user?._id ? [{
          key: 'customers', // Key phải khớp với path trong URL
          icon: <TeamOutlined />,
          label: <Link to="/customers" style={{ textDecoration: 'none' }}>Quản lý khách hàng</Link>,
        }] : []),
        ...(user?._id ? [{
          key: 'products', // Key phải khớp với path trong URL
          icon: <UsergroupAddOutlined />,
          label: <Link to="/products" style={{ textDecoration: 'none' }}>Quản lý sản phẩm</Link>,
        }] : []),
        ...(user?._id ? [{
          key: 'suppliers', // Key phải khớp với path trong URL
          icon: <TeamOutlined />,
          label: <Link to="/suppliers" style={{ textDecoration: 'none' }}>Quản lý nhà cung cấp</Link>,
        }] : []),
      ],
    },
    {
      key: 'sub2',
      label: 'Nhập Xuất Kho',
      icon: <SettingOutlined />,
      children: [
        ...(user?.role_id === "1" || user?.role_id === "2" ? [{
          key: 'addin-orders', // Key phải khớp với path trong URL
          icon: <CloudUploadOutlined />,
          label: <Link to="/addin-orders" style={{ textDecoration: 'none' }}>Nhập kho</Link>,
        }] : []),
        ...(user?.role_id === "1" || user?.role_id === "3" ? [{
          key: 'addout-orders', // Key phải khớp với path trong URL
          icon: <TruckOutlined />,
          label: <Link to="/addout-orders" style={{ textDecoration: 'none' }}>Xuất kho</Link>,
        }] : []),
        ...(user?.role_id === "1" || user?.role_id === "2" ? [{
          key: 'in-orders', // Key phải khớp với path trong URL
          icon: <CloudUploadOutlined />,
          label: <Link to="/in-orders" style={{ textDecoration: 'none' }}>Quản lý nhập kho</Link>,
        }] : []),
        ...(user?.role_id === "1" || user?.role_id === "3" ? [{
          key: 'out-orders', // Key phải khớp với path trong URL
          icon: <TruckOutlined />,
          label: <Link to="/out-orders" style={{ textDecoration: 'none' }}>Quản lý xuất kho</Link>,
        }] : []),
      ],
    },
    ...(user?._id ? [{
      key: 'revenue', // Key phải khớp với path trong URL
      icon: <DollarOutlined />,
      label: <Link to="/revenue" style={{ textDecoration: 'none' }}>Doanh thu</Link>,
    }] : []),
    {
      key: 'link',
      icon: <LinkOutlined />,
      label: (
        <a href="https://www.facebook.com/hiyulu.03/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          Warehouse Manager
        </a>
      ),
    },
  ];

  return (
    <Menu
      style={{
        width: 256,
        height: "100vh",
      }}
      mode="inline"
      theme="light"
      items={items}
      onClick={onClick}
      selectedKeys={[current]}
      defaultOpenKeys={['sub1', 'sub2']}
    />
  );
};
export default Menus;