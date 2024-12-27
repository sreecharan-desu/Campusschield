import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Edit2, Save, X, User, Heart, Building,
    UserPlus, Shield,
    PhoneIcon,
    LogOutIcon
} from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';

const MobileDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const initializeEditData = (user) => ({
      username: user.username || '',
      password: '',
      personal_email: user.personal_email || '',
      college_email: user.college_email || '',
      phone: user.phone || '',
      address: user.address || '',
      college_name: user.college || '',
      course: user.course || '',
      year: user.year || '',
      blood_group: user.blood_group || '',
      medical_conditions: user.medical_conditions || '',
      allergies: user.allergies || '',
      medications: user.medications || '',
      emergency_contacts: user.emergency_contact || [{
          name: '',
          phone: '',
          relation: ''
      }],
      authorities_detail: user.authorities_detail || {
          name: '',
          phone: '',
          address: '',
          email: '',
          type: ''
      }
  });
    // Fetch Reports
    const fetchReports = async (username, token) => {
        try {
            const response = await fetch(
                'https://campus-schield-backend-api.vercel.app/api/v1/user/getreports',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ username }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setReports(data.reports || []);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    // Profile Update Handler
    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Clean up data before sending
            const cleanedData = {
                ...editedData,
                emergency_contacts: editedData.emergency_contacts.filter(
                    contact => contact.name || contact.phone || contact.relation
                )
            };

            if (!cleanedData.password) {
                delete cleanedData.password;
            }

            const response = await fetch(
                'https://campus-schield-backend-api.vercel.app/api/v1/user/updateprofile',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(cleanedData),
                }
            );

            const data = await response.json();

            if (data.success) {
                setUpdateStatus({ type: 'success', message: data.msg + "Please signin again for authentication.(To prove its you)"});
                                setTimeout(()=>{
                  setUpdateStatus({ type: '', message: '' })
                },2000)
                if (data.user) {
                    setUserData(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                setIsEditing(false);
                
                if (data.msg.includes('updated')) {
                    setTimeout(()=>{
                        setUpdateStatus({ type: 'success', message: 'Please signin again for authentication.(To prove its you)' })
                      },2000)
                    setTimeout(() => handleLogout(), 2000);
                }
            } else {
                if(data.error.includes("Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: CampusSchieldAPI.users index: CollegeEmail_1 dup key:")){
                    setUpdateStatus({ type: 'error', message: `The email id you are trying to use has already taken by someone please use another email.`});
                    setTimeout(()=>{
                        setUpdateStatus({ type: '', message: '' })
                      },2000)
                }else{
                setUpdateStatus({ type: 'error', message: data.msg });
                setTimeout(()=>{
                  setUpdateStatus({ type: '', message: '' })
                },2000)}
            }


            // try {
            //     const response = await axios.get('https://campus-schield-backend-api.vercel.app/api/v1/user/details');
            //     if (response.data.success) {
            //         localStorage.setItem('user', JSON.stringify(response.data.user));
            //         navigate('/');
            //     } else {
            //         setUpdateStatus({type : response.data.success,message : response.data.msg});
            //         setTimeout(() => setUpdateStatus(''), 3000);
            //     }
            // } catch (error) {
            //     console.log('API Error:', error);
            // } 
     
        } catch (error) {
            console.log(error)
            setUpdateStatus({ type: 'error', message: 'Failed to update profile' });
            setTimeout(()=>{
              setUpdateStatus({ type: '', message: '' })
            },2000)
        }
    };

  

    // Emergency Contact Handlers
    const handleAddEmergencyContact = () => {
        setEditedData({
            ...editedData,
            emergency_contacts: [
                ...editedData.emergency_contacts,
                { name: '', phone: '', relation: '' }
            ]
        });
    };

    const handleEmergencyContactChange = (index, field, value) => {
        const newContacts = editedData.emergency_contacts.map((contact, i) => 
            i === index ? { ...contact, [field]: value } : contact
        );
        setEditedData({ ...editedData, emergency_contacts: newContacts });
    };

    const handleRemoveEmergencyContact = (index) => {
        setEditedData({
            ...editedData,
            emergency_contacts: editedData.emergency_contacts.filter((_, i) => i !== index)
        });
    };

    // Authentication Handlers
    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin');
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            setUserData(user);
            setEditedData(initializeEditData(user));
            fetchReports(user.username, token);
        } else {
            setLoading(false);
        }
    }, []);

    const computeStats = () => ({
        totalReports: reports.length,
        pendingReports: reports.filter((r) => r.Status === 'Pending').length,
        resolvedReports: reports.filter((r) => r.Status === 'Resolved').length,
    });

    // UI Components
    const renderProfileSection = () => (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-b-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="-mt-14 w-16 h-16 rounded-full bg-white text-indigo-500 flex items-center justify-center font-bold text-2xl shadow-md">
                        {userData.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{userData.username}</h2>
                        <p className="text-sm opacity-90">{userData.college_email}</p>
                        <p className="text-xs opacity-75">{userData.college}</p>
                        <button
    onClick={handleLogout}
    className="px-1 py-2 mt-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg focus:ring-2 focus:ring-red-300 transition duration-300 flex items-center gap-2"
>
    <LogOutIcon className="w-5 h-5" />
    <span>Logout</span>
</button>
                    </div>
                 

                </div>
                <div className="flex gap-2">
                    {!isEditing ? (<>
    <div className="flex flex-col items-center space-y-4 p-4 sm:space-y-6 sm:p-6">
        <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 sm:p-5 sm:text-lg"
            aria-label="Edit profile"
            title="Edit your profile"
        >
            <Edit2 size={28} className="sm:w-8 sm:h-8" />
        </button>
        <p className="text-xs text-gray-600 bg-gray-100 p-3 rounded-lg shadow-md border border-gray-200 max-w-xs text-center sm:text-sm sm:max-w-md sm:p-4">
            <strong>Note:</strong> On updating your profile, you need to sign in again for authentication.
        </p>
    </div>
</>

) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdateProfile}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                            >
                                <Save size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedData(initializeEditData(userData));
                                }}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSection = (title, icon, fields, color) => (
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="space-y-3">
                {fields.map((field) => (
                    <div key={field.key} className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">
                            {field.label}
                        </label>
                        {isEditing ? (
                            <input
                                type={field.type}
                                value={editedData[field.key] || ''}
                                onChange={(e) => setEditedData({
                                    ...editedData,
                                    [field.key]: e.target.value
                                })}
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                        ) : (
                            <p className="text-gray-800 p-2 bg-gray-50 rounded-lg">
                                {userData[field.key] || '-'}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEmergencyContacts = () => (
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                        <UserPlus className="text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                </div>
                {isEditing && (
                    <button
                        onClick={handleAddEmergencyContact}
                        className="text-purple-500 hover:text-purple-700 font-medium"
                    >
                        Add Contact
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {editedData.emergency_contacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2 bg-gray-50">
                        {isEditing ? (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-purple-500">
                                        Contact {index + 1}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveEmergencyContact(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={contact.Name}
                                    onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={contact.Phone}
                                    onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Relationship"
                                    value={contact.Relationship}
                                    onChange={(e) => handleEmergencyContactChange(index, 'relation', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </>
                        ) : (
                          <>
                          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                              <div className="text-sm text-purple-500 font-semibold mb-2">
                                  ID: {contact._id}
                              </div>
                              <div className="font-bold text-lg text-gray-800 mb-1">
                                  {contact.Name || 'Not specified'}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                  {contact.Phone ? (
                                      <>
                                          <a
                                              href={`tel:${contact.Phone}`}
                                              className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 shadow-md hover:bg-green-600 transition"
                                          >
                                              <PhoneIcon className="h-5 w-5" />
                                          </a>
                                          <span>{contact.Phone}</span>
                                      </>
                                  ) : (
                                      'No phone'
                                  )}
                              </div>
                              <div className="text-sm text-purple-500">
                                  Relationship: {contact.Relationship || 'No relation specified'}
                              </div>
                          </div>
                      </>
                      
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAuthoritiesDetails = () => (
      <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-orange-100">
                  <Shield className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold">Authority Details</h3>
          </div>
          <div className="space-y-3">
              {isEditing ? (
                  <>
                      <input
                          type="text"
                          placeholder="Authority Name"
                          value={editedData.authorities_detail.Name}
                          onChange={(e) => setEditedData({
                              ...editedData,
                              authorities_detail: {
                                  ...editedData.authorities_detail,
                                  name: e.target.value
                              }
                          })}
                          className="w-full p-2 border rounded mb-2"
                      />
                      <input
                          type="tel"
                          placeholder="Authority Phone"
                          value={editedData.authorities_detail.Phone}
                          onChange={(e) => setEditedData({
                              ...editedData,
                              authorities_detail: {
                                  ...editedData.authorities_detail,
                                  phone: e.target.value
                              }
                          })}
                          className="w-full p-2 border rounded mb-2"
                      />
                      <input
                          type="text"
                          placeholder="Authority Address"
                          value={editedData.authorities_detail.Address}
                          onChange={(e) => setEditedData({
                              ...editedData,
                              authorities_detail: {
                                  ...editedData.authorities_detail,
                                  address: e.target.value
                              }
                          })}
                          className="w-full p-2 border rounded mb-2"
                      />
                      <input
                          type="email"
                          placeholder="Authority Email"
                          value={editedData.authorities_detail.Email}
                          onChange={(e) => setEditedData({
                              ...editedData,
                              authorities_detail: {
                                  ...editedData.authorities_detail,
                                  email: e.target.value
                              }
                          })}
                          className="w-full p-2 border rounded mb-2"
                      />
                      <select
                          value={editedData.authorities_detail.Type}
                          onChange={(e) => setEditedData({
                              ...editedData,
                              authorities_detail: {
                                  ...editedData.authorities_detail,
                                  type: e.target.value
                              }
                          })}
                          className="w-full p-2 border rounded"
                      >
                          <option value="">Select Authority Type</option>
                          <option value="Police">Police</option>
                          <option value="Campus Security">Campus Security</option>
                          <option value="Medical">Medical</option>
                          <option value="Other">Other</option>
                      </select>
                  </>
              ) : (
                  <div className="space-y-2">
                      <p className="font-medium">
                          {userData.authorities_detail?.Name || 'Not specified'}
                      </p>
                      <>
    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            {userData.authorities_detail?.Phone ? (
                <>
                    <a
                        href={`tel:${userData.authorities_detail?.Phone}`}
                        className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 shadow-md hover:bg-green-600 transition"
                    >
                        <PhoneIcon className="h-5 w-5" />
                    </a>
                    <span>{userData.authorities_detail?.Phone}</span>
                </>
            ) : (
                'No phone'
            )}
        </div>
    </div>
</>

                      <p className="text-sm text-gray-600">
                          {userData.authorities_detail?.Email || 'No email'}
                      </p>
                      <p className="text-sm text-gray-600">
                          {userData.authorities_detail?.Address || 'No address'}
                      </p>
                      <p className="text-sm text-orange-500">
                          {userData.authorities_detail?.Type || 'No type specified'}
                      </p>
                  </div>
              )}
          </div>
      </div>
  );
  

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-b-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-6 bg-gray-300 rounded"></div>
                            <div className="w-48 h-4 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="text-center mb-8 space-y-4">
                    <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-indigo-600">Welcome to Campus Shield</h1>
                    <p className="text-lg text-gray-600">
                        Secure your campus. Report incidents. Stay safe.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/signin')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    Sign In to Explore
                </button>
            </div>
        );
    }

    const { totalReports, pendingReports, resolvedReports } = computeStats();

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
            {/* Status Message */}
            {updateStatus.message && (
                <div className={`fixed top-0 left-0 right-0 p-4 text-center text-white z-50 ${
                    updateStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {updateStatus.message}
                </div>
            )}

            {/* Profile Section */}
            {renderProfileSection()}

            {/* Stats Section */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Report Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                    <StatCard
                        icon="📊"
                        label="Total Reports"
                        value={totalReports}
                        bg="bg-indigo-100"
                        textColor="text-indigo-600"
                    />
                    <StatCard
                        icon="⏳"
                        label="Pending Reports"
                        value={pendingReports}
                        bg="bg-yellow-100"
                        textColor="text-yellow-600"
                    />
                    <StatCard
                        icon="✅"
                        label="Resolved Reports"
                        value={resolvedReports}
                        bg="bg-green-100"
                        textColor="text-green-600"
                    />
                </div>
            </div>

            {/* Editable Sections */}
            <div className="p-4 space-y-6">
                {renderSection(
                    'Personal Details',
                    <User size={20} className="text-indigo-500" />,
                    [
                        { label: 'Username', key: 'username', type: 'text' },
                        { label: 'Personal Email', key: 'personal_email', type: 'email' },
                        { label: 'College Email', key: 'college_email', type: 'email' },
                        { label: 'Phone', key: 'phone', type: 'tel' },
                        { label: 'Address', key: 'address', type: 'text' },
                    ],
                    'bg-indigo-100'
                )}
                {renderSection(
                    'College Information',
                    <Building size={20} className="text-blue-500" />,
                    [
                        { label: 'College Name', key: 'college', type: 'text' },
                        { label: 'Course', key: 'course', type: 'text' },
                        { label: 'Year', key: 'year', type: 'text' },
                    ],
                    'bg-blue-100'
                )}
                {renderSection(
                    'Medical Information',
                    <Heart size={20} className="text-red-500" />,
                    [
                        { label: 'Blood Group', key: 'blood_group', type: 'text' },
                        { label: 'Medical Conditions', key: 'medical_conditions', type: 'text' },
                        { label: 'Allergies', key: 'allergies', type: 'text' },
                        { label: 'Medications', key: 'medications', type: 'text' },
                    ],
                    'bg-red-100'
                )}


{renderSection(
                'Personal Details',
                <User size={20} className="text-indigo-500" />,
                [
                    { label: 'Username', key: 'username', type: 'text' },
                    { label: 'Password', key: 'password', type: 'password' },
                    { label: 'Personal Email', key: 'personal_email', type: 'email' },
                    { label: 'College Email', key: 'college_email', type: 'email' },
                    { label: 'Phone', key: 'phone', type: 'tel' },
                    { label: 'Address', key: 'address', type: 'text' },
                ],
                'bg-indigo-100'
            )}

                {renderEmergencyContacts()}
                {renderAuthoritiesDetails()}

            </div>

            {/* Bottom Navigation */}
            <BottomNavbar />
        </div>
    );
};

// StatCard Component
// eslint-disable-next-line react/prop-types
const StatCard = ({ label, value, bg, textColor }) => (
    <div className={`p-4 rounded-lg shadow-sm ${bg}  text-center`}>
        <div className="flex items-center justify-center">
            {/* <span className={`text-xl font-bold ${textColor}`}>{icon}</span> */}
            <span className="text-2xl font-semibold text-center">{value}</span>
        </div>
        <p className={`text-sm mt-2 font-medium ${textColor}`}>{label}</p>
    </div>
);

export default MobileDashboard;
