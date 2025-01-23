import axios from 'axios';
import React, { useState, useRef } from 'react';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const AdminUploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // 添加預覽狀態
  const fileInputRef = useRef(null); // 添加 ref

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      // 創建預覽
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      // 如果沒有選擇檔案，清空預覽
      setPreview(null);
    }
  };

  const uploadFile = () => {
    if (!selectedFile) {
      fileInputRef.current.click(); // 如果沒有選擇檔案，觸發檔案選擇
      return;
    }

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];

    axios.defaults.headers.common['Authorization'] = token;

    const formData = new FormData();
    formData.append('file-to-upload', selectedFile);

    axios
      .post(`${hexAPIUrl}/api/${hexAPIPath}/admin/upload`, formData)
      .then((res) => {
        console.log('upload done', res);
        setSelectedFile(null);
        setPreview(null);

        // 清空輸入框
        e.target.previousElementSibling.querySelector('input').value = '';
      })
      .catch((err) => {
        console.log('upload Error', err.response);
      });
  };

  return (
    <>
      <h2>admin Upload File</h2>
      <h3>
        <input
          type='file'
          ref={fileInputRef}
          style={{ display: 'none' }}
          className='form-control'
          onChange={handleFileChange}
          placeholder='upload file'
        />
      </h3>
      {/* 預覽區域 */}
      {preview && (
        <div className='mb-3'>
          <h3>預覽圖片：</h3>
          <img
            src={preview}
            alt='預覽'
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
      {/* 添加上傳按鈕 */}
      <button className='btn btn-primary mt-2' onClick={uploadFile}>
        {selectedFile ? 'upload' : 'select a file'}
      </button>
      {/* 添加已選擇檔案提示 */}
      {selectedFile && (
        <div className='mt-2'>已選擇檔案: {selectedFile.name}</div>
      )}
    </>
  );
};

export default AdminUploadFile;
