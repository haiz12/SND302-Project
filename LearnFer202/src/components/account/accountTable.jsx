import { notification, Popconfirm, Table } from 'antd';
import moment from 'moment';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteAccountAPI } from './account.api';
import { useState } from 'react';
import UpdateAccountModal from './account.update';

const AccountTable = (props) => {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  
  const {
    dataAccounts,
    loadAccount,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
  } = props;

  const handleDeleteUser = async (id) => {
    const res = await deleteAccountAPI(id);
    if (res.data) {
      notification.success({
        message: "Delete user",
        description: "Xóa user thành công",
      });
      await loadAccount();
    } else {
      notification.error({
        message: "Error delete user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mật Khẩu',
      dataIndex: 'password',
      key: 'password',
      render: (text, record) => (
        <span
          onClick={() => setVisiblePasswordId(visiblePasswordId === record._id ? null : record._id)}
          style={{ cursor: 'pointer' }}
        >
          {visiblePasswordId === record._id ? text : '••••••••'}
        </span>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => {
        return moment(dob).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        switch (gender) {
          case "Male":
            return "Nam";
          case "Female":
            return "Nữ";
          default:
            return "Không xác định";
        }
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: "flex", gap: "30px" }}>
          <EditOutlined
            onClick={() => {
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa tài khoản"
            description="Bạn chắc chắn xóa tài khoản này ?"
            onConfirm={() => handleDeleteUser(record._id)}
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

  const onChange = (pagination, filters, sorter, extra) => {
    // setCurrent, setPageSize
    //nếu thay đổi trang : current
    console.log("pagination", { pagination, filters, sorter, extra });
    
    if (pagination && pagination.current) {
      if (+pagination.current !== +current) {
        setCurrent(+pagination.current); //"5" => 5
      }
    }

    //nếu thay đổi tổng số phần tử : pageSize
    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize); //"5" => 5
      }
    }
  };

  return (
    <>
      <Table
        rowKey={"_id"}
        columns={columns}
        dataSource={dataAccounts}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        onChange={onChange}
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
}

export default AccountTable;