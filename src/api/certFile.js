import axios from "axios";

export const downloadCertFile = async (certId) => {
  try {
    const response = await axios.get(`/get_diamond_cert/${certId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      responseType: "blob",
    });

    // Create a URL from the blob
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${certId}.pdf`); // Set the file name for the download
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading the PDF:", error);
  }
};
