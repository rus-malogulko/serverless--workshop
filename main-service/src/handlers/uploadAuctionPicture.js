import { getAuctionById } from './getAuction';
import { uploadPictuteToS3 } from '../lib/uploadPicture';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import middy from '@middy/core';
import HttpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';
import validator from '@middy/validator';
import uploadAuctionPictureSchema from '../lib/schemas/uploadAuctionPictureSchema';

export async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  if (email !== auction.seller) {
    console.log(`User ${email} is not the seller of auction ${id}. Auction seller: ${auction.seller}`);
    throw new createError.Forbidden(`You are not the seller of this auction!`);
  }

  let updatedAuction;

  try {
    const uploadToS3Result = await uploadPictuteToS3(auction.id + '.jpg', buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, uploadToS3Result.Location);
    console.log(updatedAuction);
  } catch (e) {
    console.log(e);
    throw new createError.HttpError(e);
  }

  return { statusCode: 200, body: JSON.stringify(updatedAuction) };
}

export const handler = middy(uploadAuctionPicture)
  .use(HttpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionPictureSchema }));
