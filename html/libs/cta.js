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
		ctaButton,
		animationDuration = 125,
		pub 							= {},
		bodyObject 				= document.getElementsByTagName('body')[0],
		self 							= {
			active: 	false,
			context: 	false,
			shifted: 	false,
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

		var ctaStyles				= document.createElement('link'),
			ctaHeadingLabel 	= 'Ready to take things to the next level?',
			ctaButtonLabel 		= 'Request a FREE Quote!',
			ctaContext 				= '<div id="cta_Box234234234_context"><span class="item item-retry">&#10008;</span><span class="item item-ok">&#10004;</span></div>',
			ctaHtml 					= '<div id="cta_Box234234234"><h3>'+ctaHeadingLabel+'</h3><span class="btn-cta">'+ctaButtonLabel+'</span>'+ctaContext+'</div>';

		// Add it all to the DOM
		jQuery('body').append(ctaHtml);

		// Store our major elements in memory
		ctaBox 				= jQuery('#cta_Box234234234');
		ctaContextBox = jQuery('#cta_Box234234234_context');
		ctaButton 		= ctaBox.find('.btn-cta');

// console.log('ctabtn', ctaButton);
		// Initiate CTA Styles
		ctaStyles.setAttribute('href', 'http://'+aCTA_url+'/styles/cta.css');
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
			.on('keydown', 	checkForTriggerKeyDown)
			.on('keyup', 		checkForTriggerKeyUp)
			.on('mouseup', 	checkForTriggerCTA);

		jQuery('form')
			.on('submit', 	checkForDisabledActions);

		jQuery('a')
			.on('click', 		checkForDisabledActions);

		ctaBox
			.on('click', 		ctaClickHandler);

		ctaButton
			.on('click', 		disableAction);

		// jQuery('body').on('', checkForTriggerKeyDown);
	}

	function addContextListeners() {
		jQuery('#cta_Box234234234_context .item')
			.on('click', contextClickHandler);

		// jQuery('body').on('', checkForTriggerKeyDown);
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
			console.log('ctaBox', ctaBox);

			stop();
			self.inserted = true;
			// return false;
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
  

	function setColor(source) {
		var sourceElement,
			sourceColor,
			sourceBackgroundColor;

		if (source) {
			
			// var value = (self.shifted === true) ? 'color' : 'background-color';

			sourceElement = jQuery(source);
			sourceBackgroundColor = sourceElement.css('background-color');
			sourceColor = sourceElement.css('color');
			ctaBox.css({
				'background-color': sourceBackgroundColor,
				'color': sourceColor,
				'border': 'none'
			});

			ctaBox.find('.btn-cta').css('background-color', sourceColor);

		}
	}

/**
 * ==================================================================
 * Context
 * ==================================================================
 */

	function enableContext() {
		addContextListeners();
		ctaContextBox.fadeIn(animationDuration);
		self.context 	= true;
	}

	function disableContext() {
		removeContextListeners();
		ctaContextBox.fadeOut(animationDuration);
		self.context 	= false;
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

	function checkForTriggerKeyDown(e) {
	  
	  e = e || window.event;

	  self.shifted = e.shiftKey;

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

	function checkForTriggerKeyUp(e) {
		self.shifted = e.shiftKey;
	}


	function checkForDisabledActions(e) {
    e = e || window.event;

    var isDisabled = (
    	(self.active === true)
    	|| ((self.inserted === true) && (self.context === true))
  	);

    console.log('checkForDisabledActions:', isDisabled);

		if (isDisabled) {
	    // e.preventDefault();
	    disableAction(e);
	    return false;
		}

		// if (self.)
// console.log('self.active:', self.active)

	}

	function disableAction(e) {
		console.log('disabling action');
		e.preventDefault();
		return false;
	}

	function checkForTriggerCTA(e) { 

    e = e || window.event;

    // console.log('checkForTriggerCTA, self.active:', self.active, 'self.context', self.context);
    var targetElement = jQuery(e.target);
    console.log('targetElement.parents(ctaBox).length', targetElement.parents(ctaBox).length)

			// console.log('checkForTriggerCTA adding cta');
			// console.log(targetElement, 'is: ', , 'is within: ', ());
		if (self.active === true) {

	    e.preventDefault();



			addCTA(e);

			return false;

		}
		else if (
			(self.active === false) 
			&& (self.context === true)
			&& (self.inserted === true)
			&& (!targetElement.is('#cta_Box234234234'))
			&& (!targetElement.is('#cta_Box234234234_context'))
			&& (!targetElement.parent().is('#cta_Box234234234'))
			&& (!targetElement.parent().is('#cta_Box234234234_context'))
		) {
	  
	    // e.preventDefault();


	    setColor(e.target);
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