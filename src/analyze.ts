import request from 'request'
import querystring from 'querystring'
import { Buffer } from 'buffer'

// export function search_tracks(req:any, res:any) : void{
//   const refresh_token: any = req.query.refresh_token;
//   const access_token: any = req.query.access_token;
//   const q: string = 'track:love';
//   const type: string = 'track';
//   const options: any = {
//     url: `https://api.spotify.com/v1/search?q=track%3Alove&type=track&limit=1`,
//     headers: { 'Authorization': 'Bearer ' + access_token },
//     json: true
//   };

//   res.redirect(
//     '/#' +
//     querystring.stringify({
//       access_token: access_token,
//       refresh_token: refresh_token
//     })
//   );
// }
export function getTopTracks(req:any, res:any) {
  //const url = location.href;
  const refresh_token: any = req.query.refresh_token;
  const access_token: any = req.query.access_token;
  const options: any = {
    url: `https://api.spotify.com/v1/me/player/recently-played?`,
    headers: { 'Authorization': 'Bearer ' + access_token,
     'limit': 3 },
    json: true
  };
  res.redirect(
    '/#' +
    'result'
    // querystring.stringify({
    //   access_token: access_token,
    //   refresh_token: refresh_token
    // })
  );
  
  request.post(options, function(error:any, response:any, body:any){
    console.log(body);
  });

  // console.log('res>>>>>>>\n');
  // console.log(res.app);
  
  // const response = await getTopTracks();
  // const { items } = await response.json();

  // const tracks = items.slice(0, 10).map((track) => ({
  //   artist: track.artists.map((_artist) => _artist.name).join(', '),
  //   songUrl: track.external_urls.spotify,
  //   title: track.name
  // }));

  // return res.status(200).json({ tracks });
};

const getParams = (params: string): { [key: string]: string } => {
  const paramsArray = params.slice(1).split('&')
  const paramsObject: { [key: string]: string } = {}
  paramsArray.forEach(param => {
    paramsObject[param.split('=')[0]] = param.split('=')[1]
  });
  return paramsObject;
}