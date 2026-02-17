function validateSignup(req, res, next) {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters.' });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  next();
}

module.exports = { validateSignup, validateLogin };
