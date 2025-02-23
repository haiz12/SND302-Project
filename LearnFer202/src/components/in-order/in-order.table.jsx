import { notification, Popconfirm, Table, Button } from 'antd';
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useState } from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx';
import ViewInOrderDetail from './in-order.detail';
import UpdateInOrderModal from './in-order.update';
import { DeleteInOrderAPI } from './in-order.api';
import { useNavigate } from 'react-router-dom';

const InOrderTable = (props) => {
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const navigate = useNavigate();
    const {
        dataInOrder,
        loadInOrder,
        current,
        pageSize,
        total,
        setCurrent,
        setPageSize,
    } = props;

    const handleDeleteSupplier = async (id) => {
        const res = await DeleteInOrderAPI(id);
        if (res.data) {
            notification.success({
                message: "Delete đơn xuất",
                description: "Xóa đơn xuất thành công",
            });
            await loadInOrder();
        } else {
            notification.error({
                message: "Error delete user",
                description: JSON.stringify(res.message),
            });
        }
    };

    const columns = [
        { title: "STT", render: (_, record, index) => index + 1 },
        { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product_name', render: (product) => product?.name || 'N/A' },
        { title: 'Tên nhà cung cấp', dataIndex: 'supplier', key: 'supplier_name', render: (supplier) => supplier?.name || 'N/A' },
        { title: 'Giá nhập', dataIndex: 'product', key: 'product_in_price', render: (product) => <div>{product?.in_price || 'N/A'}</div> },
        { title: 'Chứng từ', dataIndex: 'quantity_doc', key: 'quantity_doc', render: (quantity_doc) => quantity_doc || 'N/A' },
        { title: 'Thực nhập', dataIndex: 'quantity_real', key: 'quantity_real', render: (quantity_real) => quantity_real || 'N/A' },
        { title: 'Hóa đơn', dataIndex: 'invoice', key: 'invoice', render: (invoice) => invoice || 'N/A' },
        { title: 'Ngày nhập', dataIndex: 'createdAt', key: 'createdAt', render: (createdAt) => createdAt ? moment(createdAt).format('DD/MM/YYYY') : 'N/A' },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "30px" }}>
                    <EditOutlined onClick={(e) => { e.stopPropagation(); setDataUpdate(record || {}); setIsModalUpdateOpen(true); }} />
                    <Popconfirm
                        title="Xóa nhà cung cấp này"
                        description="Bạn chắc chắn xóa nhà cung cấp này?"
                        onConfirm={(e) => { e.stopPropagation(); handleDeleteSupplier(record?._id); }}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} onClick={(e) => e.stopPropagation()} />
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

    const handleSubmitUpdate = (formData) => {
        setDataUpdate(formData);
        loadInOrder();
    };

    const exportDisplayedDataToExcel = () => {
        try {
            if (dataInOrder.length === 0) {
                throw new Error("No data found for export");
            }

            // Map the displayed data for Excel export
            const excelData = dataInOrder.map((item, index) => ({
                STT: index + 1,
                "Tên sản phẩm": item.product?.name || 'N/A',
                "Tên nhà cung cấp": item.supplier?.name || 'N/A',
                "Giá nhập": item.product?.in_price || 'N/A',
                "Chứng từ": item.quantity_doc || 'N/A',
                "Thực nhập": item.quantity_real || 'N/A',
                "Hóa đơn": item.invoice || 'N/A',
                "Ngày nhập": item.createdAt ? moment(item.createdAt).format('DD/MM/YYYY') : 'N/A'
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DisplayedInOrderData");
            XLSX.writeFile(workbook, "DisplayedInOrderData.xlsx");

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3>Danh sách đơn nhập</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button icon={<FileExcelOutlined />} onClick={exportDisplayedDataToExcel} type="primary">
                        Xuất excel
                    </Button>
                    <Button onClick={() => navigate("/import-in-order")} type="default">
                        Import Excel
                    </Button>
                </div>
            </div>
            <Table
                rowKey={"_id"}
                columns={columns}
                dataSource={dataInOrder}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => (
                        <div> {range[0]}-{range[1]} trên {total} rows</div>
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
            <ViewInOrderDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                loadInOrder={loadInOrder}
            />
            <UpdateInOrderModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                onSubmit={handleSubmitUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default InOrderTable;
