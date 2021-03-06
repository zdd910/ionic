angular.module('starter.services', ['restangular'])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
                id: 1,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'img/max.png'
            }, {
                id: 2,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'img/adam.jpg'
            }, {
                id: 3,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'img/perry.png'
            }, {
                id: 4,
                name: 'Mike Harrington',
                lastText: 'This is wicked good ice cream.',
                face: 'img/mike.png'
            }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('Account', function ($q, Restangular, $window, Storage) {
        //var Account = new Restangular.allUrl('one', 'http://192.168.3.104:18080/api/user_trade/');
        return {
            register: function (data) {
                var Account = Restangular.allUrl('/user_trade/signup');
                if (data.type == "TRAFFIC") {
                    Account = Restangular.allUrl('/user_traffic/signup');
                }
                var d = $q.defer();
                Account.post(data).then(function (result) {
                    console.log("result",result);
                    if (result.status == "success") {
                        Storage.set('userInfo',result.data);// = JSON.stringify(result.data);
                        d.resolve(result);
                    } else {
                        d.reject(result);
                    }
                }, function (error) {
                    d.reject(error);
                })
                return d.promise;
            },
            checkPhoneExist: function (phone) {
                var promis = $q.defer();
                var Phone = Restangular.one('/phone/exist/', phone);
                Phone.get().then(function (result) {
                    console.log(result)
                    promis.resolve(result);
                }, function (error) {
                    promis.reject(error);
                    console.log(error);
                });
                return promis.promise;
            },
            getCode: function (phone) {
                var Phone = Restangular.one('/phone/get_verify_code/', phone);
                var promis = $q.defer();
                Phone.get().then(function (result) {
                    promis.resolve(result);
                }, function (error) {
                    promis.reject(error);
                })
                return promis.promise;
            }
        }
    })
    .factory('Phone', function ($q, Restangular) {
        var PhoneService = Restangular.allUrl('phone/')
    })
    .factory('ListConfig', function () {
        var companyType = [{
            text: '交易型企业',
            value: 'TRADE'
        }, {
                text: '物流型企业',
                value: 'TRAFFIC'
            }]


        return {
            getCompanyType: function () {
                return companyType;
            }
        }
    })
    .factory('authenticationService', function ($window) {
        var userInfo;

        function getUserInfo() {
            return userInfo;
        }

        function init() {
            if ($window.sessionStorage['userInfo']) {
                userInfo = JSON.parse($window.sessionStorage['userInfo']);
            }
        }

        init();
        return {
            getUserInfo: getUserInfo()
        };
    })
    .factory('Storage', function ($log) {
        return {
            set: function (key, data) {
                return window.sessionStorage.setItem(key, window.JSON.stringify(data));
            },
            get: function (key) {
                return window.JSON.parse(window.sessionStorage.getItem(key));
            },
            remove: function (key) {
                window.sessionStorage.removeItem(key);
            }
        }
    })