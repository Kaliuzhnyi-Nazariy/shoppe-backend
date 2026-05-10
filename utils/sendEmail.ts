import Mailjet from "node-mailjet";

const { API_KEY_MAIL, SECRET_KEY_MAIL } = process.env;

const mailjet = Mailjet.apiConnect(API_KEY_MAIL!, SECRET_KEY_MAIL!);

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
        HTMLPart: `<h1>Hello, ${name}</h1><p>click <a href="http://localhost:5173/${link}" 
        target="_blank"</a> to set password</p>`,
      },
    ],
  });
};

export default sendEmail;
