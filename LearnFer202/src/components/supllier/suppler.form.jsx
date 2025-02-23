import { Button, Form, Input, Modal, notification, Upload } from "antd";
import { useState } from "react";
import { createSupplierAPI } from "./supllier.api";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SupplierForm = (props) => {
    const { loadSupplier } = props;
    const [form] = Form.useForm();
    const [logoBase64, setLogoBase64] = useState(""); // State to hold base64 logo
    const navigate = useNavigate();
    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            const { code, name, description, phone, address, email, website } = values;
            const res = await createSupplierAPI(
                code,
                name,
                description,
                phone,
                address,
                email,
                website,
                logoBase64 // Pass the base64 logo data
            );

            if (res.data) {
                notification.success({
                    message: "Create nhà cung cấp",
                    description: "Tạo nhà cung cấp thành công",
                });
                resetAndCloseModal();
                await loadSupplier();
            } else {
                notification.error({
                    message: "Error create supplier",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (error) {
            console.error("Form validation failed:", error);
        }
    };

    const handleLogoUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setLogoBase64(reader.result); // Set the base64 string directly
        };
        reader.readAsDataURL(file);
        return false; // Prevent default upload behavior
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
        setLogoBase64(""); // Reset logo
    };

    return (
        <div className="user-form" style={{ margin: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Danh sách nhà cung cấp</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button onClick={() => setIsModalOpen(true)} type="primary">
                        Thêm mới nhà cung cấp
                    </Button>
                    <Button onClick={() => navigate("/import-supllier")} type="default">
                        Import Excel
                    </Button>
                    
                </div>
            </div>
            <Modal
                title="Thêm mới nhà cung cấp"
                open={isModalOpen}
                onOk={handleSubmitBtn}
                onCancel={resetAndCloseModal}
                maskClosable={false}
                okText={"Create"}
            >
                <Form
                    form={form}
                    {...{
                        labelCol: { span: 6 },
                        wrapperCol: { span: 14 },
                    }}
                    style={{
                        width: "115%",
                    }}
                    variant="filled"
                >
                    <Form.Item
                        label="Mã nhà cung cấp"
                        name="code"
                        rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên nhà cung cấp"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả nhà cung cấp!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Website"
                        name="website"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Logo" name="logo">
                        <Upload
                            beforeUpload={handleLogoUpload} // Custom upload handler
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên logo</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierForm;
