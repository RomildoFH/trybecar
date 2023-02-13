module.exports = (req, res, next) => {
  const { startingAddress, endingAddress } = req.body;
    
  if (!startingAddress || !endingAddress) {
    return res.status(400).json({ message: 'fields not passed' });
  }
    
  return next();
};