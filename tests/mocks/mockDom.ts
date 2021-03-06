import * as jsdom from 'jsdom';
import * as fs from 'fs';

import { Context2DMock  } from './Context2D';
var iMockContext = new Context2DMock();

const VIEW_ELEMENT_ID = 'view'

export
function getViewElement(): HTMLElement {
    return document.getElementById( VIEW_ELEMENT_ID );
}

export
function mockDom( aScriptFiles, aDoneCallback ) {

    let scripts = loadScripts( aScriptFiles );

    jsdom.env({
        html: `<html><body><div id="${ VIEW_ELEMENT_ID }" style="width:500px; height:400px;"></div></body></html>`,
        src:  scripts,
        done: onDomLoaded
    });

    function loadScripts( aScriptFiles ) {
        var iScripts = [];
        aScriptFiles.forEach( function( aScriptFile ){
            var iScript = fs.readFileSync( aScriptFile, 'utf-8' );
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
        var originalCreateElement = aDocument.createElement;
        aDocument.createElement = function( tagName ) {
            var element = originalCreateElement.call( aDocument, tagName );
            if ( tagName.toLowerCase() === 'canvas' ) {
                element.getContext = function() {
                    return new Context2DMock();
                }
            }
            return element;
        };
    }

    function overrideOffsetGetters( aWindow ) {

        Object.defineProperties( aWindow.HTMLElement.prototype, {
            offsetLeft: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).left) || 0; }
            },
            offsetTop: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).top) || 0; }
            },
            offsetHeight: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).height) || 0; }
            },
            offsetWidth: {
                get: function() { return parseFloat( aWindow.getComputedStyle(this).width) || 0; }
            }
        });
    }

    function setGlobals( aWindow ) {
        global.window   = aWindow;
        global.document = aWindow.document;
        global.gefri    = aWindow.gefri;
    }

}
