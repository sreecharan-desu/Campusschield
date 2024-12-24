import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import { FaMapMarkerAlt, FaUser, FaClock, FaFlag } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";

const SirenButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dispersing, setDispersing] = useState(false);

  const handleSiren = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/v1/user/sendsiren",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : null,
          },
          body: JSON.stringify({
            title: "Emergency Alert",
            description: "Emergency assistance needed",
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send emergency alert");

      const data = await response.json();
      if (data.success) {
        setDispersing(true);
        setTimeout(() => {
          setShowPopup(false);
          setDispersing(false);
          toast.success("Emergency alert sent successfully");
        }, 1000); // Match dispersing animation duration
      }
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast.error("Failed to send emergency alert. Please try again.");
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setShowPopup(true)}
        className="fixed left-1/2 -translate-x-1/2 bottom-16 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Emergency Alert Button"
      >
        <span className="text-white text-3xl">🚨</span>
      </motion.button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            {dispersing ? (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1 }}
                className="bg-green-500 text-white font-bold rounded-full w-20 h-20 flex items-center justify-center"
              >
                ✅
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg w-11/12 max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <h2 className="text-lg font-bold text-center text-red-600 mb-4">
                  Confirm Emergency Alert
                </h2>
                <p className="text-gray-700 text-center mb-6">
                  Notify campus security and authorities. Are you sure?
                </p>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleSiren}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Send Alert
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const Homepage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [reports, setReports] = useState([]);
  const [displayedReports, setDisplayedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showAllReports, setShowAllReports] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) return;

      try {
        const response = await fetch(
          'https://campus-schield-backend-api.vercel.app/api/v1/user/getreports',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
          setDisplayedReports(data.reports.slice(0, 2));
          setIsAuth(true);
          setUserName(user.username);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return 'Good Morning';
      if (currentHour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };

    fetchReports();
    setGreeting(determineGreeting());
  }, []);

  const handleViewMore = () => {
    setDisplayedReports(reports);
    setShowAllReports(true);
  };

  const filteredReports = displayedReports.filter((report) => {
    return (
      report.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'All' || report.Status === filterStatus)
    );
  });

  return (
    <>
      <div className="bg-gradient-to-br from-blue-200 via-black to-white text-white p-6 flex items-center justify-between shadow-lg">
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-5 w-40 bg-white/40 rounded"></div>
              <div className="h-4 w-28 bg-white/30 rounded mt-2"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">{`${greeting}, ${userName || 'User'}!`}</h1>
              <p className="text-sm">{isAuth ? "Here's your activity overview." : 'Secure your campus by reporting incidents.'}</p>
            </>
          )}
        </div>
        <div className="flex items-center">
          <button
            className="relative flex items-center justify-center bg-white text-blue-600 font-bold h-12 w-12 rounded-full border-2 border-white shadow-md"
            onClick={() => navigate('/profile')}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search reports..."
            className="p-2 border rounded-lg w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg ml-4"
            disabled={loading}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md animate-pulse"
              >
                <div className="h-5 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {isAuth && filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReports.map((report) => (
                            <ReportCard key={report._id} report={report} />
                ))}
              </div>
            ) : (
              <div className="text-center mt-8">
                <p className="text-gray-500">No reports available. Create one to get started!</p>
                <button
                  onClick={() => navigate('/create-report')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Report
                </button>
              </div>
            )}
          </>
        )}

        {!showAllReports && reports.length > 2 && !loading && (
            <div className="flex justify-center mt-6 mb-12">
  <button
    onClick={handleViewMore}
    className="px-8 py-3 bg-transparent text-gray-700 font-medium rounded-full border border-gray-400 shadow-sm hover:bg-gray-100 hover:shadow-md flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1 focus:ring-2 focus:ring-gray-300 focus:outline-none"
  >
    <span>View More</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</div>


        )}
      </div>

      <div className="mt-96">
        <SirenButton />
        <BottomNavbar />
      </div>
    </>
  );
};

export default Homepage;


const ReportCard = ({ report }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    return (
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 w-full hover:shadow-md transition-shadow">
        {/* Title and Status */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800 truncate">{report.Title}</h3>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-medium ${
              report.Status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {report.Status}
          </span>
        </div>
  
        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 truncate">{report.Description}</p>
  
        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-800">
            <FaUser className="mr-1.5 text-gray-500" />
            <span>
              <strong>Harasser:</strong> {report.HarasserDetails}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-800">
            <FaFlag className="mr-1.5 text-gray-500" />
            <span>
              <strong>Reported To:</strong> {report.WhomToReport}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-800">
            <FaClock className="mr-1.5 text-gray-500" />
            <span>
              <strong>Time:</strong>{" "}
              {new Date(report.Time).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-800">
            <FaMapMarkerAlt className="mr-1.5 text-gray-500" />
            <span>
              <strong>Location:</strong>{" "}
              <a
                href={`https://www.google.com/maps?q=${report.Location.latitude},${report.Location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {report.Location.latitude}, {report.Location.longitude}
              </a>
            </span>
          </div>
        </div>
  
        {/* User Email */}
        <div className="text-sm text-gray-600 mt-3">
          {user?.college_email ? (
            <span>
              Updates will be sent to{" "}
              <span className="font-medium text-gray-800">{user.college_email}</span>.
            </span>
          ) : (
            <span className="text-red-500">User email not available.</span>
          )}
        </div>
      </div>
    );
  };
  