import { Button, Form, Input, Modal, notification, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { createProductAPI, SupllierAPIVV } from "./product.api";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProductForm = (props) => {
    const { loadProduct } = props;
    const [form] = Form.useForm();
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageBase64, setImageBase64] = useState(""); // State for base64 image
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await SupllierAPIVV();
                setSuppliers(response.data.suppliers || []);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách nhà cung cấp"
                });
            }
        };

        fetchSuppliers();
    }, []);

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageBase64(reader.result.split(",")[1]); // Get base64 string only
        };
        reader.readAsDataURL(file);
        return false; // Prevent automatic upload
    };

    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            const { code, name, description, size, material, supplier } = values;
            const res = await createProductAPI(code, name, description, size, material, supplier, imageBase64);

            if (res.data) {
                notification.success({
                    message: "Tạo sản phẩm",
                    description: "Sản phẩm được tạo thành công"
                });
                resetAndCloseModal();
                await loadProduct();
            } else {
                notification.error({
                    message: "Lỗi tạo sản phẩm",
                    description: res.message || "Đã xảy ra lỗi khi tạo sản phẩm"
                });
            }
        } catch (error) {
            console.error("Form validation failed:", error);
        }
    };

    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
        setImageBase64(""); // Reset the base64 image string
    };

    return (
        <div className="user-form" style={{ margin: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Danh sách sản phẩm</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button onClick={() => setIsModalOpen(true)} type="primary">
                        Thêm mới sản phẩm
                    </Button>
                    <Button onClick={() => navigate("/import-product")} type="default">
                        Import Excel
                    </Button>
                </div>

            </div>
            <Modal
                title="Thêm mới sản phẩm"
                open={isModalOpen}
                onOk={handleSubmitBtn}
                onCancel={resetAndCloseModal}
                maskClosable={false}
                okText="Create"
            >
                <Form
                    form={form}
                    {...{
                        labelCol: { span: 6 },
                        wrapperCol: { span: 14 },
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        label="Mã sản phẩm"
                        name="code"
                        rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Kích thước"
                        name="size"
                        rules={[{ required: true, message: "Vui lòng nhập kích thước sản phẩm!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Chất liệu"
                        name="material"
                        rules={[{ required: true, message: "Vui lòng nhập chất liệu sản phẩm!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Nhà cung cấp"
                        name="supplier"
                        rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
                    >
                        <Select
                            placeholder="Chọn nhà cung cấp"
                            options={suppliers.map(supplier => ({
                                value: supplier._id,
                                label: supplier.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Ảnh sản phẩm" name="image">
                        <Upload
                            listType="picture"
                            beforeUpload={handleImageUpload}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductForm;
