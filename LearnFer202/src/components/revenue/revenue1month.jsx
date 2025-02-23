import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Typography, Divider } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const MonthlyRevenue = () => {
  const [totalOutPrice, setTotalOutPrice] = useState(0);
  const [totalInPrice, setTotalInPrice] = useState(0);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        // Fetch total out price
        const outOrdersResponse = await axios.get(
          `http://localhost:9999/out/outorder/${year}/${month}`
        );
        const totalOut = outOrdersResponse.data.reduce(
          (acc, order) => acc + order.out_price * order.quantity_real,
          0
        );
        setTotalOutPrice(totalOut);

        // Fetch total in price
        const inOrdersResponse = await axios.get(
          `http://localhost:9999/in/inorder/${year}/${month}`
        );
        const totalIn = inOrdersResponse.data.reduce(
          (acc, order) => acc + order.in_price * order.quantity_real,
          0
        );
        setTotalInPrice(totalIn);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    // Fetch data only when year and month are provided
    if (year && month) {
      fetchMonthlyRevenue();
    }
  }, [year, month]);

  const handleYearChange = (value) => {
    setYear(value);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={4}>Doanh thu theo tháng</Title>
      <div>
        <span>Nhập năm: </span>
        <Select
          value={year}
          onChange={handleYearChange}
          style={{ width: 120, marginRight: 20 }}
        >
          <Option value="">Chọn một năm</Option>
          {[...Array(16)].map((_, i) => (
            <Option key={2010 + i} value={2010 + i}>{2010 + i}</Option>
          ))}
        </Select>

        <span>Nhập tháng: </span>
        <Select
          value={month}
          onChange={handleMonthChange}
          style={{ width: 120 }}
        >
          <Option value="">Chọn một tháng</Option>
          {[...Array(12)].map((_, i) => (
            <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
          ))}
        </Select>
      </div>

      <Divider />

      <Text>Tổng doanh thu: {totalOutPrice.toLocaleString()} VND</Text>
      <br />
      <Text>Tổng tiền nhập hàng: {totalInPrice.toLocaleString()} VND</Text>
      <br />
      <Text>
        Lợi nhuận tháng: {(totalOutPrice - totalInPrice).toLocaleString()} VND
      </Text>
    </div>
  );
};

export default MonthlyRevenue;