const welcomeUserTemplate = (user) => {
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "there";

  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 24px;">
      <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #111827; padding: 28px 30px;">
          <p style="margin: 0 0 8px; color: #93c5fd; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            Portfolio SaaS
          </p>
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.25;">
            Welcome aboard, ${fullName}!
          </h1>
        </div>

        <div style="padding: 30px;">
          <p style="margin: 0 0 18px; color: #374151; font-size: 16px; line-height: 1.6;">
            Your account has been created successfully. You can now start building your portfolio, adding your skills, projects, education, experience, certificates, and achievements from your dashboard.
          </p>

          <div style="margin: 24px 0; padding: 18px; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
            <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
              Tip: Begin with your profile details and resume, then add projects and social links so your portfolio feels complete right away.
            </p>
          </div>

          <div style="margin: 26px 0;">
            <p style="margin: 0 0 10px; color: #111827; font-size: 15px; font-weight: 700;">
              Good first steps
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.7;">
              <li>Complete your personal details.</li>
              <li>Upload your profile image and resume.</li>
              <li>Add your strongest skills, projects, and achievements.</li>
            </ul>
          </div>

          <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Thanks for joining us. We are excited to see what you create.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
          </p>
        </div>
      </div>
    </div>`;
};

const resetPasswordOTPTemplate = (user, otp) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
        
        <h2 style="color: #1f2937;">Password Reset OTP</h2>

        <p style="color: #4b5563; font-size: 15px;">
          Hi ${user?.firstName || "User"} ${user?.lastName || ""},
        </p>

        <p style="color: #4b5563; font-size: 15px;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>

        <div style="margin: 25px 0; text-align: center;">
          <span style="
            display: inline-block;
            padding: 12px 20px;
            font-size: 24px;
            letter-spacing: 4px;
            font-weight: bold;
            color: #111827;
            background-color: #f3f4f6;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #4b5563; font-size: 14px;">
          This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #b91c1c;">
            If you did not request this, please ignore this email.
          </p>
        </div>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
        </p>

      </div>
    </div>`;
};

const passwordChangedTemplate = (user) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
        <h2 style="color: #1f2937;">Password Updated Successfully</h2>

        <p style="color: #4b5563; font-size: 15px;">Hi ${user?.firstName} ${user?.lastName},</p>

        <p style="color: #4b5563; font-size: 15px;">
          This is a confirmation that your account password was successfully
          changed.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #374151;">
            If you made this change, no further action is required.
          </p>
        </div>

        <p style="color: #4b5563; font-size: 15px;">
          If you did <strong>not</strong> change your password, please reset it
          immediately and contact our support team.
        </p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
        </p>
      </div>
    </div>`;
};

export {
  welcomeUserTemplate,
  resetPasswordOTPTemplate,
  passwordChangedTemplate,
};
