import React, { useState } from 'react';
import { Upload, Button, Alert, Typography, Divider, message, Spin, Card } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImportOutOrderExcelPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Download template
  const handleDownloadTemplate = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9999/out/template/download', {
        responseType: 'blob'
      });
      
      // Tạo URL và link download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'donxuat_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      message.error('Không thể tải template. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!file) {
      message.warning('Vui lòng chọn file trước khi tiếp tục!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:9999/out/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        message.success('Import dữ liệu thành công!');
        setFile(null);
      } else {
        setError(response.data.error || 'Có lỗi xảy ra khi import dữ liệu');
        message.error('Import thất bại!');
      }
    } catch (err) {
      // Lấy message lỗi từ response của backend
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi import dữ liệu';
      
      // Nếu lỗi là array (nhiều lỗi)
      if (Array.isArray(errorMessage)) {
        setError(
          <ul>
            {errorMessage.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        );
      } else {
        // Nếu lỗi là string
        setError(errorMessage);
      }
      
      message.error('Import thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.xls,.xlsx',
    showUploadList: true,
    beforeUpload: (file) => {
      // Kiểm tra định dạng file
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Chỉ chấp nhận file Excel!');
        return Upload.LIST_IGNORE;
      }

      // Kiểm tra dung lượng (20MB)
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('File phải nhỏ hơn 20MB!');
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFile(null);
      setError(null);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
            Nhập đơn xuất từ Excel
          </Title>

          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Main Content */}
            <div style={{ flex: '1' }}>
              {/* Section 1: Download Template */}
              <Card 
                title={<Title level={4}>1. Tải template và điền thông tin</Title>}
                style={{ marginBottom: '24px' }}
              >
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                  size="large"
                  type="primary"
                >
                  Tải file mẫu
                </Button>
              </Card>

              {/* Section 2: Upload File */}
              <Card 
                title={<Title level={4}>2. Upload file đã điền thông tin</Title>}
              >
                <Alert
                  message="Lưu ý quan trọng"
                  description={
                    <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                      <li>Mỗi file chỉ được nhập tối đa 500 dòng chi tiết</li>
                      <li>Dung lượng tối đa 20MB</li>
                      <li>Chỉ chấp nhận file định dạng .xls, .xlsx</li>
                    </ul>
                  }
                  type="warning"  
                  showIcon
                  style={{ marginBottom: '24px' }}
                />

                <Dragger {...uploadProps} style={{ padding: '24px' }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: '#40a9ff' }} />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                    Kéo thả file tại đây hoặc click để chọn file
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#666' }}>
                    Hỗ trợ tải lên một file duy nhất
                  </p>
                </Dragger>

                {error && (
                  <Alert
                    message="Lỗi Import"
                    description={
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {error}
                      </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginTop: '24px' }}
                  />
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div style={{ width: '300px' }}>
              <Card title={<Title level={4}>Hướng dẫn</Title>}>
                <ol style={{ paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '12px' }}>Tải file mẫu</li>
                  <li style={{ marginBottom: '12px' }}>Điền thông tin theo mẫu</li>
                  <li style={{ marginBottom: '12px' }}>Upload file đã điền thông tin</li>
                  <li>Kiểm tra kết quả import</li>
                </ol>
              </Card>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ 
            marginTop: '24px', 
            display: 'flex', 
            justifyContent: 'flex-end',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '24px'
          }}>
            <Button 
              type="primary" 
              onClick={handleUpload}
              disabled={!file}
              loading={loading}
              size="large"
            >
              Tiến hành Import
            </Button>
          </div>
        </Card>
      </div>
    </Spin>
  );
};

export default ImportOutOrderExcelPage;