import { ChangeEvent } from 'react';

type ModalProps = {
  imageType: string;
  closeModal: () => void;
  uploadImage: () => void;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Modal = ({ closeModal, uploadImage, handleUpload, imageType }: ModalProps) => {
  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75' />
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
          &#8203;
        </span>
        <div
          className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <div className='bg-white px-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Change {imageType}</h3>
                <div className='mt-3 mx-12'>
                  <input
                    onChange={handleUpload}
                    type='file'
                    className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='px-4 pb-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              onClick={closeModal}
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium text-white bg-red-600 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Cancel
            </button>
            <button
              onClick={uploadImage}
              type='button'
              className='w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium bg-green-600 text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
