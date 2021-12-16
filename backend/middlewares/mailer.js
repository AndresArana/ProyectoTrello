import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "joya1028@gmail.com",
    pass: "zdqxkrkkrjvvgxkf",
  },
});

transporter.verify().then(() => {
  console.log("Ready for send to emails");
});

export default transporter;
