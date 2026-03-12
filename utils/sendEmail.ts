// const mailjet = require("node-mailjet").connect(
//   process.env.MJ_APIKEY_PUBLIC,
//   process.env.MJ_APIKEY_PRIVATE,
// );

import Mailjet from "node-mailjet";

const { API_KEY_MAIL, SECRET_KEY_MAIL } = process.env;

const mailjet = Mailjet.apiConnect(API_KEY_MAIL!, SECRET_KEY_MAIL!);

const sendEmail = async ({
  email,
  name,
}: //   tokenId,
{
  email: string;
  name: string;
  //   tokenId: string
}) => {
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
        Subject: "My first Mailjet Email!",
        TextPart: "Greetings from Mailjet!",
        HTMLPart:
          '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
      },
    ],
  });
  //   request
  //     .then((result) => {
  //       console.log(result.body);
  //     })
  //     .catch((err) => {
  //       console.log(err.statusCode);
  //     });
};

export default sendEmail;
