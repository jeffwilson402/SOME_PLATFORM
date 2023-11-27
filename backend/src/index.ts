import { APIGatewayEvent, Context } from 'aws-lambda';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application, Request } from 'express';
import helmet from 'helmet';
import { connectDatabase, uploadMiddleWare } from './db/connector';
import routes from './routes';
import { fileSizeLimit } from './constants/enum';
import serverless from 'serverless-http';

const app: Application = express();
const port = process.env.PORT || 5000;
// Optional: Configure cors to prevent unauthorised domain to access your resources
const corsOptionsDelegate = (req: Request, callback: any) => {
  let corsOptions;
  // Enable CORS for this request
  corsOptions = {
    origin: true,
    'cross-origin-resource-policy': 'cross-origin',
  };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
// app.post(
//   "/api/project/upload_file",
//   uploadMiddleWare.single("file"),
//   projectController.fileUpload
// );

// Optional: To add additional security to protect your HTTP headers in response.
app.use(helmet());
// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: `${fileSizeLimit}mb` }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
routes(app, uploadMiddleWare);
// importSkills();
// importRoleCategory();
// importCategoryRoles();
// importSchemaRoles();
// importSchemaSkills();
// importRoles();
// importUsers();
// importProjects();
// fixDB();
// importUserXProject();
// transfer();
// updateEmails();
server.listen(port, () =>
  console.log("Server is up and running at port: " + port)
);

const handler = serverless(app);
module.exports.handler = async (event: APIGatewayEvent, context: Context) => {
  await connectDatabase();
  return await handler(event, context);
};
