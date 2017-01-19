function getElementPosition(element) {
	var l = 0;
	var t = 0;
	var w = element.offsetWidth;
	var h = element.offsetHeight;
	while(element) {
		l += element.offsetLeft;
		t += element.offsetTop;
		element = element.offsetParent;
	}
	return {"left":l, "top":t, "width":w, "height":h};
}
function isParent(child, parent) {
	if(!child || !parent) {return false;}
	while(true) {
		if(child.parentNode) {child = child.parentNode;}
			else {return false;}
		if(child == parent) {return true;}
	}
}
function window_resize() {
	if(typeof document.createEvent != "undefined") {
		var window_onresize = document.createEvent("HTMLEvents");
		window_onresize.initEvent("resize", true, true);
		window.dispatchEvent(window_onresize);
	} else {
		if(typeof document.createEventObject != "undefined") {
			var window_onresize = document.createEventObject();
			document.documentElement.fireEvent("onresize", window_onresize);
		}
	}
}
