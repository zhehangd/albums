console.log("console hello");


function requestFile(url, callback) {
  function fail(code) {
    var textarea = document.getElementById('test-response-text');
    textarea.innerHTML = 'Error code: ' + code;
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

function render_album_preview(dirname) {
    function success(content) {
        var album = JSON.parse(content);
        var strs = []
        for (var i in album.photoFiles) {
          photoFile = album.directory + '/' + album.photoFiles[i]
          thumbnailFile = album.directory + '/' + album.thumbFiles[i]
          strs.push('<div class="album">');
          strs.push('  <a target="_blank" href="' + photoFile + '">');
          strs.push('    <img class="cover-main" src="' + thumbnailFile + '" alt="Ballade" width="200" height="200"');
          strs.push('  </a>');
          strs.push('</div>');
          strs.push('');
        }
        
        var textarea = document.getElementById('dynamic-container');
        textarea.innerHTML = strs.join('\n');
    }

  function fail(code) {
    var textarea = document.getElementById('test-response-text');
    textarea.innerHTML = 'Error code: ' + code;
    console.log("fail");
  }

  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        return success(request.responseText);
      } else {
        return fail(request.status);
      }
    } else {
    }
  }
  
  request.open('GET', '/albums');
  request.send();
}

var albums = [];

function showAllAlbums () {
  var strs = []
  
  for (var k = 0; k < window.albums.length; k++) {
    album = window.albums[k]
    strs.push('      <h2> ' + album.albumName + ' </h2>')
    strs.push('      <div class="gallery-container">')
    for (var i in album.photoFiles) {
      photoFile = album.albumDirectory + '/' + album.photoFiles[i]
      thumbnailFile = album.albumDirectory + '/thumbnails/' + album.photoFiles[i]
      strs.push('        <div class="album">');
      strs.push('          <a target="_blank" href="' + photoFile + '">');
      strs.push('            <img class="cover-main" src="' + thumbnailFile + '" alt="Ballade" width="200" height="200"');
      strs.push('          </a>');
      strs.push('        </div>');
      strs.push('');
    }
    strs.push('      </div>')
  }
  stars = strs.join('\n');
  var textarea = document.getElementById('main-group');
  textarea.innerHTML = stars;
}

function loadAlbumsJson() {
  requestFile("albums.json", function(content) {
    window.albums = JSON.parse(content);
    showAllAlbums();
  });
  
}

window.onload = function() {
  loadAlbumsJson();
}
