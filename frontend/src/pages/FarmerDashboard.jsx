import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/mainlogo.png';

const FarmerDashboard = () => {
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [formData, setFormData] = useState({
    State: '',
    City: '',
    Crop: '',
    pH_soil: '',
    Area_ha: '',
    avgTemp: '',
    Rainfall_mm: '',
    Yield_ton_ha: '',
    Avg_smlvl: '',
    Soil_Type: '',
    Nutrient_Level: '',
    Credit_Score: '600',
    Predicted_Risk_Score: '',
  });

  // Translation data
  const translations = {
    english: {
      title: 'Farmer Dashboard',
      state: 'State',
      city: 'City',
      crop: 'Crop',
      phSoil: 'pH Soil',
      area: 'Area (Hectare)',
      temperature: 'Temperature (°C)',
      rainfall: 'Rainfall (mm)',
      yield: 'Yield (Tons/ha)',
      soilMoistureLevel: 'Soil Moisture Level (%)',
      soilType: 'Soil Type',
      nutrientLevel: 'Nutrient Level',
      creditScore: 'Credit Score',
      riskCategory: 'Risk Category',
      submit: 'Submit',
      selectLanguage: 'Select Language',
      selectPlaceholder: 'Select',
      loading: 'Processing...',
      riskScoreTitle: 'Predicted Risk Score',
      riskScorePercent: 'Risk Score',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      veryHighRisk: 'Very High Risk',
      formSuccess: 'Data submitted successfully! See your risk assessment below.',
      formError: 'Error submitting form. Please try again.',
    },
    hindi: {
      title: 'किसान डैशबोर्ड',
      state: 'राज्य',
      city: 'शहर',
      crop: 'फसल',
      phSoil: 'मिट्टी का पीएच',
      area: 'क्षेत्र (हेक्टेयर)',
      temperature: 'तापमान (°C)',
      rainfall: 'वर्षा (मिमी)',
      yield: 'उपज (टन/हेक्टेयर)',
      soilMoistureLevel: 'मिट्टी की नमी का स्तर (%)',
      soilType: 'मिट्टी का प्रकार',
      nutrientLevel: 'पोषक तत्व स्तर',
      creditScore: 'क्रेडिट स्कोर',
      riskCategory: 'जोखिम श्रेणी',
      submit: 'जमा करें',
      selectLanguage: 'भाषा चुनें',
      selectPlaceholder: 'चुनें',
      loading: 'प्रोसेसिंग...',
      riskScoreTitle: 'अनुमानित जोखिम स्कोर',
      riskScorePercent: 'जोखिम स्कोर',
      lowRisk: 'कम जोखिम',
      mediumRisk: 'मध्यम जोखिम',
      highRisk: 'उच्च जोखिम',
      veryHighRisk: 'बहुत अधिक जोखिम',
      formSuccess: 'डेटा सफलतापूर्वक जमा किया गया! नीचे अपना जोखिम मूल्यांकन देखें।',
      formError: 'फॉर्म जमा करने में त्रुटि। कृपया पुन: प्रयास करें।',
    },
    gujarati: {
      title: 'ખેડૂત ડેશબોર્ડ',
      state: 'રાજ્ય',
      city: 'શહેર',
      crop: 'પાક',
      phSoil: 'માટીનો પીએચ',
      area: 'વિસ્તાર (હેક્ટર)',
      temperature: 'તાપમાન (°C)',
      rainfall: 'વરસાદ (મીમી)',
      yield: 'ઉપજ (ટન/હેક્ટર)',
      soilMoistureLevel: 'માટીનું ભેજ સ્તર (%)',
      soilType: 'માટીનો પ્રકાર',
      nutrientLevel: 'પોષક તત્વોનું સ્તર',
      creditScore: 'ક્રેડિટ સ્કોર',
      riskCategory: 'જોખમ શ્રેણી',
      submit: 'સબમિટ કરો',
      selectLanguage: 'ભાષા પસંદ કરો',
      selectPlaceholder: 'પસંદ કરો',
      loading: 'પ્રક્રિયા થઈ રહી છે...',
      riskScoreTitle: 'અનુમાનિત જોખમ સ્કોર',
      riskScorePercent: 'જોખમ સ્કોર',
      lowRisk: 'ઓછું જોખમ',
      mediumRisk: 'મધ્યમ જોખમ',
      highRisk: 'ઉચ્ચ જોખમ',
      veryHighRisk: 'અત્યંત ઉચ્ચ જોખમ',
      formSuccess: 'ડેટા સફળતાપૂર્વક સબમિટ કર્યો! નીચે તમારું જોખમ મૂલ્યાંકન જુઓ.',
      formError: 'ફોર્મ સબમિટ કરવામાં ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    },
    punjabi: {
      title: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ',
      state: 'ਰਾਜ',
      city: 'ਸ਼ਹਿਰ',
      crop: 'ਫਸਲ',
      phSoil: 'ਮਿੱਟੀ ਦਾ ਪੀਐਚ',
      area: 'ਖੇਤਰ (ਹੈਕਟੇਅਰ)',
      temperature: 'ਤਾਪਮਾਨ (°C)',
      rainfall: 'ਵਰਖਾ (ਮਿਮੀ)',
      yield: 'ਪੈਦਾਵਾਰ (ਟਨ/ਹੈਕਟੇਅਰ)',
      soilMoistureLevel: 'ਮਿੱਟੀ ਦੀ ਨਮੀ ਦਾ ਪੱਧਰ (%)',
      soilType: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
      nutrientLevel: 'ਪੋਸ਼ਕ ਪੱਧਰ',
      creditScore: 'ਕ੍ਰੈਡਿਟ ਸਕੋਰ',
      riskCategory: 'ਜੋਖਮ ਸ਼੍ਰੇਣੀ',
      submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
      selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      selectPlaceholder: 'ਚੁਣੋ',
      loading: 'ਪ੍ਰੋਸੈਸਿੰਗ...',
      riskScoreTitle: 'ਅਨੁਮਾਨਿਤ ਜੋਖਮ ਸਕੋਰ',
      riskScorePercent: 'ਜੋਖਮ ਸਕੋਰ',
      lowRisk: 'ਘੱਟ ਜੋਖਮ',
      mediumRisk: 'ਮੱਧਮ ਜੋਖਮ',
      highRisk: 'ਉੱਚ ਜੋਖਮ',
      veryHighRisk: 'ਬਹੁਤ ਉੱਚ ਜੋਖਮ',
      formSuccess: 'ਡਾਟਾ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਕੀਤਾ ਗਿਆ! ਹੇਠਾਂ ਆਪਣੇ ਜੋਖਮ ਮੁਲਾਂਕਣ ਨੂੰ ਦੇਖੋ।',
      formError: 'ਫਾਰਮ ਜਮ੍ਹਾਂ ਕਰਨ ਵਿੱਚ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    },
    marathi: {
      title: 'शेतकरी डॅशबोर्ड',
      state: 'राज्य',
      city: 'शहर',
      crop: 'पीक',
      phSoil: 'मातीचा पीएच',
      area: 'क्षेत्र (हेक्टर)',
      temperature: 'तापमान (°C)',
      rainfall: 'पाऊस (मिमी)',
      yield: 'उत्पादन (टन/हेक्टर)',
      soilMoistureLevel: 'मातीचा ओलावा पातळी (%)',
      soilType: 'मातीचा प्रकार',
      nutrientLevel: 'पोषक पातळी',
      creditScore: 'क्रेडिट स्कोर',
      riskCategory: 'जोखीम श्रेणी',
      submit: 'सबमिट करा',
      selectLanguage: 'भाषा निवडा',
      selectPlaceholder: 'निवडा',
      loading: 'प्रक्रिया सुरू आहे...',
      riskScoreTitle: 'अंदाजित जोखीम स्कोर',
      riskScorePercent: 'जोखीम स्कोर',
      lowRisk: 'कमी जोखीम',
      mediumRisk: 'मध्यम जोखीम',
      highRisk: 'उच्च जोखीम',
      veryHighRisk: 'अत्यंत उच्च जोखीम',
      formSuccess: 'डेटा यशस्वीरित्या सबमिट केला! खाली आपले जोखीम मूल्यांकन पहा.',
      formError: 'फॉर्म सबमिट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.',
    },
  };

  const t = translations[language];

  // Options for dropdown fields
  const stateOptions = ['Gujarat'];
  const cityOptions = [
    'Ahmedabad',
    'Gandhinagar',
    'Junagadh',
    'Rajkot',
    'Surat',
    'Tapi',
    'Vadodara',
    'Valsad',
  ];
  const cropOptions = ['Bajra', 'Groundnut', 'Jowar', 'Wheat', 'Maize', 'Rice', 'Sugarcane'];
  const soilTypeOptions = ['Sandy Loam', 'Mixed Soil', 'Sandy Soil', 'Silty Clay'];
  const nutrientLevelOptions = ['Low', 'Medium', 'High'];
  const riskCategoryOptions = [
    'Very Low Risk',
    'Low Risk',
    'Medium Risk',
    'High Risk',
    'Very High Risk',
  ];
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी (Hindi)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setRiskScore(null);

    // Map form field names to match the backend schema
    const apiData = {
      State: formData.State,
      City: formData.City,
      Crop: formData.Crop,
      pH_soil: parseFloat(formData.pH_soil),
      Area_ha: parseFloat(formData.Area_ha),
      avgTemp: parseFloat(formData.avgTemp),
      Rainfall_mm: parseFloat(formData.Rainfall_mm),
      Yield_ton_ha: parseFloat(formData.Yield_ton_ha),
      Avg_smlvl: parseFloat(formData.Avg_smlvl),
      Soil_Type: formData.Soil_Type,
      Nutrient_Level: formData.Nutrient_Level,
      Credit_Score: parseInt(formData.Credit_Score),
    };

    axios
      .post('http://localhost:5000/credit/store', apiData)
      .then((response) => {
        console.log('Data submitted successfully:', response.data);
        setRiskScore(response.data.predictedRiskScore);
        setLoading(false);
        alert(t.formSuccess);
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        setLoading(false);
        alert(t.formError);
      });
  };

  // Helper function to create a dropdown
  const renderDropdown = (id, name, label, options, value) => (
    <div className="w-full">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
      >
        <option value="">
          {t.selectPlaceholder} {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Helper function to create a text input
  const renderTextInput = (id, name, label, value, placeholder = '', unit = '') => (
    <div className="w-full">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={id}
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {unit && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
            {unit}
          </span>
        )}
      </div>
    </div>
  );

  // Get credit score color based on value
  const getCreditScoreColor = (score) => {
    const numScore = Number(score);
    if (numScore < 300) return 'bg-red-500';
    if (numScore < 500) return 'bg-orange-500';
    if (numScore < 700) return 'bg-yellow-300';
    return 'bg-green-500';
  };

  // Get risk score color based on value
  const getRiskScoreColor = (score) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-300';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get risk level text based on score
  const getRiskLevelText = (score) => {
    if (score < 25) return t.lowRisk;
    if (score < 50) return t.mediumRisk;
    if (score < 75) return t.highRisk;
    return t.veryHighRisk;
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Language selector */}
        <div className="flex justify-end mb-4">
          <div className="w-48">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
              {t.selectLanguage}
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="language"
              value={language}
              onChange={handleLanguageChange}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <img src={logo} alt="Farmer icon" className="mr-4 w-[80px] h-14" />
            <h1 className="text-3xl font-bold text-green-700">{t.title}</h1>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dropdown for State */}
              {renderDropdown('State', 'State', t.state, stateOptions, formData.State)}

              {/* Dropdown for City */}
              {renderDropdown('City', 'City', t.city, cityOptions, formData.City)}

              {/* Dropdown for Crop */}
              {renderDropdown('Crop', 'Crop', t.crop, cropOptions, formData.Crop)}

              {/* Regular text input for pH Soil */}
              {renderTextInput('pH_soil', 'pH_soil', t.phSoil, formData.pH_soil, '6.5-7.5')}

              {/* Regular text input for Area */}
              {renderTextInput('Area_ha', 'Area_ha', t.area, formData.Area_ha, '0-100', 'ha')}

              {/* Regular text input for Temperature */}
              {renderTextInput(
                'avgTemp',
                'avgTemp',
                t.temperature,
                formData.avgTemp,
                '20-35',
                '°C'
              )}

              {/* Regular text input for Rainfall */}
              {renderTextInput(
                'Rainfall_mm',
                'Rainfall_mm',
                t.rainfall,
                formData.Rainfall_mm,
                '500-2000',
                'mm'
              )}

              {/* Regular text input for Yield */}
              {renderTextInput(
                'Yield_ton_ha',
                'Yield_ton_ha',
                t.yield,
                formData.Yield_ton_ha,
                '1-10',
                't/ha'
              )}

              {/* Regular text input for Soil Moisture Level */}
              {renderTextInput(
                'Avg_smlvl',
                'Avg_smlvl',
                t.soilMoistureLevel,
                formData.Avg_smlvl,
                '20-60',
                '%'
              )}

              {/* Dropdown for Soil Type */}
              {renderDropdown(
                'Soil_Type',
                'Soil_Type',
                t.soilType,
                soilTypeOptions,
                formData.Soil_Type
              )}

              {/* Dropdown for Nutrient Level */}
              {renderDropdown(
                'Nutrient_Level',
                'Nutrient_Level',
                t.nutrientLevel,
                nutrientLevelOptions,
                formData.Nutrient_Level
              )}

              {/* Credit Score Slider */}
              <div className="w-full col-span-full">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="Credit_Score"
                >
                  {t.creditScore}: {formData.Credit_Score}
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-xs text-red-600">100</span>
                  <div className="w-full">
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="1"
                      name="Credit_Score"
                      value={formData.Credit_Score}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-full flex justify-between text-xs text-gray-600 px-1 mt-1">
                      <span className="text-red-600">Poor</span>
                      <span className="text-orange-600">Fair</span>
                      <span className="text-yellow-600">Good</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                  </div>
                  <span className="ml-2 text-xs text-green-600">900</span>
                </div>
                <div
                  className={`mt-2 w-full h-2 rounded ${getCreditScoreColor(
                    formData.Credit_Score
                  )}`}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-8">
              <button
                className={`${
                  loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                } text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline flex items-center`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t.submit}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Risk Score Display */}
        {riskScore !== null && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">{t.riskScoreTitle}</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                        {t.riskScorePercent}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {riskScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${riskScore}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getRiskScoreColor(
                        riskScore
                      )}`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 md:pl-8">
                <div
                  className={`p-4 rounded-lg ${getRiskScoreColor(
                    riskScore
                  )} bg-opacity-20 border ${getRiskScoreColor(riskScore)} border-opacity-50`}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-bold">{getRiskLevelText(riskScore)}</p>
                      <p className="text-sm">
                        {riskScore.toFixed(1)}% {t.riskScorePercent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
