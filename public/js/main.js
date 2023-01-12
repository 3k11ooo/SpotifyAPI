// const hash = window.location.hash.toString();
const loginButton = document.getElementById('login');
const refreshButton = document.getElementById('loggedin');

function log(){
  console.log('click');
};
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

// const hashTag = hash.search('#') + 1;

// if(hashTag > 0){ // hashが存在しない
//   loginButton.style.display = 'none';
//   refreshButton.style.display = 'block';
  
// }
// else{ // hashが存在する
//   loginButton.style.display = 'block';
//   refreshButton.style.display = 'none';
// }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */


  // var userProfileSource = document.getElementById('user-profile-template').innerHTML,
  //     userProfileTemplate = Handlebars.compile(userProfileSource),
  const userProfilePlaceholder = document.getElementById('user-profile');

  // var oauthSource = document.getElementById('oauth-template').innerHTML,
  //     oauthTemplate = Handlebars.compile(oauthSource),
  const oauthPlaceholder = document.getElementById('oauth');

  const params = getHashParams();

  const access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

        
function search_tracks(){
  if (error) {
    alert('There was an error during the authentication');
  }
  else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = "";
      /*
      oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
      */
      let arrayData;
      let resData = {
        user_name: '',
        track_name: '',
        track_id: '',
        track_img: '',
        track_link: '',
        artists: '',
      };
      const me = fetch(
        'https://api.spotify.com/v1/me',
        {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token,
          },
      });
      me.then(async response => {
        // このブロックの中ではPromiseではなくて、通常の値として扱える
        // console.log("status", response.status); // => 200
        const response_1 = await response.json();
        console.log("me", response_1);
        resData.user_name = response.display_name;
        const search_tracks = fetch(
          'https://api.spotify.com/v1/me/player/recently-played?limit=1',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + access_token,
              'Content-Type': 'application/json'
            },
          }
        );
        search_tracks.then(async response => {
          const response_2 = await response.json();
          console.log("recently-played", response_2.items);
          resData.track_name = response_2.items[0].track.name,
          resData.track_id = response_2.items[0].track.id,
          resData.track_link = response_2.items[0].track.external_urls.spotify,
          resData.track_img = response_2.items[0].track.album.images[0].url;
          for(i=0; i<response_2.items[0].track.artists.length; i++){
            if(i>0) resData.artists += ', ';
            resData.artists += response_2.items[0].track.artists[i].name;
          };
          await drowData(resData);
        })
        search_tracks.catch(error => {
          console.error(error);
          alert("recently-played 読み込み失敗");
        })
      })
      me.catch(error => {
        console.error(error);
        alert("読み込み失敗");
      });
    }
    else {
      // render initial screen
      // $('#login').show();
      // $('#loggedin').hide();
      loginButton.style.display = 'block';
      refreshButton.style.display = 'none';
    }
  }
}
async function drowData(data){

}
