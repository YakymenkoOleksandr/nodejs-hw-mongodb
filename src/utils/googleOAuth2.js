import { OAuth2Client } from 'google-auth-library';
import oauthConfig from '../../google-oauth.json';
import { ENV_VARS, env } from './env';

export const googleOAuthClient = new OAuth2Client({
  clientId: env(ENV_VARS.GOOGLE_AUTH_CLIENT_ID), // заміняємо змінні оточення
  clientSecret: env(ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET), // заміняємо змінні оточення
  redirectUri: oauthConfig.web.redirect_uris[0],
});
