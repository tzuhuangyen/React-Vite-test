import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import { Modal } from 'bootstrap';
import Header from './components/Header';
import MainComponent from './components/MainComponent';
import SideBar from './components/SideBar';
import AdminUploadFile from './AdminUploadFile';
console.log(import.meta.env.VITE_API_hexAPIUrl);
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

function App() {
  const [user, setUser] = useState({ username: '', password: '' });
  const [isAuth, setIsAuth] = useState(false); // 初始狀態為未認證
  const [products, setProducts] = useState([]);

  // const modalRef = useRef(null); // 透過 useRef 創建一個 ref，並將其賦值給 modalRef
  // const customModal = useRef(null); // 創建一個 ref，並將其賦值給 customModal
  // 在 useEffect 中，使用 modalRef.current 取得 ref 的 DOM 元素
  // useEffect(() => {
  //   console.log(modalRef.current);
  //   customModal.current = new Modal(modalRef.current);
  //   // customModal.current.show();
  // }, []);
  // const openModal = () => {
  //   customModal.current.show();
  // };
  //確認是否有token
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
  const handleAdminLogin = async () => {
    e.preventDefault();
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
      getAdminProducts();
      setIsAuth(true);
    } catch (error) {
      console.error('登入失敗：', error);
    }
  };
  //管理員取得產品
  const getAdminProducts = async () => {
    try {
      const response = await axios.get(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/products/all`
      );
      console.log('取得產品列表成功：', response.data);
      setProducts(response.data.products);
    } catch (error) {
      console.error('取得產品列表失敗：', error);
    }
  };

  return (
    <>
      <div className='container'>
        <Header />
        {isAuth ? (
          <>
            {/* 已登入顯示主要內容 */}
            <div className='row'>
              <div className='col-md-4'>
                <SideBar />
              </div>
              <div className='col-md-8'>
                <MainComponent products={products} />
                {/* 添加產品表格 */}
                <div className='mb-4'>
                  <h3>產品列表</h3>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>標題</th>
                        <th>分類</th>
                        <th>價格</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products &&
                        Object.values(products).map((product) => (
                          <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.category}</td>

                            <td>${product.price}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {JSON.stringify(products, null, 2)}

                <AdminUploadFile />
              </div>
            </div>
          </>
        ) : (
          // 未登入顯示登入表單
          <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
            <h1 className='mb-5'>請先登入</h1>{' '}
            <form
              onSubmit={handleAdminLogin}
              className='d-flex flex-column gap-3'
            >
              <div className='form-floating mb-3'>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  name='username'
                  value={user.username}
                  onChange={handleInput}
                />
                <label htmlFor='username'>Email address</label>{' '}
              </div>
              <div className='form-floating'>
                <input
                  type='password'
                  id='password'
                  className='form-control'
                  name='password'
                  value={user.password}
                  onChange={handleInput}
                />
                <label htmlFor='password'>Password</label>{' '}
              </div>
              <button type='submit' className='btn btn-primary'>
                登入
              </button>
            </form>
          </div>
        )}
      </div>
      <p className='mt-5 mb-3 text-muted'>&copy; 2025~∞ - Yennefer</p>{' '}
    </>
  );
}

export default App;
