import { notification, Popconfirm, Table, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import ViewOutOrderDetail from "./out-order.detail";
import UpdateOutOrderModal from "./out-order.update";
import { DeleteOutOrderAPI } from "./out-order.api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OutOrderTable = (props) => {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const {
    dataOutOrder,
    loadOutOrder,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
  } = props;
  const navigate = useNavigate();
  const handleDeleteSupplier = async (id) => {
    const res = await DeleteOutOrderAPI(id);
    if (res.data) {
      notification.success({
        message: "Delete đơn xuất",
        description: "Xóa đơn xuất thành công",
      });
      await loadOutOrder();
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
      render: (_, record, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product_name",
      render: (product) => <>{product?.name || "N/A"}</>,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      key: "customer_name",
      render: (customer) => <>{customer?.name || "N/A"}</>,
    },
    {
      title: "Giá nhập",
      dataIndex: "product",
      key: "product_in_price",
      render: (product) => <div>{product?.in_price || "N/A"}</div>,
    },
    {
      title: "Giá xuất",
      dataIndex: "out_price",
      key: "out_price",
      render: (out_price) => <>{out_price || "N/A"}</>,
    },
    {
      title: "Chứng từ",
      dataIndex: "quantity_doc",
      key: "quantity_doc",
      render: (quantity_doc) => <>{quantity_doc || "N/A"}</>,
    },
    {
      title: "Thực tế",
      dataIndex: "quantity_real",
      key: "quantity_real",
      render: (quantity_real) => <>{quantity_real || "N/A"}</>,
    },
    {
      title: "Hóa đơn",
      dataIndex: "invoice",
      key: "invoice",
      render: (invoice) => <>{invoice || "N/A"}</>,
    },
    {
      title: "Ngày xuất",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "30px" }}>
          <EditOutlined
            onClick={(e) => {
              e.stopPropagation();
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa nhà cung cấp này"
            description="Bạn chắc chắn xóa nhà cung cấp này ?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDeleteSupplier(record._id);
            }}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <DeleteOutlined
              style={{ cursor: "pointer", color: "red" }}
              onClick={(e) => e.stopPropagation()}
            />
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

  const exportDisplayedDataToExcel = () => {
    try {
      if (dataOutOrder.length === 0) {
        throw new Error("No data found for export");
      }

      // Map the displayed data for Excel export
      const excelData = dataOutOrder.map((item, index) => ({
        STT: index + 1,
        "Tên sản phẩm": item.product?.name || "N/A",
        "Tên khách hàng": item.customer?.name || "N/A",
        "Giá nhập": item.product?.in_price || "N/A",
        "Giá xuất": item.out_price || "N/A",
        "Chứng từ": item.quantity_doc || "N/A",
        "Thực tế": item.quantity_real || "N/A",
        "Hóa đơn": item.invoice || "N/A",
        "Ngày xuất": item.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY")
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "DisplayedOutOrderData"
      );
      XLSX.writeFile(workbook, "DisplayedOutOrderData.xlsx");

      notification.success({
        message: "Export Success",
        description: "Displayed data has been successfully exported to Excel.",
      });
    } catch (error) {
      console.error("Error exporting displayed data:", error);
      notification.error({
        message: "Export Error",
        description: error.message || "There was an error exporting the data.",
      });
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Danh sách đơn xuất</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportDisplayedDataToExcel}
            type="primary"
          >
            Xuất excel
          </Button>
          <Button onClick={() => navigate("/import-out-order")} type="default">
            Import Excel
          </Button>
        </div>
      </div>
      <Table
        rowKey={"_id"}
        columns={columns}
        dataSource={dataOutOrder}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => (
            <div>
              {" "}
              {range[0]}-{range[1]} trên {total} rows
            </div>
          ),
        }}
        onChange={onChange}
        onRow={(record) => ({
          onClick: () => {
            setDataDetail(record);
            setIsDetailOpen(true);
          },
          style: { cursor: "pointer" },
        })}
      />
      <ViewOutOrderDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        loadOutOrder={loadOutOrder}
      />
      <UpdateOutOrderModal
        isOpen={isModalUpdateOpen}
        onClose={() => setIsModalUpdateOpen(false)}
        onSubmit={(formData) => {
          console.log(formData);
          setIsModalUpdateOpen(false);
        }}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default OutOrderTable;
