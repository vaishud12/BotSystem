import React, { useState } from 'react';
import Navbar from './Navbar';
import Chatbot from './BotAnalysis/Chatbot';
import { motion } from 'framer-motion';
import img1 from "./Incident/img1.jpg";
import { Slide } from 'react-awesome-reveal';
import img4 from "./Incident/img4.png"
import img5 from "./Incident/img5.png"
import img6 from "./Incident/img6.png"
import logo from "./Signup-Login/logo.jpeg"
import { useTranslation } from 'react-i18next';
const Home = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { t } = useTranslation();
  const toggleChatbot = () => {
    setChatbotOpen((prevState) => !prevState);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 3,
        ease: "easeInOut",
      },
    },
  };
  
  const words = [
    "SME,",
    "MSME,",
    "Agriculture,",
    "Startups,",
    "Colleges,",
    "Bank,",
    "Investors, ",
    " Management ",
    " & ",
    " Technology"
  ];
  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        
        <section className="bg-gray-100 py-16 max-w-full"> {/* Adjusted padding to py-4 */}
  <div className="max-w-100vh mx-auto px-6"> {/* Removed padding on sides */}
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Left Column */}
      <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
          <span className="text-gray-800">{t("content.intro")} </span>
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.4, ease: 'easeOut' }}
              className="inline-block text-red-600"
            >
              {word}{" "}
            </motion.span>
          ))}
        </h1>
        <div className="mt-4"> {/* Reduced margin to mt-4 */}
          <button className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded mr-4 hover:bg-red-700">{t("content.getInTouch")}</button>
          <button className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">{t("content.joinNow")}</button>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="w-full md:w-1/2 flex justify-center">
        <motion.img
          src={img1}
          alt="Person working on a laptop"
          className="max-w-full h-auto rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: words.length * 0.2 + 0.2, ease: 'easeOut' }}
          style={{ width: '40vw', height: 'auto' }} 
        />
      </div>
    </div>
  </div>
</section>

<section className="bg-white py-16">
  <div className="container mx-auto text-center px-4">
    <h2 className="text-3xl font-bold text-gray-800">
      The Passion <span className="text-red-600">Incident Framework</span>
    </h2>
    <p className="mt-4 text-gray-600">{t("content.frameworkDescription")}</p>
  </div>
</section>



        <section className="bg-gray-100 py-16">
      <div className="container mx-auto text-center px-8">
        <h2 className="text-3xl font-bold text-red-600">{t("content.strategicFocusAreas.title")}</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            className="bg-white p-6 rounded shadow"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={cardVariants}
          >
            <i className="fas fa-flask text-red-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800">{t("content.strategicFocusAreas.areas1")}</h3>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded shadow"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={cardVariants}
            transition={{ delay: 0.2 }}  // Add delay for a staggered effect
          >
            <i className="fas fa-rocket text-red-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800">{t("content.strategicFocusAreas.areas2")}</h3>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded shadow"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={cardVariants}
            transition={{ delay: 0.4 }}  // Add delay for a staggered effect
          >
            <i className="fas fa-briefcase text-red-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800">{t("content.strategicFocusAreas.areas3")}</h3>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded shadow"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={cardVariants}
            transition={{ delay: 0.6 }}  // Add delay for a staggered effect
          >
            <i className="fas fa-cogs text-red-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800">{t("content.strategicFocusAreas.areas4")}</h3>
          </motion.div>
        </div>
      </div>
    </section>

                <section className="bg-white py-16">
                    <div className="container mx-auto flex flex-col md:flex-row items-center px-8">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-800">Eager to Explore the Future Landscape of <span className="text-red-600">Startup Support?</span></h2>
                            <p className="mt-4 text-gray-600">{t("content.efficiency")}</p>
                            <button className="mt-8 bg-red-600 text-white px-6 py-3 rounded">Learn More</button>
                        </div>
                        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                            <img src={img5} alt="People working in a startup environment" style={{ width: "50%", height: "auto" }}  className="rounded shadow"/>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-100 py-16">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl font-bold text-red-600">{t("content.vtitle")}</h2>
                        <p className="mt-4 text-gray-600">{t("content.vcontent")}</p>
                    </div>
                </section>

                <section className="bg-white py-16">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl font-bold text-red-600">{t("content.mtitle")}</h2>
                        <p className="mt-4 text-gray-600">{t("content.mcontent")}</p>
                    </div>
                </section>

                <section className="bg-gray-100 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-red-600">{t("content.services.title")}</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Slide in from the left */}
          <Slide direction="left">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-search text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list1")}</h3>
            </div>
          </Slide>

          {/* Slide in from the right */}
          <Slide direction="right">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-chart-line text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list2")}</h3>
            </div>
          </Slide>

          {/* Slide in from the left */}
          <Slide direction="left">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-cogs text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list3")}</h3>
            </div>
          </Slide>

          {/* Slide in from the right */}
          <Slide direction="right">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-rocket text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list4")}</h3>
            </div>
          </Slide>

          {/* Slide in from the left */}
          <Slide direction="left">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-chart-bar text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list5")}</h3>
            </div>
          </Slide>

          {/* Slide in from the right */}
          <Slide direction="right">
            <div className="bg-white p-6 rounded shadow">
              <i className="fas fa-money-bill-wave text-red-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">{t("content.services.list6")}</h3>
            </div>
          </Slide>

        </div>
      </div>
    </section>
                <section className="bg-white py-16">
                    <div className="container mx-auto flex flex-col md:flex-row items-center px-8">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-800">{t("content.pCombinator.title")} <span className="text-red-600">{t("content.pCombinator.title1")}</span></h2>
                            <p className="mt-4 text-gray-600">{t("content.pCombinator.description")}</p>
                            <button className="mt-8 bg-red-600 text-white px-6 py-3 rounded">{t("content.pCombinator.learnMore")}</button>
                            <button className="mt-8 bg-red-600 text-white px-6 py-3 rounded ml-4">{t("content.pCombinator.getConnected")}</button>
                        </div>
                        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                            <img src={img6} alt="People collaborating in a workspace" style={{ width: "60%", height: "auto" }}className="rounded shadow"/>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-100 py-16">
                    <div className="container mx-auto text-center px-8">
                       
                        <div className="mt-8 flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 text-center md:text-left">
                                <img src={img5} alt="Member photo" style={{ width: "14%", height: "auto" }} className="rounded-full w-32 h-32 object-cover mx-auto md:mx-0"/>
                                <h1 className="text-4xl font-bold text-gray-500">
                                {t("content.aiJourney.title")}<span className="text-red-400">{t("content.aiJourney.title1")}</span>
                        </h1>
                        <p className="mt-4 text-lg text-red-400">
                        {t("content.aiJourney.description")}
                        </p>
                               
                            </div>
                            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                                <img src={img4} style={{ width: "50%", height: "auto" }} alt="AI and Cyber Security" className="rounded shadow"/>
                            </div>
                        </div>
                    </div>
                </section>
        {/* Additional sections remain unchanged */}

        {/* Conditionally render the Chatbot */}
        

        <footer className="bg-gray-800 text-white py-8">
                        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                            <div className="text-center md:text-left">
                            <div class="flex items-center mb-4">
                            <img src={logo} alt="Logo of Passion IT" class="mr-2"/>
                            <span class="text-2xl text-red-500 font-bold">PASSION IT.com</span>
                        </div>
                                <p className="mt-4">A generic platform dedicated to empowering innovation research and development across various domains.</p>
                                <div class="flex items-center mb-2">
                            <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                            <span>Office #5, Block 1, Lloyds Chambers, Mangalwar Peth, Near Ambedkar Bavan, Pune - 411011</span>
                        </div>
                                <div class="flex items-center">
                            <i class="fas fa-phone-alt text-red-500 mr-2"></i>
                            <span>+91 8983003402</span>
                        </div>
                            </div>
                            <div className="mt-8 md:mt-0 text-center md:text-right">
                                <h3 className="text-xl font-bold">Quick Links</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="hover:text-red-600">About Us</a></li>
                                    <li><a href="#" className="hover:text-red-600">Services</a></li>
                                    <li><a href="#" className="hover:text-red-600">Resources</a></li>
                                    <li><a href="#" className="hover:text-red-600">Blog</a></li>
                                </ul>
                            </div>
                            <div className="mt-8 md:mt-0 text-center md:text-right">
                                <h3 className="text-xl font-bold">Join Our Team</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="hover:text-red-600">Careers</a></li>
                                    <li><a href="#" className="hover:text-red-600">Internships</a></li>
                                    <li><a href="#" className="hover:text-red-600">Volunteer</a></li>
                                </ul>
                                <div className="mt-4 space-x-4">
                                    <a href="#" className="text-white hover:text-red-600"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="text-white hover:text-red-600"><i className="fab fa-twitter"></i></a>
                                    <a href="#" className="text-white hover:text-red-600"><i className="fab fa-linkedin-in"></i></a>
                                    <a href="#" className="text-white hover:text-red-600"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
    <p>&copy; 2023 <a href="https://passionit.com/" target="_blank" className="text-yellow hover:text-red-600" rel="noopener noreferrer">Passion IT.com</a>. All rights reserved.</p>
</div>

                    </footer>
        
        <button 
  className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none
             w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14"
  onClick={toggleChatbot}
>
  💬 {/* You can use an icon instead of an emoji */}
</button>


      {/* Chatbot modal */}
      {chatbotOpen && (
        <div className="">
          <Chatbot />
        </div>
      )}
      </div>
    </>
  );
};

export default Home;
