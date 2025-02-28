import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import warehouseImage from "../../assets/warehouse.jpg"; 
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:9999/accounts/forgotPassword",
        { email }
      );
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi gửi OTP");
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:9999/accounts/verifyOTP",
        { email, otp }
      );
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP không hợp lệ");
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu nhập lại không khớp!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:9999/accounts/resetPassword", {
        email,
        otp,
        newPassword,
      });
      alert("Mật khẩu đã thay đổi, hãy đăng nhập lại!");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi đặt lại mật khẩu");
    }

    setLoading(false);
  };

  return (
    <Container>
      <FormBox>
        <Title>🔑 Quên Mật Khẩu</Title>
        {message && <Message>{message}</Message>}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <Input
              type="email"
              placeholder="📧 Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "📨 Đang gửi..." : "📩 Gửi OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <Input
              type="text"
              placeholder="🔢 Nhập OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "🔍 Đang xác minh..." : "✅ Xác minh OTP"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <Input
              type="password"
              placeholder="🔒 Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="🔄 Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "🔄 Đang xử lý..." : "🔑 Đặt lại mật khẩu"}
            </Button>
          </form>
        )}
      </FormBox>
    </Container>
  );
};

export default ForgotPassword;

// Styled Components
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${warehouseImage}) no-repeat center center;
  background-size: cover;
`;
const FormBox = styled.div`
  background: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  font-size: 22px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;

  ::placeholder {
    color: #888;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
    transform: scale(1.03);
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
