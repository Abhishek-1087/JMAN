import React, { useState } from 'react';
import axios from 'axios';
import JMAN_BG from './JMAN_BG.mp4';
import Sidebar from './Sidebar';

const RECOMMEND = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error state
    setError('');

    try {
      const response = await axios.get(`http://127.0.0.1:5000/recommendations?employee_id=${employeeId}`);
      setRecommendedEvents(response.data.recommended_events);
    } catch (error) {
      setError('Error fetching recommended events: ' + error.message);
    }
  };

  return (
    <>
      <video autoPlay muted loop id="bg-video">
        <source src={JMAN_BG} type="video/mp4" />
      </video>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ marginRight: 'auto' }}>
          <Sidebar />
        </div>
        <div style={{ flex: '1' }}>
          <div>
            <h1>Employee Event Recommendations</h1>
            <form onSubmit={handleSubmit}>
              <label>
                Enter Employee ID:
                <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
              </label>
              <button type="submit">Get Recommendations</button>
            </form>
            {error && <p>{error}</p>}
            {recommendedEvents.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
                  <h2>Recommended Events:</h2>
                  <ul>
                    {recommendedEvents.map((event, index) => (
                      <li key={index}>{event}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RECOMMEND;







// import JMAN_BG from './JMAN_BG.mp4'
// import React, { useState } from 'react';
// import './recommand.css'; // import CSS file for styling
// import Sidebar from './Sidebar';
// function RECOMMEND() {
//   const [employeeId, setEmployeeId] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleInputChange = (event) => {
//     setEmployeeId(event.target.value);
//   };

//   const fetchRecommendations = () => {
//     if (!employeeId) {
//       setErrorMessage('Please enter an Employee ID.');
//       return;
//     }

//     fetch(`http://127.0.0.1:5000/recommendations?employee_id=${employeeId}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch recommendations.');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setRecommendations(data.recommendations);
//         setErrorMessage('');
//       })
//       .catch((error) => {
//         setErrorMessage(error.message);
//         setRecommendations([]);
//       });
//   };

//   return (
//     <>
//     <video autoPlay muted loop id="bg-video">
//     <source src={JMAN_BG} type="video/mp4" />
//   </video>
//     <div style={{ display: 'flex',  height: '100vh' }}>
//     <div style={{ marginRight: 'auto' }}>
//       <Sidebar />
//     </div>
//     <div style={{ flex: '1'}}>
//     <div className="recom">
//       <h1>Employee Training Recommendations</h1>
//       <input
//         type="text"
//         placeholder="Enter Employee ID"
//         value={employeeId}
//         onChange={handleInputChange}
//       />
//       <button onClick={fetchRecommendations}>Get Recommendations</button>
//       {errorMessage && <p className="error">{errorMessage}</p>}
//       <div className="recommendations-box">
//         <h2>Recommendations:</h2>
//         <div className="recommendations">
//           <ul>
//             {recommendations.map((recommendation, index) => (
//               <li key={index}>{recommendation}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//     </div>
//     </div>
//     </>
//   );
// }

// export default RECOMMEND;

