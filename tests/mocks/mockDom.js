var iJsdom = require( 'jsdom' );
var iFs    = require( 'fs' );

var Context2DMock = require( './Context2D.ts' ).Context2DMock;
var iMockContext = new Context2DMock();

var mockDom = function( aScriptFiles, aDoneCallback ) {

    scripts = loadScripts( aScriptFiles );

    iJsdom.env({
        html: '<html><body><div id="view" style="width:500px; height:400px;"></div></body></html>',
        src:  scripts,
        done: onDomLoaded
    });

    function loadScripts( aScriptFiles ) {
        var iScripts = [];
        aScriptFiles.forEach( function( aScriptFile ){
            var iScript = iFs.readFileSync( aScriptFile, 'utf-8' );
            iScripts.push( iScript );
        });
        return iScripts;
    }

    function onDomLoaded( aError, aWindow ) {
        if ( aError ) {
            throw new Error( aError )
        } else {
            mockContext( aWindow.document );
            overrideOffsetGetters( aWindow );
            setGlobals( aWindow );
        }
        aDoneCallback();
    }

    function mockContext( aDocument ) {
        iMockContext = new Context2DMock();

        var originalCreateElement = aDocument.createElement;
        aDocument.createElement = function( tagName ) {
            var element = originalCreateElement.call( aDocument, tagName );
            if ( tagName.toLowerCase() === 'canvas' ) {
                element.getContext = function() {
                    return iMockContext;
                }
            }
            return element;
        };
    }

    function overrideOffsetGetters( aWindow ) {

        Object.defineProperties( aWindow.HTMLElement.prototype, {
            offsetHeight: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).height) || 0; }
            },
            offsetWidth: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).width) || 0; }
            }
        });
    }

    function setGlobals( aWindow ) {
        global.document = aWindow.document;
        global.gefri    = aWindow.gefri;
    }

}

module.exports = mockDom;
