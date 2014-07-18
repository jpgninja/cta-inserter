var aCTA_url 	= 'clientcoffee.com/cta',
	// aCTA_url 		= 'apply-cta.jpgninja.loc/',
	aCTA_lib		= document.createElement('script'),
	aCTA_body		= document.getElementsByTagName('body')[0];

aCTA_lib.setAttribute('src', 'http://'+aCTA_url+'/cta.min.js');
aCTA_body.appendChild(aCTA_lib);

void(0);