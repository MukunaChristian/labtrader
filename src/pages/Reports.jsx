import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getCompanies, getUsersInCompany, getUsersCompany } from '../api/company';
import { getReport } from '../api/reports';
import { getOrderInvoiceDetails } from '../api/orders';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { default as downloadPdf } from '../assets/download-pdf.svg';
import { default as downloadCsv } from '../assets/download-csv.svg';


export const Report = () => {
  const user = useSelector(state => state.user.user)
  const [isGenerateButtonEnabled, setIsGenerateButtonEnabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportHtml, setReportHtml] = useState(null);
  const [resellers, setResellers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [salesReps, setSalesReps] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    reportType: '',
    reseller: '',
    supplier: '',
    salesRep: '',
  });

  const fetchResellerCompanies = async () => {
    const filterList = {
      name: null,
      type_id: 2, // Reseller Company
      registration_number: null,
      search: null,
      user_role: user.role,
      user_id: user.id
    };

    try {
      const data = await getCompanies([0, 10], filterList);
      setResellers(data.data)
    } catch (error) {
      console.error('Error in fetchResellerCompanies:', error);
    }
  };

  const fetchSupplierCompanies = async () => {
    const filterList = {
      name: null,
      type_id: 1, // Supplier Company
      registration_number: null,
      search: null,
      user_role: user.role,
      user_id: user.id
    };

    try {
      const data = await getCompanies([0, 10], filterList);
      setSuppliers(data.data)
    } catch (error) {
      console.error('Error in fetchSupplierCompanies:', error);
    }
  };

  const fetchUsersInCompany = async (company_id) => {
    const filterList = {
      name: null,
      surname: null,
      role: "Sales Rep",
      phone: null,
      search: null,
    };

    try {
      const data = await getUsersInCompany(company_id, filterList);
      if (data && data.data && data.data.length > 0) {
        setSalesReps(data.data);
      } else {
        setSalesReps([]);
        console.log("No sales representatives found for the selected company.");
      }
    } catch (error) {
      console.error('Error in fetchUsersInCompany:', error);
    }
  };

  const fetchUsersCompany = async () => {
    try {
      const data = await getUsersCompany(user.id);
      if (data && data.company_type == "Supplier") { // Admin in a supplier
        fetchResellerCompanies();
        setSuppliers([data])
        setAdminAllowed(true)
        setSelectedOptions(prevState => ({
          ...prevState,
          supplier: data.id
        }));
      } else if (data && data.company_type == "Reseller") {
        setResellers([data])
        fetchUsersInCompany(data.id);
      } else {
        setResellers([])
        setSuppliers([])
        console.log("No company found for user.");
      }
    } catch (error) {
      console.error('Error in fetchUsersCompany:', error);
    }
  };

  const generateReport = async (format) => {
    const filterList = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      company_id: selectedOptions.reseller,
      supplier: selectedOptions.supplier,
      salesRep: selectedOptions.salesRep
    };

    const reportType = selectedOptions.reportType
    console.log(filterList)

    try {
      const reportData = await getReport(reportType, JSON.stringify(filterList), format);
      if (format == "HTML") {
        setReportHtml(reportData);
      } else if (format === "PDF" || format === "CSV") {
        const blob = base64ToBlob(reportData, format === "PDF" ? 'application/pdf' : 'text/csv');
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${reportType}_report.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const updateGenerateButtonState = () => {
    const isSalesReport = selectedOptions.reportType === "sales";
    const isSupplierSelected = !!selectedOptions.supplier;
    const isResellerSelected = !!selectedOptions.reseller;
    const isSalesCommissionReport = selectedOptions.reportType === "sales_commission";
    const isSalesRepSelected = !!selectedOptions.salesRep;

    const isEnabled = selectedOptions.reportType && (
        (isSalesReport && isSupplierSelected) || 
        (isSalesCommissionReport ? isSalesRepSelected : isResellerSelected)
    );

    setIsGenerateButtonEnabled(isEnabled);
  };

  const handleInvoiceNumberClick = (event) => {
    let targetElement = event.target;
    while (targetElement != null && targetElement.nodeName !== 'A') {
      targetElement = targetElement.parentElement;
    }
  
    if (targetElement && targetElement.nodeName === 'A' && targetElement.hasAttribute('data-invoice-number')) {
      event.preventDefault();
  
      const invoiceNumber = targetElement.getAttribute('data-invoice-number');
      if (invoiceNumber) {
        document.body.style.cursor = 'wait';
        getOrderInvoiceDetails(invoiceNumber).then(resp => {
          const pdfUrl = URL.createObjectURL(resp);
          window.open(pdfUrl, '_blank');
          URL.revokeObjectURL(pdfUrl);
        }).catch(error => {
          console.error('Error fetching invoice details:', error);
        }).finally(() => {
          document.body.style.cursor = 'default';
        });
      } else {
        console.error('Invoice number not found');
      }
    }
  };

  const handleSelectChange = async (e) => {
    const { name, value } = e.target;

    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [name]: value,
    }));

    if (name === 'reportType') {
      if (value === 'sales') {
        setSelectedOptions(prevState => ({
          ...prevState,
          reseller: '',
          salesRep: ''
        }));
      } else if (value === 'reseller_commission') {
        setSelectedOptions(prevState => ({
          ...prevState,
          salesRep: '',
          supplier: ''
        }));
      }
    } else if (name === 'reseller') {
      if (value) {
        await fetchUsersInCompany(value);
        setSalesReps(data => {
          if (data.length === 0) {
            setSelectedOptions(prevOptions => ({
              ...prevOptions,
              salesRep: '',
              supplier: ''
            }));
          }
          return data;
        });
      } else {
        setSalesReps([]);
        setSelectedOptions(prevOptions => ({
          ...prevOptions,
          salesRep: '',
          supplier: ''
        }));
      }
    }
  };

  useEffect(() => {
    if (user.role === "Superadmin") {
      fetchResellerCompanies();
      fetchSupplierCompanies();
      setAdminAllowed(true)
    } else {
      fetchUsersCompany();
    }
  }, [user]);
  
  useEffect(() => {
    if (resellers.length > 0 && user.role === "Sales Rep") {
      const resellerId = resellers[0]?.id;
      if (resellerId) {
        fetchUsersInCompany(resellerId);
      }
    }
  }, [resellers, user.role]);
  
  useEffect(() => {
    if (salesReps.length > 0 && user.role === "Sales Rep") {
      const matchingSalesRep = salesReps.find(rep => rep.id === user.id);
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        reportType: 'sales_commission',
        reseller: resellers[0]?.id,
        salesRep: matchingSalesRep?.id || salesReps[0]?.id
      }));
    } else if (user.role === "Admin" && !adminAllowed) {
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        reportType: '',
        reseller: resellers[0]?.id,
        salesRep: ''
      }));
    }
  }, [salesReps, user.role, resellers]);
  
  useEffect(() => {
    updateGenerateButtonState();
  }, [selectedOptions]);

  useEffect(() => {
    const reportContainer = document.getElementById('profile-block');
    if (!reportContainer) {
      return;
    }
    reportContainer.addEventListener('click', handleInvoiceNumberClick);
    return () => {
      reportContainer.removeEventListener('click', handleInvoiceNumberClick);
    };
  }, [reportHtml]);

  return (
    <div className="flex border-0 pt-24 bg-light-grey">
      <div className="flex w-full justify-items-center grid grid-cols-1 mt-12 pb-10">
        <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
          <div className="flex justify-between items-end mb-4">
            <div className={`flex-1 mr-8 ${selectedOptions.reportType === 'sales_commission' ? 'basis-1/5' : 'basis-1/4'}`}>
              <p className="text-lg">Select Report:</p>
              <select 
                name="reportType" 
                value={selectedOptions.reportType} 
                onChange={handleSelectChange} 
                className="default-input w-[50%] mt-1" 
                style={{ borderColor: 'black' }}
                disabled={user.role === "Sales Rep"}
              >
                <option value="" hidden>Select Report</option>
                <option value="sales_commission">Sales Commission Report</option>
                <option value="reseller_commission">Reseller Commission Report</option>
                <option value="sales" hidden={!(user.role === "Superadmin" || (user.role === "Admin" && selectedOptions.supplier))}>Sales Report</option>
              </select>
            </div>

            <div className={`flex-1 mr-8 ${selectedOptions.reportType === 'sales_commission' ? 'basis-1/5' : 'basis-1/4'}`}>
              <p className="text-lg">From:</p>
              <DatePicker 
                selected={startDate} 
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className="default-input w-[50%] mt-1" 
                wrapperClassName="w-[100%]" />
            </div>

            <div className={`flex-1 mr-8 ${selectedOptions.reportType === 'sales_commission' ? 'basis-1/5' : 'basis-1/4'}`}>
              <p className="text-lg">To:</p>
              <DatePicker 
                selected={endDate} 
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="default-input w-[50%] mt-1" 
                wrapperClassName="w-[100%]" />
            </div>

            {selectedOptions.reportType !== 'sales' && (
              <div className={`flex-1 mr-8 ${selectedOptions.reportType === 'sales_commission' ? 'basis-1/5' : 'basis-1/4'}`}>
                <p className="text-lg">Select Reseller:</p>
                <select
                  name="reseller"
                  value={selectedOptions.reseller}
                  onChange={handleSelectChange}
                  className="default-input w-[50%] mt-1"
                  style={{ borderColor: 'black' }}
                  disabled={user.role === "Sales Rep" || !adminAllowed}
                >
                  <option value="" hidden>Select Reseller</option>
                  {resellers.length > 0 ? (
                    resellers.map(company => (
                      <option value={company.id}>{company.name}</option>
                    ))
                  ) : <option value="" hidden></option>}
                </select>
              </div>
            )}

            {selectedOptions.reportType === 'sales_commission' && (
              <div className="flex-1 mr-8 basis-1/5">
                <p className="text-lg">Select Sales Rep:</p>
                <select
                  name="salesRep"
                  value={selectedOptions.salesRep}
                  onChange={handleSelectChange}
                  className="default-input w-[50%] mt-1"
                  style={{ borderColor: 'black' }}
                  disabled={user.role === "Sales Rep" || salesReps.length === 0}
                >
                  <option value="" hidden>
                    {salesReps.length > 0 ? 'Select Sales Rep' : 'No Sales Reps'}
                  </option>
                  {salesReps.length > 1 && <option value="all">All</option>}
                  {salesReps.map(user => (
                    <option key={user.id} value={user.id}>{user.user_details.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedOptions.reportType === 'sales' && (
              <div className="flex-1 mr-8 basis-1/4">
                <p className="text-lg">Select Supplier:</p>
                <select
                  name="supplier"
                  value={selectedOptions.supplier}
                  onChange={handleSelectChange}
                  className="default-input w-[50%] mt-1"
                  style={{ borderColor: 'black' }}
                  disabled={user.role !== "Superadmin"}
                >
                  <option value="" hidden>Select Supplier</option>
                  {suppliers.length > 1 && <option value="all">All</option>}
                  {suppliers.length > 0 ? (
                    suppliers.map(supplier => (
                      <option value={supplier.id}>{supplier.name}</option>
                    ))
                  ) : <option value="" hidden></option>}
                </select>
              </div>
            )}
          </div>
          <div className="flex w-full justify-end">
            <button
              onClick={() => generateReport("HTML")}
              className={`default-button-reports w-32 mr-8 ${isGenerateButtonEnabled ? 'bg-accent text-white cursor-default' : ''}`}
              disabled={!isGenerateButtonEnabled}
              style={{ cursor: isGenerateButtonEnabled ? 'pointer' : 'default' }}>
              Generate
            </button>
          </div>
        </div>
        <br></br>
        {reportHtml ? (
          <>
            <div id="profile-block" className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
              <div className="flex w-full justify-end">
                <img src={downloadPdf} alt="Download PDF" className="max-w-[30px] mr-2" onClick={() => generateReport("PDF")} />
                <img src={downloadCsv} alt="Download CSV" className="max-w-[30px] mr-2" onClick={() => generateReport("CSV")} />
              </div>
              <br></br>
              <div className="bg-white" dangerouslySetInnerHTML={{ __html: reportHtml }}/>
            </div>
          </>
        ) : (
          <p className="flex w-full justify-center text-grey pt-8 text-3xl">No report generated</p>
        )}
      </div>
    </div >
  )
}