import React, { useState } from 'react';
import { Phone, BookOpen, Video, Heart, Share, Home, Search, Menu, Clock, ExternalLink, Eye, ThumbsUp } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';

const Support = () => {
  const [activeTab, setActiveTab] = useState("Emergency");

  const emergencyContacts = [
    { name: 'National Women Helpline', number: '1091', description: 'Immediate assistance for women in distress', category: 'Emergency', icon: '🆘' },
    { name: 'National Commission for Women', number: '7827170170', description: '24x7 helpline for issues related to violence against women', category: 'Emergency', icon: '♀️' },
    { name: 'Women Helpline (Domestic Abuse)', number: '181', description: 'Support for women facing domestic violence', category: 'Emergency', icon: '🏠' },
    { name: 'Akancha Against Harassment', number: '9152987821', description: 'Support for cyber harassment victims', category: 'Cyber Safety', icon: '💻' },
    { name: 'Central Social Welfare Board - Police Helpline', number: '1091', description: 'Assistance for women in distress', category: 'Emergency', icon: '🚨' },
    { name: 'Delhi Commission for Women', number: '181', description: 'Helpline for women in Delhi facing harassment or violence', category: 'Emergency', icon: '🏢' },
    { name: 'Mumbai Police Women Helpline', number: '103', description: 'Helpline for women in Mumbai facing harassment or violence', category: 'Emergency', icon: '🏙️' },
    { name: 'Bihar Women Helpline', number: '18003456247', description: 'Support for women in distress in Bihar', category: 'Emergency', icon: '📞' },
    { name: 'Assam Women Helpline', number: '181', description: 'Support for women in distress in Assam', category: 'Emergency', icon: '📞' },
    { name: 'Haryana Women Helpline', number: '1091', description: 'Support for women in distress in Haryana', category: 'Emergency', icon: '📞' }
  ];
  

  const articles = [
    {
      title: "Safety Tips for Single Women Living Alone",
      description: "Essential safety tips for women living alone to ensure personal security.",
      readTime: "7 min",
      category: "Safety",
      image: "https://www.smartlocksguide.com/wp-content/uploads/2020/07/safety-tips-for-a-woman-living-alone.jpg",
      views: 850,
      link: "https://reolink.com/blog/safety-tips-for-single-women-living-alone/"
    },
    {
      title: "Violence Against Women: General Safety Tips",
      description: "Safety tips to prevent violence against women and how to stay safe.",
      readTime: "6 min",
      category: "Safety",
      image: "https://www.placer.ca.gov/DocumentCenter/View/8848/Violence-against-women-general-safety-tips-PDF",
      views: 920,
      link: "https://www.placer.ca.gov/8848/Violence-against-women-general-safety-ti"
    },
    {
      title: "Paladin Security: Safety Tips for Women",
      description: "A comprehensive list of safety tips for women to ensure their well-being.",
      readTime: "4 min",
      category: "Safety",
      image: "https://paladinsecurity.com/wp-content/uploads/2018/06/Paladin-Security-Women-Safety-Tips.jpg",
      views: 1100,
      link: "https://paladinsecurity.com/safety-tips/for-women/"
    },
    {
      title: "Self Rules for Being Safe as a Woman in India",
      description: "Personal safety rules for women to follow in daily life in India.",
      readTime: "5 min",
      category: "Safety",
      image: "https://www.quora.com/What-are-your-self-rules-for-being-safe-as-a-woman-in-India",
      views: 1450,
      link: "https://www.quora.com/What-are-your-self-rules-for-being-safe-as-a-woman-in-India"
    },
    {
      title: "Awareness of Safety Measures for Teen Girls and Women",
      description: "Awareness guide for young women and teenage girls to ensure personal safety.",
      readTime: "6 min",
      category: "Safety",
      image: "https://bewitness.world/wp-content/uploads/2020/11/Teen-Girls-Safety.jpg",
      views: 890,
      link: "https://bewitness.world/awareness-of-safety-measures-for-teen-girls-and-women/"
    },
    {
      title: "Women's Safety in India",
      description: "Guidance on improving women's safety in India and steps to take for personal security.",
      readTime: "5 min",
      category: "Safety",
      image: "https://www.goaid.in/wp-content/uploads/2020/11/Women-Safety-India.jpg",
      views: 960,
      link: "https://www.goaid.in/women-safety-in-india/"
    },
    {
      title: "The Growing Need for Women’s Safety in India",
      description: "An exploration of the growing importance of women's safety and the challenges they face.",
      readTime: "6 min",
      category: "Safety",
      image: "https://zhl.org.in/wp-content/uploads/2020/11/Women-Safety-India.jpg",
      views: 1020,
      link: "https://zhl.org.in/blog/growing-need-women-safety-india/"
    },
    {
      title: "A Guide to Women’s Safety in India",
      description: "A comprehensive guide to women's safety measures and precautions in India.",
      readTime: "5 min",
      category: "Safety",
      image: "https://hashtagmagazine.in/wp-content/uploads/2020/11/Women-Safety-India.jpg",
      views: 1150,
      link: "https://hashtagmagazine.in/a-guide-to-womens-safety-in-india/"
    },
    {
      title: "Top 10 Safety Measures for Women",
      description: "10 essential safety measures that must be implemented to ensure women's safety.",
      readTime: "7 min",
      category: "Safety",
      image: "https://bpac.in/wp-content/uploads/2020/11/Women-Safety-Measures.jpg",
      views: 1300,
      link: "https://bpac.in/top-10-safety-measures-which-must-be-implemented-for-women/"
    },
    {
      title: "10 Safety Tips for Women Traveling in India",
      description: "Important safety tips for women traveling in India to ensure a safe journey.",
      readTime: "6 min",
      category: "Travel Safety",
      image: "https://www.transitionsabroad.com/wp-content/uploads/2020/11/Women-Travel-Safety-India.jpg",
      views: 1400,
      link: "https://www.transitionsabroad.com/listings/travel/women/articles/10-safety-tips-women-in-india.shtml"
    }
  ];

  const videos = [
    {
      title: "Self-Defense Basics",
      description: "Learn fundamental self-defense moves.",
      duration: "5:30",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/KVpxP3ZZtAc",
      views: 15000
    },
    {
      title: "Self Defence for Women - The Most Effective Techniques",
      description: "Effective self-defense techniques tailored for women.",
      duration: "10:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/WCn4GBcs84s",
      views: 12000
    },
    {
      title: "8 Self-Defense Techniques Every Woman Should Know",
      description: "Essential self-defense techniques for women.",
      duration: "8:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/SSnnte5cVIo",
      views: 18000
    },
    {
      title: "Most Common Women's Self-Defense - Krav Maga for Beginners",
      description: "Introduction to Krav Maga techniques for women's self-defense.",
      duration: "12:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/R_IVjAvnEZc",
      views: 15000
    },
    {
      title: "The REALITY of WOMEN'S SELF DEFENSE",
      description: "Understanding the realities of women's self-defense.",
      duration: "7:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/SZ816eIMd0w",
      views: 13000
    },
    {
      title: "Self-Defense Moves Every Woman Should Know",
      description: "Key self-defense moves for women.",
      duration: "9:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/KVpxP3ZZtAc",
      views: 16000
    },
    {
      title: "Self-Defense Techniques for Women",
      description: "Practical self-defense techniques for women.",
      duration: "11:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/WCn4GBcs84s",
      views: 14000
    },
    {
      title: "Self-Defense Tips for Women",
      description: "Important self-defense tips for women.",
      duration: "10:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/SSnnte5cVIo",
      views: 11000
    },
    {
      title: "Krav Maga Self-Defense for Women",
      description: "Krav Maga self-defense techniques for women.",
      duration: "13:00",
      category: "Self Defense",
      link: "https://www.youtube.com/embed/R_IVjAvnEZc",
      views: 17000
    }
  ];
  

  const renderArticles = () => (
    <div className="space-y-4 px-4">
      {articles.map((article, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{article.category}</span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {article.views}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{article.description}</p>
            <div className="flex justify-between items-center">
              <a href={article.link} target='_blank'>
              <button className="flex items-center text-blue-600 hover:underline">
                <ExternalLink className="h-4 w-4 mr-1" />
                Read More
              </button>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {emergencyContacts.map((contact, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start p-6 space-y-4 md:space-y-0 md:space-x-6 transform transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="text-5xl text-blue-500">{contact.icon}</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{contact.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{contact.description}</p>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <a href={`tel:${contact.number}`} className="text-blue-600 font-medium">
                {contact.number}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  

  const renderVideos = () => (
    <div className="space-y-4 px-4">
      {videos.map((video, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="relative">
            <iframe 
              src={video.link.replace("watch?v=", "embed/")} 
              title={video.title} 
              className="w-full h-48 object-cover rounded-t-xl" 
              allowFullScreen
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white rounded-md text-sm">
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">{video.category}</span>
              <div className="flex items-center text-gray-500 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {video.views.toLocaleString()}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{video.description}</p>
            {/* <div className="flex justify-between items-center">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
  

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}

      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 z-10 shadow-lg">
  <div className="p-4">
    <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
      Safety Support Hub
    </h1>
    <div className="mt-4 flex justify-around space-x-6 border-t border-gray-200 pt-2">
      {[
        { name: 'Emergency', icon: Phone },
        { name: 'Articles', icon: BookOpen },
        { name: 'Videos', icon: Video }
      ].map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setActiveTab(name)}
          className={`flex flex-col items-center p-3 rounded-lg transition-all transform duration-300 ease-in-out ${
            activeTab === name 
              ? 'bg-white text-blue-600 shadow-lg scale-105' 
              : 'text-white hover:bg-blue-100 hover:scale-105'
          }`}
        >
          <Icon className="h-7 w-7 mb-1 transition-all duration-300 ease-in-out transform hover:scale-110" />
          <span className="text-sm font-medium">{name}</span>
        </button>
      ))}
    </div>
  </div>
</div>



      <br/>
      <br/>
      <br/>

      {/* Content */}
      <div className="pt-32 pb-4">
        {activeTab === "Emergency" && renderEmergencyContacts()}
        {activeTab === "Articles" && renderArticles()}
        {activeTab === "Videos" && renderVideos()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Support;
