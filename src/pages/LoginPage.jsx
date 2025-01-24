import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
// const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const LoginPage = ({ getAdminProducts, setIsAuth }) => {
  const [user, setUser] = useState({
    username: 'example@test.com',
    password: 'example',
  });

  //handleCheckLogin確認是否已登入有token
  useEffect(() => {
    const checkAdminLogin = async () => {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
          '$1'
        );
        if (!token) return; // 如果沒有 token 就直接返回

        axios.defaults.headers.common['Authorization'] = token;
        // 使用 axios 發送請求到後端 API
        const response = await axios.post(`${hexAPIUrl}/api/user/check`);

        if (response.data.success) {
          setIsAuth(true);
          getAdminProducts(); // 驗證成功後獲取產品
          console.log('驗證成功：', response);
        }
      } catch (error) {
        console.error('驗證失敗：', error);
      }
    };

    checkAdminLogin();
  }, []);

  //擷取登入資訊
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  //登入
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${hexAPIUrl}/admin/signin`, user);
      console.log('登入成功：', response.data);
      // 從 response.data 中取出 token 和 expired
      const { token, expired } = response.data;
      // 將 token 和 expired 存到 cookies
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

      console.log('Token 和 expired 已存入 cookies');
      // getAdminProducts();
      setIsAuth(true);
    } catch (error) {
      console.error('登入失敗：', error);
    }
  };
  return (
    <>
      <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
        <h1 className='mb-5'>請先登入</h1>{' '}
        <form onSubmit={handleAdminLogin} className='d-flex flex-column gap-3'>
          <div className='form-floating mb-3'>
            <input
              type='email'
              className='form-control'
              id='email'
              value={user.username}
              name='username'
              onChange={handleInput}
            />
            <label htmlFor='username'>Email address</label>{' '}
          </div>
          <div className='form-floating'>
            <input
              type='password'
              id='password'
              className='form-control'
              value={user.password}
              name='password'
              onChange={handleInput}
            />
            <label htmlFor='password'>Password</label>{' '}
          </div>
          <button type='submit' className='btn btn-primary'>
            登入
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
