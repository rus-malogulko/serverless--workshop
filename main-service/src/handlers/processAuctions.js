import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedAuctions';
import { closeAuction } from '../lib/closeAuction';
async function processAuctions(event, context) {
  let closePromises;
  try {
    const auctionsToClose = await getEndedAuctions();
    closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    closed: closePromises.length,
  };
}

export const handler = processAuctions;
