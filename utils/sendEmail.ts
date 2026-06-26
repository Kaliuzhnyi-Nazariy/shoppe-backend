import Mailjet from "node-mailjet";
import { errorHandler } from "../helpers";

const { API_KEY_MAIL, SECRET_KEY_MAIL, FRONTEND_URL } = process.env;

if (!API_KEY_MAIL) {
  throw errorHandler(500, "No api key!");
}

if (!SECRET_KEY_MAIL) {
  throw errorHandler(500, "No secret api key!");
}

if (!FRONTEND_URL) {
  throw errorHandler(500, "No frontend url key!");
}

const mailjet = Mailjet.apiConnect(API_KEY_MAIL, SECRET_KEY_MAIL);

const sendEmail = async ({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token?: string;
}) => {
  const link = token ? `set/password?token=${token}` : `set/password`;

  const subject = token ? "Set password" : "Reset password";

  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "kaliuzhnyinazarii@gmail.com",
          Name: "shoppe",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: "Greetings from Mailjet!",
        HTMLPart: `<h1>Hello, ${name}</h1><p>click <a href="${FRONTEND_URL}/${link}" 
        target="_blank"</a> to set password</p>`,
      },
    ],
  });
};

export default sendEmail;
