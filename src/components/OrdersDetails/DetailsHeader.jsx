import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { updateStatus, updateLabel, getOrderInvoiceDetails, getOrders } from '../../api/orders';
import { useState, useRef, useEffect } from "react";
import { OrderStatusDropdown } from "../Dropdowns/OrderStatusDropdown";
import { usePopper } from "react-popper";


export const OrdersDetailsHeader = ({ labelNumber, status, onSave }) => {
  const [changesMade, setChangesMade] = useState(false);
  const [labelNumberState, setLabelNumberState] = useState(labelNumber);
  const [statusState, setStatusState] = useState(status);
  const [confirming, setConfirming] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);

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
    const dummyElement = document.createElement("div");
    dummyElement.style.position = "fixed";
    setReferenceElement(dummyElement);
  }, [])

  return (
    <div className="flex mb-4">
      <div className="hover:bg-grey rounded-lg w-7 h-7 cursor-pointer mr-auto">
        <ArrowLeftIcon className="h-7 w-7" onClick={() => window.history.back()}/>
      </div>
      <input 
          type="text" 
          value={labelNumberState}
          className="w-48 h-8 px-2 text-ellipsis overflow-hidden border-solid border-text border-[1px] rounded-md"
          onChange={(e) => { handleLabelNumberChange(e) }}
      />
      <div className="w-48 h-8 ml-2"><OrderStatusDropdown toggleStatus={(status) => {setStatusState(status); setChangesMade(true)}} statusId={status} /></div>
      <button onClick={() => {setConfirming(true)}} disabled={!changesMade} className={`border-solid border-[1px] border-text rounded-md px-4 py-1 text-sm ml-2 ${changesMade ? 'hover:bg-light-grey' : 'bg-grey cursor-default' } `}>Save</button>
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
            <button onClick={() => {setConfirming(false); onSave(labelNumberState, statusState); setChangesMade(false)}} className={`border-solid border-[1px] border-text rounded-md px-4 py-1 text-sm ml-8 hover:bg-light-grey`}>Confirm</button>
          </div>
        </div>
      </div>)}
    </div>
  )
}