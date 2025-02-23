import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const UpdateOutOrderModal = ({ isOpen, onClose, onSubmit, dataUpdate }) => {
    const [formData, setFormData] = useState({
      out_price: "",
      quantity_real: "",
      quantity_doc: "",
    });
  
    useEffect(() => {
      if (dataUpdate) {
        setFormData({
          out_price: dataUpdate.out_price,
          quantity_real: dataUpdate.quantity_real,
          quantity_doc: dataUpdate.quantity_doc,
        });
      }
    }, [dataUpdate]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const id = dataUpdate._id; // Get the id from the dataUpdate object
          await axios.put(`http://localhost:9999/out/${id}`, formData);
          onSubmit(formData);
          alert("Cập nhật xuất đơn hàng thành công!");
          onClose(); // Close the modal after submission
          window.location.reload(); // Refresh the page
        } catch (error) {
          console.error("Lỗi khi cập nhật xuất đơn hàng:", error);
          alert("Cập nhật đơn hàng không thành công!");
        }
      };
  
    return (
      <div className={`modal ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cập nhật thông tin đơn hàng</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Đơn giá mới:</label>
                  <input
                    type="number"
                    name="out_price"
                    value={formData.out_price}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Chứng từ:</label>
                  <input
                    type="number"
                    name="quantity_doc"
                    value={formData.quantity_doc}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Thực tế:</label>
                  <input
                    type="number"
                    name="quantity_real"
                    value={formData.quantity_real}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default UpdateOutOrderModal;