const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARE
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin
// api.natours.com, natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id' cors())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',
        'blob:', // allow Mapbox’s worker bootstrap
      ],
      styleSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://fonts.googleapis.com', // allow Google Fonts CSS
        "'unsafe-inline'",
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com', // allow Google Fonts files
      ],
      imgSrc: ["'self'", 'data:'],
      workerSrc: [
        "'self'",
        'blob:', // specifically allow blob: for WebWorkers
      ],
      connectSrc: ["'self'", 'https://api.mapbox.com', 'blob:'],
      // add any other directives you need…
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//3)ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
