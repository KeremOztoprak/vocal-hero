var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'); //yeni expresste boyleymis



var app = express();

// model
mongoose.Promise = global.Promise; //deprecation icin eklendi
mongoose.connect('mongodb://localhost/my_database');

var Todo = mongoose.model('Todo', new mongoose.Schema({
  text: String,
  done: Boolean,
  order: Number
}));

// app.configure(function(){
  // app.use(bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(application_root, "public")));
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//app.set('views', path.join(application_root, "views"));
//app.set('view engine', 'jade')
// });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())
//
// app.use(function(req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// })



// more middleware (executes after routes)
// app.use(function(req, res, next) {});
// error handling middleware
// app.use(function(err, req, res, next) {});

app.get('/', function(req, res) {
  res.send('Hello World');
});

//app.get('/todo', function(req, res){
//  res.render('todo', {title: "MongoDB Backed TODO App"});
//});
//why
app.get('/todo', function(req, res) {
  res.sendfile(__dirname + '/public/static.html');
});

app.get('/api/todos', function(req, res) {
  return Todo.find(function(err, todos) {
    return res.send(todos);
  });
});

app.get('/api/todos/:id', function(req, res) {
  return Todo.findById(req.params.id, function(err, todo) {
    if (!err) {
      return res.send(todo);
    }
  });
});

app.put('/api/todos/:id', function(req, res) {
  return Todo.findById(req.params.id, function(err, todo) {
    todo.text = req.body.text;
    todo.done = req.body.done;
    todo.order = req.body.order;
    return todo.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(todo);
    });
  });
});

app.post('/api/todos', function(req, res) {
  var todo;
  todo = new Todo({
    text: req.body.text,
    done: req.body.done,
    order: req.body.order
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(todo);
});

app.delete('/api/todos/:id', function(req, res) {
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('')
      }
    });
  });
});

app.listen(3000);
