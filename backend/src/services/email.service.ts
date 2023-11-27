import axios from "axios";

export class EmailService {
  private token: string;

  constructor(private host: string, token: string, private fromEmail: string) {
    this.token = encodeURIComponent(token);
  }

  async sendEmail(
    name: string,
    email: string,
    subject: string,
    htmlContent: string,
    textContent: string
  ) {
    const url = `https://${this.host}/api/accounts/messaging/email?code=${this.token}`;
    const result = await axios.post(url, {
      toAddresses: [
        {
          name,
          email,
        },
      ],
      htmlContent,
      textContent,
      fromEmail: this.fromEmail,
      fromName: "Syphon",
      subject,
    });
    return result.status === 200;
  }
}
