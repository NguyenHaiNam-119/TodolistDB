const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
};

exports.redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/todos');
    } catch (error) {
      res.clearCookie('token');
    }
  }

  next();
}; 