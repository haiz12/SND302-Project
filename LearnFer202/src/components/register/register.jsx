import { useState } from "react";
import { Button, Form, Input, Row, Col, Typography, Select, DatePicker } from "antd";
import khoImage from "../../assets/kho.jpg"; // Import hình ảnh từ thư mục assets

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    form.submit();
    // Simulate register process
    setTimeout(() => setLoading(false), 2000); // Replace with API call later
  };

  return (
    <div
      style={{
        backgroundImage: `url(${khoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row justify="center" style={{ padding: "0 20px", width: "100%" }}>
        <Col xs={24} md={16} lg={8}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
              Đăng Ký
            </Title>
            <Form form={form} layout="vertical">
              <Form.Item
                label={<Text strong>Email</Text>}
                name="email"
                rules={[{ required: true, message: "Email không được để trống!" }]}
              >
                <Input placeholder="Nhập email của bạn" size="large" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Tên đăng nhập</Text>}
                name="username"
                rules={[{ required: true, message: "Tên đăng nhập không được để trống!" }]}
              >
                <Input placeholder="Nhập tên đăng nhập của bạn" size="large" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Số điện thoại</Text>}
                name="phoneNum"
                rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
              >
                <Input placeholder="Nhập số điện thoại của bạn" size="large" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Giới tính</Text>}
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              >
                <Select placeholder="Chọn giới tính" size="large">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<Text strong>Ngày sinh</Text>}
                name="dob"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              >
                <DatePicker placeholder="Chọn ngày sinh" size="large" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label={<Text strong>Lựa chọn vị trí</Text>}
                name="major"
                rules={[{ required: true, message: "Vui lòng chọn ngành học!" }]}
              >
                <Select placeholder="Chọn vị trí" size="large">
                  <Option value="outorder">Quản lý xuất kho</Option>
                  <Option value="inorder">Quản lý nhập kho</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<Text strong>Mật khẩu</Text>}
                name="password"
                rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu của bạn" size="large" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Nhập lại mật khẩu</Text>}
                name="passwordCF"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu của bạn" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  size="large"
                  style={{ width: "100%", backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                  onClick={handleRegister}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
