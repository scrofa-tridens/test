function popup_mess_form(div, e, Param, popup_xyP, popup_xdP, popup_ydP) {
	for(key in Param) {
		document.getElementById(key).value = Param[key];
	}
	if(typeof(popup_xyP) != "string") popup_xyP = 'right_bottom';
	if(typeof(popup_xdP) != "number") popup_xdP = 20;
	if(typeof(popup_ydP) != "number") popup_ydP = 10;
	popup_show_hide(div, e, popup_xyP, popup_xdP, popup_ydP);
}
function popup_up(source, id, evt) {
	var p = document.getElementById(id);
	document.body.appendChild(p);
	if(window.getComputedStyle(p, null).display == "none") {
		p.style.visiblity = "hidden"; p.style.display = "block";
		var l = parseInt(0 - p.offsetWidth / 2 - source.offsetWidth / 2);
		var t = parseInt(0 - p.offsetHeight / 2 - source.offsetHeight / 2);
		p.style.display = "none"; p.style.visiblity = "visible";
	} else {
		var l = parseInt(0 - p.offsetWidth / 2 - source.offsetWidth / 2);
		var t = parseInt(0 - p.offsetHeight / 2 - source.offsetHeight / 2);
	}
	popup_show_hide(p, evt, "right_bottom", l, t);
}
function popup_show_hide(element, evt, popup_xy, popup_xd, popup_yd) {
	if(!element.popup_again) {
		element.popup_again = true;
		if(window.getComputedStyle(element, null).position == "absolute"
		&& element.parentNode != document.body) {
			document.body.appendChild(element);
		}
		element.classList.add("disappear");
		element.addEventListener("click", function() {this.popup_top();}, false);
	}
	evt.stopPropagation();
	element.popup_source = evt.target;
	element.popup_xy = popup_xy;
	element.popup_xd = popup_xd;
	element.popup_yd = popup_yd;
	if(element.popup_shown) {
		if(evt.type == "mouseover" && element.popup_shown == true) {return;}
	} else {
		if(element.classList.contains("disappear")
		|| window.getComputedStyle(element, null).display == "none"
		|| window.getComputedStyle(element, null).visibility == "hidden") {
			element.popup_shown = false;
		} else {element.popup_shown = true;}
	}
	var popup_over_timeout = null;
	element.popup_source.popup_over = false;
	element.popup_over = false;
	element.popup_hide = function() {
		element.classList.add("disappear"); element.classList.remove("appear");
		element.style.zIndex = "";
		if(window.getComputedStyle(element, null).position == "absolute") {
			window_resize();
		}
		try {
			element.popup_source.removeEventListener("mouseover", element.popup_source_mouseover, false);
			element.removeEventListener("mouseover", element.element_mouseover, false);
			element.popup_source.removeEventListener("mouseout", element.popup_source_mouseout, false);
			element.removeEventListener("mouseout", element.element_mouseout, false);
		} catch(e) {}
		if(document.popuped.indexOf(element) != -1) {document.popuped.splice(document.popuped.indexOf(element), 1);}
	}
	element.popup_show = function() {
		element.style.left = "auto";
		element.style.top = "auto";
		element.popup_top();
		if(window.getComputedStyle(element, null).display == "none") {element.style.visiblity = "hidden"; element.style.display = "block";}
		element.popup_put();
		element.classList.add("appear"); element.classList.remove("disappear");
		if(window.getComputedStyle(element, null).visiblity == "hidden") {element.style.visiblity = "visible";}
		document.popuped.push(element);
	}
	element.popup_put = function() {
		if(window.getComputedStyle(element, null).position == "absolute") {
			var popup_x, popup_y;
			var source_pos = getElementPosition(element.popup_source);
			var popup_parent_pos = getElementPosition(element.parentNode);
			switch(element.popup_xy) {
				case "mouse" :
					popup_x = evt.clientX + document.body.parentNode.scrollLeft;
					popup_y = evt.clientY + document.body.parentNode.scrollTop;
					break;
				case "left_top" :
					popup_x = source_pos.left - element.offsetWidth;
					popup_y = source_pos.top - element.offsetHeight;
					break;
				case "right_top" :
					popup_x = source_pos.left + element.popup_source.offsetWidth;
					popup_y = source_pos.top - element.offsetHeight;
					break;
				case "right_bottom" :
					popup_x = source_pos.left + element.popup_source.offsetWidth;
					popup_y = source_pos.top + element.popup_source.offsetHeight;
					break;
				case "left_bottom" :
					popup_x = source_pos.left - element.offsetWidth;
					popup_y = source_pos.top + element.popup_source.offsetHeight;
					break;
			}
			element.style.left = popup_x + element.popup_xd - popup_parent_pos.left + "px";
			element.style.top = popup_y + element.popup_yd - popup_parent_pos.top + "px";
		}
	}
	element.popup_top = function() {
		var zi = Number(window.getComputedStyle(element, null).zIndex);
		for(var i = 0; i < document.popuped.length; i++) {
			zi = Math.max(zi, window.getComputedStyle(document.popuped[i], null).zIndex);
		}
		element.style.zIndex = zi + 1;
	}
	element.popup_source_mouseover = function() {
		element.popup_source.popup_over = true;
		if(popup_over_timeout != null) {clearTimeout(popup_over_timeout); popup_over_timeout = null;}
	}
	element.element_mouseover = function() {
		element.popup_over = true;
		if(popup_over_timeout != null) {clearTimeout(popup_over_timeout); popup_over_timeout = null;}
	}
	element.popup_source_mouseout = function() {
		var target = evt.relatedTarget;
		if(!isParent(target, element.popup_source)) {
			element.popup_source.popup_over = false;
			popup_over_timeout = window.setTimeout(function() {
				if(element.popup_source.popup_over == false && element.popup_over == false) {
					element.popup_shown = false;
					element.popup_hide();
				}
			}, 200);
		}
	}
	element.element_mouseout = function() {
		var target = evt.relatedTarget;
		if(!isParent(target, element)) {
			element.popup_over = false;
			popup_over_timeout = window.setTimeout(function() {
				if(element.popup_source.popup_over == false && element.popup_over == false) {
					element.popup_shown = false;
					element.popup_hide();
				}
			}, 200);
		}
	}
	switch(element.popup_xy) {
		case "left_top" : case "right_top" : case "right_bottom" : case "left_bottom" : break;
		default :
			element.popup_xy = "right_bottom";
			break;
	}
	switch(typeof element.popup_xd) {
		case "number" : break;
		case "undefined" : default :
			element.popup_xd = 0 - element.popup_source.offsetWidth;
			break;
	}
	switch(typeof element.popup_yd) {
		case "number" : break;
		case "undefined" : default :
			element.popup_yd = 0;
			break;
	}
	switch(evt.type) {
		case "mouseover" :
			element.popup_source.popup_over = true;
			element.popup_shown = true;
			element.popup_show();
			element.popup_source.addEventListener("mouseover", element.popup_source_mouseover, false);
			element.addEventListener("mouseover", element.element_mouseover, false);
			element.popup_source.addEventListener("mouseout", element.popup_source_mouseout, false);
			element.addEventListener("mouseout", element.element_mouseout, false);
			break;
		default :
			if(element.popup_shown == false) {
				element.popup_shown = true;
				element.popup_show();
			} else {
				element.popup_shown = false;
				element.popup_hide();
			}
			break;
	}
}
function make_popup(rolling_element, rolling_sample, rolling_event, rolling_popup_xy, rolling_popup_xd, rolling_popup_yd) {
	var rolling_source = [];
	var rolling_shower;
	if(Array.isArray(rolling_sample)) {
		rolling_source.obj = rolling_sample[0];
		rolling_source.url = rolling_sample[1];
	} else {
		rolling_source.obj = rolling_sample;
		rolling_source.url = "javascript:;";
	}
	switch(typeof rolling_source.obj) {
		case "object" :
			rolling_shower = rolling_source.obj;
			break;
		case "string" :
			rolling_shower = document.createElement("a");
			rolling_shower.href = rolling_source.url;
			typeof rolling_shower.innerText == "undefined" ? rolling_shower.textContent = rolling_source.obj : rolling_shower.innerText = rolling_source.obj;
			rolling_element.parentNode.insertBefore(rolling_shower, rolling_element);
			break;
		case "undefined" : default :
			rolling_shower = document.createElement("a");
			rolling_shower.href = rolling_source.url;
			typeof rolling_shower.innerText == "undefined" ? rolling_shower.textContent = "Подробнее" : rolling_shower.innerText = "Подробнее";
			rolling_element.parentNode.insertBefore(rolling_shower, rolling_element);
			break;
	}
	switch(rolling_event) {
		case "click" :
			rolling_shower.addEventListener("click", function(event_this) {popup_show_hide(rolling_element, event_this, rolling_popup_xy, rolling_popup_xd, rolling_popup_yd);}, false);
			break;
		case "mouseover" : case "undefined" : default :
			rolling_shower.addEventListener("mouseover", function(event_this) {popup_show_hide(rolling_element, event_this, rolling_popup_xy, rolling_popup_xd, rolling_popup_yd);}, false);
			break;
	}
}
if(!document.popuped) {
	document.popuped = new Array();
	document.addEventListener("click", function(evt) {
		var popup_source = evt.target;
		var clear = true;
		for(var i = 0; i < document.popuped.length; i++) {
			if(popup_source === document.popuped[i] || isParent(popup_source, document.popuped[i])) {
				clear = false; break;
			}
		}
		if(clear) {
			while(document.popuped.length !== 0) {
				popup_show_hide(document.popuped.pop(), evt);
			}
		}
	}, false);
	window.addEventListener("resize", function(evt) {
		for(var i = 0; i < document.popuped.length; i++) {
			if(document.popuped[i].popup_shown) {document.popuped[i].popup_put();}
		}
	}, false);
}
