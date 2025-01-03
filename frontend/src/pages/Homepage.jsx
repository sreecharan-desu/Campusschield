import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import { 
  User, Flag, Clock, MapPin, AlertCircle, 
  CheckCircle2, CircleDot, Circle,Badge,Video,Calendar,FileText,ChevronDown,ChevronUp
} from 'lucide-react';import { motion, AnimatePresence } from "framer-motion";
import {Card,CardHeader,CardTitle,CardContent} from '../components/ui/card';

const SirenButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dispersing, setDispersing] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const sirenAudioRef = useRef(null);
  const fadeOutIntervalRef = useRef(null);

  const playSirenSound = () => {
    if (!sirenAudioRef.current) {
      sirenAudioRef.current = new Audio("/siren.mp3");
      sirenAudioRef.current.loop = true; // Loop the siren sound
    }
    sirenAudioRef.current.volume = 1; // Set volume to maximum
    sirenAudioRef.current.play().catch((error) => {
      console.error("Error playing siren sound:", error);
    });
    setSirenActive(true);
  };

  const stopSirenSoundWithFadeOut = () => {
    if (sirenAudioRef.current) {
      let volume = sirenAudioRef.current.volume;
      fadeOutIntervalRef.current = setInterval(() => {
        if (volume > 0.1) {
          volume -= 0.1; // Decrease volume gradually
          sirenAudioRef.current.volume = Math.max(volume, 0);
        } else {
          clearInterval(fadeOutIntervalRef.current);
          sirenAudioRef.current.pause();
          sirenAudioRef.current.currentTime = 0; // Reset playback position
          setSirenActive(false);
        }
      }, 100); // Decrease volume every 100ms
    }
  };

  const handleSiren = async () => {
    try {
      const location = await fetch('https://ipapi.co/json/');
      console.log(location)
      if (!location.ok) {
          throw new Error('Failed to fetch location data');
      }
      const loc_data = await location.json();
      const { latitude, longitude } = loc_data;
      console.log(latitude, longitude)
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://campus-schield-backend-api.vercel.app/api/v1/user/sendsiren",        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : null,
          },
          body: JSON.stringify({
            title: "Emergency Alert",
            description: "Emergency assistance needed",
            location: {
              latitude: latitude,
              longitude: longitude,
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
        onClick={() => {
          if (sirenActive) {
            stopSirenSoundWithFadeOut();
          } else {
            playSirenSound();
            setShowPopup(true);
          }
        }}
        className={`fixed right-4 bottom-16 w-16 h-16 rounded-full ml-10 mb-10 ${
          sirenActive ? "bg-red-600" : "bg-gradient-to-br from-red-500 to-red-700"
        } flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:ring-4 focus:ring-red-300`}
        aria-label="Emergency Alert Button"
      >
        {sirenActive ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18v-6m6 6v-6" />
            <path d="M12 9v-3" />
            <path d="M5 12h14" />
            <path d="M5 12H4a1 1 0 01-1-1V9a3 3 0 013-3h10a3 3 0 013 3v2a1 1 0 01-1 1h-1" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        )}
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
                    onClick={() => {
                      setShowPopup(false);
                      stopSirenSoundWithFadeOut(); // Stop siren if canceled
                    }}
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
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) return setLoading(false);

      try {
        const response = await fetch(
          "https://campus-schield-backend-api.vercel.app/api/v1/user/getreports",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: user.username }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
          setFilteredReports(data.reports);
          setIsAuth(true);
          setUserName(user.username);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return "Good Morning";
      if (currentHour < 18) return "Good Afternoon";
      return "Good Evening";
    };
    fetchReports();
    setGreeting(determineGreeting());
  }, []);

  const handleSearch = () => {
    const filtered = reports.filter((report) => {
      const matchesSearch = report.Title.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
      const matchesStatus =
        filterStatus === "All" || report.Status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredReports(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterStatus]);

  return (
    <>
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white p-6 md:p-8 rounded-lg shadow-lg">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-2/3 bg-gray-300 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div>
          </div>
        ) : isAuth ? (
          <>
            <button
              className="absolute top-7 right-4 flex items-center justify-center h-12 w-12 bg-white text-purple-600 font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform"
              onClick={() => navigate("/profile")}
              title="View Profile"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/vite.svg"
                alt="Campus Shield Logo"
                className="h-10 w-10 rounded-full shadow-md"
              />
              <h1 className="text-2xl font-bold leading-tight w-1/2">{`${greeting}, ${userName}!`}</h1>
            </div>
            <p className="text-sm md:text-base text-purple-200">
              Here's your activity overview. Stay updated and safe!
            </p>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Campus Shield</h1>
            <p className="text-base text-purple-200 mb-6">
              "Make every day a step closer to a safer and more secure campus. Your journey begins here."
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/signin")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {
        !isAuth ? <>

<div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
  {/* Hero Section */}
  <div className="m-8">
    <img src='/image1.webp' alt="CampusShield Hero" className="w-full h-auto rounded-xl shadow-lg" />
  </div>
  <p className="text-gray-600 mb-8 mt-8 italic font-semibold text-lg max-w-3xl mx-auto">
    CampusShield is your companion for a secure and informed campus life. 
    Easily report incidents, stay updated on safety issues, and access 
    essential resources — all in one place.
  </p>

  {/* Features Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
      <div className="w-24 h-24 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="animate-bounce" width="100%" height="100%">
          <rect x="10" y="5" width="44" height="54" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
          <rect x="16" y="12" width="32" height="4" fill="#6b7280" />
          <rect x="16" y="20" width="28" height="3" fill="#9ca3af" />
          <rect x="16" y="26" width="20" height="3" fill="#9ca3af" />
          <rect x="16" y="32" width="24" height="3" fill="#9ca3af" />
          <path d="M42 42L54 54L47 61L35 49Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <path d="M54 54L57 57" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 49L42 42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-indigo-600 mb-2 italic">
        Report Incidents
      </h3>
      <p className="text-sm text-gray-600 italic">
        Quickly report incidents and ensure campus safety with ease.
      </p>
    </div>

    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
      <div className="w-24 h-24 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="animate-pulse" width="100%" height="100%">
          <path d="M32 8C23.2 8 16 15.2 16 24V38H12C10.8 38 10 38.8 10 40C10 41.2 10.8 42 12 42H20C20 46.4 24.6 50 32 50C39.4 50 44 46.4 44 42H52C53.2 42 54 41.2 54 40C54 38.8 53.2 38 52 38H48V24C48 15.2 40.8 8 32 8Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="32" cy="52" r="4" fill="#f59e0b" />
          <circle cx="46" cy="18" r="5" fill="#ef4444" />
          <path d="M24 38H40V24C40 16.8 34.2 12 32 12C29.8 12 24 16.8 24 24V38Z" fill="rgba(255, 255, 255, 0.3)" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-indigo-600 mb-2 italic">
        Real-Time Updates
      </h3>
      <p className="text-sm text-gray-600 italic">
        Get real-time updates on campus events and safety alerts.
      </p>
    </div>

    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
      <div className="w-24 h-24 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
          <path d="M12 8H44C48.4 8 52 11.6 52 16V48C52 52.4 48.4 56 44 56H12C9.8 56 8 54.2 8 52V12C8 9.8 9.8 8 12 8Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
          <path d="M16 12H40V48H16C14.8 48 14 47.2 14 46V14C14 12.8 14.8 12 16 12Z" fill="#ffffff" />
          <path d="M28 12H40V24L34 20L28 24V12Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <path d="M44 56H12C9.8 56 8 54.2 8 52C10.2 54.2 12.6 54 12.6 54H44C46.2 54 48 52.2 48 50V48C48 50.2 46.4 56 44 56Z" fill="rgba(0, 0, 0, 0.1)" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-indigo-600 mb-2 italic">
        Access Resources
      </h3>
      <p className="text-sm text-gray-600 italic">
        Find essential resources and contacts at your fingertips.
      </p>
    </div>
  </div>

  {/* Call to Action */}
  <button
    onClick={() => navigate('/signin')}
    className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
  >
    Sign In to Get Started
  </button>
</div>

        
        </> : <>
        
        {isAuth && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search reports..."
              className="p-2 border rounded-lg w-full"
              value={searchTerm}
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
            <div className="animate-pulse">Loading...</div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-8">No matching reports found.</div>
          )}
        </div>
      )}
        
        </>
      }


      <SirenButton/>
      <div className="mt-32">
        <BottomNavbar />
      </div>
    </>
  );

};


export default Homepage;


// import { 
//   MapPin, Clock, User, AlertCircle, FileText, 
//   Video, Image, Audio, ChevronDown, ChevronUp,
//   Flag, Calendar
// } from 'lucide-react';

const ReportCard = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    "Pending": 'bg-yellow-100 text-yellow-800 border-yellow-200',
    "Resolved": 'bg-green-100 text-green-800 border-green-200',
    "Default": 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getStatusColor = (status) => statusColors[status] || statusColors.Default;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const steps = [
    { done: true, label: 'Reported' },
    { done: report.Status !== 'Pending', label: 'In Review' },
    { done: report.Status === 'Resolved', label: 'Resolved' }
  ];

  const mediaItems = [
    { type: 'Video', link: report.VideoLink, icon: Video },
    { type: 'Image', link: report.ImageLink, icon: Image },
    { type: 'Audio', link: report.AudioLink, icon: Audio }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">
              {report.Title}
            </h3>
            <p className="text-xs text-gray-500">
              Case ID: #{report._id.slice(-8)}
            </p>
          </div>
          <Badge className={`${getStatusColor(report.Status)} px-2 py-1`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {report.Status}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-1 mt-3">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={`h-1 flex-1 rounded transition-colors ${
                step.done ? 'bg-green-500' : 'bg-gray-200'
              }`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${
                step.done ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {step.done && (
                  <div className="absolute w-2 h-2 rounded-full animate-ping bg-green-500 opacity-75" />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Essential Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoItem icon={Clock} label="Incident Time" value={formatDate(report.Time)} />
          <InfoItem icon={Calendar} label="Reported On" value={formatDate(report.createdAt)} />
          <InfoItem icon={User} label="Reported To" value={report.WhomToReport} />
          <InfoItem icon={Flag} label="Harasser Details" value={report.HarasserDetails} />
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <FileText className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Description</span>
          </div>
          <p className="text-sm text-gray-600 ml-6">
            {report.Description}
          </p>
        </div>

        {/* Location Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Harassment Location:</span>
            <span className="text-sm text-gray-600">{report.h_location}</span>
          </div>
          <a
            href={`https://www.google.com/maps?q=${report.Location.latitude},${report.Location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-500 hover:underline ml-6"
          >
            <MapPin className="w-4 h-4 mr-1" />
            View Live Location ({report.Location.latitude}, {report.Location.longitude})
          </a>
        </div>
      </div>
    </Card>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <Icon className="w-4 h-4 text-gray-500 mt-0.5" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  </div>
);

