import nodemailer from "nodemailer";
import { emailConfig } from "../config.js";
import fs from "fs";

let transporter = nodemailer.createTransport(emailConfig.nodemailer);

const sentmail = async (emailto, subject, text = "", attFile = "") => {
  if (attFile === "") {
    await transporter.sendMail({
      from: "<gis@kls-gr.ru>",
      to: emailto,
      subject: subject,
      text: text,
      html: text,
    });
    return;
  } else {
    await transporter.sendMail({
      from: "<gis@kls-gr.ru>",
      to: emailto,
      subject: subject,
      text: text,
      html: text,
      attachments: [
        {
          //filename: attFile,
          //content: fs.createReadStream(
          path: emailConfig.SMTPSentreport.attachment + `${attFile}`,
          // ),
        },
      ],
    });
    return;
  }
};


export default sentmail;
