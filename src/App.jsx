import { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import MainComponent from './components/MainComponent';
import SideBar from './components/SideBar';
import AdminUploadFile from './AdminUploadFile';
import LoginPage from './pages/LoginPage';
import AdminProductPage from './pages/AdminProductPage';

function App() {
  const [isAuth, setIsAuth] = useState(false); // 初始狀態為未認證

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
                <AdminProductPage setIsAuth={setIsAuth} />
                <AdminUploadFile />
              </div>
            </div>
          </>
        ) : (
          // 未登入顯示登入表單
          <LoginPage setIsAuth={setIsAuth} />
        )}
      </div>
      <p className='mt-5 mb-3 text-muted'>&copy; 2025~∞ - Yennefer</p>{' '}
    </>
  );
}

export default App;
