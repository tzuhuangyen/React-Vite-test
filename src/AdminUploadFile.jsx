import React from 'react';

const AdminUploadFile = () => {
  return (
    <>
      <h1>admin UploadFile</h1>
      <h2>
        <input
          type='file'
          className='form-control'
          id='file'
          placeholder='up;oad file'
        />
      </h2>
    </>
  );
};

export default AdminUploadFile;
