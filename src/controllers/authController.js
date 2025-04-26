const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const user = await prisma.user.findUnique({ 
      where: { username },
      select: {
        id: true,
        username: true,
        password: true
      }
    });

    if (!user) {
      console.log('User not found:', username);
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    console.log('User found, verifying password...');
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.render('auth/login', { error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.redirect('/todos');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { 
      error: 'An error occurred during login. Please try again.',
      username: req.body.username 
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.render('auth/register', { 
        error: 'Username and password are required',
        username: username 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.render('auth/register', { 
        error: 'Username already exists',
        username: username 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    console.log('User registered successfully:', username);
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', { 
      error: 'An error occurred during registration. Please try again.',
      username: req.body.username 
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

exports.renderLogin = (req, res) => {
  res.render('auth/login');
};

exports.renderRegister = (req, res) => {
  res.render('auth/register');
}; 