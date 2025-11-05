module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(statusCode).json({ message });
};
