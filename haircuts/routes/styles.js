var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Styles = require('../models/style');



function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// function authenticate(req, res, next) {
//   if(!req.isAuthenticated()) {
//     req.flash('error', 'Please signup or login.');
//     res.redirect('/');
//   }
//   else {
//     next();
//   }
// }

// INDEX
router.get('/', function(req, res, next) {
  // get all the styles and render the index view
  var styles = global.currentUser.styles;
  res.render('styles/index', { styles: styles});
});


// NEW
router.get('/styles/new', function(req, res, next) {
  var style = {
    type: '',
    tools: '',
    notes: '',
    duration: '',
    media: '',
    cost: '',
    stylist: '',
    haircutRating: '',
    salonName: ''
  };
  res.render('styles/new', { style: style});
});


// SHOW
router.get('/:id', function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  res.render('styles/show', { style: style} );
});


// CREATE
router.post('/', function(req, res, next) {
  var style = {
    type: req.body.type,
    tools: req.body.tools,
    notes: req.body.notes,
    duration: req.body.duration,
    media: req.body.media,
    cost: req.body.cost,
    stylist: req.body.stylist,
    haircutRating: req.body.haircutRating,
    salonName: req.body.salonName
  };
  /* Since a user's styles are an embedded document, we just need to push a new style to the user's list of styles and save the user. */
  currentUser.styles.push(style);
  currentUser.save()
  .then(function() {
    res.redirect('/styles');
  }, function(err) {
    return next(err);
  });
});


// EDIT
router.get('/:id/edit', function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  res.render('styles/edit', { style: style});
});

// UPDATE
router.put('/:id', function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  else {
    style.type = req.body.type;
    style.tools = req.body.tools
    style.notes = req.body.notes;
    style.duration = req.body.duration;
    style.media = req.body.media;
    style.cost = req.body.cost;
    style.stylist = req.body.stylist;
    style.haircutRating = req.body.haircutRating;
    style.salonName = req.body.salonName;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/styles');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.styles.indexOf(style);
  currentUser.styles.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/styles');
  }, function(err) {
    return next(err);
  });
});



module.exports = router;
