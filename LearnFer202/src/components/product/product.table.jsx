import { notification, Popconfirm, Table, Button } from 'antd';
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { deleteProductAPI, getBySupplier } from './product.api';
import UpdateProductModal from './product.update';
import { useState } from 'react';
import ViewProductDetail from './product.detail';
import * as XLSX from 'xlsx'; // Import the xlsx library

const ProductTable = (props) => {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const {
    dataProducts,
    loadProduct,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
  } = props;

  const handleDeleteProduct = async (id) => {
    const res = await deleteProductAPI(id);
    if (res.data) {
      notification.success({
        message: "Delete Product",
        description: "Xóa product thành công",
      });
      await loadProduct();
    } else {
      notification.error({
        message: "Error delete user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const [supplierDetails, setSupplierDetails] = useState({});

  const fetchSupplierDetails = async (supplierId) => {
    if (!supplierId) return 'N/A';
    if (supplierDetails[supplierId]) return supplierDetails[supplierId];
    try {
      const res = await getBySupplier(supplierId);
      if (res.data) {
        setSupplierDetails(prev => ({
          ...prev,
          [supplierId]: res.data.name,
        }));
        return res.data.name;
      }
    } catch (error) {
      console.error("Error fetching supplier details", error);
    }
    return 'N/A';
  };

  const exportToExcel = () => {
    const excelData = dataProducts.map((item, index) => ({
      STT: index + 1,
      Code: item.code || 'N/A',
      "Tên sản phẩm": item.name || 'N/A',
      "Nhà Cung Cấp": supplierDetails[item.supplier] || 'N/A',
      "Kích Thước": item.size || 'N/A',
      "Chất liệu": item.material || 'N/A',
      "Số lượng": item.quantity || 'N/A',
      "Giá nhập": item.in_price || 'N/A',
      "Giá bán": item.out_price || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "ProductsData.xlsx");

    notification.success({
      message: "Export Success",
      description: "Data has been successfully exported to Excel.",
    });
  };

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplierId) => {
        return supplierId
          ? supplierDetails[supplierId] || fetchSupplierDetails(supplierId)
          : 'N/A';
      },
    },
    {
      title: 'Kích Th size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Chất liệu',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá nhập',
      dataIndex: 'in_price',
      key: 'in_price',
    },
    {
      title: 'Giá bán',
      dataIndex: 'out_price',
      key: 'out_price',
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "30px" }}>
          <EditOutlined
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click when clicking edit
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn chắc chắn xóa sản phẩm này này ?"
            onConfirm={(e) => {
              e.stopPropagation(); // Prevent row click when confirming delete
              handleDeleteProduct(record._id);
            }}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <DeleteOutlined 
              style={{ cursor: "pointer", color: "red" }}
              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking delete
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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel} type="primary">
        </Button>
      </div>
      <Table 
        rowKey={"_id"}
        columns={columns}
        dataSource={dataProducts}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
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
      <UpdateProductModal
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadAccount={loadProduct}
      />
      <ViewProductDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        loadProduct={loadProduct}
      />
    </>
  );
}

export default ProductTable;