import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getCompanies, getUsersInCompany } from '../api/company';
import { getReport } from '../api/reports';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const Report = () => {
  const user = useSelector(state => state.user.user)
  const [isGenerateButtonEnabled, setIsGenerateButtonEnabled] = useState(false);
  const [donwloadAs, setDonwloadAs] = useState("HTML");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportHtml, setReportHtml] = useState(null);
  const [resellers, setResellers] = useState([]);
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
      user_role: user.role,
      user_id: user.id
    };

    try {
      const data = await getCompanies([0, 10], filterList);
      setResellers(data.data)
      console.log(data)
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
    fetchCompanies();
  }, []);

  useEffect(() => {
    updateGenerateButtonState();
  }, [selectedOptions, showSalesRep]);

  return (
    <div className="flex border-0 pt-24">
      <div className="flex w-full justify-items-center grid grid-cols-1 mt-12">
        <div className="profile-block bg-white">
          <div className="flex justify-between items-end mb-4">
            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
              <select name="reportType" value={selectedOptions.reportType} onChange={handleSelectChange} className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }}>
                <option value="" hidden>Select Report</option>
                <option value="sales_commission">Sales Commission Report</option>
                <option value="reseller_commission">Reseller Commission Report</option>
              </select>
            </div>

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
              <p className="text-lg">From:</p>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="default-input w-[50%] mt-1" wrapperClassName="w-[100%]" />
            </div>

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
              <p className="text-lg">To:</p>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="default-input w-[50%] mt-1" wrapperClassName="w-[100%]" />
            </div>

            <div className={`flex-1 ${showSalesRep ? 'basis-1/5' : 'basis-1/4'} mr-8`}>
              <select name="reseller" value={selectedOptions.reseller} onChange={handleSelectChange} className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }}>
                <option value="" hidden>Select Reseller</option>
                {resellers.length > 0 ? (
                  resellers.map(company => (
                    <option value={company.id}>{company.name}</option>
                  ))
                ) : (console.log("no companies"))}
              </select>
            </div>

            {showSalesRep && (
              <div className="flex-1 basis-1/5 mr-8">
                <select
                  name="salesRep"
                  value={selectedOptions.salesRep}
                  onChange={handleSelectChange}
                  className="default-input w-[50%] mt-1"
                  style={{ borderColor: 'black' }}
                  disabled={salesReps.length === 0}
                >
                  <option value="" hidden>
                    {salesReps.length > 0 ? 'Select Sales Rep' : 'No Sales Reps'}
                  </option>
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
              className="default-button w-32 mr-8"
              disabled={!isGenerateButtonEnabled}
              style={{ cursor: isGenerateButtonEnabled ? 'pointer' : 'default' }}>
              Generate
            </button>
          </div>
        </div>
        <br></br>
        {reportHtml ? (
          <>
            <div className="profile-block bg-white">
              <div className="flex w-full justify-end">
                <img src="src/assets/download-pdf.png" alt="Download PDF" className="max-w-[30px] mr-2" onClick={() => generateReport("PDF")} />
                <img src="src/assets/download-csv.png" alt="Download CSV" className="max-w-[50px] mr-2" onClick={() => generateReport("CSV")} />
              </div>
              <br></br>
              <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
            </div>
          </>
        ) : (
          <p className="flex w-full justify-center text-grey pt-8 text-3xl">No report generated</p>
        )}
      </div>
    </div >
  )
}