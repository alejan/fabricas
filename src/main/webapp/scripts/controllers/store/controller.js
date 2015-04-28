﻿'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
var app = angular.module("sbAdminApp");

app.controller('storeController', ['$scope', 'UsuarioFactoryCompra', 'DataService', '$cookies', '$timeout',
    'TarjetaFactoryCompra', 'CompraFactory', 'TarjetasFactoryCompra', 'ComprasFactory', '$location', 'bancos',
    function ($scope, UsuarioFactoryCompra, DataService, $cookies, $timeout,
            TarjetaFactoryCompra, CompraFactory, TarjetasFactoryCompra, ComprasFactory, $location, bancos) {

        // get store and cart from service
        $scope.store = DataService.store;
        $scope.cart = DataService.cart;
        $scope.pagoTarjeta = {direccion: null};
        $scope.pagoTarjeta.usuario;
        $scope.usuarioLogin = JSON.parse($cookies.id);
        $scope.pagoTarjeta.direccion = $scope.usuarioLogin.perId.perDireccion;
        $scope.usuario = UsuarioFactoryCompra.show({id: 1});
        $scope.tipos = ["VISA", "American Express", "Master Card"];
        $scope.siguienteId = CompraFactory.nextId();
        $scope.tarjetasiguienteId = TarjetaFactoryCompra.nextId();

        $scope.pagoPSE = {direccion: null};
        $scope.pseBanco = bancos.bancos;
        $scope.pagoPSE.direccion = $scope.usuarioLogin.perId.perDireccion;

        $scope.createAction = function () {
            var idTarjeta = '';
            var idCompra = '';
            var key = '';
            for (key in $scope.tarjetasiguienteId)
            {
                if (key === '$promise')
                    break;
                idTarjeta = idTarjeta + $scope.tarjetasiguienteId[key];
            }
            for (key in $scope.siguienteId)
            {
                if (key === '$promise')
                    break;
                idCompra = idCompra + $scope.siguienteId[key];
            }

            var tarjeta = {persona: null, tarNumero: null, tarFechaExpiracion: null, tarCodigoSeguridad: null, tarTipo: null,
                tarjetacreditoPK: null};
            var validaHasta = $scope.pagoTarjeta.validaHasta;
            var validaHastaArray = validaHasta.split("/");
            var validadhastaFecha = new Date("20" + validaHastaArray[1] + "-" + validaHastaArray[0] + "-01");
            console.log("asd" + validadhastaFecha);
            tarjeta.tarTipo = $scope.pagoTarjeta.tipo;
            tarjeta.tarNumero = $scope.pagoTarjeta.numTarjeta;
            tarjeta.tarFechaExpiracion = validadhastaFecha;
            tarjeta.tarCodigoSeguridad = $scope.pagoTarjeta.cvc;
            tarjeta.persona = $scope.usuarioLogin.perId;

            tarjeta.tarjetacreditoPK = {perId: $scope.usuarioLogin.perId.perId, tarId: idTarjeta};

            TarjetasFactoryCompra.create(tarjeta);
            $timeout(function () {
                var compra = {comCiudad: null, comDireccion: null, comId: null, comPais: null, comValor: null, tarjetacredito: null,
                    tipPagId: {tipPagId: 1, tipPagNombre: "Tarjeta de CrÃ©dito"}, usuId: null};
                compra.comCiudad = $scope.pagoTarjeta.ciudad;
                compra.comDireccion = $scope.pagoTarjeta.direccion;
                compra.comPais = $scope.pagoTarjeta.pais;
                compra.comValor = $scope.cart.getTotalPrice();
                compra.tarjetacredito = tarjeta;
                compra.usuId = $scope.usuarioLogin;
                compra.comId = idCompra;
                console.log('VALOR: ' + compra.comValor);
                ComprasFactory.create(compra);
                $location.path('dashboard/summary');
                $scope.cart.clearItems();
            }, 1000);




        };
        $scope.createbyPSE = function () {

            var idCompra = '';
            var key = '';

            for (key in $scope.siguienteId)
            {
                if (key === '$promise')
                    break;
                idCompra = idCompra + $scope.siguienteId[key];
            }

            var compra = {comCiudad: null, comDireccion: null, comId: null, comPais: null, comValor: null, tarjetacredito: null,
                tipPagId: {tipPagId: 2, tipPagNombre: "PSE"}, usuId: null};
            compra.comCiudad = $scope.pagoPSE.ciudad;
            compra.comDireccion = $scope.pagoPSE.direccion;
            compra.comPais = $scope.pagoPSE.pais;
            compra.comValor = $scope.cart.getTotalPrice();
            compra.usuId = $scope.usuarioLogin;
            compra.comId = idCompra;
            console.log('VALOR: ' + compra.comValor);
            ComprasFactory.create(compra);
            $location.path('dashboard/summary');
   $scope.cart.clearItems();
        };

     

    }]);

app.factory("DataService", function () {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "xxxxxxx",
            {
                ship_method_name_1: "UPS Next Day Air",
                ship_method_price_1: "20.00",
                ship_method_currency_1: "USD",
                ship_method_name_2: "UPS Ground",
                ship_method_price_2: "15.00",
                ship_method_currency_2: "USD"
            }
    );

    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the 
    // shopping cart with Stripe, you have to create a merchant account with 
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    myCart.addCheckoutParameters("Stripe", "pk_test_xxxx",
            {
                chargeurl: "https://localhost:1234/processStripe.aspx"
            }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});

app.factory('UsuarioFactoryCompra', function ($resource) {
    return $resource('/StampUreStyle2.0/webresources/usuario/:id', {}, {
        show: {method: 'GET'},
        update: {method: 'PUT', params: {id: '@disId'}},
        delete: {method: 'DELETE', params: {id: '@id'}}
    });
});
app.factory('TarjetasFactoryCompra', function ($resource) {
    return $resource('/StampUreStyle2.0/webresources/tarjetacredito', {},
            {
                query: {method: 'GET', isArray: true},
                create: {method: 'POST'}

            });
});
app.factory('TarjetaFactoryCompra', function ($resource) {
    return $resource('/StampUreStyle2.0/webresources/tarjetacredito/:id', {}, {
        show: {method: 'GET'},
        update: {method: 'PUT', params: {id: '@disId'}},
        delete: {method: 'DELETE', params: {id: '@id'}},
        nextId: {method: 'GET', params: {id: 'nextId'}, isArray: false}
    });
});
app.factory('ComprasFactory', function ($resource) {
    return $resource('/StampUreStyle2.0/webresources/compra', {},
            {
                query: {method: 'GET', isArray: true},
                create: {method: 'POST'}

            });
});
app.factory('CompraFactory', function ($resource) {
    return $resource('/StampUreStyle2.0/webresources/compra/:id', {}, {
        show: {method: 'GET'},
        update: {method: 'PUT', params: {id: '@disId'}},
        delete: {method: 'DELETE', params: {id: '@id'}},
        nextId: {method: 'GET', params: {id: 'nextId'}, isArray: false}
    });
});

app.factory('bancos', function () {
    return {bancos: [{
                "nombre": "Bancolombia"
            }, {
                "nombre": "Davivienda"
            }, {
                "nombre": "Banco De Occidente"
            }, {
                "nombre": "AVvillas"
            }, {
                "nombre": "Colpatria"
            }, {
                "nombre": "Citibank"
            }, {
                "nombre": "Banco de Bogota"
            }, {
                "nombre": "Helm Bank"
            }, {
                "nombre": "Scotia Bank"
            }]



    }
});