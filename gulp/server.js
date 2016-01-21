'use strict';

var path = require( 'path' );
var gulp = require( 'gulp' );
var conf = require( './conf' );
//replace with your endpoint
var proxyLiveTarget = 'https://80.80.80.80';

//Assumption : wiremock is pointing to port 9006
var proxyMockTarget = 'http://localhost:9006';
var context = '/yourContextHere';
var browserSync = require( 'browser-sync' );
var browserSyncSpa = require( 'browser-sync-spa' );

var util = require( 'util' );

var proxyMiddleware = require( 'http-proxy-middleware' );

function browserSyncInit( baseDir, browser, env ) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;

    var options = {
        target: '',
        changeOrigin: '',
        https: '',
        secure: '',
        host: '0.0.0.0'
    };

    if ( baseDir === conf.paths.src || ( util.isArray( baseDir ) && baseDir.indexOf( conf.paths.src ) !== -1 ) ) {
        routes = {
            '/bower_components': 'bower_components'
        };
    }

    var server = {
        baseDir: baseDir,
        routes: routes
    };

    if ( env === 'mock' ) {
        options.target = proxyMockTarget;
        options.changeOrigin = false;
        options.https = false;
        options.secure = true;
    }

    if ( env ) {
        if ( env === 'mock' ) {
            options.target = proxyMockTarget;
            options.changeOrigin = false;
            options.https = false;
            options.secure = true;
        } else if ( env === 'live' ) {
            options.target = proxyLiveTarget;
            options.changeOrigin = true;
            options.https = true;
            options.secure = false;
        }

        server.middleware = proxyMiddleware( context, options );
    }

    browserSync.instance = browserSync.init( {
        startPath: '/',
        server: server,
        browser: browser } );
}

browserSync.use( browserSyncSpa( {
    selector: '[ng-app]' // Only needed for angular apps
} ) );

gulp.task( 'serve:mock', [ 'clean', 'watch' ], function() {
    browserSyncInit( [ path.join( conf.paths.tmp, '/serve' ), conf.paths.src ], null, 'mock' );
} );

gulp.task( 'serve', [ 'clean', 'watch' ], function() {
    browserSyncInit( [ path.join( conf.paths.tmp, '/serve' ), conf.paths.src ] );
} );

gulp.task( 'serve:live', [ 'clean', 'watch' ], function() {
    browserSyncInit( [ path.join( conf.paths.tmp, '/serve' ), conf.paths.src ], null, 'live' );
} );

gulp.task( 'serve:mock-backend', [ 'wire-mock', 'serve:mock' ] );

gulp.task( 'serve:dist', [ 'build' ], function() {
    browserSyncInit( conf.paths.dist );
} );

gulp.task( 'serve:e2e', [ 'inject' ], function() {
    browserSyncInit( [ conf.paths.tmp + '/serve', conf.paths.src ], [] );
} );

gulp.task( 'serve:e2e-dist', [ 'build' ], function() {
    browserSyncInit( conf.paths.dist, [] );
} );
