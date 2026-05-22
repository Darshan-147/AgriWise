/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  AlertTriangle,
  Info,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  History,
  X,
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  Settings,
  Moon,
  Sun,
  Trash2,
  Download,
} from 'lucide-react';
import { aiService } from '../../services/api';

const FARMER_KEYWORDS = [
  'loan',
  'credit score',
  'finance',
  'crop yield',
  'soil health',
  'weather forecast',
  'farming techniques',
  'market prices',
  'investment',
  'agriculture',
  'sustainable farming',
  'land quality',
  'harvest',
  'pest control',
  'fertilizers',
  'irrigation',
  'equipment',
  'safety regulations',
];

const responseCache = new Map();
const CACHE_EXPIRY = 60 * 60 * 1000;

const sanitizeInput = (input) => {
  return input
    .replace(/[^\p{L}\p{N}\s.,?!-:;()]/gu, '')
    .trim()
    .substring(0, 800);
};

const getCacheKey = (input) => {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Voice language mapping
const VOICE_LANGUAGES = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

const Ai = () => {
  // State initialization
  const [messages, setMessages] = useState([
    {
      text: "👩‍🌾 Welcome to AgriAdvisor! I'm your virtual assistant for farmers. Ask me about:\n\n💰 Financing options\n📈 Improving your credit score\n🌱 Crop yield predictions\n🌦️ Weather forecasts\n\nHow can I assist you today?",
      sender: 'ai',
      timestamp: Date.now(),
    },
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [fullHistory, setFullHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Voice assistant states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Enhanced history function to store complete conversations
  const addToHistory = (newMessage) => {
    // Create a conversation object if it's a user message
    if (newMessage.sender === 'user') {
      const conversationId = Date.now();
      const conversationObj = {
        id: conversationId,
        text: newMessage.text,
        timestamp: Date.now(),
        messages: [
          ...messages.slice(-3), // Include recent context
          newMessage,
        ],
      };

      // Update history with new conversation
      const updatedHistory = [...fullHistory, conversationObj];
      // Limit history to last 50 conversations
      const limitedHistory = updatedHistory.slice(-50);
      setFullHistory(limitedHistory);

      // Store conversation ID for later association with AI response
      setActiveConversation(conversationId);

      // Persist to localStorage
      localStorage.setItem('agriAdvisorHistory', JSON.stringify(limitedHistory));
    }
    // If it's an AI response and we have an active conversation
    else if (newMessage.sender === 'ai' && activeConversation) {
      // Find the conversation and update it with the AI response
      const updatedHistory = fullHistory.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      });

      setFullHistory(updatedHistory);
      localStorage.setItem('agriAdvisorHistory', JSON.stringify(updatedHistory));

      // Reset active conversation
      setActiveConversation(null);
    }
  };

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('agriAdvisorHistory');
    if (savedHistory) {
      try {
        setFullHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing history:', error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => handleSendMessage(transcript), 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError('Voice recognition failed. Please try again or type your question.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Updated language detection to include Gujarati
  const detectLanguage = (text) => {
    // Only detect language if there's a clear pattern
    if (/[\u0A80-\u0AFF]{3,}/.test(text)) return 'gu'; // At least 3 Gujarati characters
    if (/[\u0600-\u06FF]{3,}/.test(text)) return 'ar'; // At least 3 Arabic characters
    if (/[\u0900-\u097F]{3,}/.test(text)) return 'hi'; // At least 3 Hindi characters
    if (/(?:hola|como|gracias|buenos|días)/.test(text.toLowerCase())) return 'es';
    if (/(?:bonjour|merci|comment|salut)/.test(text.toLowerCase())) return 'fr';
    return 'en'; // Default to English
  };

  // Use a consistent disclaimer in the user's language
  const getFarmerMessage = (lang) => {
    const disclaimers = {
      en: '\n\n🔍 Note: This is general farming finance advice. Always consult a financial advisor or agricultural expert.',
      es: '\n\n🔍 Nota: Este es un consejo general de financiamiento agrícola. Consulte siempre a un asesor financiero o experto agrícola.',
      fr: "\n\n🔍 Remarque: Il s'agit de conseils généraux sur le financement agricole. Consultez toujours un conseiller financier ou un expert agricole.",
      ar: '\n\n🔍 ملاحظة: هذه نصيحة عامة للتمويل الزراعي. استشر دائمًا مستشارًا ماليًا أو خبيرًا زراعيًا.',
      hi: '\n\n🔍 नोट: यह सामान्य कृषि वित्त सलाह है। हमेशा वित्तीय सलाहकार या कृषि विशेषज्ञ से परामर्श करें।',
      gu: '\n\n🔍 નોંધ: આ સામાન્ય કૃષિ નાણાં સલાહ છે. હંમેશા નાણાકીય સલાહકાર અથવા કૃષિ નિષ્ણાતની સલાહ લો.',
    };
    return disclaimers[lang] || disclaimers.en;
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = VOICE_LANGUAGES[language] || 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        console.error('Speech recognition error:', error);
        setError('Could not start voice recognition. Please try again.');
      }
    }
  };

  // Toggle voice output
  const toggleVoiceOutput = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Apply theme to body
    document.body.classList.toggle('light-theme', !darkMode);
  };

  // Speak text using appropriate voice for the language
  const speakText = (text) => {
    if (!voiceEnabled) return;

    // Clean up the text - remove emoji and other non-speech elements
    const cleanText = text
      .replace(/\n\n🔍 Note:.+/g, '') // Remove disclaimer
      .replace(/[^\p{L}\p{N}\s.,?!:;()-]/gu, '') // Remove emoji and special chars
      .trim();

    if (synthRef.current) {
      synthRef.current.cancel(); // Stop any current speech

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Set language based on detected language
      utterance.lang = VOICE_LANGUAGES[language] || 'en-US';

      // Try to find an appropriate voice
      const voices = synthRef.current.getVoices();
      const languageVoice = voices.find((voice) => voice.lang.startsWith(utterance.lang));
      if (languageVoice) {
        utterance.voice = languageVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  // Export chat history function
  const exportChatHistory = () => {
    try {
      // Format the history for export
      const historyForExport = fullHistory
        .map((conv) => {
          const date = new Date(conv.timestamp).toLocaleDateString();
          const time = new Date(conv.timestamp).toLocaleTimeString();

          let formattedMessages = '';
          if (conv.messages && conv.messages.length) {
            formattedMessages = conv.messages
              .map((msg) => `${msg.sender === 'user' ? 'You' : 'AgriAdvisor'}: ${msg.text}`)
              .join('\n\n');
          } else {
            formattedMessages = `You: ${conv.text}`;
          }

          return `--- Conversation from ${date} at ${time} ---\n\n${formattedMessages}\n\n`;
        })
        .join('\n');

      // Create a downloadable file
      const blob = new Blob([historyForExport], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agriadvisor-history-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting history:', error);
      setError('Failed to export history. Please try again.');
    }
  };

  // Determine query type for farmer-specific questions
  const determineFarmerQueryType = (query) => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes('loan') ||
      lowerQuery.includes('credit') ||
      lowerQuery.includes('finance') ||
      lowerQuery.includes('funding') ||
      lowerQuery.includes('money') ||
      lowerQuery.includes('bank')
    ) {
      return 'finance';
    }

    if (
      lowerQuery.includes('weather') ||
      lowerQuery.includes('forecast') ||
      lowerQuery.includes('rain') ||
      lowerQuery.includes('temperature') ||
      lowerQuery.includes('climate') ||
      lowerQuery.includes('season')
    ) {
      return 'weather';
    }

    if (
      lowerQuery.includes('soil') ||
      lowerQuery.includes('crop') ||
      lowerQuery.includes('yield') ||
      lowerQuery.includes('harvest') ||
      lowerQuery.includes('planting') ||
      lowerQuery.includes('seeds')
    ) {
      return 'farming';
    }

    if (
      lowerQuery.includes('market') ||
      lowerQuery.includes('price') ||
      lowerQuery.includes('sell') ||
      lowerQuery.includes('buy') ||
      lowerQuery.includes('trading') ||
      lowerQuery.includes('profit')
    ) {
      return 'market';
    }

    return 'general';
  };

  const getAIResponse = async (userInput) => {
    try {
      const detectedLang = detectLanguage(userInput);
      setLanguage(detectedLang);

      const queryType = determineFarmerQueryType(userInput);
      const disclaimer = getFarmerMessage(detectedLang);

      const cacheKey = getCacheKey(userInput);
      if (responseCache.has(cacheKey)) {
        const cachedData = responseCache.get(cacheKey);
        if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          return cachedData.response;
        }
      }

      const cleanInput = sanitizeInput(userInput);

      // Farmer-specific prompts
      const promptTemplate = {
        en: `You are AgriAdvisor, a virtual assistant specifically designed to help farmers with financial advice and credit evaluation. Follow these rules STRICTLY:
  1. IMPORTANT: Focus on the user's specific question about farming finance, loans, or credit scores.
  2. Stay focused on the user's specific question - don't provide unrelated information.
  3. ${
    queryType === 'finance'
      ? 'Provide detailed information about agricultural loans, financial assistance programs, and credit improvement strategies for farmers'
      : ''
  }
  4. ${
    queryType === 'weather'
      ? 'Explain how weather forecasts can impact financial planning and risk assessment for farmers'
      : ''
  }
  5. ${
    queryType === 'farming'
      ? 'Discuss how crop yields, soil health, and farming practices can affect creditworthiness'
      : ''
  }
  6. ${
    queryType === 'market'
      ? 'Provide information on how market prices and trends affect farm finances and credit evaluations'
      : ''
  }
  7. Use simple language that farmers can understand
  8. Always respond in the same language as the user's query
  
  ${
    queryType === 'general'
      ? 'Format responses with ONLY relevant sections from:'
      : "ONLY use the sections that directly answer the user's question:"
  }
  ${queryType === 'finance' || queryType === 'general' ? '💰 Financial Advice: [Details]' : ''}
  ${
    queryType === 'finance' || queryType === 'general'
      ? '📈 Credit Score Improvement: [Details]'
      : ''
  }
  ${
    queryType === 'weather' || queryType === 'farming' || queryType === 'general'
      ? '🌱 Farm Production Impact: [Details]'
      : ''
  }
  ${queryType === 'market' || queryType === 'general' ? '🏦 Loan Options: [Details]' : ''}
  ⚠️ Important Note: [If applicable]`,
        hi: `आप AgriAdvisor हैं, एक आभासी सहायक जो विशेष रूप से किसानों को वित्तीय सलाह और क्रेडिट मूल्यांकन में मदद करने के लिए डिज़ाइन किया गया है। इन नियमों का कड़ाई से पालन करें:
  1. महत्वपूर्ण: उपयोगकर्ता के कृषि वित्त, ऋण, या क्रेडिट स्कोर के बारे में विशिष्ट प्रश्न पर ध्यान केंद्रित करें।
  2. उपयोगकर्ता के विशिष्ट प्रश्न पर ध्यान केंद्रित रखें - असंबंधित जानकारी प्रदान न करें।
  3. ${
    queryType === 'finance'
      ? 'किसानों के लिए कृषि ऋण, वित्तीय सहायता कार्यक्रमों और क्रेडिट सुधार रणनीतियों के बारे में विस्तृत जानकारी प्रदान करें'
      : ''
  }
  4. ${
    queryType === 'weather'
      ? 'बताएं कि मौसम पूर्वानुमान किसानों के लिए वित्तीय योजना और जोखिम मूल्यांकन को कैसे प्रभावित कर सकते हैं'
      : ''
  }
  5. ${
    queryType === 'farming'
      ? 'चर्चा करें कि फसल उपज, मिट्टी की स्वास्थ्य और खेती के तरीके कैसे क्रेडिट योग्यता को प्रभावित कर सकते हैं'
      : ''
  }
  6. ${
    queryType === 'market'
      ? 'जानकारी प्रदान करें कि बाजार की कीमतें और रुझान कृषि वित्त और क्रेडिट मूल्यांकन को कैसे प्रभावित करते हैं'
      : ''
  }
  7. सरल भाषा का उपयोग करें जिसे किसान समझ सकें
  8. हमेशा उपयोगकर्ता के प्रश्न की भाषा में उत्तर दें
  
  ${
    queryType === 'general'
      ? 'केवल प्रासंगिक खंडों के साथ प्रतिक्रिया दें:'
      : 'केवल वे खंड उपयोग करें जो उपयोगकर्ता के प्रश्न का सीधा उत्तर देते हैं:'
  }
  ${queryType === 'finance' || queryType === 'general' ? '💰 वित्तीय सलाह: [विवरण]' : ''}
  ${queryType === 'finance' || queryType === 'general' ? '📈 क्रेडिट स्कोर सुधार: [विवरण]' : ''}
  ${
    queryType === 'weather' || queryType === 'farming' || queryType === 'general'
      ? '🌱 कृषि उत्पादन प्रभाव: [विवरण]'
      : ''
  }
  ${queryType === 'market' || queryType === 'general' ? '🏦 ऋण विकल्प: [विवरण]' : ''}
  ⚠️ महत्वपूर्ण नोट: [यदि लागू हो]`,
        gu: `તમે AgriAdvisor છો, એક વર્ચ્યુઅલ આસિસ્ટન્ટ જે ખાસ કરીને ખેડૂતોને નાણાકીય સલાહ અને ક્રેડિટ મૂલ્યાંકનમાં મદદ કરવા માટે ડિઝાઇન કરવામાં આવ્યું છે. આ નિયમોનું ચુસ્તપણે પાલન કરો:
  1. મહત્વપૂર્ણ: વપરાશકર્તાના ખેતી નાણાં, લોન, અથવા ક્રેડિટ સ્કોર વિશેના ચોક્કસ પ્રશ્ન પર ધ્યાન કેન્દ્રિત કરો.
  2. વપરાશકર્તાના ચોક્કસ પ્રશ્ન પર ધ્યાન કેન્દ્રિત કરો - અસંબંધિત માહિતી પ્રદાન કરશો નહીં.
  3. ${
    queryType === 'finance'
      ? 'ખેડૂતો માટે કૃષિ લોન, નાણાકીય સહાય કાર્યક્રમો, અને ક્રેડિટ સુધારણા વ્યૂહરચનાઓ વિશે વિગતવાર માહિતી પ્રદાન કરો'
      : ''
  }
  4. ${
    queryType === 'weather'
      ? 'સમજાવો કે હવામાન આગાહીઓ ખેડૂતો માટે નાણાકીય આયોજન અને જોખમ મૂલ્યાંકનને કેવી રીતે અસર કરી શકે છે'
      : ''
  }
  5. ${
    queryType === 'farming'
      ? 'ચર્ચા કરો કે પાક ઉપજ, જમીનના સ્વાસ્થ્ય, અને ખેતીની પદ્ધતિઓ ક્રેડિટ પાત્રતાને કેવી રીતે અસર કરી શકે છે'
      : ''
  }
  6. ${
    queryType === 'market'
      ? 'માહિતી પ્રદાન કરો કે બજાર ભાવો અને વલણો ફાર્મ ફાઇનાન્સ અને ક્રેડિટ મૂલ્યાંકનને કેવી રીતે અસર કરે છે'
      : ''
  }
  7. સરળ ભાષાનો ઉપયોગ કરો જે ખેડૂતો સમજી શકે
  8. હંમેશા વપરાશકર્તાના પ્રશ્નની ભાષામાં જવાબ આપો
  
  ${
    queryType === 'general'
      ? 'માત્ર સંબંધિત વિભાગો સાથે પ્રતિસાદ ફોર્મેટ કરો:'
      : 'માત્ર તે વિભાગોનો ઉપયોગ કરો જે વપરાશકર્તાના પ્રશ્નનો સીધો જવાબ આપે છે:'
  }
  ${queryType === 'finance' || queryType === 'general' ? '💰 નાણાકીય સલાહ: [વિગતો]' : ''}
  ${queryType === 'finance' || queryType === 'general' ? '📈 ક્રેડિટ સ્કોર સુધારણા: [વિગતો]' : ''}
  ${
    queryType === 'weather' || queryType === 'farming' || queryType === 'general'
      ? '🌱 કૃષિ ઉત્પાદન પ્રભાવ: [વિગતો]'
      : ''
  }
  ${queryType === 'market' || queryType === 'general' ? '🏦 લોન વિકલ્પો: [વિગતો]' : ''}
  ⚠️ મહત્વપૂર્ણ નોંધ: [જો લાગુ પડતું હોય તો]`,
      };

      const promptLang = promptTemplate[detectedLang] || promptTemplate.en;

      const { data } = await aiService.chat({
        prompt: promptLang,
        userInput: cleanInput,
      });

      const aiText = data.text || "I'm unable to provide information right now. Please try again.";

      const fullResponse = aiText + disclaimer;

      responseCache.set(cacheKey, {
        response: fullResponse,
        timestamp: Date.now(),
      });

      return fullResponse;
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);

      const errorMessages = {
        en: 'Service unavailable. Please try again later.',
        hi: 'सेवा अनुपलब्ध है। कृपया बाद में पुन: प्रयास करें।',
        gu: 'સેવા ઉપલબ્ધ નથી. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.',
        es: 'Servicio no disponible. Por favor, inténtelo más tarde.',
      };

      return errorMessages[language] || errorMessages.en;
    }
  };

  const retryWithExponentialBackoff = async (fn, maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;

        const delay = Math.min(1000 * 2 ** retries + Math.random() * 1000, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Select a conversation from history
  const handleSelectConversation = (conversation) => {
    // Load the conversation messages
    if (conversation.messages && conversation.messages.length) {
      setMessages(conversation.messages);
    } else {
      // Fallback if old format without nested messages
      setMessages([
        {
          text: '👋 Previous conversation',
          sender: 'ai',
          timestamp: conversation.timestamp,
        },
        {
          text: conversation.text,
          sender: 'user',
          timestamp: conversation.timestamp,
        },
      ]);
    }

    // Close history panel
    setShowHistory(false);
  };

  const handleSendMessage = async (voiceInput = null) => {
    const cleanInput = sanitizeInput(voiceInput || input);
    if (!cleanInput) return;

    const userMessage = {
      text: cleanInput,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    // Add to history
    addToHistory(userMessage);

    try {
      const response = await retryWithExponentialBackoff(() => getAIResponse(cleanInput));

      const aiMessage = {
        text: response,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Add AI response to history
      addToHistory(aiMessage);

      // Speak the response if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        speakText(response);
      }
    } catch (error) {
      console.error('Final error after retries:', error);
      const errorMsg = 'Service unavailable. Please try again later.';

      const errorMessage = {
        text: errorMsg,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setError('Service temporarily unavailable. Please try again later.');

      // Add error message to history
      addToHistory(errorMessage);

      // Speak error message if voice is enabled
      if (voiceEnabled) {
        speakText(errorMsg);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    const welcomeMsg =
      "👩‍🌾 Welcome to AgriAdvisor! I'm your virtual assistant for farmers. Ask me about:\n\n💰 Financing options\n📈 Improving your credit score\n🌱 Crop yield predictions\n🌦️ Weather forecasts\n\nHow can I assist you today?";

    setMessages([
      {
        text: welcomeMsg,
        sender: 'ai',
        timestamp: Date.now(),
      },
    ]);
    setError(null);

    // Speak welcome message
    if (voiceEnabled) {
      speakText(welcomeMsg);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setError('Connection restored. You can continue your consultation.');
      setTimeout(() => setError(null), 3000);
    };

    const handleOffline = () => {
      setError('Network connection lost. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load available voices when the component mounts
  useEffect(() => {
    const loadVoices = () => {
      synthRef.current.getVoices();
    };

    loadVoices();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // History Panel Component
  const HistoryPanel = ({ history, onSelectConversation, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter history based on search term
    const filteredHistory = history.filter((msg) =>
      msg.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group conversations by date
    const groupedHistory = filteredHistory.reduce((groups, message) => {
      const date = new Date(message.timestamp || Date.now()).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

    return (
      <div className="absolute top-0 left-0 w-80 h-full bg-gray-900 border-r border-gray-800 z-10 shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Conversation History</h2>
            <div className="flex gap-2">
              <button
                onClick={exportChatHistory}
                className="text-gray-400 hover:text-white"
                title="Export history"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                title="Close history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 rounded bg-gray-800 text-white border border-gray-700"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-2">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory).map(([date, messages]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs text-gray-400 px-2 py-1">{date}</h3>
                {messages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectConversation(message)}
                    className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors mb-1 text-sm truncate"
                  >
                    {message.text.substring(0, 60)}...
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <History className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
              {searchTerm && <p className="text-xs mt-1">Try a different search term</p>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Settings Panel Component
  const SettingsPanel = () => (
    <div className="absolute top-0 right-0 w-80 h-full bg-gray-900 border-l border-gray-800 z-10 shadow-lg">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-gray-400" />
            <span className="text-white">Dark Mode</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full ${
              darkMode ? 'bg-green-600' : 'bg-gray-700'
            } relative`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-white">Voice Output</span>
          </div>
          <button
            onClick={toggleVoiceOutput}
            className={`w-12 h-6 rounded-full ${
              voiceEnabled ? 'bg-green-600' : 'bg-gray-700'
            } relative`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                voiceEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              localStorage.removeItem('agriAdvisorHistory');
              setFullHistory([]);
              setShowSettings(false);
            }}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Message Bubble Component
  const MessageBubble = ({ message }) => {
    const isAI = message.sender === 'ai';
    const timestamp = message.timestamp ? new Date(message.timestamp) : new Date();
    const formattedTime = timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className={`flex items-start gap-3 mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
        <div
          className={`max-w-[85%] p-4 rounded-2xl ${
            isAI ? 'bg-gray-800 text-white border border-gray-700' : 'bg-green-600 text-white'
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm">{message.text}</pre>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedTime}
            </span>

            {isAI && voiceEnabled && (
              <button
                onClick={() => speakText(message.text)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                disabled={isSpeaking}
              >
                <Volume2 className="w-3 h-3" />
                <span>Listen</span>
              </button>
            )}
          </div>
        </div>
        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  };

  // Voice status indicator
  const VoiceStatus = () => {
    if (isListening) {
      return (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm animate-pulse">
          <Mic className="w-4 h-4" />
          <span>Listening...</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-2 mt-20 ${darkMode ? 'dark-theme' : 'light-theme'}`}
    >
      <div className="bg-gray-900 rounded-2xl shadow-md border border-gray-800 relative">
        <header className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-green-500" />
            AgriAdvisor
          </h1>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 py-1 px-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span>Clear conversation</span>
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`text-xs flex items-center gap-1 py-1 px-2 rounded-full transition-colors cursor-pointer ${
                  showHistory
                    ? 'text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-800/30'
                    : 'text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700'
                }`}
                title="View conversation history"
              >
                <History className="w-3 h-3" />
                <span>History</span>
              </button>

              <button
                onClick={toggleVoiceOutput}
                className={`text-xs flex items-center gap-1 py-1 px-2 rounded-full transition-colors cursor-pointer ${
                  voiceEnabled
                    ? 'text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-800/30'
                    : 'text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700'
                }`}
                title={voiceEnabled ? 'Voice output enabled' : 'Voice output disabled'}
              >
                {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>{voiceEnabled ? 'Voice on' : 'Voice off'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-xs flex items-center gap-1 py-1 px-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer text-gray-400 hover:text-gray-200"
                title="Settings"
              >
                <Settings className="w-3 h-3" />
                <span>Settings</span>
              </button>

              <button
                onClick={toggleListening}
                className={`text-xs flex items-center gap-1 py-1 px-2 rounded-full transition-colors cursor-pointer ${
                  isListening
                    ? 'text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-800/30'
                    : 'text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{isListening ? 'Stop' : 'Voice'}</span>
              </button>
            </div>
          </div>
        </header>

        {showHistory && (
          <HistoryPanel
            history={fullHistory}
            onSelectConversation={handleSelectConversation}
            onClose={() => setShowHistory(false)}
          />
        )}

        {showSettings && <SettingsPanel />}

        <div className="p-4 h-[calc(100vh-280px)] overflow-y-auto">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AgriAdvisor is typing...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about financing, credit scores, or farming techniques..."
              className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 resize-none"
              rows="2"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping || !input.trim()}
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <VoiceStatus />
      </div>
    </div>
  );
};

export default Ai;
