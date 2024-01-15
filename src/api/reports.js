import axios from "axios";


export const getReport = (reportType, filterList, reportFormat) => {
    return axios
        .get("/get_report", {
            params: {
                report_type: reportType,
                filter_list: filterList,
                report_format: reportFormat
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.data.data;
            } else {
                console.log(response.data);
            }
        })
        .catch((error) => {
            console.log(error.message);
            return error.response;
        });
};