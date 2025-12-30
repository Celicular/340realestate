import emailjs from "@emailjs/browser";

// EmailJS configuration - DEMO CREDENTIALS (Replace with your actual EmailJS credentials)
const EMAILJS_SERVICE_ID = "service_lvze4wb"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID_BOOKING = "template_p6nfnpq"; // Template for booking notifications
const EMAILJS_TEMPLATE_ID_CONFIRMATION = "template_njdvhls"; // Template for guest confirmations
const EMAILJS_PUBLIC_KEY = "NgxMnCqSHT0gaTTOY"; // Replace with your EmailJS public key

// Demo email for testing
const DEMO_AGENT_EMAIL = "sshrey844@gmail.com";

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY !== "your_public_key_here") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Send booking request notification email to agent
 * @param {Object} bookingData - The booking request data
 * @param {Object} propertyData - The property information
 * @param {string} agentEmail - The agent's email address
 */
export const sendBookingNotificationToAgent = async (
  bookingData,
  propertyData,
  agentEmail
) => {
  try {
    console.log("📧 Starting email send process...");
    console.log("EmailJS configured:", isEmailServiceConfigured());
    console.log("Service ID:", EMAILJS_SERVICE_ID);
    console.log("Template ID:", EMAILJS_TEMPLATE_ID_BOOKING);
    console.log("Public Key:", EMAILJS_PUBLIC_KEY ? "Present" : "Missing");

    // Check if EmailJS is configured
    if (!isEmailServiceConfigured()) {
      console.log(
        "📧 EmailJS not configured - Booking notification would be sent to:",
        agentEmail || DEMO_AGENT_EMAIL
      );
      return {
        success: false,
        message:
          "EmailJS not configured properly. Please check your credentials.",
        emailInfo: {
          sentTo: agentEmail || DEMO_AGENT_EMAIL,
          agentName: propertyData.agentInfo?.name || "Property Agent",
          propertyName: propertyData.name || propertyData.propertyInfo?.name,
        },
      };
    }

    const templateParams = {
      // Email recipients
      to_email: agentEmail || DEMO_AGENT_EMAIL,
      agent_name: propertyData.agentInfo?.name || "Property Agent",

      // Guest information
      guest_name: bookingData.guestInfo.name,
      guest_email: bookingData.guestInfo.email,
      guest_phone: bookingData.guestInfo.phone,

      // Property information
      property_name: propertyData.name || propertyData.propertyInfo?.name,
      property_address:
        propertyData.address || propertyData.propertyInfo?.address,
      property_id: propertyData.id,

      // Booking details
      check_in_date: formatDate(bookingData.bookingDetails.checkIn),
      check_out_date: formatDate(bookingData.bookingDetails.checkOut),
      number_of_guests: bookingData.bookingDetails.guests,
      total_nights: bookingData.pricing.totalNights,

      // Pricing
      base_rate: `$${bookingData.pricing.baseRate}`,
      cleaning_fee: `$${bookingData.pricing.cleaningFee}`,
      service_fee: `$${bookingData.pricing.serviceFee}`,
      taxes: `$${bookingData.pricing.taxes}`,
      total_amount: `$${bookingData.pricing.totalAmount}`,

      // Special requests
      special_requests: bookingData.guestInfo.message || "No special requests",

      // Booking metadata
      booking_date: formatDate(bookingData.requestedAt),
      booking_id: generateBookingId(),

      // Call to action
      approval_link: `https://340realestate.com/admin/booking-requests`,

      // Company info
      company_name: "340 Real Estate",
      company_website: "https://340realestate.com",
      company_phone: "+1 (340) 555-0123",

      // Email subject
      subject: `🏡 New Booking Request - ${
        propertyData.name || propertyData.propertyInfo?.name
      }`,
    };

    console.log(
      "Sending booking notification email with params:",
      templateParams
    );

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_BOOKING,
      templateParams
    );

    console.log("Email sent successfully:", response);

    return {
      success: true,
      message: "Booking notification sent to agent successfully",
      emailInfo: {
        sentTo: agentEmail || DEMO_AGENT_EMAIL,
        agentName: templateParams.agent_name,
        propertyName: templateParams.property_name,
      },
    };
  } catch (error) {
    console.error("Error sending booking notification email:", error);

    return {
      success: false,
      error: error.message || "Failed to send booking notification email",
      details: error,
    };
  }
};

/**
 * Send booking confirmation email to guest
 * @param {Object} bookingData - The booking request data
 * @param {Object} propertyData - The property information
 */
export const sendBookingConfirmationToGuest = async (
  bookingData,
  propertyData
) => {
  try {
    if (!isEmailServiceConfigured()) {
      console.log(
        "📧 EmailJS not configured - Guest confirmation would be sent to:",
        bookingData.guestInfo.email
      );
      return {
        success: true,
        message:
          "Demo mode: Guest confirmation logged (EmailJS not configured)",
      };
    }

    const templateParams = {
      // Email recipients
      to_email: bookingData.guestInfo.email,
      guest_name: bookingData.guestInfo.name,

      // Property information
      property_name: propertyData.name || propertyData.propertyInfo?.name,
      property_address:
        propertyData.address || propertyData.propertyInfo?.address,

      // Booking details
      check_in_date: formatDate(bookingData.bookingDetails.checkIn),
      check_out_date: formatDate(bookingData.bookingDetails.checkOut),
      number_of_guests: bookingData.bookingDetails.guests,
      total_nights: bookingData.pricing.totalNights,

      // Pricing
      total_amount: `$${bookingData.pricing.totalAmount}`,

      // Booking metadata
      booking_date: formatDate(bookingData.requestedAt),
      booking_id: generateBookingId(),

      // Company info
      company_name: "340 Real Estate",
      company_website: "https://340realestate.com",
      company_phone: "+1 (340) 555-0123",
      support_email: "support@340realestate.com",

      // Email subject
      subject: `✅ Booking Request Received - ${
        propertyData.name || propertyData.propertyInfo?.name
      }`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONFIRMATION,
      templateParams
    );

    console.log("Guest confirmation email sent successfully:", response);

    return {
      success: true,
      message: "Booking confirmation sent to guest successfully",
    };
  } catch (error) {
    console.error("Error sending guest confirmation email:", error);

    return {
      success: false,
      error: error.message || "Failed to send guest confirmation email",
    };
  }
};

/**
 * Send booking status update email
 * @param {Object} bookingData - The booking request data
 * @param {Object} propertyData - The property information
 * @param {string} status - New booking status (approved, rejected)
 * @param {string} adminNotes - Admin notes for the status change
 */
export const sendBookingStatusUpdateEmail = async (
  bookingData,
  propertyData,
  status,
  adminNotes = ""
) => {
  try {
    if (!isEmailServiceConfigured()) {
      console.log(
        `📧 EmailJS not configured - Booking ${status} notification would be sent to:`,
        bookingData.guestInfo.email
      );
      return {
        success: true,
        message: `Demo mode: Booking ${status} notification logged (EmailJS not configured)`,
      };
    }

    const isApproved = status === "approved";

    const templateParams = {
      // Email recipients
      to_email: bookingData.guestInfo.email,
      guest_name: bookingData.guestInfo.name,

      // Property information
      property_name: propertyData.name || propertyData.propertyInfo?.name,

      // Booking details
      check_in_date: formatDate(bookingData.bookingDetails.checkIn),
      check_out_date: formatDate(bookingData.bookingDetails.checkOut),

      // Status update
      booking_status: status.toUpperCase(),
      status_message: isApproved
        ? "Congratulations! Your booking has been approved."
        : "We regret to inform you that your booking request has been declined.",
      admin_notes:
        adminNotes ||
        (isApproved
          ? "Your booking is confirmed!"
          : "Please contact us for alternative options."),

      // Next steps
      next_steps: isApproved
        ? "You will receive payment instructions within 24 hours. A 50% deposit is required to secure your reservation."
        : "Please feel free to browse our other available properties or contact us for assistance.",

      // Company info
      company_name: "340 Real Estate",
      company_phone: "+1 (340) 555-0123",
      support_email: "support@340realestate.com",

      // Email subject
      subject: `${isApproved ? "🎉 Booking Approved" : "📋 Booking Update"} - ${
        propertyData.name || propertyData.propertyInfo?.name
      }`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONFIRMATION,
      templateParams
    );

    console.log("Status update email sent successfully:", response);

    return {
      success: true,
      message: `Booking ${status} notification sent successfully`,
    };
  } catch (error) {
    console.error("Error sending status update email:", error);

    return {
      success: false,
      error: error.message || "Failed to send status update email",
    };
  }
};

// Legacy functions for backward compatibility
export const sendBookingRequestEmail = async (bookingDetails) => {
  console.log(
    "📧 Using legacy sendBookingRequestEmail - redirecting to sendBookingNotificationToAgent"
  );

  // Extract data for new format
  const bookingData = {
    guestInfo: {
      name: bookingDetails.guestName || bookingDetails.name,
      email: bookingDetails.guestEmail || bookingDetails.email,
      phone: bookingDetails.guestPhone || bookingDetails.phone,
      message: bookingDetails.specialRequests || bookingDetails.message || "",
    },
    bookingDetails: {
      checkIn: bookingDetails.checkInDate || bookingDetails.checkIn,
      checkOut: bookingDetails.checkOutDate || bookingDetails.checkOut,
      guests: bookingDetails.numberOfGuests || bookingDetails.guests || 1,
    },
    pricing: {
      totalAmount: bookingDetails.totalAmount || "0",
      totalNights: bookingDetails.totalNights || 1,
    },
    requestedAt: new Date(),
  };

  const propertyData = {
    name: bookingDetails.propertyName,
    id: bookingDetails.propertyId,
    agentInfo: {
      name: bookingDetails.agentName || "Property Agent",
    },
  };

  return await sendBookingNotificationToAgent(
    bookingData,
    propertyData,
    bookingDetails.agentEmail
  );
};

export const validateEmailConfiguration = async () => {
  const isConfigured = isEmailServiceConfigured();

  return {
    isValid: isConfigured,
    config: {
      serviceId: EMAILJS_SERVICE_ID,
      hasTemplates: EMAILJS_TEMPLATE_ID_BOOKING !== "template_booking",
      publicKey:
        EMAILJS_PUBLIC_KEY !== "your_public_key_here"
          ? EMAILJS_PUBLIC_KEY.substring(0, 8) + "..."
          : "Not configured",
      demoMode: !isConfigured,
    },
  };
};

export const sendRentalApprovalEmail = async (
  rentalProperty,
  adminNotes = ""
) => {
  console.log(
    "📧 Rental approval email would be sent to:",
    rentalProperty.agentEmail || rentalProperty.agentInfo?.email
  );

  if (!isEmailServiceConfigured()) {
    return {
      success: true,
      message: "Demo mode: Rental approval email logged",
    };
  }

  // Implementation for rental approval emails can be added here
  return {
    success: true,
    message: "Rental approval email functionality available",
  };
};

export const sendRentalRejectionEmail = async (
  rentalProperty,
  adminNotes = ""
) => {
  console.log(
    "📧 Rental rejection email would be sent to:",
    rentalProperty.agentEmail || rentalProperty.agentInfo?.email
  );

  if (!isEmailServiceConfigured()) {
    return {
      success: true,
      message: "Demo mode: Rental rejection email logged",
    };
  }

  // Implementation for rental rejection emails can be added here
  return {
    success: true,
    message: "Rental rejection email functionality available",
  };
};

export const sendNewRentalNotificationEmail = async (rentalProperty) => {
  console.log("📧 New rental notification email would be sent");

  if (!isEmailServiceConfigured()) {
    return {
      success: true,
      message: "Demo mode: New rental notification logged",
    };
  }

  // Implementation for new rental notifications can be added here
  return {
    success: true,
    message: "New rental notification functionality available",
  };
};

export const sendContactFormEmail = async (contactData) => {
  console.log("📧 Contact form email would be sent:", contactData);

  if (!isEmailServiceConfigured()) {
    return { success: true, message: "Demo mode: Contact form email logged" };
  }

  // Implementation for contact form emails can be added here
  return {
    success: true,
    message: "Contact form email functionality available",
  };
};

export const sendTestEmail = async (testEmail = "test@example.com") => {
  try {
    if (!isEmailServiceConfigured()) {
      console.log(
        "📧 EmailJS not configured - Test email would be sent to:",
        testEmail
      );
      return { success: false, message: "EmailJS not configured properly" };
    }

    const templateParams = {
      to_email: testEmail,
      guest_name: "Test User",
      subject: "Test Email from 340 Real Estate",
      message: "This is a test email to verify EmailJS configuration.",
    };

    console.log("Sending test email with params:", templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONFIRMATION,
      templateParams
    );

    console.log("Test email sent successfully:", response);

    return {
      success: true,
      message: "Test email sent successfully",
      response: response,
    };
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      error: error.message || "Failed to send test email",
      details: error,
    };
  }
};

export const initializeEmailJS = () => {
  if (isEmailServiceConfigured()) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("📧 EmailJS initialized successfully");
  } else {
    console.log("📧 EmailJS not configured - running in demo mode");
  }
};

// Helper functions
const formatDate = (date) => {
  if (!date) return "N/A";

  try {
    // Handle Firestore timestamp
    if (date.toDate) {
      return date.toDate().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Handle regular Date object or string
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return date.toString();
  }
};

const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `BK-${timestamp}-${randomStr}`.toUpperCase();
};

const isEmailServiceConfigured = () => {
  return (
    EMAILJS_SERVICE_ID !== "service_demo123" &&
    EMAILJS_TEMPLATE_ID_BOOKING !== "template_demo" &&
    EMAILJS_PUBLIC_KEY !== "your_public_key_here" &&
    EMAILJS_SERVICE_ID &&
    EMAILJS_TEMPLATE_ID_BOOKING &&
    EMAILJS_PUBLIC_KEY
  );
};

// Configuration check function
export const checkEmailServiceConfiguration = () => {
  const isConfigured = isEmailServiceConfigured();

  return {
    isConfigured,
    message: isConfigured
      ? "Email service is properly configured"
      : "Email service needs configuration. Please update EmailJS credentials in emailService.js",
    credentials: {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID_BOOKING,
      publicKey: EMAILJS_PUBLIC_KEY.substring(0, 8) + "...",
      demoMode: !isConfigured,
    },
    instructions: {
      step1: "Sign up at https://www.emailjs.com/",
      step2: "Create email templates for booking notifications",
      step3: "Replace demo credentials in src/services/emailService.js",
      step4: "Test the email functionality",
    },
  };
};

const emailService = {
  initializeEmailJS,
  sendBookingNotificationToAgent,
  sendBookingConfirmationToGuest,
  sendBookingStatusUpdateEmail,
  sendRentalApprovalEmail,
  sendRentalRejectionEmail,
  sendNewRentalNotificationEmail,
  sendBookingRequestEmail,
  sendContactFormEmail,
  validateEmailConfiguration,
  sendTestEmail,
  checkEmailServiceConfiguration,
};

export default emailService;
