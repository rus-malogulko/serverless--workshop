import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import validator from '@middy/validator';
import commonMiddleware from "../lib/commonMiddleware";
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function createAuction(event, context) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: new Date(now.setHours(now.getHours() + 1)).toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email
  }

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch(e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction)
  .use(validator({
  inputSchema: createAuctionSchema,
  useDefaults: true,
}));


