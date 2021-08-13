require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true,
}));
app.use(fileUpload({
  createParentPath: true,
}));

const di = require('./di');

require('./routes/auth.routes')(app, di);
require('./routes/user.routes')(app, di);
require('./routes/project.routes')(app, di);
require('./routes/segment.routes')(app, di);
require('./routes/issue.routes')(app, di);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

let port;

if (process.env.APP_ENV === 'development') {
  port = 8081;
} else {
  port = process.env.PORT || 3000;
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});
