require('dotenv').config();
const cron = require('node-cron');
const User = require('../models/userModel');
const transporter = require('../nodemailer');

const sendBirthdayEmail = async (user) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Happy Birthday!',
    text: `Dear ${user.username},\n\nWe acknowledge and appreciate your prescence with us, and we wish you a fantastic birthday filled with joy and surprises! \nCheers to many Happy returns!\n\nBest regards,\nBokesMan Group.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Birthday email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);

  }
};

const runBirthdayCheck = () => {
  cron.schedule('* * * * *', async () => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    const users = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$dob' }, month + 1] }, // MongoDB months are 1-indexed
          { $eq: [{ $dayOfMonth: '$dob' }, date] },
        ],
      },
    });

    for (const user of users) {
      await sendBirthdayEmail(user);
    }
  });
};

module.exports = { runBirthdayCheck };
