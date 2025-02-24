import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const AiAskModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const response = await fetch("https://snapzy-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (data?.response) {
        setResponse(data.response);
      } else {
        setResponse("Sorry, I couldn't process your question.");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("An error occurred while fetching the response.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4 text-white text-center">Ask AI</h2>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {/* Response Section */}
        {response && <p className="mt-4 text-gray-300">{response}</p>}
      </motion.div>
    </div>
  );
};

export default AiAskModal;
