import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { updateStatus, updateLabel, getOrderInvoiceDetails, getOrders } from '../../api/orders';
import { useState, useRef, useEffect } from "react";
import { OrderStatusDropdown } from "../dropdowns/OrderStatusDropdown";
import { usePopper } from "react-popper";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";


export const OrdersDetailsHeader = ({ labelNumber, status, onSave, handleDownload }) => {
  const [changesMade, setChangesMade] = useState(false);
  const [labelNumberState, setLabelNumberState] = useState(labelNumber);
  const [statusState, setStatusState] = useState(status);
  const [confirming, setConfirming] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [isShipped, setIsShipped] = useState(status === "ready_for_ship" ? true : false);

  const navigate = useNavigate();

  const popperElement = useRef(null);
  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement.current,
    {
      placement: "bottom" // Popup position
    }
  );

  const handleLabelNumberChange = (e) => {
    setChangesMade(true); 
    console.log(e.target.value)
    setLabelNumberState(e.target.value);
  }

  useEffect(() => {
    if (labelNumberState === labelNumber && statusState === status) {
      setChangesMade(false);
    }
  }, [labelNumberState, statusState])

  useEffect(() => {
    setLabelNumberState(labelNumber);
  }, [labelNumber])

  useEffect(() => {
    if (status === "ready_for_ship") {
      setIsShipped(true);
    }
  }, [status])

  useEffect(() => {
    const dummyElement = document.createElement("div");
    dummyElement.style.position = "fixed";
    setReferenceElement(dummyElement);
  }, [])

  const handleStatusChange = (status) => {
    setStatusState(status);
    setChangesMade(true);

    if (status === "ready_for_ship") {
      setIsShipped(true);
    }
  }

  return (
    <div className="flex mb-4">
      <div className="hover:bg-grey rounded-lg w-7 h-7 cursor-pointer mr-auto">
        <ArrowLeftIcon className="h-7 w-7" onClick={() => navigate("/orders")}/>
      </div>
      <div className="w-48 h-8 ml-2 pr-2"><OrderStatusDropdown toggleStatus={(status) => { handleStatusChange(status) }} statusId={status} /></div>
      {isShipped && (
      <input 
          type="text" 
          value={labelNumberState}
          placeholder="Enter label number"
          className="w-40 h-8 px-2 text-ellipsis overflow-hidden border-solid border-text border-[1px] rounded-md"
          onChange={(e) => { handleLabelNumberChange(e) }}
      /> )}
      <button onClick={() => {setConfirming(true)}} disabled={!changesMade} className={`border-solid border-[1px] border-text rounded-md px-4 py-1 text-sm ml-2 bg-accent text-white ${changesMade ? '' : 'bg-grey cursor-default' } `}>Save</button>
      <div className="flex justify-center h-8">
        {/* <img src="src/assets/download-pdf.svg" alt="Download PDF" className={`border-solid border-[1px] bg-accent text-white border-text rounded-md px-4 py-1 text-sm ml-2`} onClick={handleDownload}/> */}
        <button onClick={handleDownload} className={`border-solid border-[1px] bg-accent text-white border-text rounded-md px-4 py-1 text-sm ml-2`}>Download</button>
      </div>
      {confirming && (
      <div>
          <div
            className="fixed z-[30] inset-0 bg-gray-700 opacity-50 h-[100vh]"
            onClick={() => {
              setConfirming(false);
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
          className={`z-[31] h-[8rem] fixed bg-white rounded shadow-lg p-6 text-center`}
        >
          <div>
            <p className="mb-6">Please confirm changes to invoice status.  </p>
            <button onClick={() => {setConfirming(false)}} className={`border-solid border-[1px] border-text rounded-md px-4 py-1 text-sm hover:bg-light-grey`}>Cancel</button>
            <button onClick={() => {setConfirming(false); onSave(labelNumberState, statusState); setChangesMade(false)}} className={`border-solid border-[1px] border-text rounded-md px-4 py-1 text-sm ml-8 bg-accent text-white`}>Confirm</button>
          </div>
        </div>
      </div>)}
    </div>
  )
}