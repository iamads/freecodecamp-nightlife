'use strict';

var _ = require('lodash');
var Bar = require('./bar.model');

// Get list of bars
exports.index = function(req, res) {
  Bar.find(function (err, bars) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(bars);
  });
};
// Search for place

exports.places = function(req,res){
console.log(process.env['yelp_consumer_key']);
console.log(req.params);
var Yelp = require('yelp')

var yelp = new Yelp({ 
	consumer_key: process.env['yelp_consumer_key'],
	consumer_secret: process.env['yelp_consumer_secret'],
	token: process.env['yelp_token'],
	token_secret: process.env['yelp_token_secret']
	});
yelp.search({term:'bar',location:req.params.location}, function(err,bars){
	if (err){ return handleError(res,err); }
	if (!bars){return res.status(200).send("No bar Found");}
	return res.status(200).json(bars['businesses']);
});
};



// Get a single bar
exports.show = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    return res.json(bar);
  });
};

// Creates a new bar in the DB.
exports.create = function(req, res) {
  Bar.create(req.body, function(err, bar) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(bar);
  });
};

// Updates an existing bar in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bar.findById(req.params.id, function (err, bar) {
    if (err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    var updated = _.merge(bar, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(bar);
    });
  });
};

// Deletes a bar from the DB.
exports.destroy = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    bar.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  console.log(err);	
  return res.status(500).send(err);
}
