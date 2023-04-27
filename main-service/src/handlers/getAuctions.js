import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from "../lib/commonMiddleware";
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndingAt',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      }
    }
    const result = await dynamodb.query(params).promise();

    auctions = result.Items;
  } catch(e) {
    console.log(e);
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({
    inputSchema: getAuctionsSchema,
    useDefaults: true,
  }));
