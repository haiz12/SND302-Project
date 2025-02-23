import { notification, Popconfirm, Table, Button } from 'antd';
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { deleteSupplierAPI } from './supllier.api';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import UpdateSupplierModal from './supplier.update';
import ViewSupplierDetail from './supplier.detail';

const SupplierTable = (props) => {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    dataSuppllier,
    loadSuppllier,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
  } = props;

  const handleDeleteSupplier = async (id) => {
    const res = await deleteSupplierAPI(id);
    if (res.data) {
      notification.success({
        message: "Delete Supplier",
        description: "Xóa nhà cung cấp thành công",
      });
      await loadSuppllier();
    } else {
      notification.error({
        message: "Error delete user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const truncateText = (text, maxLength = 32767) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  const exportToExcel = () => {
    try {
      const excelData = dataSuppllier.map((item, index) => ({
        STT: index + 1,
        
        Code: item.code || 'N/A',
        "Tên nhà cung cấp": truncateText(item.name), // Truncate name
        "Số điện thoại": item.phone || 'N/A',
        "Địa chỉ": truncateText(item.address), // Truncate address
        Email: truncateText(item.email) || 'N/A' // Truncate email if necessary
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.boexok_append_sheet(workbook, worksheet, "SupplierData");
      XLSX.writeFile(workbook, "SupplierData.xlsx");
  
      notification.success({
        message: "Export Success",
        description: "Data has been successfully exported to Excel.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      notification.error({
        message: "Export Error",
        description: error.message || "An error occurred while exporting data.",
      });
    }
  };
  
  

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => index + 1
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logos) => (
        logos && logos.length > 0 && logos[0].url ? (
          <img 
            src={logos[0].url} 
            alt="Logo" 
            style={{ width: 50, height: 50 }} 
            onClick={(e) => e.stopPropagation()}
          />
        ) : null
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <span>{text}</span>
      ),
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a 
          href={record.website} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div 
          style={{ display: "flex", gap: "30px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <EditOutlined
            onClick={() => {
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa nhà cung cấp này"
            description="Bạn chắc chắn xóa nhà cung cấp này ?"
            onConfirm={() => handleDeleteSupplier(record._id)}
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
    if (pagination && pagination.current) {
      if (+pagination.current !== +current) {
        setCurrent(+pagination.current);
      }
    }

    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel} type="primary">
        </Button>
      </div>
      <Table 
        rowKey={"_id"}
        columns={columns}
        dataSource={dataSuppllier}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => (
            <div>{range[0]}-{range[1]} trên {total} rows</div>
          )
        }}
        onChange={onChange}
        onRow={(record) => ({
          onClick: () => {
            setDataDetail(record);
            setIsDetailOpen(true);
          },
          style: { cursor: 'pointer' }
        })}
      />
      <UpdateSupplierModal
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadSuppllier={loadSuppllier}
      />
      <ViewSupplierDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        loadSuppllier={loadSuppllier}
      />
    </>
  );
};

export default SupplierTable;
