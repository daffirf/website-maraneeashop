// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    req.flash('error', 'Please login to access this page');
    return res.redirect('/auth/login');
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  } else {
    req.flash('error', 'Access denied. Admin privileges required.');
    return res.redirect('/');
  }
};

// Middleware to check if user is already logged in (for login/register pages)
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  } else {
    return next();
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfLoggedIn
};



