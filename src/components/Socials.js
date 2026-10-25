import React, { useState, useEffect } from "react";
import "../stylesheets/Socials.css";
import {
  FaGithub,
  FaLinkedin,
  FaCheck,
  FaEnvelope,
  FaCode,
} from "react-icons/fa";
import emailjs from "@emailjs/browser"; // Import EmailJS

const Socials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    const serviceID = process.env.REACT_APP_SERVICE_ID;
    const templateID = process.env.REACT_APP_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;

    const missingSettings = [
      !serviceID && "REACT_APP_SERVICE_ID",
      !templateID && "REACT_APP_TEMPLATE_ID",
      !publicKey && "REACT_APP_PUBLIC_KEY",
    ].filter(Boolean);

    if (missingSettings.length > 0) {
      setFormError(
        `Email is not configured yet. Add ${missingSettings.join(", ")} to .env.local, then restart the development server.`
      );
      return;
    }

    const templateParams = {
      name: formData.name,
      email: formData.email,
      from_name: formData.name,
      from_email: formData.email,
      reply_to: formData.email,
      message: formData.message,
    };

    setIsSending(true);
    setFormError("");

    try {
      await emailjs.send(serviceID, templateID, templateParams, {
        publicKey,
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error("EmailJS message send failed:", {
        status: error?.status,
        text: error?.text,
      });
      setFormError(
        error?.text ||
          (error?.status === 400 ||
          error?.status === 401 ||
          error?.status === 403
            ? "EmailJS rejected the request. Check your service ID, template ID, and public key."
            : "Your message could not be sent. Check your connection and EmailJS service status, then try again.")
      );
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setFormError("");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const platforms = [
    {
      name: "GitHub",
      icon: <FaGithub className="platform-icon" />,
      description: "Check out my code repositories and projects",
      link: "https://github.com/Monikakumari765",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="platform-icon" />,
      description: "Connect with me professionally",
      link: "https://www.linkedin.com/in/monika-kumari-988420394/",
    },
    {
      name: "LeetCode",
      icon: <FaCode className="platform-icon" />,
      description: "View my problem-solving practice",
      link: "https://leetcode.com/u/Monikakumari765/",
    },
    {
      name: "Email",
      icon: <FaEnvelope className="platform-icon" />,
      description: "Feel free to reach out to me",
      link: "mailto:monikakumari4687@gmail.com",
    },
  ];

  return (
    <section className="socials-section">
      <div className={`section-content socials-content ${isVisible ? "visible" : ""}`}>
        <div className="social-platforms">
          <h3>Connect With Me</h3>
          <div className="platforms-grid">
            {platforms.map((platform, index) => (
              <div className="platform-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {platform.icon}
                <h4>{platform.name}</h4>
                <p>{platform.description}</p>
                <a href={platform.link} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form-container">
          <h3>Get In Touch</h3>

          {!formSubmitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              {formError && (
                <p className="form-feedback error" role="alert">
                  {formError}
                </p>
              )}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSending}>
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h4>Message Sent!</h4>
              <p>
                Thank you for reaching out. I'll get back to you as soon as
                possible!
              </p>
              <button onClick={resetForm} className="back-btn">
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Socials;
