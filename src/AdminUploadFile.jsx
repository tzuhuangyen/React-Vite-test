import axios from 'axios';
import React from 'react';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;
const AdminUploadFile = () => {
  const uploadFile = () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];

    const fileInput = document.querySelector('#file');

    axios.defaults.headers.common['Authorization'] = token;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);

    axios
      .post(`${hexAPIUrl}/api/${hexAPIPath}/admin/upload`, formData)
      .then((res) => {
        console.log('上傳成功：', res);
      })
      .catch((err) => {
        console.log('上傳失敗：', err.response);
      });
  };

  return (
    <>
      <h1>admin UploadFile</h1>
      <h2>
        <input
          type='file'
          className='form-control'
          id='file'
          placeholder='upload file'
        />
      </h2>
      {/* 添加上傳按鈕 */}
      <button className='btn btn-primary mt-2' onClick={uploadFile}>
        上傳檔案
      </button>
    </>
  );
};

export default AdminUploadFile;
