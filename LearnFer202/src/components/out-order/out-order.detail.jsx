import { Modal, Descriptions, Button } from "antd";
import * as XLSX from "xlsx";

const ViewOutOrderDetail = (props) => {
  const { dataDetail, setDataDetail, isDetailOpen, setIsDetailOpen, loadOutOrder } = props;

  const handleClose = () => {
    setDataDetail(null);
    setIsDetailOpen(false);
  };

  const formatNumber = (number) => {
    return number ? number.toLocaleString('vi-VN') : 'N/A';
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString('vi-VN') : 'N/A';
  };

  const exportToExcel = () => {
    if (!dataDetail) return;

    // Prepare data for Excel
    const excelData = [
      { Label: "Mã sản phẩm", Value: dataDetail?.product?.code || 'N/A' },
      { Label: "Tên sản phẩm", Value: dataDetail?.product?.name || 'N/A' },
      { Label: "Kích thước", Value: dataDetail?.product?.size || 'N/A' },
      { Label: "Chất liệu", Value: dataDetail?.product?.material || 'N/A' },
      { Label: "Giá nhập", Value: dataDetail?.product?.in_price ? `${formatNumber(dataDetail.product.in_price)} VNĐ` : 'N/A' },
      { Label: "Giá xuất", Value: dataDetail?.out_price ? `${formatNumber(dataDetail.out_price)} VNĐ` : 'N/A' },
      { Label: "Khách hàng", Value: dataDetail?.customer?.name || 'N/A' },
      { Label: "Số điện thoại", Value: dataDetail?.customer?.phone || 'N/A' },
      { Label: "Email", Value: dataDetail?.customer?.email || 'N/A' },
      { Label: "Địa chỉ", Value: dataDetail?.customer?.address || 'N/A' },
      { Label: "Số lượng thực tế", Value: dataDetail?.quantity_real || 'N/A' },
      { Label: "Số lượng trên chứng từ", Value: dataDetail?.quantity_doc || 'N/A' },
      { Label: "Người nhận", Value: dataDetail?.receiver || 'N/A' },
      { Label: "Số hóa đơn", Value: dataDetail?.invoice || 'N/A' },
      { Label: "Ngày xuất", Value: formatDate(dataDetail?.createdAt) },
      { Label: "Tổng giá trị xuất", Value: dataDetail?.out_price && dataDetail?.quantity_real ? `${formatNumber(dataDetail.out_price * dataDetail.quantity_real)} VNĐ` : 'N/A' }
    ];

    // Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: ["Label", "Value"] });

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OutOrderDetail");

    // Export the workbook to a file
    XLSX.writeFile(workbook, "OutOrderDetail.xlsx");
  };

  return (
    <Modal
      width={"75vw"}
      title="Chi tiết phiếu xuất"
      open={isDetailOpen}
      onCancel={handleClose}
      footer={[
        <Button key="export" onClick={exportToExcel}>
          Xuất Excel
        </Button>,
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>,
       
      ]}
    >
      {dataDetail ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Mã sản phẩm" span={2}>
            {dataDetail?.product?.code || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sản phẩm" span={2}>
            {dataDetail?.product?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Kích thước">
            {dataDetail?.product?.size || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Chất liệu">
            {dataDetail?.product?.material || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá nhập">
            {dataDetail?.product?.in_price ? `${formatNumber(dataDetail.product.in_price)} VNĐ` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá xuất">
            {dataDetail?.out_price ? `${formatNumber(dataDetail.out_price)} VNĐ` : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng" span={2}>
            {dataDetail?.customer?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataDetail?.customer?.phone || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataDetail?.customer?.email || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {dataDetail?.customer?.address || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng thực tế">
            {dataDetail?.quantity_real || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng trên chứng từ">
            {dataDetail?.quantity_doc || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Người nhận">
            {dataDetail?.receiver || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Số hóa đơn">
            {dataDetail?.invoice || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày xuất" span={2}>
            {formatDate(dataDetail?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng giá trị xuất" span={2}>
            {dataDetail?.out_price && dataDetail?.quantity_real ? `${formatNumber(dataDetail.out_price * dataDetail.quantity_real)} VNĐ` : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </Modal>
  );
};

export default ViewOutOrderDetail;
