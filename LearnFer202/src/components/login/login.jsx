import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Col, message, notification, Typography } from "antd";
import { loginAPI } from "./api";
import { useContext, useState } from "react";
import khoImage from '../../assets/kho.jpg'; // Nhập hình ảnh từ thư mục assets
import { AuthContext } from "../context/auth.context";
const { Title, Text } = Typography;
import { Link } from "react-router-dom";

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await loginAPI(values.username, values.password);
            if (res.data) {
                message.success("Đăng nhập thành công");
                localStorage.setItem("access_token", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.existUser)); // Lưu thông tin người dùng
                setUser(res.data.existUser);
                navigate("/");
            } else {
                throw new Error(res.message || "Thông tin đăng nhập không chính xác");
            }
        } catch (error) {
            notification.error({
                message: "Lỗi đăng nhập",
                description: error.message || "Thông tin đăng nhập không chính xác",
            });
        } finally {
            setLoading(false); // Đảm bảo luôn cập nhật trạng thái loading
        }
    };
    

    return (
      <div
        style={{
          backgroundImage: `url(${khoImage})`, // Ảnh nền đã cập nhật
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh", // Chiều cao tối thiểu là 100% chiều cao màn hình
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row justify="center" style={{ padding: "0 20px", width: "100%" }}>
          <Col xs={24} md={16} lg={8}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)", // Tô màu nền với độ trong suốt để dễ nhìn hơn
                padding: "40px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "40px" }}
              >
                Đăng Nhập
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label={<Text strong>Tên đăng nhập</Text>}
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên đăng nhập không được để trống!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên đăng nhập của bạn"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Mật khẩu</Text>}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Mật khẩu không được để trống!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu của bạn"
                    size="large"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") form.submit();
                      console.log("checkkey", event.key);
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{
                        width: "100%",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                      }}
                      onClick={() => form.submit()}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <NavLink to="/">
                  <Text strong>Quay lại trang chủ</Text> <ArrowRightOutlined />
                </NavLink>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
};

export default Login;
