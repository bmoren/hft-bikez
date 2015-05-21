//
// Highscores server
//
var levelup = require('levelup')
var router = require('tiny-router')
var location = __dirname + '/db'
var options = {
  valueEncoding: 'json'
}

// create and open the database
var db = levelup(location, options)

var saveHighscores = function(req, res){
  var data = Object.keys(req.body)[0]
  data = JSON.parse(data);
  // save kill highscore
  db.put('hs/kill', data.kill, function(err){
    // save survival highscore
    db.put('hs/time', data.time, function(err){
      // respond with data
      var error = (err) ? err : false
      var saved = (!err) ? true : false
      res.send({error: error, saved: saved})
    })
  })
}

var getHighscores = function(req, res){
  db.get('hs/kill', function(err, kill){
    db.get('hs/time', function(err, time){
      var results = {
        kill: kill,
        time: time
      }
      res.send(results)
    })
  })
}

// tiny router for the API
router
  .get('/', getHighscores)
  .post('/save', saveHighscores)
  .get('/test', function(req, res){
    res.send({test:"ok", another:1234})
  })
router.listen(3000)