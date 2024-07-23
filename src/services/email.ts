import nodemailer, { Transporter} from 'nodemailer';
import 'dotenv/config'
import { google } from "googleapis"
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
const OAuth2 = google.auth.OAuth2;

const createTransporter = async (): Promise<Transporter> => {
    try {
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
            access_token: process.env.ACCESS_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log("*ERR: ", err)
                    reject();
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport<SMTPTransport.Options>({
            //@ts-ignore
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.USER_EMAIL,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        });
        return transporter;
    } catch (err: any) {
        return err
    }
};


class MailOptions {
    from: string = process.env.USER_EMAIL ? process.env.USER_EMAIL : '' 
    to: string = ''
    subject: string = 'Enviando Email usando Node.js'
    text: string = 'Isso foi fácil!'
    html: string = '<h1>Hello, Como vai</h1>'
    setFrom(f: string) {
        this.from = f
    }
    setTo(t: string) {
        this.to = t
    }
    setSubject(s: string) {
        this.subject = s
    }
    setText(t: string) {
        this.text = t
    }
    set(from: string, to: string, subject: string, text: string) {
        this.from = from
        this.to = to
        this.subject = subject
        this.text = text
    }
}
export default { createTransporter, options: new MailOptions() }

