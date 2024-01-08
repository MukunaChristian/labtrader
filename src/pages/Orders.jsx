import { useEffect, useState } from 'react';
import SearchBar from '../components/searchBar/searchBar';
import { getOrders, updateStatus, getOrderInvoice } from '../api/orders';
import { Pagenation } from '../components/dataTable/Pagenation';
import { useDispatch } from 'react-redux';
import { OrderStatusDropdown } from '../components/Dropdowns/OrderStatusDropdown';
import { debounce } from 'lodash';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

export const Orders = () => {
  // const [companies, setCompanies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataAmount, setDataAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const maxItems = 10;

  const maxPages = Math.ceil(dataAmount / maxItems);
  const lastPage = currentPage === maxPages;

  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  const handleSearch = debounce((e) => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {
      id: e,
      label_number: e,
      customer: e,
    });
  }, 500)


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {});
  };


  const downloadInvoice = async (orderId) => {
    try {
      const response = await getOrderInvoice(orderId)
      return
      // Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data], 
        { type: 'application/pdf' }
      );
  
      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Order_${orderId}.pdf`); // or any other filename
      document.body.appendChild(link);
      
      // Programmatically click the link to trigger the download
      link.click();
  
      // Remove the link after downloading
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('There was an error downloading the file:', error);
    }
  }


  return (
    <div className="flex pb-16 border-0 pt-24 px-14 bg-light-grey justify-center">
      <div className="border-solid border-[1px] border-black w-[90%] p-6 h-full bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-black flex-1">Orders</h2>
          <div className="ml-auto">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(e) => {setSearchTerm(e); handleSearch(e)}}
              className="w-full max-w-xs"
            />
          </div>
        </div>
        <div className="">
          <table className="w-full bg-white table-fixed border-collapse border-solid border-[1px]">
            <thead>
              <tr className="w-full h-16 py-8">
                <th className="text-left w-[10%] px-4">ID</th>
                <th className="text-left w-1/5 px-4">Label Number</th>
                <th className="text-left w-1/4 px-4">Customer</th>
                <th className="text-left w-1/5 px-4">Date</th>
                <th className="text-left w-1/6 px-4">Total</th>
                <th className="text-left w-1/6 px-4">Status</th>
                <th className="text-left w-[10%] px-4">Invoice</th>
              </tr>
            </thead>
            <tbody className="">
              {orders.map(order => (
                <tr key={order.id} className="h-14 text-sm">
                  <td className="w-1/5 px-4 border-solid border-[1px] text-ellipsis overflow-hidden ">{order.id}</td>
                  <td className="w-1/5 px-4 border-solid border-[1px] text-ellipsis overflow-hidden ">{order.label_number ? order.label_number : "N/A"}</td>
                  <td className="w-1/5 px-4 border-solid border-[1px] text-ellipsis overflow-hidden ">{order.customer}</td>
                  <td className="w-1/5 px-4 border-solid border-[1px] text-ellipsis overflow-hidden ">{order.order_date}</td>
                  <td className="w-1/5 px-4 border-solid border-[1px] text-ellipsis overflow-hidden ">{order.total_price} {order.currency}</td>
                  <td className="text-center w-1/5 border-solid border-[1px]">
                    <OrderStatusDropdown toggleStatus={(status) => {updateStatus(order.id, status)}} statusId={order.status} />
                  </td>
                  <td className="w-1/5 px-4 border-solid border-[1px]">
                    <a onClick={() => {downloadInvoice(order.id)}} className='flex justify-center'>
                      <div className="w-8 h-8 bg-light-grey hover:bg-grey flex items-center justify-center rounded-lg border-solid border-[1px] ">
                        <ArrowDownOnSquareIcon className="w-6 h-6 text-black" />
                      </div>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className="flex justify-center mt-14">
          <Pagenation 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            lastPage={lastPage}
          />
        </div>
        
      </div>
    </div>
  )
};