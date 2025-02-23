import { Button, Input, Modal, notification, Form } from "antd";
import { useState } from "react";
import { createUserAPI } from "../../services/api.service";

const UserForm = (props) => {
  const { loadUser } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitBtn = async () => {
    try {
      const values = await form.validateFields();
      const res = await createUserAPI(
        values.name,
        values.email,
        values.address,
        values.phone
      );

      if (res.data) {
        notification.success({
          message: "Create user",
          description: "Tạo user thành công",
        });
        resetAndCloseModal();
        await loadUser();
      } else {
        notification.error({
          message: "Error create user",
          description: JSON.stringify(res.message),
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const resetAndCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="user-form" style={{ margin: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Danh sách khách hàng</h3>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          Thêm mới khách hàng
        </Button>
      </div>
      <Modal
        title="Create User"
        open={isModalOpen}
        onOk={handleSubmitBtn}
        onCancel={resetAndCloseModal}
        maskClosable={false}
        okText="Create"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: "",
            email: "",
            address: "",
            phone: "",
          }}
        >
          <Form.Item
            name="name"
            label="Tên khách hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên khách hàng!",
              },
              {
                min: 2,
                message: "Tên phải có ít nhất 2 ký tự!",
              },
              {
                max: 50,
                message: "Tên không được vượt quá 50 ký tự!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ!",
              },
              {
                min: 5,
                message: "Địa chỉ phải có ít nhất 5 ký tự!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserForm;