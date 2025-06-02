export function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // Usuario logueado, continúa
  }
  res.redirect('/login'); // No logueado, redirige al login
}