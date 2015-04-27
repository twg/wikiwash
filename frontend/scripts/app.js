var wikiwash = { };

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
  $i18nextProvider.options = {
    lng: 'en',
    useCookie: false,
    useLocalStorage: false,
    fallbackLng: 'en',
    defaultLoadingValue: ''
  };
});
