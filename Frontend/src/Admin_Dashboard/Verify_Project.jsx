import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import JMAN_BG from './JMAN_BG.mp4'

function Verify_Project() {
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(9); // Adjust the number of projects per page as needed

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.post(
          "http://localhost:5000/getProject"
        );
        setUserProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving user projects:", error);
        setError(
          "Error retrieving user projects. Please try again later."
        );
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/updateProjectStatus",
        { projectId, newStatus }
      );
      if (response.status === 200) {
        // Update the local state after successful status update
        setUserProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project._id === projectId) {
              return {
                ...project,
                Status: newStatus,
              };
            }
            return project;
          })
        );
        alert("Project status updated successfully");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an issue updating the project status");
    }
  };

  // Logic for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = userProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
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
          <div className="container mt-5" >
            <h1 className="project-heading"> PROJECTS TAB </h1>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userProjects.length > 0 ? (
              <div className="project-box">
                <table className="table project-table" >
                  <thead>
                    <tr>
                      <th>Empid</th>
                      <th>Project Name</th>
                      <th>Skills used</th>
                      <th>Approve</th>
                      <th>Action</th> {/* New column for status update */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentProjects.map((item) => {
                      console.log("Item:", item); // Add this line for debugging
                      return (
                        <tr key={item._id}>
                          <td>
                            {item.projectName ? item.Empid.toUpperCase() : ""}
                          </td>
                          <td>
                            {item.projectName ? item.projectName.toUpperCase() : ""}
                          </td>
                          <td>
                            {item.majorSkill ? item.majorSkill.toUpperCase() : ""}
                          </td>
                          <td>{item.Status ? item.Status.toUpperCase() : ""}</td>
                          <td>
                            {/* Dropdown to select status */}
                            <select
                              value={item.Status}
                              onChange={(e) =>
                                handleUpdateStatus(item._id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
                {/* Pagination */}
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>Page {currentPage}</span>
                  <button onClick={nextPage} disabled={indexOfLastProject >= userProjects.length}>
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No Projects To Show</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Verify_Project;
