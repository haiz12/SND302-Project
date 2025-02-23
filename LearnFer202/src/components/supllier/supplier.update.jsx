/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Input, notification, Modal, Form } from "antd";
import { updateSupplierAPI } from "./supllier.api";

const UpdateSupplierModal = (props) => {
    const [form] = Form.useForm();
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadAccount } = props;

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                code: dataUpdate.code,
                name: dataUpdate.name,
                description: dataUpdate.description,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
                email: dataUpdate.email,
                website: dataUpdate.website,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            const {
                code,
                name,
                description,
                phone,
                address,
                email,
                website
            } = values;
            const res = await updateSupplierAPI(
                dataUpdate._id,
                code,
                name,
                description,
                phone,
                address,
                email,
                website
            );
            if (res.data) {
                notification.success({
                    message: "Update supplier",
                    description: "Cập nhật nhà cung cấp thành công",
                });
                resetAndCloseModal();
                await loadAccount();
            } else {
                notification.error({
                    message: "Error updating product",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (error) {
            console.error("Validation Failed:", error);
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        form.resetFields();
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update a Product"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            okText={"Save"}
            width="60vw"
            style={{ top: 20, height: "60vh" }}
        >
            <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "133%", height: "100%" }}
                layout="vertical"
            >
                <Form.Item
                    label="Mã nhà cung cấp"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp!" }]}
                >
                    <Input disabled style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Tên nhà cung cấp"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea rows={3} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Website"
                    name="website"
                    rules={[{ required: false }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateSupplierModal;
