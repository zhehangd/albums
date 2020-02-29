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

var albums_meta = [];

class ViewSwitcher {
  constructor() {
    this.timeouts = {};
  }
  
  switchView(elementId, newContent) {
    if (this.timeouts.hasOwnProperty(elementId)) {
      window.clearTimeout(this.timeouts[elementId]);
    }
    var switcher = this;
    var element = document.getElementById(elementId);
    element.style.opacity = 0;
    this.timeouts[elementId] = window.setTimeout(function() {
      element.innerHTML = newContent;
      element.style.opacity = 1;
      delete switcher.timeouts[elementId];
    }, 500);
  }
}

var viewSwitcher = new ViewSwitcher()

function showSubcategory(subcategory_meta) {
  var view_category = {"albums" : []};
  for (var k = 0; k < subcategory_meta['albums'].length; k++) {
    album = subcategory_meta['albums'][k]
    var view_album = {};
    view_album.albumName = album.albumName;
    view_album.photos = [];
    for (var i in album.photoFiles) {
      photoFile = album.albumPath + '/' + album.photoFiles[i]
      thumbnailFile = album.albumPath + '/thumbnails/' + album.photoFiles[i]
      view_album.photos.push({'photoFile': photoFile, 'thumbnailFile': thumbnailFile});
      new Image().src = thumbnailFile;
    }
    view_category['albums'].push(view_album);
  }
  var template = document.getElementById('template-subcategory').innerHTML;
  var content = Mustache.render(template, view_category);
  viewSwitcher.switchView('dev-group', content)
}

function showCategoryByName(categoryName) {
  var good = false;
  for (var k = 0; k < window.albums_meta['categories'].length; k++) {
    category = window.albums_meta['categories'][k]
    if (category.categoryName == categoryName) {
      showSubcategory(category);
      good = true;
      break;
    } else {
      continue;
    }
  }
  if (!good) {console.error('Cannot find category ' + categoryName);}
}

function loadAlbumsJson() {
  requestFile("albums.json", function(content) {
    window.albums_meta = JSON.parse(content);
    showCategoryByName('Astrophotography')
    //showSubcategory(window.albums_meta['categories'][0]);
    dev();
  });
}

function dev() {
  var view_main = {"categories" : []};
  for (var k = 0; k < window.albums_meta['categories'].length; k++) {
    category = window.albums_meta['categories'][k]
    view_category = {
      'categoryName': category.categoryName,
      'coverFile': category.coverImage,
    };
    view_main["categories"].push(view_category);
  }
  var template = document.getElementById('template-main').innerHTML;
  var content = Mustache.render(template, view_main);
  viewSwitcher.switchView('main-group', content)
}

window.onload = function() {
  loadAlbumsJson();
}
