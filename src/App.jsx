import UploadForm from "./components/UploadForm";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-slate-900 min-h-screen container text-white">
      <UploadForm />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
