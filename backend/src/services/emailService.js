const nodemailer = require('nodemailer');
const { email: emailConfig } = require('../config/env');

let transporter;
let warned = false;

const canSendEmails = () =>
  emailConfig?.enabled &&
  emailConfig.host &&
  emailConfig.port &&
  emailConfig.user &&
  emailConfig.pass;

const getTransporter = () => {
  if (!canSendEmails()) {
    if (!warned) {
      console.warn('Envio de email desativado. Configure as variáveis EMAIL_* para habilitar.');
      warned = true;
    }
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: Boolean(emailConfig.secure),
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });
  }

  return transporter;
};

const buildMessage = (appointment) => {
  const serviceName =
    typeof appointment.service === 'object' ? appointment.service.name : appointment.service;

  const text = [
    `Olá, ${appointment.customerName}!`,
    '',
    'Recebemos sua reserva. Seguem as informações:',
    `Data: ${new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')}`,
    `Horário: ${appointment.appointmentTime}`,
    `Serviço: ${serviceName}`,
    `Valor: R$ ${Number(appointment.totalPrice || 0).toFixed(2)}`,
    `Telefone: ${appointment.customerPhone}`,
    appointment.notes ? `Observações: ${appointment.notes}` : '',
    '',
    'Se precisar alterar algo é só responder este email.',
    'Equipe CleoLash'
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: 'Poppins', Arial, sans-serif; background:#fdf2f8; padding:24px;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 8px 24px rgba(236,72,153,0.15);color:#4a044e;">
        <tr>
          <td style="text-align:center;">
            <h1 style="margin:0 0 8px;font-size:26px;color:#be185d;">Reserva Confirmada</h1>
            <p style="margin:0;color:#6b7280;">Olá, ${appointment.customerName}! 😊</p>
            <p style="margin:12px 0 24px;color:#9d174d;">Recebemos sua reserva e aqui estão os detalhes:</p>
          </td>
        </tr>
        <tr>
          <td>
            <div style="border:1px solid #f9a8d4;border-radius:12px;padding:16px 20px;background:#fff5f7;">
              <p style="margin:0 0 12px;"><strong style="color:#be185d;">Serviço:</strong> ${serviceName}</p>
              <p style="margin:0 0 12px;"><strong style="color:#be185d;">Data:</strong> ${new Date(
                appointment.appointmentDate
              ).toLocaleDateString('pt-BR')}</p>
              <p style="margin:0 0 12px;"><strong style="color:#be185d;">Horário:</strong> ${
                appointment.appointmentTime
              }</p>
              <p style="margin:0 0 12px;"><strong style="color:#be185d;">Valor:</strong> R$ ${Number(
                appointment.totalPrice || 0
              ).toFixed(2)}</p>
              <p style="margin:0 0 12px;"><strong style="color:#be185d;">Telefone:</strong> ${
                appointment.customerPhone
              }</p>
              ${
                appointment.notes
                  ? `<p style="margin:0;"><strong style="color:#be185d;">Observações:</strong> ${appointment.notes}</p>`
                  : ''
              }
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;color:#6b7280;font-size:14px;text-align:center;">
            <p style="margin:0 0 8px;">Precisa remarcar ou tirar alguma dúvida? Basta responder este email.</p>
            <p style="margin:0;color:#be185d;font-weight:600;">Com carinho, Equipe CleoLash 💕</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  return {
    from: emailConfig.from,
    to: appointment.customerEmail,
    replyTo: emailConfig.replyTo,
    bcc: emailConfig.copyTo,
    subject: `Recebemos sua reserva - ${serviceName}`,
    text,
    html
  };
};

const sendAppointmentConfirmation = async (appointment) => {
  const mailer = getTransporter();
  if (!mailer) {
    return { sent: false, skipped: true };
  }

  try {
    await mailer.sendMail(buildMessage(appointment));
    return { sent: true };
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error.message);
    return { sent: false, error };
  }
};

module.exports = { sendAppointmentConfirmation };
