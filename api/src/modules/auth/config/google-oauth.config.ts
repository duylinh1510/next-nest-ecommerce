import { registerAs } from '@nestjs/config';

export default registerAs('googleOAuth', () => {
  if (!process.env.GOOGLE_CLIENT_ID)
    throw new Error('GOOGLE_CLIENT_ID missing');
  if (!process.env.GOOGLE_CLIENT_SECRET)
    throw new Error('GOOGLE_CLIENT_SECRET missing');
  if (!process.env.GOOGLE_CALLBACK_URL)
    throw new Error('GOOGLE_CALLBACK_URL missing');

  return {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callBackURL: process.env.GOOGLE_CALLBACK_URL,
  };
});
