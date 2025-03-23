import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <MessageSquare className="h-16 w-16 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to AskMore
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your AI-powered chatbot assistant. Get answers to your questions
            instantly.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
