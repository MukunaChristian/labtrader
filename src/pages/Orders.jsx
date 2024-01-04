import { useEffect, useState } from 'react';
import SearchBar from '../components/searchBar/searchBar';
import { getOrders, updateStatus } from '../api/orders';
import { Pagenation } from '../components/dataTable/Pagenation';
import { useDispatch } from 'react-redux';
import { OrderStatusDropdown } from '../components/Dropdowns/OrderStatusDropdown';

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {});
  };

  return (
    <div className="flex pb-16 border-0 pt-24 px-14 bg-light-grey justify-center">
      <div className="border-solid border-[1px] border-black w-[90%] p-6 h-full bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-black flex-1">Orders</h2>
          <div className="ml-auto">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              className="w-full max-w-xs"
            />
          </div>
        </div>
        <div className="">
          <table className="w-full bg-white table-fixed border-collapse border-solid border-[1px]">
            <thead>
              <tr className="w-full h-16 py-8">
                <th className="text-left w-1/6 px-4">ID</th>
                <th className="text-left w-1/5 px-4">Label Number</th>
                <th className="text-left w-1/4 px-4">Customer</th>
                <th className="text-left w-1/5 px-4">Date</th>
                <th className="text-left w-1/6 px-4">Total</th>
                <th className="text-left w-1/6 px-4">Status</th>
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