import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendContactFormEmail } from '../../services/emailService';
import { submitContact } from '../../firebase/firestore';

const ContactDetail = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Prepare data for Firebase (map form fields to expected format)
      const contactData = {
        name: formData.user_name,
        email: formData.user_email,
        subject: formData.subject,
        message: formData.message,
      };

      // Save to Firebase first
      console.log('📝 Saving contact form to Firebase...');
      const firebaseResult = await submitContact(contactData);
      
      if (!firebaseResult.success) {
        console.error('Failed to save to Firebase:', firebaseResult.error);
        // Continue with email even if Firebase fails
      } else {
        console.log('✅ Contact form saved to Firebase with ID:', firebaseResult.id);
      }

      // Send email notification
      console.log('📧 Sending email notification...');
      const emailResult = await sendContactFormEmail(formData);

      if (emailResult.success || firebaseResult.success) {
        // Consider success if either Firebase OR email succeeds
        setSubmitStatus('success');
        setFormData({
          user_name: "",
          user_email: "",
          subject: "",
          message: "",
        });
        // Reset form
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetStatus = () => {
    setSubmitStatus(null);
  };

  return (
    <section className="py-16 px-4 md:px-10 bg-brand-light" id="contact">
      <motion.div
        className="max-w-6xl mx-auto bg-gradient-to-r from-brand-light via-white to-brand-light rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 border "
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left Contact Info Section */}
        <div className=" text-brand-dark p-10 flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold text-brand-dark">Contact Us</h2>
          <p className="text-lg text-brand-dark/80">
            Reach Out for Villa Rentals: Contact Us Today!
          </p>

          <div className="space-y-4 text-brand-dark">
            <div className="flex items-start gap-3">
              <MapPin className="text-[#25525a] mt-1" />
              <p>
                340 Real Estate Company Property, Sales, and Management
                <br />
                St John, US Virgin Islands
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-[#25525a] mt-1" />
              <p>
                <a href="tel:3406436068" className="hover:underline">
                  340-643-6068
                </a>{" "}
                /{" "}
                <a href="tel:3407794478" className="hover:underline">
                  340-779-4478
                </a>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-[#25525a] mt-1" />
              <a
                href="mailto:340realestateco@gmail.com"
                className="hover:underline"
              >
                340realestateco@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Message sent successfully! We'll get back to you soon.</span>
              <button
                type="button"
                onClick={resetStatus}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Failed to send message. Please try again.</span>
              <button
                type="button"
                onClick={resetStatus}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </motion.div>
          )}

          <div>
            <label className="block text-brand-dark mb-1 font-medium">
              Your Name
            </label>
            <input
              type="text"
              name="user_name"
              required
              value={formData.user_name}
              onChange={handleChange}
              className="w-full bg-brand-light border border-[#25525a] px-4 py-3 rounded-md text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-brand-dark mb-1 font-medium">
              Your Email
            </label>
            <input
              type="email"
              name="user_email"
              required
              value={formData.user_email}
              onChange={handleChange}
              className="w-full bg-brand-light border border-[#25525a] px-4 py-3 rounded-md text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-brand-dark mb-1 font-medium">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-brand-light border border-[#25525a] px-4 py-3 rounded-md text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Subject of your message"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-brand-dark mb-1 font-medium">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-brand-light border border-[#25525a] px-4 py-3 rounded-md text-brand-dark placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Write your message here..."
              disabled={isLoading}
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="bg-[#25525a] text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactDetail;
