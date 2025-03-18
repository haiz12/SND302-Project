/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Input, notification, Modal, Form, DatePicker, Select } from "antd";
import moment from "moment";
import { updateAccountAPI } from "./account.api";

const UpdateAccountModal = (props) => {
    const [form] = Form.useForm();
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadAccount } = props;

    useEffect(() => {
        if (dataUpdate) {
            const formattedGender = dataUpdate.gender?.toLowerCase();
            
            form.setFieldsValue({
                username: dataUpdate.username,
                email: dataUpdate.email,
                password: dataUpdate.password,
                dob: dataUpdate.dob ? moment(dataUpdate.dob) : null, 
                gender: formattedGender,
                phoneNumber: dataUpdate.phoneNumber,
                role_id: dataUpdate.role_id,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            const formattedGender = values.gender.charAt(0).toUpperCase() + values.gender.slice(1);
            
            const res = await updateAccountAPI(
                dataUpdate._id,
                values.username,
                values.email,
                values.password,
                values.dob ? values.dob.format('YYYY-MM-DD') : null,
                formattedGender,
                values.phoneNumber,
                values.role_id,
            );
            
            if (res.data) {
                notification.success({
                    message: "Update account",
                    description: "Cập nhật tài khoản thành công",
                });
                resetAndCloseModal();
                await loadAccount();
            } else {
                notification.error({
                    message: "Error update user",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (error) {
            console.error("Validation Failed:", error);
            notification.error({
                message: "Validation Error",
                description: "Please check all required fields",
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        form.resetFields();
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update a Account"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            okText={"Save"}
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
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
                >
                    <Input disabled />
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
                    <Select disabled>
                        <Select.Option value="1">Quản lý</Select.Option>
                        <Select.Option value="2">Nhân viên nhập hàng</Select.Option>
                        <Select.Option value="3">Nhân viên xuất hàng</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAccountModal;