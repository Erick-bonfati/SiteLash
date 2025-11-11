const { contact } = require('../config/env');

const getPublicSettings = (req, res) => {
  const whatsapp = contact.whatsapp
    ? {
        display: contact.whatsapp.display,
        phone: contact.whatsapp.phone,
        link: contact.whatsapp.link
      }
    : null;

  res.json({
    whatsapp
  });
};

module.exports = {
  getPublicSettings
};
