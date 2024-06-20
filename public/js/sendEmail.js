const nodemailer = require("nodemailer");
require('dotenv').config();
exports.sendEmailService = async (data) => {
    try {
        console.log(data[1])
        let transporter = await nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true, // true for 465, false for other ports
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.email, // generated ethereal user
                pass: process.env.pass_email, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: process.env.email , // sender address
            to: process.env.email, // list of receivers
            subject: "Liên Hệ Mua Xe ISUZU",
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Successful</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    line-height: 1.6;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }
                .header img {
                    width: 150px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content h1 {
                    color: #4CAF50;
                }
                .content p {
                    font-size: 16px;
                    text-align: left;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                <img src="http://isuzudanang.com.vn/public/img/logo1.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h1 >Thư Liên Hệ Từ Website!</h1>
                    <p>Chào Anh Dương Tôi Là ${data[0]},</p>
                    <p>Tôi muốn liên hê anh để được tư vấn</p>
                    <p>Email : <strong>${data[1]}</strong></p>
                    <p>Số Điện Thoại : <strong>${data[3]}</strong> </p>
                    <p>tôi muốn anh tư vấn : ${data[2]} </p>
                    
                </div>
                <div class="footer">
                    <p>rất vui được liên hệ</p>
                </div>
            </div>
        </body>
        </html>
      `

        });
        return info;
    } catch (error) {
        console.log(error)
    }
}