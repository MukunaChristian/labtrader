import { useEffect, useState } from 'react';
import SearchBar from '../components/searchBar/searchBar';
import { getOrders, getOrderInvoice, updateLabel, updateOrderFlag } from '../api/orders';
import { Pagenation } from '../components/dataTable/Pagenation';
import { useDispatch } from 'react-redux';
import { OrderStatusDropdown } from '../components/dropdowns/OrderStatusDropdown';
import { debounce, get, max, set } from 'lodash';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StatusFilterDropdown } from '../components/dropdowns/StatusFilterDropdown';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';


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
  const [isExpanded, setIsExpanded] = useState({});
  const maxItems = 5;

  const warehouses = useSelector(state => state.app.warehouses);
  const userCompany = useSelector(state => state.user.userCompany);

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
      stock_id: e,
    });
    setCurrentPage(1)
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
    return formatter.format(Math.round(number * 100) / 100).replace(/,/g, ' ');
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
      const response = await getOrderInvoice(orderId, false)
    } catch (error) {
      console.error('There was an error downloading the file:', error);
    }
  }


  const handleFlagToggle = (order) => {
    updateOrderFlag(order.id);
    setOrders(orders.map(o => {
      if (o.id === order.sales_order_id) {
        return { ...o, orders: o.orders.map(oo => {
          if (oo.id === order.id) {
            console.log(oo)
            return { ...oo, flag: !oo.flag }
          }
          return oo;
        })}
      }
      return o;
    }))
  }


  const getLocationsFromWarehouse = (orders) => {

    // collect all the warehouse ids
    const warehouse_ids = [];
    orders.forEach(o => {
      if (o.warehouse_id) {
        warehouse_ids.push(o.warehouse_id);
      }
    });

    // return warehouse locations
    const locations = []
    warehouses.forEach(w => {
      if (warehouse_ids.includes(w.id)) {
        locations.push(w.country);
      }
    });
    return locations.join(', ');
  }

  const getOrderTotal = (sales_order, order) => {
    let convertedPrice = order.price * sales_order.currency_rate;
    let totalPriceIncludingVAT = parseFloat(convertedPrice.toFixed(2)) + parseFloat((sales_order.vat / 100 * convertedPrice).toFixed(2));
    console.log(totalPriceIncludingVAT)
    return totalPriceIncludingVAT.toFixed(2);
  }

  const getSalesOrderTotal = (sales_order) => {
    let totalPrice = sales_order.total_price; // Assuming it's already rounded appropriately
    let totalPriceIncludingVATTotal = totalPrice + (sales_order.vat / 100 * totalPrice);
    // let totalPriceIncludingVATTotal = totalPrice ;
    console.log(totalPriceIncludingVATTotal)
    return totalPriceIncludingVATTotal.toFixed(2);
  }
  

  return (
    <div className="flex pb-16 border-0 pt-24 px-8 bg-light-grey justify-center">
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
          <table className="w-full table-fixed border-collapse ">
            <thead>
              <tr className="w-full h-16 py-8 border-[#dcdcdc]">
                <th className="text-left w-[10%] px-4 bg-white border-none">ID</th>
                <th className="text-left w-[20%] px-4 bg-white border-none">Date</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">User</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Customer</th>
                <th className="text-left w-1/4 px-4 bg-white border-none">Total (Inc. VAT)</th>
                <th className="text-left w-[15%] px-4 bg-white border-none">Status</th>
                <th className="text-left w-[15%] px-4 bg-white border-none">Invoice</th>
                <th className="text-left w-[5%] px-4 border-none"></th>
              </tr>
            </thead>
            <tbody className="border-[#dcdcdc]">
              {orders.map(order => (
                <>
                  <tr key={order.id} className="h-14 text-sm border-[#dcdcdc]">
                    <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.id}</td>
                    <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.order_date}</td>
                    <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.user_name} {order.user_surname}</td>
                    <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">{order.jeweller_name}</td>
                    <td className="w-1/5 px-4 bg-white border-none text-ellipsis overflow-hidden ">R{formatNumberWithSpaces(getSalesOrderTotal(order))}</td>
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
                    <td className="w-1/5 px-4 border-[#dcdcdc]">
                      <button onClick={() => {setIsExpanded({...isExpanded, [order.id]: !isExpanded[order.id]})}} className={`rounded-md w-6 h-6 duration-300 text-white bg-grey hover:bg-gray-200 `} >
                        {isExpanded[order.id] ? <ChevronUpIcon className='w-6 h-6'/> : <ChevronDownIcon className='w-6 h-6'/> }
                      </button>
                    </td>
                  </tr>
                  <tr className={`text-sm border-[#dcdcdc]`}>
                    <td colSpan="7" className={`bg-white border-none`}>
                      <table className={`block table-fixed px-16 w-full border-0 duration-500 ${isExpanded[order.id] ? 'max-h-[100rem]' : 'overflow-hidden max-h-0'}`}>
                        <thead className='w-full'>
                          <tr className="w-full border-[#dcdcdc]">
                            <th className="text-left w-[20rem] bg-white border-none pt-4">Stock ID</th>
                            <th className="text-left w-1/5 bg-white border-none pt-4">Description</th>
                            <th className="text-left w-1/5 bg-white border-none pt-4">Warehouse</th>
                            <th className="text-left w-1/5 bg-white border-none pt-4">Delivery</th>
                            <th className="text-left w-1/5 bg-white border-none pt-4">Total</th>
                            <th className="text-left w-[2rem] bg-white border-none pt-4">Memo</th>
                          </tr>
                        </thead>
                        <tbody className='w-full'>
                          {order.orders.map(o => (
                            <tr key={o.id} className="h-12 w-full text-sm border-[#dcdcdc]">
                              <td className=" w-1/6 text-left bg-white border-none text-ellipsis overflow-hidden ">{o.stock_id}</td>
                              <td className=" w-1/6 text-left bg-white border-none text-ellipsis overflow-hidden pr-4">
                                {o.diamond_description} 
                              </td>
                              <td className=" w-1/6 text-left bg-white border-none">
                                {warehouses.find(w => w.id === o.warehouse_id) ? warehouses.find(w => w.id === o.warehouse_id).name : ''}
                              </td>
                              <td className=" w-1/6 text-left bg-white border-none">
                                {warehouses.find(w => w.id === o.warehouse_id) ? `${warehouses.find(w => w.id === o.warehouse_id).delivery_from} - ${warehouses.find(w => w.id === o.warehouse_id).delivery_to} days` : ''}
                              </td>
                              <td className="w-1/6 text-left bg-white border-none text-ellipsis overflow-hidden ">R{formatNumberWithSpaces(getOrderTotal(order, o))}</td>
                              <td className=" text-left bg-white border-none">
                                <input type="checkbox" checked={o.flag} onChange={() => {handleFlagToggle(o)}} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </>
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