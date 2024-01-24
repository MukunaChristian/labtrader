import { usePopper } from "react-popper";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone'
import { uploadStock } from "../../api/diamonds";
import { WarehouseDropdown } from "../dropdowns/WarehouseDropdown.jsx";
import { SupplierDropdown } from "../dropdowns/SupplierDropdown.jsx";
import loader from '../../assets/loader.gif';
import { setDiamondTypeState } from "../../reducers/AppSlice";
import { useApp } from "../../hooks/useApp.jsx";

import { setUploadingLoaderState, setUploadErrorsState } from '../../reducers/AppSlice';


export const Header = ({ title, results }) => {
  const [uploadConfirm, setUploadConfirm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [fileLoaded, setFileLoaded] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);

  const user = useSelector(state => state.user.user)
  const filters = useSelector(state => state.app.filters);
  const uploading = useSelector(state => state.app.uploadingLoader);
  const uploadErrors = useSelector(state => state.app.uploadErrors);
  const currentDiamondType = useSelector(state => state.app.diamond_type);

  const { setFilters } = useApp()

  const dispatch = useDispatch();
  
  const popperElement = useRef(null);
  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement.current,
    {
      placement: "bottom" // Popup position
    }
  );

  useEffect(() => {
    const dummyElement = document.createElement("div");
    dummyElement.style.position = "fixed";
    setReferenceElement(dummyElement);
  }, []);

  

  const onDrop = useCallback(acceptedFiles => {
    console.log("File dropped");
    console.log(acceptedFiles[0])
    setFileLoaded(acceptedFiles[0]);
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  const handleFileUpload = (e) => {
    dispatch(setUploadErrorsState({}));
    dispatch(setUploadingLoaderState(true));
    e.stopPropagation();
    console.log("File uploaded");
    setFileLoaded(null);
    uploadStock(fileLoaded, selectedWarehouse, selectedSupplier, dispatch, setUploadingLoaderState, setUploadErrorsState);
  }

  const cancelFileUpload = (e) => {
    e.stopPropagation();
    setUploadConfirm(false);
    setFileLoaded(null);
  }

  const handleTabChange = (diamondType) => {
    dispatch(setDiamondTypeState(diamondType === 1 ? 'diamond' : 'melee'));
  }

  const downloadFile = () => {
    // Define the text to be written to the file
    let fileText = '';
    console.log(uploadErrors.count.failures)
    for (let i = 0; i < uploadErrors.count.failures.length; i++) {
      fileText += `Line ${uploadErrors.count.failures[i].line} - ${uploadErrors.count.failures[i].error}\n`;
    }

    // Create a Blob with the text
    const blob = new Blob([fileText], { type: 'text/plain' });

    // Create a link element
    const link = document.createElement('a');

    link.download = 'upload_errors.txt';

    link.href = window.URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div className="pt-24">
      <div className="w-full h-[2rem] border-solid border-0 border-b-[1px]">
        <button 
          onClick={() => {handleTabChange(1)}} 
          className={`
            border-0 border-solid w-[10rem] h-full  
            hover:bg-grey hover:border-[1px]
            ${currentDiamondType === "diamond" ? 'bg-grey border-[1px]' : 'bg-light-grey'}`
          }>Lab Grown Diamonds</button>
        <button 
          onClick={() => {handleTabChange(2)}} 
          className={`
            border-0 border-solid w-[10rem] h-full  
            hover:bg-grey hover:border-[1px]
            ${currentDiamondType === "melee" ? 'bg-grey border-[1px]' : 'bg-light-grey'}`
          }>Lab Grown Melee</button>
      </div>
      <div className="p-4 flex">
        <div>
          <p className="text-xl font-bold text-secondary">{ title }</p>
          <p className="text-sm text-text font-semibold">{ results } results</p>
        </div>
        <div className="flex ml-auto mt-4">
          <a href=".\Stock Upload Template.xlsx" download>
            <button className={user.role !== 'Superadmin' ? 'hidden' : 'default-button mr-4 bg-accent text-white'}>Download Template</button>
          </a>
          <button
            disabled={user.role !== 'Superadmin'}
            onClick={() => {
              setUploadConfirm(true);
            }}
            className={user.role !== 'Superadmin' ? 'hidden' : 'default-button bg-accent text-white'}
          >
            Upload Stock
          </button>
        </div>
      </div>

      {uploadConfirm && (
        <div className="">
          <div
            className="fixed z-[30] inset-0 bg-gray-700 opacity-50 h-[100vh]"
            onClick={() => {
              setUploadConfirm(false);
              setSelectedWarehouse(null);
              setFileLoaded(null);
            }} // Close the pop-up when clicking outside
          />
          <div
          ref={popperElement}
          style={{
            ...styles.popper,
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed"
          }}
          {...attributes.popper}
          className={`z-[31] ${uploadErrors.count ? 'h-[30rem]' : 'h-[28rem]'} fixed bg-white rounded shadow-lg p-6 text-center`}
        >
          <div>
            <div {...getRootProps()} className="h-[14rem] w-[24rem] border-1 border-solid rounded-2xl border-dashed">
              <div className="flex flex-col justify-around p-6 h-full">
                <input {...getInputProps()} className="w-10 h-10" />
                {uploading ? 
                <div className='h-full flex flex-col items-center bg-white justify-center'>
                  <img className='w-6 h-6 text-white' src={loader}/>
                  <p className="pt-2">Uploading...</p>
                </div> :
                <>
                  {!fileLoaded ? 
                    <p className="font-semibold">Drop files here</p> :
                    <p>{fileLoaded.name}</p>
                  }
                </>}
                
                
              </div>
            </div>
          </div>
          <div className="pt-5 flex justify-around ">
            <SupplierDropdown supplier={selectedSupplier} setSupplier={setSelectedSupplier} />
            <WarehouseDropdown warehouse={selectedWarehouse} setWarehouse={setSelectedWarehouse} disabled={!selectedSupplier} supplier={selectedSupplier}/>
          </div>


          {(uploadErrors.count) && 
          <div className="mt-16">
            <div>
              {uploadErrors.count.success_count} / {uploadErrors.count.total_data} uploaded successfully
            </div>
          </div>}

          {(fileLoaded && selectedWarehouse) ?
            <div className="flex justify-end mt-24 ml-3">
              <button onClick={(e) => handleFileUpload(e)} className="default-button w-24">Upload</button>
              <button onClick={(e) => cancelFileUpload(e)} className="default-button w-24 ml-3">Cancel</button>
            </div> :
            <div className={`flex  ${uploadErrors.count ? 'mt-8 justify-around' : 'mt-20 justify-end'}`}>
              <button className="default-button-disabled w-24">Upload</button>
              {uploadErrors.count ? <button onClick={(e) => downloadFile()} className="default-button ml-3 w-26">Download Error Logs</button> : null }
              <button onClick={(e) => cancelFileUpload(e)} className="default-button w-24 ml-3">Cancel</button>
            </div>
          }
        </div>
      </div>
    )}
  </div>
  )
}
