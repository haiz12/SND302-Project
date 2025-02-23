import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarComponent from "./calender"; // Ensure this is the correct path
import { Row, Col, Card, Typography, DatePicker } from "antd";
import Month from "./revenue1month";

const { Title, Paragraph } = Typography;

const DailyRevenue = () => {
  const [totalOutPrice, setTotalOutPrice] = useState(0);
  const [totalInPrice, setTotalInPrice] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stockValue, setStockValue] = useState(0);

  useEffect(() => {
    // Fetch products data for stock in_price values
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:9999/products");
        
        // Log dữ liệu sản phẩm để kiểm tra
        console.log("Dữ liệu sản phẩm trả về từ API:", response.data.products);

        // Kiểm tra nếu dữ liệu trả về có danh sách sản phẩm
        if (response.data.products && response.data.products.length > 0) {
          const totalStockValue = response.data.products.reduce(
            (acc, product) => {
              console.log(`Product: ${product.name}, Quantity: ${product.quantity}, In Price: ${product.in_price}`);
              return acc + (product.in_price || 0) * (product.quantity || 0); // Sử dụng || 0 để tránh lỗi nếu thiếu dữ liệu
            },
            0
          );
          setStockValue(totalStockValue);
        } else {
          console.warn("API không trả về danh sách sản phẩm hoặc danh sách trống.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm từ API:", error);
      }
    };
    fetchStockData();
  }, []);

  useEffect(() => {
    const fetchDailyOrders = async () => {
      try {
        const timezoneOffset = selectedDate.getTimezoneOffset();
        const adjustedDate = new Date(
          selectedDate.getTime() - timezoneOffset * 60000
        );
        const formattedDate = adjustedDate.toISOString().split("T")[0];

        const [outOrdersResponse, inOrdersResponse] = await Promise.all([
          axios.get(`http://localhost:9999/out/outorder/${formattedDate}`),
          axios.get(`http://localhost:9999/in/inorder/${formattedDate}`),
        ]);

        const totalOut = outOrdersResponse.data.reduce(
          (acc, order) => acc + order.out_price * order.quantity_real,
          0
        );
        setTotalOutPrice(totalOut);

        const totalIn = inOrdersResponse.data.reduce(
          (acc, order) => acc + order.in_price * order.quantity_real,
          0
        );
        setTotalInPrice(totalIn);

        setDailyProfit(totalOut - totalIn);
      } catch (error) {
        console.error("Error fetching daily orders:", error);
      }
    };

    fetchDailyOrders();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date); // Directly set the date object
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Doanh thu</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Chọn ngày" bordered={false}>
            <DatePicker onChange={handleDateChange} />
            <CalendarComponent onDateSelect={handleDateChange} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={16}>
          <Card title="Thông tin doanh thu" bordered={false}>
            <Paragraph>
              <strong>Tổng doanh thu:</strong> {totalOutPrice.toLocaleString()} VND
            </Paragraph>
            <Paragraph>
              <strong>Tổng tiền nhập hàng:</strong> {totalInPrice.toLocaleString()} VND
            </Paragraph>
            <Paragraph>
              <strong>Lợi nhuận:</strong> {dailyProfit.toLocaleString()} VND
            </Paragraph>
            <Paragraph>
              <strong>Tổng tiền hàng tồn kho:</strong> {stockValue.toLocaleString()} VND
            </Paragraph>
          </Card>
        </Col>
      </Row>
      <Month /> {/* Assuming Month is a component that displays monthly data */}
    </div>
  );
};

export default DailyRevenue;
