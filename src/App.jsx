import { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import MainComponent from './components/MainComponent';
import SideBar from './components/SideBar';
import AdminUploadFile from './AdminUploadFile';
import LoginPage from './pages/LoginPage';
import AdminProductPage from './pages/AdminProductPage';
import axios from 'axios';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

function App() {
  const [isAuth, setIsAuth] = useState(false); // 初始狀態為未認證
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  //管理員取得產品
  const getAdminProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/products?page=${page}`
      );
      console.log('取得產品列表成功：', response.data);
      // 確保正確處理回應數據
      if (response.data.success) {
        setProducts(response.data.products);
        setPageInfo(response.data.pagination);
      }
    } catch (error) {
      console.error('取得產品列表失敗：', error);
      if (error.response) {
        console.log('錯誤狀態:', error.response.status);
        console.log('錯誤數據:', error.response.data);
      }
    }
  };
  return (
    <>
      {/* 登入和未登入畫面 */}
      <div className='container'>
        <Header />
        {isAuth ? (
          <>
            {/* 已登入顯示主要內容 */}
            <div className='row'>
              <div className='col-md-2'>
                <SideBar />
              </div>
              <div className='col-md-10'>
                <MainComponent />
                <AdminProductPage
                  setIsAuth={setIsAuth}
                  getAdminProducts={getAdminProducts}
                  pageInfo={pageInfo}
                  products={products}
                />
                <AdminUploadFile />
              </div>
            </div>
          </>
        ) : (
          // 未登入顯示登入表單
          <LoginPage
            setIsAuth={setIsAuth}
            getAdminProducts={getAdminProducts}
          />
        )}
      </div>
      <p className='mt-5 mb-3 text-muted'>&copy; 2025~∞ - Yennefer</p>{' '}
    </>
  );
}

export default App;
