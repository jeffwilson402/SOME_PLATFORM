require('dotenv').config();
import * as AWS from 'aws-sdk';
const ssmClient = new AWS.SSM();
const { MONGO_DB_NAME, MONGO_HOST } = process.env;

const getMongoCreds = async () => {
  const param = await ssmClient
    .getParameter({
      Name: '/mongo/credentials',
      WithDecryption: true,
    })
    .promise();

  return param.Parameter?.Value;
};

export const getMongoUrl = async () => {
  const mongoCreds = await getMongoCreds();
  return `mongodb+srv://${mongoCreds}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
};
