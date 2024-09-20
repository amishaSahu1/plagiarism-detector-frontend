/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast, { Toaster } from "react-hot-toast";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [plagiarismAnalysis, setPlagiarismAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3008/api/v1/upload-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Set document text and plagiarism analysis
      setMessage(response?.data?.message);
      setSuccess(response?.data?.success);
      setDocumentText(response?.data?.data?.DocumentText);
      setPlagiarismAnalysis(response?.data?.data?.plagiarismAnalysis);
    } catch (err) {
      setError("Failed to upload document or analyze plagiarism.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(message);
      setTimeout(() => {
        setMessage("");
        setSuccess(false);
        setSelectedFile(null);
      }, 5000);
    }

    if (error) {
      toast.error(error);
      setTimeout(() => {
        setError("");
        setSelectedFile(null);
      }, 5000);
    }

    setIsLoading(false);
  }, [success, error, message]);

  return (
    <div className="container w-full mx-auto p-4  rounded lg:max-w-9/12 md:max-w-5/6 sm:w-full">
      <div className="mb-6 border border-gray-500 p-4 rounded-lg bg-slate-950 w-full">
        <h1 className="text-2xl font-bold mb-4">Plagiarism Analysis</h1>

        {/* Form for Uploading Document */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            accept="application/pdf"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          >
            Upload
          </button>

          {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        </form>
      </div>
      {/* Loading Indicator */}
      {isLoading && <p className="text-gray-500">Analyzing document...</p>}

      {/* Display Results */}
      <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
        {/* Document Text */}
        {documentText && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Extracted Document Text
            </h2>
            <div className="px-8 bg-slate-950 rounded shadow h-80 overflow-y-auto border border-gray-500">
              <pre className="whitespace-pre-wrap text-left">
                {documentText}
              </pre>
            </div>
          </div>
        )}

        {/* Display plagiarism analysis with syntax highlighting */}
        {plagiarismAnalysis && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Plagiarism Analysis</h2>
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              className="p-4 bg-slate-950 rounded shadow h-80 border border-gray-500"
              wrapLongLines
            >
              {plagiarismAnalysis
                .trim()
                .replace(/^```json/, "")
                .replace(/```$/, "")}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
