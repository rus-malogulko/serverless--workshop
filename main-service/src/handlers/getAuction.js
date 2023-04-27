import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const result = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch(e) {
    console.log(e);
    throw new createError.InternalServerError(e);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${event.pathParameters.id}" not found!`);
  }

  return auction;
}
async function getAuction(event, context) {
  let auction = await getAuctionById(event.pathParameters.id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  }
}

export const handler = commonMiddleware(getAuction);

