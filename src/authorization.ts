import request from 'request'
import querystring from 'querystring'
import { Buffer } from 'buffer'
import { access } from 'fs';

const client_id: string = '482f2f80a66345e4810d441f7f8a0c5a'; // Your client id
const client_secret: string = '454c5ba931654cdbbbbb6db043a5700f'; // Your secre
const redirect_uri: string = `http://localhost:3000/callback`; // Your redirect uri
const scopes: string = 'user-read-private user-read-email user-library-read playlist-read user-read-recently-played user-top-read'; // Your scopes

const stateKey = 'spotify_auth_state';

const generateRandomString = function(length : number) : string {
  let text: string = '';
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


export function login(req:any, res:any) : void{
  const state: string = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopes,
      redirect_uri: redirect_uri,
      state: state
    }));
}

export function callback(req:any, res:any) : void{

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  let token : string = '';

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } 
  else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        // const options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        // use the access token to access the Spotify Web API
        // request.get(options, mydata);
        // function mydata(error:any, response:any, body:any) {
        //   // const data = body.display_name;
        //   // console.log('login user: ',data);
        // }

        const options: any = {
          url: `https://api.spotify.com/v1/me/top/tracks?limit=1`,
          headers: { 'Authorization': 'Bearer ' + access_token,},
          json: true
        };
        // console.log(options);
        request.get(options, mydata);
        function mydata(error:any, response:any, body:any) {
          const data = body.items;
          // console.log(body.href);
          console.log(data);
        }

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          })
        );
        // console.log('breakpoint');
        // res.send({
        //   'access_token': access_token
        // });
        // return access_token;
      } 
      else {
        res.send({
          error: 'invalid_token'
        });
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
        })
        );
      }
    });
  }
}

// refresh token
export function refresh_token(req:any, res:any) : void{
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
}

