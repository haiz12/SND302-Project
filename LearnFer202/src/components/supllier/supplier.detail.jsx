import { Modal, Descriptions, Button } from "antd";

const ViewSupplierDetail = (props) => {
  const { dataDetail, setDataDetail, isDetailOpen, setIsDetailOpen } = props;

  const handleClose = () => {
    setDataDetail(null);
    setIsDetailOpen(false);
  };

  return (
    <Modal
      width={"75vw"}
      title="Chi tiết Nhà Cung cấp"  
      open={isDetailOpen}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>
      ]}
    >
      {dataDetail ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Mã nhà cung cấp" span={2}>
            {dataDetail?.code}
          </Descriptions.Item>
          
          <Descriptions.Item label="Tên công ty" span={2}>
            {dataDetail?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {dataDetail?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại">
            {dataDetail?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {dataDetail?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Website">
            {dataDetail?.website}
          </Descriptions.Item>

          <Descriptions.Item label="Địa chỉ" span={2}>
            {dataDetail?.address}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {new Date(dataDetail?.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {new Date(dataDetail?.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>

          <Descriptions.Item label="Logo" span={2}>
            {dataDetail?.logo?.map((item, index) => (
              <div key={item._id}>
                <img 
                  src={item.url} 
                  alt={item.caption}
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            ))}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </Modal>
  );
};

export default ViewSupplierDetail;