import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getOrderInvoiceDetails, getOrders, updateLabel, updateStatus } from '../api/orders';
import { useEffect, useState, useRef } from "react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { OrdersDetailsHeader } from "../components/OrdersDetails/DetailsHeader";

// pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



export const OrdersDetails = () => {
  const location = useLocation();
  const orderID = location.pathname.split('/')[3];
  const [order, setOrder] = useState([{}]);
  
  const pdfCalled = useRef(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [html, setHtml] = useState('');
  const dispatch = useDispatch();

  const labelNumber = useRef('');
  const status = useRef('');


  useEffect(() => {
    if (pdfCalled.current) return;
    getOrderInvoiceDetails(orderID).then(resp => {
      const pdfUrl = URL.createObjectURL(resp);
      setHtml(pdfUrl);
      console.log(resp);
      setPdfLoaded(true)
    });

    getOrders(dispatch, setOrder, null, null, 1, { id: orderID }).then(resp => {
      labelNumber.current = resp[0].label_number;
      status.current = resp[0].status;
    });
    pdfCalled.current = true;
    
  }, [])

  const onSave = (labelNumber, new_status) => {
    updateLabel(orderID, labelNumber);
    updateStatus(orderID, new_status);

    if (new_status === 'sold' || new_status === 'cancelled') {
      setPdfLoaded(false);
      getOrderInvoiceDetails(orderID).then(resp => {
        const pdfUrl = URL.createObjectURL(resp);
        setHtml(pdfUrl);
        console.log(resp);
        setPdfLoaded(true);
      });
    }
  }

  const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(1);
  
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
      setPdfLoaded(true);
    }
  
    return (
      <div className="">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} />
            ),
          )}
        </Document>
      </div>
    );
  };


  const handleDownload = () => {
    if (html && pdfLoaded) {
      const link = document.createElement('a');
      link.href = html;
      link.download = 'invoice.pdf';
      link.click();
    }
    
  }

  console.log(pdfLoaded )

  return (
    <div className="pb-16 border-0 pt-24 px-14 flex justify-center overflow-auto h-full" style={{ backgroundColor: 'rgb(220 220 220)' }}>
      <div className="w-[595px] ">
        <OrdersDetailsHeader labelNumber={labelNumber.current} status={status.current} onSave={onSave} handleDownload={handleDownload} />
        <div className="w-full border-black bg-white">
          {(html && pdfLoaded) ? (
             <PDFViewer file={html} />
          ) : (
            <div className="flex justify-center mt-24 w-full bg-light-grey">
              <p className="border-black bg-white p-2 rounded border-solid border-text border-[1px]">Generating pdf...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}