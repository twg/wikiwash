var wikiwash = { };

window.locale = {
  current: function() {
    var language = location.hostname.split('.')[0];

    switch (language)
    {
      case 'en':
      case 'fr':
      case 'de':
      case 'ru':
      case 'es':
      case 'pt':
        return language;
      default:
        return 'en';
    }
  }
};

angular.module('wikiwash', [
  'btford.socket-io',
  'ngSanitize',
  'ngRoute',
  'route-segment', 
  'view-segment',
  'ngAnimate',
  'underscore',
  'SmoothScroll',
  'ngCsv',
  'jm.i18next'
]).config(function($i18nextProvider) {
  var _locale = window.locale.current();

  $i18nextProvider.options = {
    lng: _locale,
    useCookie: false,
    useLocalStorage: false,
    fallbackLng: 'en',
    resGetPath: 'locales/' + _locale + '.json',
    defaultLoadingValue: ''
  };
});
