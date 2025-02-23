/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Input, notification, Modal, Form } from "antd";
import { updateProductAPI } from "./product.api";

const UpdateProductModal = (props) => {
    const [form] = Form.useForm();
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadAccount } = props;

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                code: dataUpdate.code,
                name: dataUpdate.name,
                description: dataUpdate.description,
                size: dataUpdate.size,
                material: dataUpdate.material,
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
                size,
                material
            } = values;
            const res = await updateProductAPI(
                dataUpdate._id,
                code,
                name,
                description,
                size,
                material,
            );
            if (res.data) {
                notification.success({
                    message: "Update product",
                    description: "Cập nhật sản phẩm thành công",
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
                    label="Code"
                    name="code"
                    rules={[{ required: true, message: "Please input the product code!" }]}
                >
                    <Input disabled style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please input the product name!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea rows={3} style={{ width: "100%" }} />
                </Form.Item>

               

                <Form.Item
                    label="Size"
                    name="size"
                    rules={[{ required: true, message: "Please input the size!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Material"
                    name="material"
                    rules={[{ required: true, message: "Please input the material!" }]}
                >
                   <Input style={{ width: "100%" }} />
                </Form.Item>

                
            </Form>
        </Modal>
    );
};

export default UpdateProductModal;
