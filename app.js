const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');

const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
const playerRoutes = require('./routes/playerRoutes');
const newsRoutes = require('./routes/newsRoutes');
const streamerRoutes = require('./routes/streamerRoutes');
const mainViewRoutes = require('./routes/mainViewRoutes');
const adminViewRoutes = require('./routes/adminViewRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

app.locals.moment = require('moment');

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set security http headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// preventing dos and bruteforce dengan rate lmiting
const limiter = rateLimit({
  max: 3000, //100 request
  windowMs: 60 * 60 * 1000, //per jam
  message: 'To many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data sanitization after body parser is perfect place
// 1) data sanitization against nosql query injection
app.use(mongoSanitize());

// 2) data sanitization against xss
// clean any user i n put from malisius html code, by converting all html symbol
app.use(xss());

// prevent paameter polution
// whitelist: pengecualian
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/', mainViewRoutes);
app.use('/panel-admin', adminViewRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/streamer', streamerRoutes);

// handling unhandled routes
app.all('*', (req, res, next) => {
  // if the next(args) recieve arguments, express assume that is an error,
  // and will be pass all middleware stack and go straight to middleware error in below
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

// error handling middleware by express,
app.use(require('./controllers/errorControllers'));

module.exports = app;
