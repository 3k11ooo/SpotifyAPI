const hash = window.location.hash.toString();
const loginButton = document.getElementById('login');
const refreshButton = document.getElementById('loggedin');

const hashTag = hash.search('#') + 1;

if(hashTag > 0){ // hashが存在しない
  loginButton.style.display = 'none';
  refreshButton.style.display = 'block';
  
}
else{ // hashが存在する
  loginButton.style.display = 'block';
  refreshButton.style.display = 'none';
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

var params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

if (error) {
  alert('There was an error during the authentication');
}
else {
  if (access_token) {
    // render oauth info
    // oauthPlaceholder.innerHTML = oauthTemplate({
    //   access_token: access_token,
    //   refresh_token: refresh_token
    // });
    let arrayData;
    let resData = {
      user_name: '',
      track_name: '',
      track_id: '',
      track_img: '',
      track_link: '',
      artists: '',
    };
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token,
        },
        success: function(response) {
          // console.log(response);
          resData.user_name = response.display_name;
        }
    });

    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/recently-played?limit=3',
        // url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(response) {
          console.log(response.items);
          for(i=0; i<response.items.length; i++){
            arrayData[i] = resData;
            arrayData[i].resData.track_name = response.items[i].track.name,
            arrayData[i].resData.track_id = response.items[i].track.id,
            arrayData[i].resData.track_link = response.items[0].track.external_urls.spotify,
            arrayData[i].resData.track_img = response.items[i].track.album.images[0].url;
                // track_preview = response.items[0].preview_url;
            for(j=0; j<response.items[0].track.artists.length; j++){
              if(j>0)
              arrayData[i].resData.artists += ', ';
              arrayData[i].resData.artists += response.items[0].track.artists[j].name;
            }
            userProfilePlaceholder.innerHTML = userProfileTemplate(arrayData[i].resData);
          }

          $('#login').hide();
          $('#loggedin').show();
        }
        
    });
    // console.log(resData);
  }
  else {
    // render initial screen
    $('#login').show();
    $('#loggedin').hide();
  }
}
