import React, { useState, useEffect } from "react";
import { FaChevronUp, FaPrint, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";

const TermsAndConditions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();

  const sections = [
    {
      id: "user-eligibility",
      title: "User Eligibility",
      content:
        "Users must be 21 years or older with a valid driver's license. Geographic restrictions apply based on local regulations. Minimum qualification includes clean driving record for the past 3 years.",
    },
    {
      id: "booking-process",
      title: "Booking Process",
      content:
        "Complete the online booking form. Submit required documentation including valid ID and driver's license. Await verification confirmation. Receive booking confirmation via email.",
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      content:
        "We accept major credit cards and digital payments. Security deposit required. Additional fees may apply for late returns or damages.",
    },
    {
      id: "cancellation-policy",
      title: "Cancellation and Refund Policy",
      content:
        "Free cancellation up to 48 hours before pickup. 50% refund for cancellations within 24-48 hours. No refund for last-minute cancellations.",
    },
    {
      id: "rental-responsibilities",
      title: "Rental Responsibilities",
      content:
        "Document vehicle condition at pickup. Regular maintenance checks required. Return vehicle in original condition. Full tank required at return.",
    },
    {
      id: "insurance-liability",
      title: "Insurance and Damage Liabilities",
      content:
        "Basic insurance included. Additional coverage available. User responsible for undisclosed damages. Certain activities excluded from coverage.",
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      content:
        "No off-road driving. No vehicle modifications. No commercial use without authorization. No crossing international borders without permission.",
    },
    {
      id: "account-termination",
      title: "Account Termination",
      content:
        "Accounts may be suspended for policy violations. Appeals must be submitted within 30 days. Data retained as per privacy policy.",
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content:
        "All platform content is protected. User content rights detailed in privacy policy. Trademark usage requires written permission.",
    },
    {
      id: "liability-limitations",
      title: "Limitations of Liability",
      content:
        "Service provided 'as-is'. Maximum liability limited to rental fee paid. Users indemnify GearUp against third-party claims.",
    },
    {
      id: "user-data",
      title: "User Data Handling",
      content:
        "Data collected as per privacy policy. Information shared with necessary third parties. User consent required for marketing communications.",
    },
    {
      id: "jurisdiction",
      title: "Jurisdiction and Governing Law",
      content:
        "Governed by local state laws. Disputes resolved through arbitration. Legal proceedings in designated courts only.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleback = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    } // Navigate back to the previous page or home page    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-2   py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="ml-4 text-2xl font-bold text-gray-800">
                Terms and Conditions
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
              onClick={handleback}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <IoCaretBack  className="mr-2" /> Back
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Last Updated: January 1, 2024
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <main className="max-w-3xl mx-auto">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              This document outlines the terms and conditions governing the use
              of GearUp's vehicle rental services. Please read these terms
              carefully before using our services.
            </p>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="mb-12 scroll-mt-28"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </main>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Back to top"
        >
          <FaChevronUp />
        </button>
      )}
    </div>
  );
};

export default TermsAndConditions;
