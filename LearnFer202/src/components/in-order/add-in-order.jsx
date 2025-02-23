import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Checkbox, Table, Row, Col, Card, Space, Typography, Divider, notification } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const AddInOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [confirmation, setConfirmation] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: "",
    supplier: "",
    in_price: "",
    quantity_real: "",
    quantity_doc: "",
    staff: "",
    deliver: "",
    invoice: "",
  });

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.error("User data is not available in localStorage.");
      navigate("/login");
    } else {
      const user = JSON.parse(storedUser);
      if (!user._id) {
        console.error("User _id is missing.");
        navigate("/login");
      }
    }

    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:9999/suppliers");
        if (response.data && Array.isArray(response.data.suppliers)) {
          setSuppliers(response.data.suppliers);
        } else {
          console.error("Suppliers response format is incorrect:", response.data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/products");
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("Products response format is incorrect:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.supplier) {
      const supplierInfo = suppliers.find(s => s._id === selectedProduct.supplier);
      setSelectedSupplier(supplierInfo);
      setFormData(prevState => ({
        ...prevState,
        supplier: selectedProduct.supplier
      }));
    }
  }, [selectedProduct, suppliers]);

  const handleChange = (value, field) => {
    if (field === "product") {
      const selectedProd = products.find((p) => p._id === value);
      setSelectedProduct(selectedProd);

      setFormData((prevState) => ({
        ...prevState,
        product: value,
        supplier: selectedProd.supplier
      }));
    } else if (field === "supplier") {
      const supplierInfo = suppliers.find((s) => s._id === value);
      setSelectedSupplier(supplierInfo);
      setFormData((prevState) => ({
        ...prevState,
        supplier: value
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.error("User data is not available in localStorage.");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user._id) {
      console.error("User _id is missing.");
      return;
    }

    const dataToSubmit = { ...formData, staff: user._id };

    try {
      await axios.post("http://localhost:9999/in", dataToSubmit);

      const productResponse = await axios.get(`http://localhost:9999/products/${formData.product}`);
      const product = productResponse.data;

      const newQuantity = product.quantity + Number(formData.quantity_real);
      const newInPrice = formData.in_price;

      await axios.put(`http://localhost:9999/products/${formData.product}`, {
        ...product,
        quantity: newQuantity,
        in_price: newInPrice,
      });

      notification.success({
        message: 'Thành công',
        description: 'Đã thêm đơn nhập kho thành công!',
        duration: 3
      });

      navigate('/in-orders');

    } catch (error) {
      console.error("Error adding in-order and updating product quantity:", error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm đơn nhập kho!',
        duration: 3
      });
    }
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id" },
    { title: "Mã sản phẩm", dataIndex: "product", key: "product" },
    { title: "Tên nhà cung cấp", dataIndex: "supplier", key: "supplier" },
    { title: "Chứng từ", dataIndex: "quantity_doc", key: "quantity_doc" },
    { title: "Thực nhập", dataIndex: "quantity_real", key: "quantity_real" },
    { title: "Đơn giá", dataIndex: "in_price", key: "in_price" },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => record.quantity_real * record.in_price
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Card className="header-card" style={{ marginBottom: "24px", borderRadius: "8px" }}>
          <Row justify="space-between" align="middle">
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              PHIẾU NHẬP KHO
            </Title>
            <Link to="/in-orders">
              <Button type="default">
                Quay lại
              </Button>
            </Link>
          </Row>
        </Card>

        <Row gutter={24}>
          <Col xs={24} lg={15}>
            <Card
              title={<Title level={4}>Thông tin nhập kho</Title>}
              bordered={false}
              style={{ borderRadius: "8px", height: "100%" }}
              className="form-card"
            >
              <Form
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={<Text strong>Số hóa đơn</Text>}
                      name="invoice"
                      rules={[{ required: true, message: 'Vui lòng nhập số hóa đơn' }]}
                    >
                      <Input
                        size="large"
                        value={formData.invoice}
                        onChange={(e) => handleChange(e.target.value, "invoice")}
                        placeholder="Nhập số hóa đơn"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<Text strong>Người giao hàng</Text>}
                      name="deliver"
                      rules={[{ required: true, message: 'Vui lòng nhập tên người giao' }]}
                    >
                      <Input
                        size="large"
                        value={formData.deliver}
                        onChange={(e) => handleChange(e.target.value, "deliver")}
                        placeholder="Nhập tên người giao"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<Text strong>Mã sản phẩm</Text>}
                  name="product"
                  rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                >
                  <Select
                    size="large"
                    value={formData.product}
                    onChange={(value) => handleChange(value, "product")}
                    placeholder="Chọn sản phẩm"
                    showSearch
                    optionFilterProp="children"
                  >
                    {products.map((product) => (
                      <Option key={product._id} value={product._id}>
                        {`${product.code} - ${product.name}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<Text strong>Nhà cung cấp</Text>}
                  name="supplier"
                  rules={[{ message: 'Vui lòng chọn nhà cung cấp' }]}
                >
                  <Select disabled
                    size="large"
                    value={formData.supplier}
                    onChange={(value) => handleChange(value, "supplier")}
                    placeholder="Chọn nhà cung cấp"
                    showSearch
                    optionFilterProp="children"
                  >
                    {suppliers.map((supplier) => (
                      <Option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label={<Text strong>Số lượng chứng từ</Text>}
                      name="quantity_doc"
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                    >
                      <Input
                        size="large"
                        type="number"
                        min={0}
                        value={formData.quantity_doc}
                        onChange={(e) => handleChange(e.target.value, "quantity_doc")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={<Text strong>Số lượng thực nhập</Text>}
                      name="quantity_real"
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                    >
                      <Input
                        size="large"
                        type="number"
                        min={0}
                        value={formData.quantity_real}
                        onChange={(e) => handleChange(e.target.value, "quantity_real")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={<Text strong>Đơn giá</Text>}
                      name="in_price"
                      rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
                    >
                      <Input
                        size="large"
                        type="number"
                        min={0}
                        value={formData.in_price}
                        onChange={(e) => handleChange(e.target.value, "in_price")}
                        addonAfter="VNĐ"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Form.Item>
                  <Space size="middle" style={{ width: '100%', justifyContent: 'end' }}>
                    <Checkbox
                      checked={confirmation}
                      onChange={(e) => setConfirmation(e.target.checked)}
                    >
                      <Text strong>Xác nhận thông tin chính xác</Text>
                    </Checkbox>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!confirmation}
                      size="large"
                    >
                      Xác nhận nhập kho
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            {confirmation && (
              <Card
                title={<Title level={4}>Xác nhận thông tin nhập kho</Title>}
                bordered={false}
                style={{ borderRadius: "8px" }}
                className="summary-card"
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between" className="summary-row">
                    <Text type="secondary">Người giao:</Text>
                    <Text strong>{formData.deliver}</Text>
                  </Row>
                  <Row justify="space-between" className="summary-row">
                    <Text type="secondary">Số hóa đơn:</Text>
                    <Text strong>{formData.invoice}</Text>
                  </Row>
                  <Row justify="space-between" className="summary-row">
                    <Text type="secondary">Mã sản phẩm:</Text>
                    <Text strong>{selectedProduct?.code}</Text>
                  </Row>
                  <Row justify="space-between" className="summary-row">
                    <Text type="secondary">Nhà cung cấp:</Text>
                    <Text strong>{selectedSupplier?.name}</Text>
                  </Row>

                  <Divider />
                  <Table
                    dataSource={[
                      {
                        id: 1,
                        product: selectedProduct?.code || "",
                        supplier: selectedSupplier?.name || "",
                        quantity_doc: formData.quantity_doc,
                        quantity_real: formData.quantity_real,
                        in_price: formData.in_price,
                      },
                    ]}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />
                  <Row justify="end" style={{ marginTop: "16px" }}>
                    <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                      Tổng tiền: {(formData.quantity_real * formData.in_price).toLocaleString()} VNĐ
                    </Text>
                  </Row>
                </Space>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddInOrder;