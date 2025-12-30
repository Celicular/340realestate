# Email Templates for EmailJS

## Rental Approval Email Template

**Template Name:** `rental_approval_template`

**Subject:** `🎉 Your Rental Property has been Approved - {{property_name}}`

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rental Property Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .property-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Rental Property Approved!</h1>
        </div>
        
        <div class="content">
            <p>Dear {{to_name}},</p>
            
            <p>Great news! Your rental property submission has been approved and is now live on our website.</p>
            
            <div class="property-details">
                <h3>{{property_name}}</h3>
                <p><strong>Location:</strong> {{property_location}}</p>
                <p><strong>Rate:</strong> {{property_price}}</p>
                <p><strong>Approved Date:</strong> {{approval_date}}</p>
            </div>
            
            <p><strong>Admin Notes:</strong></p>
            <p>{{admin_notes}}</p>
            
            <p>Your property is now visible to potential guests and can be booked through our platform.</p>
            
            <a href="{{property_url}}" class="button">View Your Property</a>
            
            <p>Thank you for choosing {{website_name}} for your rental property listing!</p>
            
            <p>Best regards,<br>
            The {{website_name}} Team</p>
        </div>
        
        <div class="footer">
            <p>Questions? Contact us at {{admin_email}}</p>
            <p>This is an automated message from {{website_name}}</p>
        </div>
    </div>
</body>
</html>
```

---

## Rental Rejection Email Template

**Template Name:** `rental_rejection_template`

**Subject:** `⚠️ Action Required - Your Rental Property Submission`

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rental Property Needs Attention</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .property-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .rejection-reason { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Property Submission Needs Attention</h1>
        </div>
        
        <div class="content">
            <p>Dear {{to_name}},</p>
            
            <p>Thank you for submitting your rental property to {{website_name}}. We've reviewed your submission and need some adjustments before we can approve it.</p>
            
            <div class="property-details">
                <h3>{{property_name}}</h3>
                <p><strong>Location:</strong> {{property_location}}</p>
                <p><strong>Review Date:</strong> {{rejection_date}}</p>
            </div>
            
            <div class="rejection-reason">
                <h4>🔍 Required Changes:</h4>
                <p>{{rejection_reason}}</p>
            </div>
            
            <p>Please make the necessary adjustments and resubmit your property through the agent dashboard.</p>
            
            <a href="{{resubmission_url}}" class="button">Update & Resubmit Property</a>
            
            <p>We're here to help you get your property listed successfully. Don't hesitate to reach out if you have any questions.</p>
            
            <p>Best regards,<br>
            The {{website_name}} Team</p>
        </div>
        
        <div class="footer">
            <p>Questions? Contact us at {{admin_email}}</p>
            <p>This is an automated message from {{website_name}}</p>
        </div>
    </div>
</body>
</html>
```

---

## Setup Instructions

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create a free account
3. Connect your email service (Gmail, Outlook, etc.)

### 2. Create Email Templates
1. In EmailJS dashboard, go to "Email Templates"
2. Create two new templates using the HTML above
3. Use the template names: `rental_approval_template` and `rental_rejection_template`

### 3. Configure Environment Variables
1. Copy `.env.email.example` to `.env.local`
2. Fill in your actual EmailJS credentials:
   - Service ID from EmailJS dashboard
   - Template IDs you created
   - Public Key from account settings

### 4. Template Variables
The email service will automatically populate these variables:
- `{{to_name}}` - Agent name
- `{{to_email}}` - Agent email  
- `{{property_name}}` - Property title
- `{{property_location}}` - Property address
- `{{property_price}}` - Rental rate
- `{{approval_date}}` / `{{rejection_date}}` - Action date
- `{{admin_notes}}` / `{{rejection_reason}}` - Admin feedback
- `{{property_url}}` - Link to approved property
- `{{resubmission_url}}` - Link to agent dashboard
- `{{website_name}}` - "340 Real Estate"
- `{{admin_email}}` - Admin contact email

### 5. Testing
Use the admin dashboard to test email functionality. The system will show email configuration status and allow you to approve/reject test properties.