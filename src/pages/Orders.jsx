import { useEffect, useState } from 'react';
import SearchBar from '../components/searchBar/searchBar';
import { getOrders, updateStatus, getOrderInvoice, updateLabel } from '../api/orders';
import { Pagenation } from '../components/dataTable/Pagenation';
import { useDispatch } from 'react-redux';
import { OrderStatusDropdown } from '../components/dropdowns/OrderStatusDropdown';
import { debounce, get, max } from 'lodash';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StatusFilterDropdown } from '../components/dropdowns/StatusFilterDropdown';
import { useNavigate } from 'react-router-dom';


const options = [
  { id: "hold", name: "On Hold" },  
  { id: "in_stock", name: "In Stock" },
  { id: "no_stock", name: "No Stock" },
  { id: "sold", name: "Sold" },
  { id: "ready_for_ship", name: "Ready to be shipped" },
  { id: "ready_for_collect", name: "Ready for collection" },
  { id: "collected", name: "Collected" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" }
];


export const Orders = () => {
  // const [companies, setCompanies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ id: "all", name: "All" });
  const [dataAmount, setDataAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const maxItems = 5;

  const navigate = useNavigate();

  const maxPages = Math.ceil(dataAmount / maxItems);
  const lastPage = currentPage === maxPages;

  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  const handleSearch = debounce((e) => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {
      status: statusFilter.id === 'all' ? '' : statusFilter.id,
      id: e,
      label_number: e,
      customer: e,
    });
  }, 500)

  const handleStatusFilter = (statusId) => {
    if (statusId === 'all') {
      getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {});
      return;
    }

    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {
      status: statusId,
      id: searchTerm,
      label_number: searchTerm,
      customer: searchTerm,
    });
  }

  const formatNumberWithSpaces = (number) => {
    const formatter = new Intl.NumberFormat('en-US');
    return formatter.format(number).replace(/,/g, ' ');
  }

  const handleLabelNumberChange = (e, order) => {
    const newOrders = [...orders];
    const orderIndex = newOrders.findIndex(o => o.id === order.id);
    newOrders[orderIndex].label_number = e.target.value;
    setOrders(newOrders);
    updateLabel(order.id, e.target.value);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {});
  };

  useEffect(() => {
    getOrders(dispatch, setOrders, setLoading, setDataAmount, currentPage, {
      status: statusFilter.id,
      id: searchTerm,
      label_number: searchTerm,
      customer: searchTerm,
    });
  }, [currentPage]);


  const downloadInvoice = async (orderId) => {
    try {
      const response = await getOrderInvoice(orderId)
    } catch (error) {
      console.error('There was an error downloading the file:', error);
    }
  }

  console.log(maxItems)


  return (
    <div className="flex pb-16 border-0 pt-24 px-14 bg-light-grey justify-center">
      <div className="border-solid border-[1px] border-black w-[90%] p-6 h-full" style={{ backgroundColor: 'rgb(220 220 220)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-black flex-1">Orders</h2>
          <div className='mr-4'>
            <StatusFilterDropdown handleStatusFilter={handleStatusFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          </div>
          <div>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(e) => {setSearchTerm(e); handleSearch(e)}}
              className="w-full"
            />
          </div>
        </div>
        <div className="">
          <table className="w-full table-fixed">
            <thead>
              <tr className="w-full h-16 py-8">
                <th className="text-left w-[10%] px-4 bg-white border-none">ID</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Label Number</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Customer</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Date</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Total</th>
                <th className="text-left w-[20%] px-4 bg-white border-none">Status</th>
                <th className="text-left w-[13%] px-4 bg-white border-none">Invoice</th>
              </tr>
            </thead>
            <tbody className="">
              {orders.map(order => (
                <tr key={order.id} className="h-14 text-sm">
                  <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.id}</td>
                  <td className="w-1/5 px-4 bg-white border-none">
                    {order.label_number}
                  </td>
                  <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.customer}</td>
                  <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.order_date}</td>
                  <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{formatNumberWithSpaces(order.total_price)} USD</td>
                  <td className="w-1/5 px-4 bg-white border-none">
                    {options.find(o => o.id === order.status).name}
                  </td>
                  <td className="flex border-0 justify-around items-center h-14 bg-white border-none">
                    <a onClick={() => {downloadInvoice(order.id)}} className='flex justify-center'>
                      <div className="w-8 h-8 bg-light-grey hover:bg-grey flex items-center justify-center rounded-lg border-solid border-[1px] text-blue-600">
                        <ArrowDownOnSquareIcon className="w-6 h-6"/>
                      </div>
                    </a>
                    <a onClick={() => {navigate("/orders/details/" + order.id)}} className='flex justify-center'>
                      <div className="w-8 h-8 bg-light-grey hover:bg-grey flex items-center justify-center rounded-lg border-solid border-[1px] text-blue-600">
                        <EyeIcon className="w-5 h-6"/>
                      </div>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className="flex justify-center pt-6">
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