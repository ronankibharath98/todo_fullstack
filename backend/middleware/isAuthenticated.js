import jwt from 'jsonwebtoken';

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token =  req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
        success: false,
        message: 'Unauthorized, token missing' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // Attach the user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ 
        success: false,
        message: 'Unauthorized, invalid token' 
    });
  }
};

export default isAuthenticated;
