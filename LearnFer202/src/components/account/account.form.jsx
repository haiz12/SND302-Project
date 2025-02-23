import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { useState } from "react";
import { createAccountAPI } from "./account.api";

const AccountForm = (props) => {
    const { loadAccount } = props;
    const [form] = Form.useForm();

    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            // Capitalize first letter of gender
            const formattedValues = {
                ...values,
                gender: values.gender.charAt(0).toUpperCase() + values.gender.slice(1),
                dob: values.dob?.format('YYYY-MM-DD')
            };

            const res = await createAccountAPI(
                formattedValues.username,
                formattedValues.email,
                formattedValues.password,
                formattedValues.dob,
                formattedValues.gender,
                formattedValues.phoneNumber,
                formattedValues.role_id
            );

            if (res.data) {
                notification.success({
                    message: "Create user",
                    description: "Tạo user thành công",
                });
                resetAndCloseModal();
                await loadAccount();
            } else {
                notification.error({
                    message: "Error create user",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (error) {
            console.error("Form validation failed:", error);
            notification.error({
                message: "Validation Error",
                description: "Please check all required fields",
            });
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div className="user-form" style={{ margin: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Danh sách tài khoản</h3>
                <Button onClick={() => setIsModalOpen(true)} type="primary">
                    Thêm mới tài khoản
                </Button>
            </div>
            <Modal
                title="Thêm mới tài khoản"
                open={isModalOpen}
                onOk={handleSubmitBtn}
                onCancel={resetAndCloseModal}
                maskClosable={false}
                okText="Create"
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    style={{ maxWidth: 600 }}
                    variant="filled"
                >
                    <Form.Item
                        label="Name"
                        name="username"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input the password!" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please input the phone number!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[{ required: true, message: "Please select date of birth!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: "Please select the gender!" }]}
                        initialValue="male"
                    >
                        <Select>
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role_id"
                        rules={[{ required: true, message: "Please select the role!" }]}
                    >
                        <Select>
                            <Select.Option value="1">Quản lý</Select.Option>
                            <Select.Option value="2">Nhân viên nhập hàng</Select.Option>
                            <Select.Option value="3">Nhân viên xuất hàng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountForm;