import { notification, Popconfirm, Table } from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteAccountAPI } from "./account.api";
import { useState } from "react";
import UpdateAccountModal from "./account.update";

const AccountTable = ({
  dataAccounts,
  loadAccount,
  current,
  pageSize,
  total,
  setCurrent,
  setPageSize,
}) => {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  const handleDeleteUser = async (id, role_id) => {
    if (role_id === "1") {
      notification.warning({
        message: "Không thể xóa",
        description: "Bạn không thể xóa tài khoản Quản lý!",
      });
      return;
    }

    const res = await deleteAccountAPI(id);
    if (res.data) {
      notification.success({
        message: "Xóa tài khoản",
        description: "Xóa tài khoản thành công!",
      });
      await loadAccount();
    } else {
      notification.error({
        message: "Lỗi khi xóa",
        description: JSON.stringify(res.message),
      });
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => <>{index + 1}</>,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <span
          onClick={() =>
            setVisiblePasswordId(
              visiblePasswordId === record._id ? null : record._id
            )
          }
          style={{ cursor: "pointer" }}
        >
          {visiblePasswordId === record._id ? text : "••••••••"}
        </span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => moment(dob).format("DD/MM/YYYY"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender === "Male"
          ? "Nam"
          : gender === "Female"
          ? "Nữ"
          : "Không xác định",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "role_id",
      key: "role_id",
      render: (role_id) => {
        switch (role_id) {
          case "1":
            return "Quản lý";
          case "2":
            return "Nhân viên nhập hàng";
          case "3":
            return "Nhân viên xuất hàng";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "15px" }}>
          <EditOutlined
            onClick={() => {
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <Popconfirm
            title="Xóa tài khoản"
            description="Bạn chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => handleDeleteUser(record._id, record.role_id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey={"_id"}
        columns={columns}
        dataSource={dataAccounts}
        pagination={{
          current,
          pageSize,
          showSizeChanger: true,
          total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} tài khoản`,
        }}
        onChange={(pagination) => {
          if (pagination.current !== current) setCurrent(pagination.current);
          if (pagination.pageSize !== pageSize)
            setPageSize(pagination.pageSize);
        }}
      />
      <UpdateAccountModal
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadAccount={loadAccount}
      />
    </>
  );
};

export default AccountTable;
