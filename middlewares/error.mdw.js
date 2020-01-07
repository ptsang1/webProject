module.exports = function (app) {
  app.get('/err', function (req, res) {
    throw new Error('beng beng');
  })

  app.use(function (req, res) {
    res.render('404', {
      layout: false
    });
  })

  //
  // default error handler

  app.use(function (err, req, res, next) {
    console.log(err);
    res.send('error');
  })
}
