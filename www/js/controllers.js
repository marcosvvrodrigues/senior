angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('WelcomeCtrl', function($scope, $ionicLoading, $localstorage, $ionicNavBarDelegate, City) {
  var cities = $localstorage.getArray('cities');
  // $cordovaNetwork.isOnline();
  if (!navigator.onLine) {
    if (cities.length) {
      location.href = '#/weather/' + cities[0];
    } else {
      alert('Para consultar sua localização é necessário estar online.')
      return;
    }
  }

  $ionicLoading.show({
    template: 'Obtendo sua localização...'
  });
  

  navigator.geolocation.watchPosition(function(position) {
  },
  function (error) { 
    if (error.code == error.PERMISSION_DENIED)
      alert('Não foi possível definir sua localização atual, pois você não compartilhou sua localização.');
      $ionicLoading.hide();
      var cities = $localstorage.getArray('cities');
      if (cities[0]) {
        location.href  = '#/weather/' + cities[0];
      }
  });

  // Talvez usar cordova geolocation
  navigator.geolocation.getCurrentPosition(function(position) {
    

    City.getFromCoords(position.coords, function successCallback(city) {
      if (cities.indexOf(city) == -1)  {
        cities.push(city);
        $localstorage.setArray('cities', cities);
      }

      location.href = '#/weather/' + city;
    }, function errorCallback() {
      alert('Não foi possível definir sua localização atual.');
    }).finally(function () {
      $ionicLoading.hide();
    });
  });
})

.controller('WeatherCtrl', function($scope, $stateParams, $ionicLoading, $localstorage, Weather) {
  var city = $stateParams.city;

  function prepareData(data) {
    $scope.loaded = true;
    
    if (data.agora) {
      data.agora.imagem = data.agora.imagem.replace('http://developers.agenciaideias.com.br/images/', 'img/');
      $scope.now = data.agora;
    }

    $scope.days = [];
    if (data.previsoes) {
      $scope.days = data.previsoes.slice(1,4);
      angular.forEach($scope.days, function(value) {
        var brDate = value.data.split(' - ')[1];
        value.data = new Date(brDate.split('/').reverse());

        if (value.imagem) {
          value.imagem = value.imagem.replace('http://developers.agenciaideias.com.br/images/', 'img/');
        }
      });
      console.log($scope.days);
    }
  }

  function lastData() {
    var data = $localstorage.getObject('weather-'+city);
    prepareData(data);
  }

  // No data yet
  if (navigator.onLine) {
    $ionicLoading.show({
      template: 'Obtendo informações sobre o clima de ' + city
    });

    Weather.getData(city, function successCallback(data) {
      $localstorage.setObject('weather-'+city, data);
      prepareData(data);
      //console.log(data);
    }, function errorCallback() {
      alert('Não foi possível definir o clima atual.');

      lastData();
    })
    .finally(function () {
        $ionicLoading.hide();
    });
  } else {
    // Offline
    lastData();
  }

  $scope.city = city;
  $scope.editCities = function () {
    location.href = '#/cities';
  };
  $scope.swipeLeft = function () {
    var cities = $localstorage.getArray('cities');
    var next = cities.indexOf(city) + 1;
    if (next > (cities.length - 1)) {
      next = 0;
    }

    location.href = '#/weather/'+cities[next];
  };
  $scope.swipeRight = function () {
    var cities = $localstorage.getArray('cities');
    var previous = cities.indexOf(city) - 1;
    if (previous < 0) {
      previous = cities.length - 1;
    }
    location.href = '#/weather/'+cities[previous];
  };
})
.controller('CitiesCtrl', function($scope, $localstorage, $ionicNavBarDelegate) {
  $scope.cities = $localstorage.getArray('cities');

  $scope.deleteCity = function ($index) {
    $scope.cities.splice($index, 1);
    $localstorage.setArray('cities', $scope.cities);
  };
  $scope.addCity = function (city) {
    $scope.cities.push(city);
    $localstorage.setArray('cities', $scope.cities);
  };
});