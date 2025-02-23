import { Modal, Descriptions, Button } from "antd";

const ViewProductDetail = (props) => {
  const { dataDetail, setDataDetail, isDetailOpen, setIsDetailOpen } = props;

  const handleClose = () => {
    setDataDetail(null);
    setIsDetailOpen(false);
  };

  return (
    <Modal
      width={"75vw"}
      title="Chi tiết sản phẩm"
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
          <Descriptions.Item label="Mã sản phẩm" span={2}>
            {dataDetail?.code}
          </Descriptions.Item>

          <Descriptions.Item label="Tên sản phẩm" span={2}>
            {dataDetail?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {dataDetail?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng">
            {dataDetail?.quantity}
          </Descriptions.Item>

          <Descriptions.Item label="Kích thước">
            {dataDetail?.size}
          </Descriptions.Item>

          <Descriptions.Item label="Chất liệu">
            {dataDetail?.material}
          </Descriptions.Item>

          <Descriptions.Item label="Giá nhập">
            {dataDetail?.in_price?.toLocaleString('vi-VN')} VNĐ
          </Descriptions.Item>

          <Descriptions.Item label="Giá bán">
            {dataDetail?.out_price?.toLocaleString('vi-VN')} VNĐ
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {new Date(dataDetail?.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {new Date(dataDetail?.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>

          <Descriptions.Item label="Hình ảnh" span={2}>
            {dataDetail?.images?.map((item, index) => (
              <div key={item._id}>
                <img
                  src={item.url}
                  alt={item.caption}
                  style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px' }}
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

export default ViewProductDetail;