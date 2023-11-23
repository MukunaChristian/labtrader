import { usePopper } from "react-popper";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import { uploadStock } from "../../api/diamonds";
import { WarehouseDropdown } from "../dropdowns/WarehouseDropdown";


export const Header = ({ title, results }) => {
  const [uploadConfirm, setUploadConfirm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [fileLoaded, setFileLoaded] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
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
    e.stopPropagation();
    console.log("File uploaded");
    setUploadConfirm(false);
    setFileLoaded(null);
    uploadStock(fileLoaded, selectedWarehouse);
  }

  const cancelFileUpload = (e) => {
    e.stopPropagation();
    setUploadConfirm(false);
    setFileLoaded(null);
  }

  return (
    <>
      <div className="p-4 flex">
        <div>
          <p className="text-xl font-bold text-secondary">{ title }</p>
          <p className="text-sm text-text font-semibold">{ results } results</p>
        </div>
        <div className="flex ml-auto mt-4">
          <a href="src\assets\Stock Upload Template.xlsx" download>
            <button className="default-button mr-4">Download Template</button>
          </a>
          <button onClick={() => {
            setUploadConfirm(true);
          }} className="default-button">Upload Stock</button>
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
          className="z-[31] h-[28rem] fixed bg-white rounded shadow-lg p-6 text-center"
        >
          <div>
            <div {...getRootProps()} className="h-[14rem] w-[24rem] border-1 border-solid rounded-2xl border-dashed">
              <div className="flex flex-col justify-around p-6 h-full">
                <input {...getInputProps()} className="w-10 h-10" />
                {!fileLoaded ? 
                  <p className="font-semibold">Drop files here</p> :
                  <p>{fileLoaded.name}</p>
                }
                
              </div>
            </div>
          </div>
          <div className="pt-5">
            <WarehouseDropdown warehouse={selectedWarehouse} setWarehouse={setSelectedWarehouse} />
          </div>

          {(fileLoaded && selectedWarehouse) ?
            <div className="flex justify-around mt-24">
              <button onClick={(e) => handleFileUpload(e)} className="default-button w-24">Upload</button>
              <button onClick={(e) => cancelFileUpload(e)} className="default-button w-24">Cancel</button>
            </div> :
            <div className="flex justify-around mt-24">
              <button className="default-button-disabled w-24">Upload</button>
              <button onClick={(e) => cancelFileUpload(e)} className="default-button w-24">Cancel</button>
            </div>
          }
        </div>
      </div>
    )}
  </>
  )
}
