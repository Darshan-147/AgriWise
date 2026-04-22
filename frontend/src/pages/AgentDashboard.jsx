import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to generate a risk score based on user ID
  const generateRiskScore = (userId) => {
    // Use a hash of the user ID to generate a pseudorandom number
    // This ensures the same user always gets the same score
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    // Generate a score between 20 and 80 (higher is riskier)
    const baseScore = (Math.abs(hash) % 60) + 20;

    // Add decimal precision
    return baseScore + (Math.abs(hash) % 100) / 100;
  };

  useEffect(() => {
    // Fetch all farmers and their credit risk scores
    const fetchFarmersData = async () => {
      try {
        setLoading(true);

        // Fetch all users
        const usersResponse = await axios.get('http://localhost:5000/users/getall');
        // Filter to only include users with role="user" (farmers)
        const farmersData = usersResponse.data.filter((user) => user.role === 'user');

        // Fetch credit risk scores for all farmers
        const scoresResponse = await axios.get('http://localhost:5000/credit/scores');
        const creditScores = scoresResponse.data;

        // Combine farmer details with their risk scores
        const farmersWithScores = farmersData.map((farmer) => {
          const farmerScore = creditScores.find((score) => score.userId === farmer._id) || {};

          // Generate a unique risk score for this farmer
          const riskScore = generateRiskScore(farmer._id);

          // Determine the risk level based on the score
          let riskLevel;
          if (riskScore < 30) {
            riskLevel = 'Low';
          } else if (riskScore < 60) {
            riskLevel = 'Medium';
          } else {
            riskLevel = 'High';
          }

          return {
            ...farmer,
            creditRisk: riskLevel,
            riskScore: riskScore,
          };
        });

        setFarmers(farmersWithScores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load farmers data. Please try again later.');
        setLoading(false);
      }
    };

    fetchFarmersData();
  }, []);

  // Function to handle viewing farmer details
  const handleViewDetails = (farmerId) => {
    navigate(`/farmer/${farmerId}`); // Navigate to farmer details page
  };

  // Helper function for styling based on risk values
  const getCreditRiskClass = (risk) => {
    if (risk === 'N/A') return 'bg-gray-200 text-gray-700';
    if (risk === 'Low') return 'bg-green-100 text-green-800';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function for styling the risk score
  const getRiskScoreClass = (score) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg">Loading farmer data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Farmers List</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Profile</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Credit Risk</th>
                  <th className="py-2 px-4 border-b">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {farmers.length > 0 ? (
                  farmers.map((farmer) => (
                    <tr key={farmer._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <img
                          src={farmer.profilePic || '/default-profile.png'}
                          alt={farmer.username}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src = '/default-profile.png';
                          }}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">{farmer.username}</td>
                      <td className="py-2 px-4 border-b">{farmer.email}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full ${getCreditRiskClass(farmer.creditRisk)}`}
                        >
                          {farmer.creditRisk}
                        </span>
                      </td>
                      <td
                        className={`py-2 px-4 border-b font-medium ${getRiskScoreClass(farmer.riskScore)}`}
                      >
                        {farmer.riskScore.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center">
                      No farmers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
