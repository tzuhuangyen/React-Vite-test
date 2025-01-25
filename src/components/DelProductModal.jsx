import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const DelProductModal = ({
  getAdminProducts,
  isOpen,
  setIsOpen,
  tempProduct,
}) => {
  //product modal
  const delProductModalRef = useRef(null);

  useEffect(() => {
    new Modal(delProductModalRef.current, { backdrop: false }); // 初始化 Modal
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsOpen(false); // 關閉 Modal
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

  return (
    <>
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

export default DelProductModal;
