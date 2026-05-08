import Mailjet from "node-mailjet";

const { API_KEY_MAIL, SECRET_KEY_MAIL } = process.env;

const mailjet = Mailjet.apiConnect(API_KEY_MAIL!, SECRET_KEY_MAIL!);

interface MailData {
  email: string;
  fullName: string;
  token: string;
}

export interface MailResult {
  ok: boolean;
}

export const sendEmail = async ({ email, fullName, token }: MailData) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kaliuzhnyinazarii@gmail.com",
            Name: "Shoppe",
          },
          To: [
            {
              Email: email,
              Name: fullName,
            },
          ],
          Subject: "Reset password to Shoppe account!",
          HTMLPart: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center;">
      
      <h2 style="color: #2c3e50; margin-bottom: 10px;">
        Reset Your Password
      </h2>

      <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
        Hi ${fullName}, <br/><br/>
        We received a request to reset your password for your <strong>Job Board</strong> account.
        Click the button below to set a new password.
      </p>

      <a 
        href="http://localhost:5173/password/set/${token}" 
        target="_blank"
        style="
          display: inline-block;
          padding: 12px 25px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          font-weight: bold;
          border-radius: 6px;
          font-size: 15px;
        "
      >
        Reset Password
      </a>

      <p style="color: #888; font-size: 13px; margin-top: 30px;">
        If you didn’t request this password reset, you can safely ignore this email.
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

      <p style="color: #aaa; font-size: 12px;">
        © ${new Date().getFullYear()} Job Board. All rights reserved.
      </p>

    </div>
  </div>
`,
        },
      ],
    });

    return;
  } catch (error) {
    return;
  }
};
