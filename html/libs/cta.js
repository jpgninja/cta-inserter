(function (window, document, undefined) {

	"use strict";


	/**
	 * ==================================================================
	 * Local variables
	 * ==================================================================
	 */
	var outline,
		ctaBox,
		ctaContextBox,
		animationDuration = 125,
		pub 							= {},
		bodyObject 				= document.getElementsByTagName('body')[0],
		self 							= {
			active: 	false,
			inserted: false
		};


	/**
	 * ==================================================================
	 * Initialisations
	 * ==================================================================
	 */

	function init() {
		// console.log('initing');

		// Initialize items
		initCTABox();
		
		// Create DomOutline object
		outline = new DomOutline({ onClick: outlineClickHandler});
		

		// initOutlineLibrary();

		addListeners();
	}

	function initCTABox() {

		var ctaStyles		= document.createElement('link'),
			ctaHeading 		= 'Ready to take things to the next level?',
			ctaButton 		= 'Request a FREE Quote!',
			ctaContext 		= '<div id="cta_Box234234234_context"><span class="item item-retry">&#10008;</span><span class="item item-ok">&#10004;</span></div>',
			ctaHtml 			= '<div id="cta_Box234234234"><h3>'+ctaHeading+'</h3><span class="btn-cta">'+ctaButton+'</span>'+ctaContext+'</div>';

		// Add it all to the DOM
		jQuery('body').append(ctaHtml);

		// Store our major elements in memory
		ctaBox 				= jQuery('#cta_Box234234234');
		ctaContextBox = jQuery('#cta_Box234234234_context');

		// Initiate CTA Styles
		ctaStyles.setAttribute('href', '//clientcoffee.com/cta/styles/cta.css');
		ctaStyles.setAttribute('rel', 'stylesheet');
		ctaStyles.setAttribute('type', 'text/css');
		ctaStyles.setAttribute('media', 'all');
		bodyObject.appendChild(ctaStyles);

	}


	// function initJqueryLibrary() {
	// 	var aCTA_jquery=document.createElement('script');

	// 	aCTA_jquery.setAttribute('src', '//code.jquery.com/jquery.js');
	// 	aCTA_jquery.onload = jQueryLibraryLoadedHandler;

	// 	bodyObject.appendChild(aCTA_jquery);
	// }

	// function initOutlineLibrary() {

	// 	var aCTA_outline=document.createElement('script');

	// 	aCTA_outline.setAttribute('src', '//apply-cta.jpgninja.loc/vendor/jquery.dom-outline-1.0.js');
	// 	aCTA_outline.onload = outlineLibraryLoadedHandler;
	// 	bodyObject.appendChild(aCTA_outline);
	// }

/**
 * ==================================================================
 * Listeners
 * ==================================================================
 */

	function addListeners() {
		jQuery(document)
			.on('keydown', checkForTriggerKey)
			.on('click', checkForTriggerCTA);

		jQuery('a')
			.on('click', checkForDisabledLinks);

		ctaBox
			.on('click', ctaClickHandler);

		// jQuery('body').on('', checkForTriggerKey);
	}

	function addContextListeners() {
		jQuery('#cta_Box234234234_context .item')
			.on('click', contextClickHandler);

		// jQuery('body').on('', checkForTriggerKey);
	}

	function removeContextListeners() {
		jQuery('#cta_Box234234234_context .item')
			.off('click', contextClickHandler);
	}






/**
 * ==================================================================
 * Call to Action
 * ==================================================================
 */



	function addCTA(chosenTargetElement) {
		if (!self.inserted) {
			// console.log('add cta');

			// Context
			enableContext();
			ctaBox.detach().insertBefore(chosenTargetElement).fadeIn(animationDuration);

			stop();
			self.inserted = true;
		}
	}

	function removeCTA() {
		if (self.inserted) {
			// console.log('remove cta');
			// start();
			
			// Context
			removeContextListeners();
			disableContext();

			ctaBox.fadeOut(animationDuration);

			self.inserted = false;
		}
	}

	function start() {
		self.active = true;
		outline.start();
		// console.log('starting');
  }

  function stop() {
    self.active = false;
    outline.stop();
    // console.log('stopping');
  }
  


/**
 * ==================================================================
 * Context
 * ==================================================================
 */

	function enableContext() {
		addContextListeners();
		ctaContextBox.fadeIn(animationDuration);
	}

	function disableContext() {
		removeContextListeners();
		ctaContextBox.fadeOut(animationDuration);
	}





/**
 * ==================================================================
 * Event Handlers
 * ==================================================================
 */


	// function outlineLibraryLoadedHandler() {
	// 	// Create DomOutline object
	// 	outline = new DomOutline({ onClick: outlineClickHandler});
	// }

	// function jQueryLibraryLoadedHandler() {
	// 	init();
	// }

	function checkForTriggerKey(e) {
	  
	  e = e || window.event;

	  if (e.which === 192) { // ~`

	  	if (self.active === true) {
	  		if (self.inserted === true) {
	  			enableContext();
	  		}
	  		else {
	  			stop();
	  		}
	  	}
	  	else {
	    	start();
	  	}

	    return false;
	  }

	}


	function checkForDisabledLinks(e) {
    e = e || window.event;

		if (self.active === true) {
	    e.preventDefault();
		}
	}


	function checkForTriggerCTA(e) { 

    e = e || window.event;

		if (self.active === true) {

	    e.preventDefault();
	    e.stopPropogation();

			addCTA();

			return false;

		}

	}

	function ctaClickHandler(e) {
    e = e || window.event;
    e.preventDefault();
    
  	enableContext();
	}

	function contextClickHandler(e) {
    e = e || window.event;


    e.preventDefault();
    
    e = jQuery(e.currentTarget);

  	disableContext();

    if (e.hasClass('item-retry')) {
    	removeCTA();
    	start();
    }
    // else if (e.hasClass('item-ok')) {
    // 	console.log('ok');
    // }

    return false;
	}


	function outlineClickHandler(e) {
    e = e || window.event;
    e = jQuery(e);

  	if (e.length > 0) {
	  	addCTA(e);
  	}

	}


	// initJqueryLibrary();
	init();
  return false;

})(window, document);