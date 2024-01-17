import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getCompanies, getUsersInCompany, getUsersCompany } from '../api/company';
import { getReport } from '../api/reports';
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
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [salesReps, setSalesReps] = useState([]);
  const [showSalesRep, setShowSalesRep] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    reportType: '',
    reseller: '',
    salesRep: '',
  });

  const fetchCompanies = async () => {
    const filterList = {
      name: null,
      type_id: 2, // Reseller Company
      registration_number: null,
      search: null,
      user_role: null,
      user_id: null
    };

    try {
      const data = await getCompanies([0, 10], filterList);
      setResellers(data.data)
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
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
      console.error('Error in fetchCompanies:', error);
    }
  };

  const fetchUsersCompany = async () => {
    try {
      const data = await getUsersCompany(user.id);
      if (data && data.company_type == "Supplier") {
        fetchCompanies();
        setAdminAllowed(true)
      } else if (data && data.company_type == "Reseller") {
        setResellers([data])
        fetchUsersInCompany(data.id);
      } else {
        setResellers([])
        console.log("No company found for user.");
      }
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  };

  const generateReport = async (format) => {
    const filterList = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      company_id: selectedOptions.reseller,
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
    const isEnabled = selectedOptions.reportType && selectedOptions.reseller && (showSalesRep ? selectedOptions.salesRep : true);
    setIsGenerateButtonEnabled(isEnabled);
  };

  const handleSelectChange = async (e) => {
    const { name, value } = e.target;

    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [name]: value,
    }));

    if (name === 'reseller') {
      if (value) {
        await fetchUsersInCompany(value);
        setSalesReps(data => {
          if (data.length === 0) {
            setSelectedOptions(prevOptions => ({
              ...prevOptions,
              salesRep: ''
            }));
          }
          return data;
        });
      } else {
        setSalesReps([]);
        setSelectedOptions(prevOptions => ({
          ...prevOptions,
          salesRep: ''
        }));
      }
    } else if (name === 'reportType') {
      const isResellerCommission = value === 'reseller_commission';
      setShowSalesRep(!isResellerCommission);
      if (isResellerCommission) {
        setSelectedOptions(prevState => ({
          ...prevState,
          salesRep: ''
        }));
      }
    }
  };

  useEffect(() => {
    if (user.role === "Sales Rep") {
      setShowSalesRep(true);
      fetchUsersCompany();
    } if (user.role === "Admin") {
      fetchUsersCompany();
    } else {
      fetchCompanies();
      setAdminAllowed(true)
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
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        reportType: 'sales_commission',
        reseller: resellers[0]?.id,
        salesRep: salesReps[0]?.id
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
  }, [selectedOptions, showSalesRep]);

  return (
    <div className="flex border-0 pt-24 bg-light-grey">
      <div className="flex w-full justify-items-center grid grid-cols-1 mt-12 pb-10">
        <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
          <div className="flex justify-between items-end mb-4">
            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
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
              </select>
            </div>

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
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

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
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

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
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

            {showSalesRep && (
              <div className="flex-1 basis-1/5 mr-8">
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
            <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
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