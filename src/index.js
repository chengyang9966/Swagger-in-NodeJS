import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import {createStream} from 'rotating-file-stream';
import allRouter from "./Routes/index";
import {existsSync } from 'fs';
import helmet from 'helmet'
let environment= process.argv.pop()
let configPath=path.join(__dirname,'..','env','.default.env')
if(environment){
  let newPath=path.join(__dirname,'..','env',`.${environment}.env`);
  if(existsSync(newPath)){
    configPath=newPath
  }
}

dotenv.config({path:configPath});
const PORT = process.env.PORT || 4001;

const app = express();

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))


// // create a rotating write stream
var accessLogStream = createStream('console.log', {
  interval: '1d', // rotate daily
  compress: true,
  size: "10M",
  path: path.join(__dirname,'..', 'logs')
})

// setup the logger
app.use(morgan("combined",{
  stream:accessLogStream
}));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet())
var corsOptions = {
  maxAge:360,
  origin: function (origin, callback) {
    if (process.env.whitelist.indexOf(origin) !== -1 ||!origin) {
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
        url: process.env.swagger_url,
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
