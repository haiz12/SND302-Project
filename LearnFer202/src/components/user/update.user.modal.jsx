/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input, notification, Modal } from "antd";
import { updateUserAPI } from "../../services/api.service";

const UpdateUserModal = (props) => {
  const [id, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
    loadUser,
  } = props;

  useEffect(() => {
    if (dataUpdate) {
      setId(dataUpdate._id);
      setFullName(dataUpdate.name);
      setPhone(dataUpdate.phone);
      setEmail(dataUpdate.email);
      setAdress(dataUpdate.address);
    }
  }, [dataUpdate]);

  const handleSubmitBtn = async () => {
    const res = await updateUserAPI(id, fullName, email, phone, address);
    if (res.data) {
      notification.success({
        message: "Update customer",
        description: "Cập nhật khách hàng thành công",
      });
      resetAndCloseModal();
      await loadUser();
    } else {
      notification.error({
        message: "Error update user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const resetAndCloseModal = () => {
    setIsModalUpdateOpen(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setAdress("");
    setDataUpdate(null);
  };

  return (
    <Modal
      title="Update a User"
      open={isModalUpdateOpen}
      onOk={() => handleSubmitBtn()}
      onCancel={() => resetAndCloseModal()}
      maskClosable={false}
      okText={"Save"}
    >
      <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
        <div>
          <span>Tên khách hàng</span>
          <Input
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
            }}
          />
        </div>
        <div>
          <span>Email</span>
          <Input value={email} disabled />
        </div>

        <div>
          <span>Số điện thoại</span>
          <Input
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
        </div>
        <div>
          <span>Địa chỉ</span>
          <Input
            value={address}
            onChange={(event) => {
              setAdress(event.target.value);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
export default UpdateUserModal;
