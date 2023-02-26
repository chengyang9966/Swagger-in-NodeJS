import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import {createStream} from 'rotating-file-stream';
import allRouter from "./Routes/index";

dotenv.config();
const PORT = process.env.PORT || 4001;

const app = express();

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))


// // create a rotating write stream
var accessLogStream = createStream('access.log', {
  interval: '1d', // rotate daily
  compress: true,
  size: "10M",
  path: path.join(__dirname,'..', 'log')
})

// setup the logger
app.use(morgan("combined",{
  stream:accessLogStream
}));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var whitelist = ['https://editor-next.swagger.io', 'http://localhost:4001']
var corsOptions = {
  maxAge:360,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 ||!origin) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS',false)
    }
  }
}
app.use(cors(corsOptions));

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Sales X API",
      version: "1.0.0",
      description: "Sales API X",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "My API Documentation",
      },
    ],
    components: {
      securitySchemes: {
        authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter a valid bearer token.'
        }
      }
    },
    // security: [{
    //   authorization: []
    // }]
  },
  apis: ["./src/Routes/*.js","./src/Routes/components.yaml"],
};

const specs = swaggerJsDoc(options);

app.use('/public',express.static('./src/public'))
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs,{customCssUrl:['/public/css/theme-monamutedkai.css']}));
app.use('/api',allRouter)

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
