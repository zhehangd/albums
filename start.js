console.log("console hello");


function requestFile(url, callback) {
  function fail(code) {
    var element = document.getElementById('test-response-text');
    element.innerHTML = 'Error code: ' + code;
    console.log("fail");
  }
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        return callback(request.responseText);
      } else {
        return fail(request.status);
      }
    } else {
    }
  }
  request.open('GET', url);
  request.send();
}

var albums = [];

function showAllAlbums () {
  var strs = []
  var view_category = {"albums" : []};
  for (var k = 0; k < window.albums.length; k++) {
    album = window.albums[k]
    var view_album = {};
    view_album.albumName = album.albumName;
    view_album.photos = [];
    for (var i in album.photoFiles) {
      photoFile = album.albumDirectory + '/' + album.photoFiles[i]
      thumbnailFile = album.albumDirectory + '/thumbnails/' + album.photoFiles[i]
      view_album.photos.push({'photoFile': photoFile, 'thumbnailFile': thumbnailFile});
    }
    view_category['albums'].push(view_album);
  }
  var template = document.getElementById('template-photo').innerHTML;
  var element = document.getElementById('main-group');
  element.innerHTML = Mustache.render(template, view_category);
}

function loadAlbumsJson() {
  requestFile("albums.json", function(content) {
    window.albums = JSON.parse(content);
    showAllAlbums();
  });
}

function dev() {
}

window.onload = function() {
  loadAlbumsJson();
  dev();
}
