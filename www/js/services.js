  angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('Utils', function() {
  return {
    normalize: function (e){
      e=e.replace(/[áàãâäª]/g,"a");
      e=e.replace(/[ÁÀÃÂÄ]/g,"A");
      e=e.replace(/[éèêë&]/g,"e");
      e=e.replace(/[ÉÈÊË]/g,"E");
      e=e.replace(/[íìîï]/g,"i");
      e=e.replace(/[ÍÌÎÏ]/g,"I");
      e=e.replace(/[óòõôöº]/g,"o");
      e=e.replace(/[ÓÒÕÔÖ]/g,"O");
      e=e.replace(/[úùûü]/g,"u");
      e=e.replace(/[ÚÙÛÜ]/g,"U");
      e=e.replace(/ç/g,"c");
      e=e.replace(/Ç/g,"C");
      e=e.replace(/ñ/g,"n");
      return e;
    }
  };
})
.factory('City', function($http) {
  return {
    getFromCoords: function (coords, successCallback, errorCallback) {
      console.log('entrou')
      var geolocationServiceUrl = 'https://maps.googleapis.com/maps/api/geocode/json?'+
        'address='+coords.latitude+','+coords.longitude;

      return $http.get(geolocationServiceUrl)
        .then(function (response) {

          if (response.data.results.length) {
            var cities = response.data.results[0].address_components.filter(function(value) {
              return value.types[0] == "administrative_area_level_2"; // Cidade
            });
            if (cities.length) {
              successCallback(cities[0].long_name);
              return;
            }
          }

          errorCallback();
        }, errorCallback);
    }
  };
})
.factory('Weather', function($http, Utils) {
  return {
    getData: function (city, successCallback, errorCallback) {
      var weatherServiceUrl = 'http://developers.agenciaideias.com.br/tempo/json/' + Utils.normalize(city);
      return $http.get('https://jsonp.afeld.me/?url='+encodeURI(weatherServiceUrl))
        .then(function(response) {
          if (response.data && !response.data.erro) {
            successCallback(response.data);
            return;  
          }
          errorCallback();
        }, errorCallback);
    }
  }
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    setArray: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getArray: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}]);