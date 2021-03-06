var express = require('express');
var router = express.Router();
var Style = require('../models/style');

//sendgrid
var sendgrid = require('sendgrid')('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');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

 function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
}

function buttonAction1(res){
  res.send('ok');
}


// INDEX
router.get('/', authenticate, function(req, res, next) {
  // get all the styles and render the index view
  var styles = global.currentUser.styles;
  console.log('currentUser', global.currentUser);
  res.render('styles/index', { styles: styles});
});



// NEW
router.get('/new', authenticate, function(req, res, next) {
  var style = {
    type: '',
    tools: '',
    date: '',
    notes: '',
    duration: '',
    cost: '',
    stylist: '',
    haircutRating: '',
    salonName: '',
    salonLocation: '',
    avatar_url: ''
  };
  res.render('styles/new', { style: style});
});


// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  res.render('styles/show', { style: style} );
});


// EMAIL
// add req.body.media to text when aws api is added
router.post('/send', function (req, res, next) {
  console.log(req.body, global.currentUser.local.email);
  // buttonAction1(res);
  var textMessage = "\n Type: " + req.body.type +
                    " \n Tools: " + req.body.tools +
                    " \n Duration: " + req.body.duration +
                    " \n Cost: " + req.body.cost +
                    " \n Stylist: " + req.body.stylist +
                    " \n Salon: " + req.body.salonName +
                    " \n Salon Location: " + req.body.salonLocation +
                    " \n Notes: " + req.body.notes +
                    " \n Haircut Rating: " + req.body.haircutRating +
                    " \n Pictures: " + req.body.avatar_url
  var payload   = {
    to      : req.body.email,
    from    : global.currentUser.local.email,
    subject : 'Style.Up',
    text    : textMessage
  };
  // var error;
  sendgrid.send(new sendgrid.Email(payload), function(err, json) {
    if (err) {
      console.error('Sendgrid ERROR:', err);
      return next(err);
    }
    else {
      console.log('Sendgrid email sent successfully');
      res.redirect('/styles');
    }
  });
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  console.log(req.body);
  var style = {
    type: req.body.type,
    tools: req.body.tools,
    date: req.body.date,
    notes: req.body.notes,
    duration: req.body.duration,
    cost: req.body.cost,
    stylist: req.body.stylist,
    haircutRating: req.body.haircutRating,
    salonName: req.body.salonName,
    salonLocation: req.body.salonLocation,
    avatar_url: req.body.avatar_url
  };
  /* Since a user's styles are an embedded document, we just need to push a new style to the user's list of styles and save the user. */
  currentUser.styles.push(style);
  currentUser.save()
    .then(function(){
      res.redirect('/styles');
    }, function(err){
          return next(err);
    });
});


// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  res.render('styles/edit', { style: style});
});


// UPDATE
router.put('/:id', authenticate, function(req, res, next) {

  var style = currentUser.styles.id(req.params.id);
  if (!style) return next(makeError(res, 'Document not found', 404));
  else {
    style.type = req.body.type;
    style.tools = req.body.tools;
    style.date = req.body.date;
    style.notes = req.body.notes;
    style.duration = req.body.duration;
    style.cost = req.body.cost;
    style.stylist = req.body.stylist;
    style.haircutRating = req.body.haircutRating;
    style.salonName = req.body.salonName;
    style.avatar_url = req.body.avatar_url;
    style.salonLocation = req.body.salonLocation;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/styles');
    }, function(err) {
      return next(err);
    });
  };
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
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
