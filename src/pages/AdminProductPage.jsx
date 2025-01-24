import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
};

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);

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
  useEffect(() => {
    getAdminProducts();
  }, []);
  const [modalMode, setModalMode] = useState(null);
  //分頁
  const [pageInfo, setPageInfo] = useState({});
  //換分頁
  const handlePageChange = (page) => {
    getAdminProducts(page);
  };
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct(product);
        break;
    }
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show(); // 顯示 Modal
  };
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide(); // 顯示 Modal
  };
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  };
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
  };
  //product modal
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  useEffect(() => {
    // console.log(productModalRef.current);
    new Modal(productModalRef.current, { backdrop: false }); // 初始化 Modal
    // console.log(Modal.getInstance(productModalRef.current)); // 顯示 Modal
    new Modal(delProductModalRef.current, { backdrop: false }); // 初始化 Modal
  }, []);

  //編輯產品視窗
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  //編輯副圖
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const createProduct = async () => {
    try {
      await axios.post(`${hexAPIUrl}/api/${hexAPIPath}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert('新增失敗');
      console.error('新增失敗：', error);
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      alert('更新失敗');
      console.error('更新失敗：', error);
    }
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    try {
      await apiCall();
      getAdminProducts();
      handleCloseProductModal();
      console.log('更新成功');
    } catch (error) {
      alert('更新失敗');
      console.error('更新失敗：', error);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      alert('刪除失敗');
      console.error('刪除失敗', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getAdminProducts();
      handleCloseDelProductModal();
      console.log('刪除成功');
    } catch (error) {
      alert('刪除失敗');
      console.error('刪除失敗');
    }
  };

  //圖片上傳
  const handleFileChange = async (e) => {
    console.log('Files:', e.target.files);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);
    console.log(formData);
    try {
      const res = await axios.post(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadedImageUrl,
      });
      alert('圖片上傳成功');
      console.log('圖片上傳成功:', uploadedImageUrl);
    } catch (error) {
      console.error('圖片上傳失敗：', error);
    }
  };
  return (
    <>
      <div className='row'>
        {' '}
        {/* 添加 row 容器 */}
        <div className='col'>
          <div className='d-flex justify-content-between'>
            <h2>產品列表</h2>
            <button
              onClick={() => handleOpenProductModal('create')}
              type='button'
              className='btn btn-primary'
            >
              建立新的產品
            </button>
          </div>
          <table className='table'>
            <thead>
              <tr>
                <th scope='col'>產品名稱</th>
                <th scope='col'>原價</th>
                <th scope='col'>售價</th>
                <th scope='col'>是否啟用</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product.id}>
                    <th scope='row'>{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className='text-success'>啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className='btn-group'>
                        <button
                          onClick={() =>
                            handleOpenProductModal('edit', product)
                          }
                          type='button'
                          className='btn btn-outline-primary btn-sm'
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type='button'
                          className='btn btn-outline-danger btn-sm'
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* 分頁 */}
          <div className='d-flex justify-content-center'>
            <nav>
              <ul className='pagination'>
                <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                  <a
                    onClick={() => handlePageChange(pageInfo.current_page - 1)}
                    className='page-link'
                    href='#'
                  >
                    上一頁
                  </a>
                </li>

                {Array.from({ length: pageInfo.total_pages }).map(
                  (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pageInfo.current_page === index + 1 && 'active'
                      }`}
                    >
                      <a
                        onClick={() => handlePageChange(index + 1)}
                        className='page-link'
                        href='#'
                      >
                        {index + 1}
                      </a>
                    </li>
                  )
                )}
                <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                  <a
                    onClick={() => handlePageChange(pageInfo.current_page + 1)}
                    className='page-link'
                    href='#'
                  >
                    下一頁
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* 登入後的編輯產品模組modal */}
      <div
        ref={productModalRef}
        id='productModal'
        className='modal'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className='modal-dialog modal-dialog-centered modal-xl'>
          <div className='modal-content border-0 shadow'>
            <div className='modal-header border-bottom'>
              <h5 className='modal-title fs-4'>
                {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
              </h5>
              <button
                onClick={handleCloseProductModal}
                type='button'
                className='btn-close'
                aria-label='Close'
              ></button>
            </div>

            <div className='modal-body p-4'>
              <div className='row g-4'>
                <div className='col-md-4'>
                  <div className='mb-4'>
                    <div className='mb-5'>
                      <label htmlFor='fileInput' className='form-label'>
                        {' '}
                        圖片上傳{' '}
                      </label>
                      <input
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        className='form-control'
                        id='fileInput'
                        onChange={handleFileChange}
                      />
                    </div>
                    <label htmlFor='primary-image' className='form-label'>
                      主圖
                    </label>
                    <div className='input-group'>
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name='imageUrl'
                        type='text'
                        id='primary-image'
                        className='form-control'
                        placeholder='請輸入圖片連結'
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className='img-fluid'
                    />
                  </div>

                  {/* 副圖 */}
                  <div className='border border-2 border-dashed rounded-3 p-3'>
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className='mb-2'>
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className='form-label'
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => {
                            handleImageChange(e, index);
                          }}
                          name={`imagesUrl-${index + 1}`}
                          id={`imagesUrl-${index + 1}`}
                          type='text'
                          placeholder={`圖片網址 ${index + 1}`}
                          className='form-control mb-2'
                        />

                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className='img-fluid mb-2'
                          />
                        )}
                      </div>
                    ))}
                    <div className='btn-group w-100'>
                      {tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[
                          tempProduct.imagesUrl.length - 1
                        ] !== '' && (
                          <button
                            onClick={handleAddImage}
                            className='btn btn-outline-primary btn-sm w-100'
                          >
                            新增圖片
                          </button>
                        )}
                      {tempProduct.imagesUrl.length > 1 && (
                        <button
                          onClick={handleRemoveImage}
                          className='btn btn-outline-danger btn-sm w-100'
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className='col-md-8'>
                  <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name='title'
                      id='title'
                      type='text'
                      className='form-control'
                      placeholder='請輸入標題'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='category' className='form-label'>
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name='category'
                      id='category'
                      type='text'
                      className='form-control'
                      placeholder='請輸入分類'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='unit' className='form-label'>
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name='unit'
                      id='unit'
                      type='text'
                      className='form-control'
                      placeholder='請輸入單位'
                    />
                  </div>

                  <div className='row g-3 mb-3'>
                    <div className='col-6'>
                      <label htmlFor='origin_price' className='form-label'>
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name='origin_price'
                        id='origin_price'
                        type='number'
                        className='form-control'
                        placeholder='請輸入原價'
                      />
                    </div>
                    <div className='col-6'>
                      <label htmlFor='price' className='form-label'>
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name='price'
                        id='price'
                        type='number'
                        className='form-control'
                        placeholder='請輸入售價'
                      />
                    </div>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name='description'
                      id='description'
                      className='form-control'
                      rows={4}
                      placeholder='請輸入產品描述'
                    ></textarea>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='content' className='form-label'>
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name='content'
                      id='content'
                      className='form-control'
                      rows={4}
                      placeholder='請輸入說明內容'
                    ></textarea>
                  </div>

                  <div className='form-check'>
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name='is_enabled'
                      type='checkbox'
                      className='form-check-input'
                      id='isEnabled'
                    />
                    <label className='form-check-label' htmlFor='isEnabled'>
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className='modal-footer border-top bg-light'>
              <button
                onClick={handleCloseProductModal}
                type='button'
                className='btn btn-secondary'
              >
                取消
              </button>
              <button
                onClick={handleUpdateProduct}
                type='button'
                className='btn btn-primary'
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*登入後的確認商品刪除模組modal */}
      <div
        ref={delProductModalRef}
        className='modal fade'
        id='delProductModal'
        tabIndex='-1'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5'>刪除產品</h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              你是否要刪除
              <span className='text-danger fw-bold'>{tempProduct.title}</span>
            </div>
            <div className='modal-footer'>
              <button
                onClick={handleCloseDelProductModal}
                type='button'
                className='btn btn-secondary'
              >
                取消
              </button>
              <button
                onClick={handleDeleteProduct}
                type='button'
                className='btn btn-danger'
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductPage;