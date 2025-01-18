import { useState, useRef, useEffect } from 'react';

import './App.css';
import axios from 'axios';
import { Modal } from 'bootstrap';
import AdminUploadFile from './AdminUploadFile';
console.log(import.meta.env.VITE_API_hexAPIUrl);
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

function App() {
  const [user, setUser] = useState({ username: '', password: '' });
  const modalRef = useRef(null); // 透過 useRef 創建一個 ref，並將其賦值給 modalRef
  const customModal = useRef(null); // 創建一個 ref，並將其賦值給 customModal
  // 在 useEffect 中，使用 modalRef.current 取得 ref 的 DOM 元素
  useEffect(() => {
    console.log(modalRef.current);
    customModal.current = new Modal(modalRef.current);
    // customModal.current.show();
  }, []);
  const openModal = () => {
    customModal.current.show();
  };
  const handleInput = (e) => {
    const { name } = e.target;
    setUser({ ...user, [name]: e.target.value });
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${hexAPIUrl}/admin/signin`, {
        username: user.username,
        password: user.password,
      });
      console.log('登入成功：', response.data);
      // 從 response.data 中取出 token 和 expired
      const { token, expired } = response.data;

      // 將 token 和 expired 存到 cookies
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

      console.log('Token 和 expired 已存入 cookies');
    } catch (error) {
      console.error('登入失敗：', error);
    }
  };
  const checkLogin = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1];
      axios.defaults.headers.common['Authorization'] = token;
      // 使用 axios 發送請求到後端 API
      const response = await axios.post(`${hexAPIUrl}/api/user/check`);
      console.log('驗證成功：', response);
    } catch (error) {
      console.error('驗證失敗：', error);
    }
  };
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/products/all`
      );
      console.log('取得產品列表成功：', response.data);
    } catch (error) {
      console.error('取得產品列表失敗：', error);
    }
  };

  return (
    <>
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => openModal()}
      >
        Launch demo modal
      </button>

      <div
        className='modal fade'
        ref={modalRef}
        tabIndex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Modal title
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>...</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button type='button' className='btn btn-primary'>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <h1>Vite + React</h1>
      <div className='card'>
        {/* 新增登入&驗證按鈕 */}
        <input type='email' id='email' name='username' onChange={handleInput} />
        <input
          type='password'
          id='password'
          name='password'
          onChange={handleInput}
        />

        <button onClick={handleLogin}>登入</button>
        <button onClick={checkLogin}>驗證登入</button>
        <button onClick={getProducts}>取得產品列表</button>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <AdminUploadFile />
    </>
  );
}

export default App;
