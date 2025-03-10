// backend/utils/emailService.js
import nodemailer from "nodemailer";

/**
 * Envía un correo con un PDF adjunto.
 * @param {Object} params
 * @param {string} params.to - Email del destinatario
 * @param {string} params.subject - Asunto del correo
 * @param {string} params.text - Cuerpo del correo (texto plano)
 * @param {Buffer} params.pdfBuffer - Contenido del PDF en memoria
 * @param {string} params.pdfFilename - Nombre del archivo PDF
 */
export const sendEmailWithAttachment = async ({
  to,
  subject,
  text,
  pdfBuffer,
  pdfFilename
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // O el servicio SMTP que uses
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: pdfFilename || "Orden_Compra.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    return { success: true, message: "Correo enviado correctamente" };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, message: "Error al enviar el correo" };
  }
};
