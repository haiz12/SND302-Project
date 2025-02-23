import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Container, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

const AddOutOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product: "",
    customer: "",
    out_price: "",
    quantity_real: "",
    quantity_doc: "",
    staff: "",
    receiver: "",
    invoice: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:9999/customers"),
          axios.get("http://localhost:9999/products")
        ]);

        setCustomers(customersRes.data.customers || []);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.receiver.trim()) newErrors.receiver = "Vui lòng nhập tên người nhận";
    if (!formData.customer) newErrors.customer = "Vui lòng chọn khách hàng";
    if (!formData.product) newErrors.product = "Vui lòng chọn sản phẩm";
    if (!formData.quantity_doc) newErrors.quantity_doc = "Vui lòng nhập số lượng theo chứng từ";
    if (!formData.quantity_real) newErrors.quantity_real = "Vui lòng nhập số lượng thực xuất";
    if (!formData.out_price) newErrors.out_price = "Vui lòng nhập đơn giá";
    if (!formData.invoice.trim()) newErrors.invoice = "Vui lòng nhập số hóa đơn";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const user = JSON.parse(localStorage.getItem("user"));
    formData.staff = user._id;

    try {
      await axios.post("http://localhost:9999/out", formData);
      const getProduct = await axios.get(`http://localhost:9999/products/${formData.product}`);
      const product = getProduct.data;
      product.quantity = +product.quantity - +formData.quantity_real;
      product.out_price = formData.out_price;
      await axios.put(`http://localhost:9999/products/${formData.product}`, product);
      notification.success({
        message: 'Thành công',
        description: 'Đã xuất kho thành công!',
        duration: 3
      });
      navigate("/out-orders");
    } catch (error) {
      console.error("Error adding out order:", error);
      setErrors({ submit: "Có lỗi xảy ra khi xử lý đơn hàng" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCustomer = customers.find((customer) => customer._id === formData.customer);
  const selectedProduct = products.find((product) => product._id === formData.product);

  // Tính toán tổng tiền
  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity_real) || 0;
    const price = parseFloat(formData.out_price) || 0;
    return (quantity * price).toLocaleString('vi-VN');
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h2 className="mb-0">XUẤT ĐƠN HÀNG</h2>
            </Card.Header>
            <Card.Body>
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên người nhận <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="receiver"
                    value={formData.receiver}
                    onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                    isInvalid={!!errors.receiver}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.receiver}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Khách hàng <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="customer"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    isInvalid={!!errors.customer}
                  >
                    <option value="">Chọn khách hàng</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.customer}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mã sản phẩm <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="product"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    isInvalid={!!errors.product}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.code}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.product}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lượng theo chứng từ <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity_doc"
                        value={formData.quantity_doc}
                        onChange={(e) => setFormData({ ...formData, quantity_doc: e.target.value })}
                        isInvalid={!!errors.quantity_doc}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.quantity_doc}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lượng thực xuất <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity_real"
                        value={formData.quantity_real}
                        onChange={(e) => setFormData({ ...formData, quantity_real: e.target.value })}
                        isInvalid={!!errors.quantity_real}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.quantity_real}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Đơn giá <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="out_price"
                    value={formData.out_price}
                    onChange={(e) => setFormData({ ...formData, out_price: e.target.value })}
                    isInvalid={!!errors.out_price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.out_price}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số hóa đơn <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice"
                    value={formData.invoice}
                    onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
                    isInvalid={!!errors.invoice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.invoice}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Xác nhận thông tin đã chính xác"
                    checked={confirmation}
                    onChange={(e) => setConfirmation(e.target.checked)}
                  />
                </Form.Group>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!confirmation || isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xuất đơn hàng"}
                </button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <Card.Header className="bg-light">
              <h4 className="mb-0">Thông tin đơn hàng</h4>
            </Card.Header>
            <Card.Body>
              <div className="preview-item">
                <strong>Người nhận:</strong>
                <span className="preview-value">{formData.receiver || '---'}</span>
              </div>
              <div className="preview-item">
                <strong>Khách hàng:</strong>
                <span className="preview-value">{selectedCustomer?.name || '---'}</span>
              </div>
              <div className="preview-item">
                <strong>Mã sản phẩm:</strong>
                <span className="preview-value">{selectedProduct?.code || '---'}</span>
              </div>
              <div className="preview-item">
                <strong>Số lượng chứng từ:</strong>
                <span className="preview-value">{formData.quantity_doc || '---'}</span>
              </div>
              <div className="preview-item">
                <strong>Số lượng thực xuất:</strong>
                <span className="preview-value">{formData.quantity_real || '---'}</span>
              </div>
              <div className="preview-item">
                <strong>Đơn giá:</strong>
                <span className="preview-value">
                  {formData.out_price ? `${parseInt(formData.out_price).toLocaleString('vi-VN')} đ` : '---'}
                </span>
              </div>
              <div className="preview-item">
                <strong>Số hóa đơn:</strong>
                <span className="preview-value">{formData.invoice || '---'}</span>
              </div>
              <div className="preview-item total">
                <strong>Tổng tiền:</strong>
                <span className="preview-value">{calculateTotal()} đ</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .preview-item {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
        }
        .preview-value {
          font-weight: 500;
          color: #2c3e50;
        }
        .total {
          margin-top: 1.5rem;
          border-top: 2px solid #eee;
          padding-top: 1rem;
          font-size: 1.2rem;
        }
        .total .preview-value {
          color: #e74c3c;
          font-weight: bold;
        }
      `}</style>
    </Container>
  );
};

export default AddOutOrder;