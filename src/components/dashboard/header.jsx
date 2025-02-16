import { usePopper } from "react-popper";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone'
import { uploadStock, exportStock } from "../../api/diamonds.js";
import { WarehouseDropdown } from "../dropdowns/WarehouseDropdown.jsx";
import { SupplierDropdown } from "../dropdowns/SupplierDropdown.jsx";
import loader from '../../assets/loader.gif';
import { setDiamondTypeState } from "../../reducers/AppSlice.jsx";
import { getSupplimentalData } from "../../api/getSupplimentalData.js";

import { setUploadingLoaderState, setUploadErrorsState } from '../../reducers/AppSlice.jsx';


export const Header = ({ title, results }) => {
  const [uploadConfirm, setUploadConfirm] = useState(false);
  const [exportConfirm, setExportConfirm] = useState(false);

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedTimeFrom, setSelectedTimeFrom] = useState(null);
  const [selectedTimeTo, setSelectedTimeTo] = useState(null);
  const [fileLoaded, setFileLoaded] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const user = useSelector(state => state.user.user)
  const uploading = useSelector(state => state.app.uploadingLoader);
  const uploadErrors = useSelector(state => state.app.uploadErrors);
  const currentDiamondType = useSelector(state => state.app.diamond_type);


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

    getSupplimentalData(dispatch);
  }, []);

  

  const onDrop = useCallback(acceptedFiles => {
    setFileLoaded(acceptedFiles[0]);
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  const handleFileUpload = (e) => {
    dispatch(setUploadErrorsState({}));
    dispatch(setUploadingLoaderState(true));
    e.stopPropagation();
    console.log("File uploaded");
    setFileLoaded(null);
    uploadStock(fileLoaded, selectedWarehouse, selectedSupplier, dispatch, setUploadingLoaderState, setUploadErrorsState).then((resp) => {
      setSelectedSupplier(null);
      setSelectedWarehouse(null);


      if (resp.code === 500) {
        setUploadError("An unexpected error occurred. Please try again.");
      } else if (resp.code === 402) {
        if (resp.error === 'Invalid file format') {
          setUploadError("Invalid file format. Please upload a .xlsx file.");
        } 
      } else {
        setUploadError(null);
      }
    });
    
  }


  const handleExportStock = (e) => {
    e.stopPropagation();
    setExportConfirm(false);

    // call export stock api
    exportStock(
      selectedWarehouse, 
      selectedSupplier, 
      selectedTimeFrom, 
      selectedTimeTo, 
      setSelectedSupplier, 
      setSelectedWarehouse
    );
  }

  const cancelFileUpload = (e) => {
    e.stopPropagation();
    setUploadConfirm(false);
    setExportConfirm(false);
    setFileLoaded(null);
    setUploadError(null);
  }

  const handleTabChange = (diamondType) => {
    dispatch(setDiamondTypeState(diamondType === 1 ? 'diamond' : 'melee'));
  }

  const downloadFile = () => {
    // Define the text to be written to the file
    let fileText = '';
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
      <div className="hide w-full h-[2rem] border-solid border-0 border-b-[1px]">
        <button 
          onClick={() => {handleTabChange(1)}} 
          className={`
            border-0 border-solid w-[10rem] h-full  
            hover:bg-black hover:text-white hover:border-[1px]
            ${currentDiamondType === "diamond" ? 'bg-black text-white border-[1px]' : 'bg-grey border-[1px] '}`
          }>Lab Grown Diamonds</button>
        <button 
          onClick={() => {handleTabChange(2)}} 
          className={`
          order-0 border-solid w-[10rem] h-full  
          hover:bg-black hover:text-white hover:border-[1px]
          ${currentDiamondType === "melee" ? 'bg-black text-white border-[1px]' : 'bg-grey border-[1px] '}`  
          }>Lab Grown Melee</button>
      </div>
      <div className="top-btn-flex">
        <button
         onClick={() => {handleTabChange(1)}} 
          className={`
            border-0 border-solid w-[10rem] h-full  
            hover:bg-black hover:text-white hover:border-[1px]
            ${currentDiamondType === "diamond" ? 'bg-black text-white border-[1px]' : 'bg-grey border-[1px] '}`
          }
        >Lab Grown Diamonds</button>
        <button
         onClick={() => {handleTabChange(2)}} 
         className={`
         order-0 border-solid w-[10rem] h-full  
         hover:bg-black hover:text-white hover:border-[1px]
         ${currentDiamondType === "melee" ? 'bg-black text-white border-[1px]' : 'bg-grey border-[1px] '}`  
         }>Lab Grown Melee</button>


      </div>
      <div className="  p-4 flex">
        <div>
          <p className="text-xl font-bold text-secondary">{ title }</p>
          <p className="text-sm text-text font-semibold">{ results } results</p>
        </div>
        <div className=" show-none flex ml-auto mt-4">
          <a href=".\Stock Upload Template.xlsx" download>
            <button className={user.role !== 'Superadmin' ? 'hidden' : 'default-button mr-4 bg-accent text-white'}>Download Template</button>
          </a>
          <button
            disabled={user.role !== 'Superadmin'}
            onClick={() => {
              setExportConfirm(true);
            }}
            className={user.role !== 'Superadmin' ? 'hidden' : 'default-button mr-4 bg-accent text-white'}
          >
            Export Stock
          </button>
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

      {(uploadConfirm || exportConfirm) && (
        <div className="">
          <div
            className="fixed z-[30] inset-0 bg-gray-700 opacity-50 h-[100vh]"
            onClick={() => {
              setUploadConfirm(false);
              setExportConfirm(false);
              setSelectedWarehouse(null);
              setFileLoaded(null);
              setUploadError(null);
            }} // Close the pop-up when clicking outside
          />

          {uploadConfirm ? (
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
          className={`z-[31] ${uploadErrors.count || uploadError ? 'h-[30rem]' : 'h-[28rem]'} fixed bg-white rounded shadow-lg p-6 text-center`}
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
          {uploadError ? <p className="text-red-500 text-sm mt-4">{uploadError}</p> : null}
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
        </div>) : (
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
          className={`z-[31] h-[19rem] fixed bg-white rounded shadow-lg p-6 text-center`}
        >
          <div className="pt-5 flex justify-around ">
            <SupplierDropdown supplier={selectedSupplier} setSupplier={setSelectedSupplier} />
            <WarehouseDropdown warehouse={selectedWarehouse} setWarehouse={setSelectedWarehouse} disabled={!selectedSupplier} supplier={selectedSupplier}/>
          </div>

          <div className="pt-[5rem] flex w-full">
            <div className="w-full">
              <p className="text-sm font-semibold">Export Stock from</p>
              <input type="date" className="h-12" onChange={(e) => {setSelectedTimeFrom(e.target.value)}} />
            </div>
            
            <div className="w-full">
              <p className="text-sm font-semibold">to</p>
              <input type="date" className="h-12" onChange={(e) => {setSelectedTimeTo(e.target.value)}} />
            </div>
          </div>

          <div className="flex justify-end mt-8 ml-3">
            <button disabled={!selectedWarehouse} onClick={(e) => handleExportStock(e)} className={`${selectedWarehouse ? 'default-button' : 'default-button-disabled'} w-24`}>Export</button>
            <button onClick={(e) => cancelFileUpload(e)} className="default-button w-24 ml-3">Cancel</button>
          </div> 

          
        </div>
        )}
      </div>
    )}
  </div>
  )
}
