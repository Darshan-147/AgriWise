import React, { useState, useEffect } from 'react';
import { creditService, userService } from '../services/api';

const AgentDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all farmers and their credit risk scores
    const fetchFarmersData = async () => {
      try {
        setLoading(true);

        const [usersResponse, scoresResponse] = await Promise.all([
          userService.getAll({ role: 'user' }),
          creditService.getRiskScores(),
        ]);
        const farmersData = usersResponse.data;
        const creditScores = scoresResponse.data;

        // Combine farmer details with their risk scores
        const farmersWithScores = farmersData.map((farmer) => {
          const farmerScore = creditScores.find((score) => score.user?._id === farmer._id);
          const riskScore = Number(farmerScore?.Predicted_Risk_Score ?? NaN);

          // Determine the risk level based on the score
          let riskLevel;
          if (!Number.isFinite(riskScore)) {
            riskLevel = 'N/A';
          } else if (riskScore < 30) {
            riskLevel = 'Low';
          } else if (riskScore < 60) {
            riskLevel = 'Medium';
          } else {
            riskLevel = 'High';
          }

          return {
            ...farmer,
            creditRisk: riskLevel,
            riskScore,
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

  // Helper function for styling based on risk values
  const getCreditRiskClass = (risk) => {
    if (risk === 'N/A') return 'bg-gray-200 text-gray-700';
    if (risk === 'Low') return 'bg-green-100 text-green-800';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function for styling the risk score
  const getRiskScoreClass = (score) => {
    if (!Number.isFinite(score)) return 'text-gray-600';
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 pb-4 pt-24">
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
                        {Number.isFinite(farmer.riskScore) ? farmer.riskScore.toFixed(2) : 'N/A'}
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
