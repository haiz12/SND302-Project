import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, InputNumber } from 'antd';
import { useParams } from "react-router-dom";

const UpdateInOrderModal = ({ isOpen, onClose, onSubmit, dataUpdate }) => {
  const [formData, setFormData] = useState({
    in_price: "",
    quantity_real: "",
    quantity_doc: "",
  });
  const { id } = useParams();

  useEffect(() => {
    if (dataUpdate) {
      setFormData({
        in_price: dataUpdate.in_price,
        quantity_real: dataUpdate.quantity_real,
        quantity_doc: dataUpdate.quantity_doc,
      });
    }
  }, [dataUpdate]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
  
      await axios.put(`http://localhost:9999/in/${dataUpdate._id}`, formData);
      onSubmit(formData);
      alert("Cập nhật đơn hàng thành công!");
      onClose(); // Close the modal after submission
    
  };

  return (
    <Modal title="Cập nhật thông tin đơn hàng" visible={isOpen} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Đơn giá mới:" required>
          <InputNumber
            name="in_price"
            value={formData.in_price}
            onChange={(value) => handleChange("in_price", value)}
            style={{ width: '100%' }}
            min={0}
            required
          />
        </Form.Item>
        <Form.Item label="Chứng từ:" required>
          <InputNumber
            name="quantity_doc"
            value={formData.quantity_doc}
            onChange={(value) => handleChange("quantity_doc", value)}
            style={{ width: '100%' }}
            min={0}
            required
          />
        </Form.Item>
        <Form.Item label="Thực tế:" required>
          <InputNumber
            name="quantity_real"
            value={formData.quantity_real}
            onChange={(value) => handleChange("quantity_real", value)}
            style={{ width: '100%' }}
            min={0}
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateInOrderModal;