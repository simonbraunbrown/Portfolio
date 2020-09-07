function checkBrowserSupport() {
	if (!NodeList.prototype.forEach) {
		document.body.innerHTML =
			'<div style="position: absolute; width: 100%; height: 100%; background-color: #161616"><div style="margin: 20% auto; font-size: 2em; text-transform: uppercase; text-align: center; color: #d6d6d6;">your browser is not supported!<br>please consider to use a contemporary browser...</div></div>';
	}
}

function checkBrowserWidth() {
	const overlay = document.body.querySelector('.overlayFlip');

	if (!overlay && window.innerWidth < 500) {
		const overlay = document.createElement('div');
		overlay.className = 'overlayFlip';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.position = 'fixed';
		overlay.style.overflow = 'hidden';
		overlay.style.zIndex = '1000';
		overlay.style.top = '0';
		overlay.innerHTML =
			'<div style="position: absolute; width: 100%; height: 100%; background-color: #161616"><div style="margin: 0 auto; top: 0; transform: translateY(50%); font-size: 2em; text-transform: uppercase; text-align: center; color: #d6d6d6;"><svg style="display: block; margin: 10% auto" width="30%" height="30%" viewBox="0 0 30.0 30.0"><g> <path id="path52" d="M 16,7.9999997 C 26,7.9999997 26,18 26,18" style="fill:none;stroke:#d6d6d6;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> <path d="m 26.000002,20 -0.866026,-1.5 -0.866025,-1.5 1.732051,0 1.732051,0 -0.866026,1.5 z" id="path64" style="fill:#d6d6d6;fill-opacity:1" /> <path style="fill:none;stroke:#d6d6d6;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 14,8 C 4,8 4,18 4,18" id="path66" /> <path transform="scale(-1,1)" style="fill:#d6d6d6;fill-opacity:1" id="path68" d="m -3.9999997,20 -0.8660255,-1.5 -0.8660254,-1.5 1.7320509,0 1.7320507,0 -0.8660254,1.5 z" /> </g></svg>this viewport is to small<br>please rotate this device...</div></div>';
		document.body.appendChild(overlay);
	} else {
		if (overlay && window.innerWidth > 500) {
			document.body.removeChild(overlay);
		}
	}
}
