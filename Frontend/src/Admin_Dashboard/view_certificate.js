import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import JMAN_BG from './JMAN_BG.mp4'

function Certificate() {
  const [userCertificates, setUserCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [certificatesPerPage] = useState(9); // Adjust the number of certificates per page as needed

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await axios.post(
          "http://localhost:5000/getCertificate"
        );
        setUserCertificates(response.data.certificates);
        console.log(response.data.certificates)
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving user certificates:", error);
        setError(
          "Error retrieving user certificates. Please try again later."
        );
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const handleUpdateStatus = async (empid,certificate, newStatus) => {
    console.log(empid," ",certificate," ",newStatus);
    try {
      const response = await axios.post(
        "http://localhost:5000/updateCertificateStatus",
        { empid,certificate, newStatus }
      );
      if (response.status === 200) {
        alert("Certificate status updated successfully");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an issue updating the certificate status");
    }
  };

  // Logic for pagination
  const indexOfLastCertificate = currentPage * certificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - certificatesPerPage;
  const currentCertificates = userCertificates.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
    <video autoPlay muted loop id="bg-video">
    <source src={JMAN_BG} type="video/mp4" />
  </video>
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ marginRight: "auto" }}>
        <Sidebar />
      </div>
      <div style={{ flex: "1" }}>
        <div className="container mt-5">
          <h1 className="certificate-heading"> CERTIFICATE TAB </h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : userCertificates.length > 0 ? (
            <div className="certificate-box">
              <table className="table certificate-table">
                <thead>
                  <tr>
                    <th>Empid</th>
                    <th>Certificate Name</th>
                    <th>Issuing Organization</th>
                    <th>Issue Date</th>
                    <th>Expire Date</th>
                    <th>Credential ID</th>
                    <th>Status</th>
                    <th>Action</th> {/* New column for status update */}
                  </tr>
                </thead>
                <tbody>
                  {currentCertificates.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.certificateName
                          ? item.Empid
                          : ""}
                      </td>
                      <td>
                        {item.certificateName
                          ? item.certificateName.toUpperCase()
                          : ""}
                      </td>
                      <td>
                        {item.issuingOrganization
                          ? item.issuingOrganization.toUpperCase()
                          : ""}
                      </td>
                      <td>
                        {item.issueDate}
                      </td>
                      <td>
                        {item.ExpireDate}
                      </td>
                      <td>
                        {item.credentialID
                          ? item.credentialID.toUpperCase()
                          : ""}
                      </td>
                      <td>{item.Status ? item.Status.toUpperCase() : ""}</td>
                      <td>
                        {/* Dropdown to select status */}
                        <select
                          value={item.Status}
                          onChange={(e) =>
                            handleUpdateStatus(item.Empid,item.certificateName, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={nextPage} disabled={indexOfLastCertificate >= userCertificates.length}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No Certificates To Show</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Certificate;