// backend/utils/emailService.js
import nodemailer from "nodemailer";

/**
 * Envía un correo con un archivo PDF adjunto
 * @param {String} to - Destinatario
 * @param {String} subject - Asunto
 * @param {String} text - Cuerpo del email
 * @param {Buffer} pdfBuffer - Contenido del PDF en Buffer
 * @returns {Object} - { success: Boolean, message: String, info: Object }
 */
export async function sendEmailWithAttachment(to, subject, text, pdfBuffer) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "orden_compra.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Correo enviado correctamente", info };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, message: "Error al enviar el correo", error };
  }
}
