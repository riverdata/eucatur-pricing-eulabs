import nodemailer from "nodemailer";
import { config } from "../config";
import path from 'path';

type MailSendData = {
  to: string;
  html: string;
  subject: string;
};

export class MailService {
  private transporter;

  constructor() {
    const configTransporter = {
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    };

    this.transporter = nodemailer.createTransport(configTransporter);
  }

  async send(data: MailSendData) {
    var imagePath = path.join(__dirname, '../utils/images/logo_eucatur.png');
    return await this.transporter.sendMail({
      from: 'no-reply@riverdata.com.br',
      ...data,
      attachments: [{
        filename: 'logo_eucatur.png',
        path: `${imagePath}`,
        cid: 'logoImage'
      }]
    });
  }
  style() {
    return `<style>
              body {
                font-family: 'Inter', 'sans-serif';
                margin: 0;
                padding: 0;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-image: linear-gradient(180deg, #fbeaea 35%, #e3f7eb 100%);
                padding: 20px;
                border-radius: 32px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            h1 {
                font-size: 24px;
                color: #803b3b;
                text-align: '-webkit-center';
                align-content: 'center';
            }
            p {
                font-size: 16px;
                color: #333333;
                
            }
            .link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #803b3b;
                color: #1F2B3B;
                text-decoration: none;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
                color: #ffffff !important;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #333333;
            }
            img {
              width: 7rem;
              height: auto;
            }
          </style>`
  }
}

export default MailService;
