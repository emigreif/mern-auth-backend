import nodemailer from "nodemailer";

export const sendEmailWithAttachment = async (to, subject, text, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // Tu email
        pass: process.env.EMAIL_PASS,  // Tu contraseña o clave de aplicación
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "Orden_Compra.pdf",
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
