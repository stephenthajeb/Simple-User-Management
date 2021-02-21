const jwt = require('jsonwebtoken')
const config = require('config')

exports.isAuth = (req, res, next) => {
  const token = req.header('x-auth-token')

  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token, authorization denied' }] })
  } else {
    try {
      const decoded = jwt.verify(token, config.get('ACCESS_TOKEN'))
      req.user = decoded.user
      return next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Session timed out,please login again' }] })
      } else if (err.name === 'JsonWebTokenError') {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid token,please login again!' }] })
      } else {
        return res.status(400).json({ error: [{ msg: err.message }] })
      }
    }
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' })
}
