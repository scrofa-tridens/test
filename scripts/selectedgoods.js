/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Скрипт прокручиваемого списка товаров с их асинхронной подгрузкой

	var sgConts;
	sgStart();

	function sgOnError(a) {
		if (a.abort) {
			if (typeof a.message === "undefined") {
				a.message = "Что-то пошло не так…";
			}
			if (typeof a.container !== "undefined") {
				a.container.sgFailed = a.message;
			}
			throw a.message;
		}
	}
	// Асинхронный вызов указанной функции, которой передаётся объект XMLHttpRequest
	function sgXhr(url, func, container, idx, abort) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					func(xhr, container, idx);
				} else {
					sgOnError({
						message: "Не могу получить вот это: " + url,
						container: container, abort: abort
					});
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);
	}
	// Самое начало: сбор контейнеров на странице и инициализация каждого из них
	function sgStart() {
		sgConts = document.getElementsByClassName("sga_container");
		for (var i = sgConts.length - 1; i >= 0; i--) {
			if (!sgConts[i].sgInitialized && !sgConts[i].sgFailed) {
				sgXhr(sgConts[i].getAttribute("sgGoodsXml"), createGoods, sgConts[i], i, true);
				if (!sgConts[i].sgFailed) {
					sgConts[i].sgInitialized = true;
				}
			}
		}
	}
	// Создание для контейнера массива объектов товаров и представления
	function createGoods(xhr, target, idxCont) {
		var rootObject = {};var goodsObjects = [];
		var root = xhr.responseXML.documentElement;
		for (var i = root.attributes.length - 1; i >= 0; i--) {
			rootObject[root.attributes[i].name] = root.attributes[i].value;
		}
		var goods = xhr.responseXML.getElementsByTagName("good");
		var goodsCount = Math.min(Number(target.getAttribute("sgCount")), goods.length);
		var goodsScrollCount = target.getAttribute("sgScrollCount") ? Number(target.getAttribute("sgScrollCount")) : 1;
		for (var i = 0; i < goods.length; i++) {
			goodsObjects.push(new GoodObject(goods[i], i));
		}
		ReactDOM.render(React.createElement(Goods, {
			idxCont: idxCont,
			data: rootObject,
			goods: goodsObjects,
			count: goodsCount,
			scroll: goodsScrollCount
		}), target);
	}
	// Конструктор объекта товара
	function GoodObject(g, p) {
		this.loaded = false;
		this.order = null;
		for (var i = g.attributes.length - 1; i >= 0; i--) {
			switch (true) {
				case /^\s*$/.test(g.attributes[i].value):
					break;
				case /^[0-9.,]+$/.test(g.attributes[i].value):
					this[g.attributes[i].name] = Number(g.attributes[i].value);
					break;
				default:
					this[g.attributes[i].name] = g.attributes[i].value;
			}
		}
		this.key = this.id ? this.id : p;
		if (this.url) {
			this.url = this.articul ? this.url + "/" + this.articul : this.url + "/goods_" + this.id;
		}
		if (this.pic) {
			this.picM = "/pic/micro/" + this.pic;
			this.picS = "/pic/small/" + this.pic;
			this.picB = "/pic/big/" + this.pic;
		}
	}

	// React

	var Goods = function (_React$Component) {
		_inherits(Goods, _React$Component);

		function Goods(props) {
			_classCallCheck(this, Goods);

			var _this = _possibleConstructorReturn(this, (Goods.__proto__ || Object.getPrototypeOf(Goods)).call(this, props));

			_this.state = {
				idx: 0,
				idxLoadedL: null,
				idxLoadedR: null
			};
			return _this;
		}
		// Передвижение товаров на d (±; прибавляется к текущему индексу this.state.idx)


		_createClass(Goods, [{
			key: "move",
			value: function move(d) {
				var n = Math.max(0, Math.min(this.state.idx + d, this.props.goods.length - this.props.count));
				var l = this.state.idxLoadedL !== null ? Math.min(this.state.idxLoadedL, n) : n;
				var r = this.state.idxLoadedR !== null ? Math.max(this.state.idxLoadedR, n + this.props.count) : n + this.props.count;
				// Добавление отсутствующих элементов при необходимости
				for (var i = n; i < this.state.idxLoadedL; i++) {
					this.props.goods[i].order = i;
					this.props.goods[i].loaded = true;
				}
				for (var i = this.state.idxLoadedR !== null ? this.state.idxLoadedR : n; i < n + this.props.count; i++) {
					this.props.goods[i].order = i;
					this.props.goods[i].loaded = true;
				}
				this.setState({ idx: n, idxLoadedL: l, idxLoadedR: r });
			}
		}, {
			key: "componentDidMount",
			value: function componentDidMount() {
				this.move(0);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				// Тут не JSX, для пробы
				return React.createElement("div", { className: "sga_component_goods" }, this.props.count < 1 ? "Нет товаров." : React.createElement("div", { className: "sga_goods" }, this.props.goods.map(function (good) {
					if (good.loaded) {
						return React.createElement(Good, {
							idxCont: _this2.props.idxCont,
							idx: _this2.state.idx,
							count: _this2.props.count,
							root: _this2.props.data,
							key: good.key,
							order: good.order,
							data: good
						});
					}
				})), React.createElement("a", {
					href: "javascript:void(0);",
					className: "sga_prev",
					onClick: function onClick() {
						return _this2.move(-_this2.props.scroll);
					}
				}), React.createElement("a", {
					href: "javascript:void(0);",
					className: "sga_next",
					onClick: function onClick() {
						return _this2.move(+_this2.props.scroll);
					}
				}));
			}
		}]);

		return Goods;
	}(React.Component);

	var Good = function (_React$Component2) {
		_inherits(Good, _React$Component2);

		function Good(props) {
			_classCallCheck(this, Good);

			var _this3 = _possibleConstructorReturn(this, (Good.__proto__ || Object.getPrototypeOf(Good)).call(this, props));

			_this3.state = { picM: "", picS: "", picO: "" };
			return _this3;
		}

		_createClass(Good, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				sgXhr(this.props.data.picM, function (xhr) {
					this.setState({
						picM: React.createElement("img", { src: this.props.data.picM, alt: this.props.data.name, className: "border1",
							onMouseOver: function (evt) {
								evt.persist();
								popup_up(evt.target, "sg" + this.props.idxCont + "_popupdiv_" + this.props.data.id, evt);
							}.bind(this)
						})
					});
				}.bind(this));
				sgXhr(this.props.data.picS, function (xhr) {
					this.setState({
						picS: React.createElement("img", { src: this.props.data.picS, alt: this.props.data.name, className: "border1" })
					});
				}.bind(this));
				sgXhr("/icons/info.png", function (xhr) {
					this.setState({
						picO: React.createElement("img", { src: "/icons/info.png", alt: "\u042D\u0442\u043E \u0432\u0430\u0448 \u0442\u043E\u0432\u0430\u0440", title: "\u042D\u0442\u043E \u0432\u0430\u0448 \u0442\u043E\u0432\u0430\u0440", className: "floatright" })
					});
				}.bind(this));
			}
		}, {
			key: "render",
			value: function render() {
				var d = this.props.root;
				var g = this.props.data;
				var Link = g.url ? "a" : "span";
				// Тут JSX, для пробы; не по нраву что-то…
				return React.createElement(
					"div",
					{ className: "object_goods block_01 thumb bounded" + (this.props.order < this.props.idx || this.props.order >= this.props.idx + this.props.count ? " hide" : " show") },
					React.createElement("input", { id: "sg" + this.props.idxCont + "_num_" + this.props.data.id, name: "num", type: "hidden", value: "1" }),
					d.isSeller && d.isSeller == 1 && this.state.picO,
					g.hotType && React.createElement(
						"div",
						{ style: { width: 0, height: 0 } },
						g.hotPic && /^st_/.test(g.hotPic) ? React.createElement(
							"div",
							{ className: g.hotPic },
							g.hotType
						) : React.createElement(
							"div",
							{ className: "imp margin_bottom" },
							React.createElement("img", { src: g.hotPic, className: "sga_hotpic", alt: g.hotType }),
							g.hotType
						)
					),
					d.ShowPicInTblGoods && d.ShowPicInTblGoods != 0 && (this.state.picM || this.state.picS) && React.createElement(
						Link,
						{ href: g.url, className: "sga_pic" },
						this.state.picM ? this.state.picM : this.state.picS
					),
					d.ShowPicInTblGoods && d.ShowPicInTblGoods != 0 && this.state.picM && this.state.picS && React.createElement(
						Link,
						{ href: g.url, id: "sg" + this.props.idxCont + "_popupdiv_" + g.id, className: "popupdiv block_02" },
						this.state.picS
					),
					g.name && React.createElement(
						"h3",
						null,
						React.createElement(
							Link,
							{ href: g.url },
							g.name
						)
					),
					g.review && (!d.isShowDescr || d.isShowDescr != 0) && React.createElement(
						"p",
						null,
						g.review,
						g.url && React.createElement(
							"a",
							{ href: g.url, style: { display: "block" } },
							"\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435\u2026"
						)
					),
					g.reports > 0 && d.reports != 0 && React.createElement(
						"p",
						null,
						"\u041E\u0442\u0437\u044B\u0432\u043E\u0432: ",
						g.reports
					)
				);
			}
		}]);

		return Good;
	}(React.Component);

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0ZWRnb29kcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkMjFlNWI1OGU3OTc1N2M0MzdjZSIsIndlYnBhY2s6Ly8vLi9zZWxlY3RlZGdvb2RzLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkMjFlNWI1OGU3OTc1N2M0MzdjZSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbi8vINCh0LrRgNC40L/RgiDQv9GA0L7QutGA0YPRh9C40LLQsNC10LzQvtCz0L4g0YHQv9C40YHQutCwINGC0L7QstCw0YDQvtCyINGBINC40YUg0LDRgdC40L3RhdGA0L7QvdC90L7QuSDQv9C+0LTQs9GA0YPQt9C60L7QuVxuXG52YXIgc2dDb250cztcbnNnU3RhcnQoKTtcblxuZnVuY3Rpb24gc2dPbkVycm9yKGEpIHtcblx0aWYgKGEuYWJvcnQpIHtcblx0XHRpZiAodHlwZW9mIGEubWVzc2FnZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0YS5tZXNzYWdlID0gXCLQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC64oCmXCI7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgYS5jb250YWluZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdGEuY29udGFpbmVyLnNnRmFpbGVkID0gYS5tZXNzYWdlO1xuXHRcdH1cblx0XHR0aHJvdyBhLm1lc3NhZ2U7XG5cdH1cbn1cbi8vINCQ0YHQuNC90YXRgNC+0L3QvdGL0Lkg0LLRi9C30L7QsiDRg9C60LDQt9Cw0L3QvdC+0Lkg0YTRg9C90LrRhtC40LgsINC60L7RgtC+0YDQvtC5INC/0LXRgNC10LTQsNGR0YLRgdGPINC+0LHRitC10LrRgiBYTUxIdHRwUmVxdWVzdFxuZnVuY3Rpb24gc2dYaHIodXJsLCBmdW5jLCBjb250YWluZXIsIGlkeCwgYWJvcnQpIHtcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRmdW5jKHhociwgY29udGFpbmVyLCBpZHgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2dPbkVycm9yKHtcblx0XHRcdFx0XHRtZXNzYWdlOiBcItCd0LUg0LzQvtCz0YMg0L/QvtC70YPRh9C40YLRjCDQstC+0YIg0Y3RgtC+OiBcIiArIHVybCxcblx0XHRcdFx0XHRjb250YWluZXI6IGNvbnRhaW5lciwgYWJvcnQ6IGFib3J0XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0eGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcblx0eGhyLnNlbmQobnVsbCk7XG59XG4vLyDQodCw0LzQvtC1INC90LDRh9Cw0LvQvjog0YHQsdC+0YAg0LrQvtC90YLQtdC50L3QtdGA0L7QsiDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQsNC20LTQvtCz0L4g0LjQtyDQvdC40YVcbmZ1bmN0aW9uIHNnU3RhcnQoKSB7XG5cdHNnQ29udHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2dhX2NvbnRhaW5lclwiKTtcblx0Zm9yICh2YXIgaSA9IHNnQ29udHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRpZiAoIXNnQ29udHNbaV0uc2dJbml0aWFsaXplZCAmJiAhc2dDb250c1tpXS5zZ0ZhaWxlZCkge1xuXHRcdFx0c2dYaHIoc2dDb250c1tpXS5nZXRBdHRyaWJ1dGUoXCJzZ0dvb2RzWG1sXCIpLCBjcmVhdGVHb29kcywgc2dDb250c1tpXSwgaSwgdHJ1ZSk7XG5cdFx0XHRpZiAoIXNnQ29udHNbaV0uc2dGYWlsZWQpIHtcblx0XHRcdFx0c2dDb250c1tpXS5zZ0luaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbi8vINCh0L7Qt9C00LDQvdC40LUg0LTQu9GPINC60L7QvdGC0LXQudC90LXRgNCwINC80LDRgdGB0LjQstCwINC+0LHRitC10LrRgtC+0LIg0YLQvtCy0LDRgNC+0LIg0Lgg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y9cbmZ1bmN0aW9uIGNyZWF0ZUdvb2RzKHhociwgdGFyZ2V0LCBpZHhDb250KSB7XG5cdHZhciByb290T2JqZWN0ID0ge307dmFyIGdvb2RzT2JqZWN0cyA9IFtdO1xuXHR2YXIgcm9vdCA9IHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQ7XG5cdGZvciAodmFyIGkgPSByb290LmF0dHJpYnV0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRyb290T2JqZWN0W3Jvb3QuYXR0cmlidXRlc1tpXS5uYW1lXSA9IHJvb3QuYXR0cmlidXRlc1tpXS52YWx1ZTtcblx0fVxuXHR2YXIgZ29vZHMgPSB4aHIucmVzcG9uc2VYTUwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJnb29kXCIpO1xuXHR2YXIgZ29vZHNDb3VudCA9IE1hdGgubWluKE51bWJlcih0YXJnZXQuZ2V0QXR0cmlidXRlKFwic2dDb3VudFwiKSksIGdvb2RzLmxlbmd0aCk7XG5cdHZhciBnb29kc1Njcm9sbENvdW50ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcInNnU2Nyb2xsQ291bnRcIikgPyBOdW1iZXIodGFyZ2V0LmdldEF0dHJpYnV0ZShcInNnU2Nyb2xsQ291bnRcIikpIDogMTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBnb29kcy5sZW5ndGg7IGkrKykge1xuXHRcdGdvb2RzT2JqZWN0cy5wdXNoKG5ldyBHb29kT2JqZWN0KGdvb2RzW2ldLCBpKSk7XG5cdH1cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoR29vZHMsIHtcblx0XHRpZHhDb250OiBpZHhDb250LFxuXHRcdGRhdGE6IHJvb3RPYmplY3QsXG5cdFx0Z29vZHM6IGdvb2RzT2JqZWN0cyxcblx0XHRjb3VudDogZ29vZHNDb3VudCxcblx0XHRzY3JvbGw6IGdvb2RzU2Nyb2xsQ291bnRcblx0fSksIHRhcmdldCk7XG59XG4vLyDQmtC+0L3RgdGC0YDRg9C60YLQvtGAINC+0LHRitC10LrRgtCwINGC0L7QstCw0YDQsFxuZnVuY3Rpb24gR29vZE9iamVjdChnLCBwKSB7XG5cdHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdHRoaXMub3JkZXIgPSBudWxsO1xuXHRmb3IgKHZhciBpID0gZy5hdHRyaWJ1dGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0c3dpdGNoICh0cnVlKSB7XG5cdFx0XHRjYXNlIC9eXFxzKiQvLnRlc3QoZy5hdHRyaWJ1dGVzW2ldLnZhbHVlKTpcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIC9eWzAtOS4sXSskLy50ZXN0KGcuYXR0cmlidXRlc1tpXS52YWx1ZSk6XG5cdFx0XHRcdHRoaXNbZy5hdHRyaWJ1dGVzW2ldLm5hbWVdID0gTnVtYmVyKGcuYXR0cmlidXRlc1tpXS52YWx1ZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhpc1tnLmF0dHJpYnV0ZXNbaV0ubmFtZV0gPSBnLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG5cdFx0fVxuXHR9XG5cdHRoaXMua2V5ID0gdGhpcy5pZCA/IHRoaXMuaWQgOiBwO1xuXHRpZiAodGhpcy51cmwpIHtcblx0XHR0aGlzLnVybCA9IHRoaXMuYXJ0aWN1bCA/IHRoaXMudXJsICsgXCIvXCIgKyB0aGlzLmFydGljdWwgOiB0aGlzLnVybCArIFwiL2dvb2RzX1wiICsgdGhpcy5pZDtcblx0fVxuXHRpZiAodGhpcy5waWMpIHtcblx0XHR0aGlzLnBpY00gPSBcIi9waWMvbWljcm8vXCIgKyB0aGlzLnBpYztcblx0XHR0aGlzLnBpY1MgPSBcIi9waWMvc21hbGwvXCIgKyB0aGlzLnBpYztcblx0XHR0aGlzLnBpY0IgPSBcIi9waWMvYmlnL1wiICsgdGhpcy5waWM7XG5cdH1cbn1cblxuLy8gUmVhY3RcblxudmFyIEdvb2RzID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcblx0X2luaGVyaXRzKEdvb2RzLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuXHRmdW5jdGlvbiBHb29kcyhwcm9wcykge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHb29kcyk7XG5cblx0XHR2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoR29vZHMuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihHb29kcykpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuXHRcdF90aGlzLnN0YXRlID0ge1xuXHRcdFx0aWR4OiAwLFxuXHRcdFx0aWR4TG9hZGVkTDogbnVsbCxcblx0XHRcdGlkeExvYWRlZFI6IG51bGxcblx0XHR9O1xuXHRcdHJldHVybiBfdGhpcztcblx0fVxuXHQvLyDQn9C10YDQtdC00LLQuNC20LXQvdC40LUg0YLQvtCy0LDRgNC+0LIg0L3QsCBkICjCsTsg0L/RgNC40LHQsNCy0LvRj9C10YLRgdGPINC6INGC0LXQutGD0YnQtdC80YMg0LjQvdC00LXQutGB0YMgdGhpcy5zdGF0ZS5pZHgpXG5cblxuXHRfY3JlYXRlQ2xhc3MoR29vZHMsIFt7XG5cdFx0a2V5OiBcIm1vdmVcIixcblx0XHR2YWx1ZTogZnVuY3Rpb24gbW92ZShkKSB7XG5cdFx0XHR2YXIgbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRoaXMuc3RhdGUuaWR4ICsgZCwgdGhpcy5wcm9wcy5nb29kcy5sZW5ndGggLSB0aGlzLnByb3BzLmNvdW50KSk7XG5cdFx0XHR2YXIgbCA9IHRoaXMuc3RhdGUuaWR4TG9hZGVkTCAhPT0gbnVsbCA/IE1hdGgubWluKHRoaXMuc3RhdGUuaWR4TG9hZGVkTCwgbikgOiBuO1xuXHRcdFx0dmFyIHIgPSB0aGlzLnN0YXRlLmlkeExvYWRlZFIgIT09IG51bGwgPyBNYXRoLm1heCh0aGlzLnN0YXRlLmlkeExvYWRlZFIsIG4gKyB0aGlzLnByb3BzLmNvdW50KSA6IG4gKyB0aGlzLnByb3BzLmNvdW50O1xuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7RgtGB0YPRgtGB0YLQstGD0Y7RidC40YUg0Y3Qu9C10LzQtdC90YLQvtCyINC/0YDQuCDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuFxuXHRcdFx0Zm9yICh2YXIgaSA9IG47IGkgPCB0aGlzLnN0YXRlLmlkeExvYWRlZEw7IGkrKykge1xuXHRcdFx0XHR0aGlzLnByb3BzLmdvb2RzW2ldLm9yZGVyID0gaTtcblx0XHRcdFx0dGhpcy5wcm9wcy5nb29kc1tpXS5sb2FkZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgaSA9IHRoaXMuc3RhdGUuaWR4TG9hZGVkUiAhPT0gbnVsbCA/IHRoaXMuc3RhdGUuaWR4TG9hZGVkUiA6IG47IGkgPCBuICsgdGhpcy5wcm9wcy5jb3VudDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMucHJvcHMuZ29vZHNbaV0ub3JkZXIgPSBpO1xuXHRcdFx0XHR0aGlzLnByb3BzLmdvb2RzW2ldLmxvYWRlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgaWR4OiBuLCBpZHhMb2FkZWRMOiBsLCBpZHhMb2FkZWRSOiByIH0pO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRcdHRoaXMubW92ZSgwKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwicmVuZGVyXCIsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHQvLyDQotGD0YIg0L3QtSBKU1gsINC00LvRjyDQv9GA0L7QsdGLXG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzZ2FfY29tcG9uZW50X2dvb2RzXCIgfSwgdGhpcy5wcm9wcy5jb3VudCA8IDEgPyBcItCd0LXRgiDRgtC+0LLQsNGA0L7Qsi5cIiA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2dhX2dvb2RzXCIgfSwgdGhpcy5wcm9wcy5nb29kcy5tYXAoZnVuY3Rpb24gKGdvb2QpIHtcblx0XHRcdFx0aWYgKGdvb2QubG9hZGVkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR29vZCwge1xuXHRcdFx0XHRcdFx0aWR4Q29udDogX3RoaXMyLnByb3BzLmlkeENvbnQsXG5cdFx0XHRcdFx0XHRpZHg6IF90aGlzMi5zdGF0ZS5pZHgsXG5cdFx0XHRcdFx0XHRjb3VudDogX3RoaXMyLnByb3BzLmNvdW50LFxuXHRcdFx0XHRcdFx0cm9vdDogX3RoaXMyLnByb3BzLmRhdGEsXG5cdFx0XHRcdFx0XHRrZXk6IGdvb2Qua2V5LFxuXHRcdFx0XHRcdFx0b3JkZXI6IGdvb2Qub3JkZXIsXG5cdFx0XHRcdFx0XHRkYXRhOiBnb29kXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1xuXHRcdFx0XHRocmVmOiBcImphdmFzY3JpcHQ6dm9pZCgwKTtcIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInNnYV9wcmV2XCIsXG5cdFx0XHRcdG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzMi5tb3ZlKC1fdGhpczIucHJvcHMuc2Nyb2xsKTtcblx0XHRcdFx0fVxuXHRcdFx0fSksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcblx0XHRcdFx0aHJlZjogXCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJzZ2FfbmV4dFwiLFxuXHRcdFx0XHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuXHRcdFx0XHRcdHJldHVybiBfdGhpczIubW92ZSgrX3RoaXMyLnByb3BzLnNjcm9sbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gR29vZHM7XG59KFJlYWN0LkNvbXBvbmVudCk7XG5cbnZhciBHb29kID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQyKSB7XG5cdF9pbmhlcml0cyhHb29kLCBfUmVhY3QkQ29tcG9uZW50Mik7XG5cblx0ZnVuY3Rpb24gR29vZChwcm9wcykge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHb29kKTtcblxuXHRcdHZhciBfdGhpczMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoR29vZC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEdvb2QpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cblx0XHRfdGhpczMuc3RhdGUgPSB7IHBpY006IFwiXCIsIHBpY1M6IFwiXCIsIHBpY086IFwiXCIgfTtcblx0XHRyZXR1cm4gX3RoaXMzO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKEdvb2QsIFt7XG5cdFx0a2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdFx0c2dYaHIodGhpcy5wcm9wcy5kYXRhLnBpY00sIGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0cGljTTogUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogdGhpcy5wcm9wcy5kYXRhLnBpY00sIGFsdDogdGhpcy5wcm9wcy5kYXRhLm5hbWUsIGNsYXNzTmFtZTogXCJib3JkZXIxXCIsXG5cdFx0XHRcdFx0XHRvbk1vdXNlT3ZlcjogZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0XHRldnQucGVyc2lzdCgpO1xuXHRcdFx0XHRcdFx0XHRwb3B1cF91cChldnQudGFyZ2V0LCBcInNnXCIgKyB0aGlzLnByb3BzLmlkeENvbnQgKyBcIl9wb3B1cGRpdl9cIiArIHRoaXMucHJvcHMuZGF0YS5pZCwgZXZ0KTtcblx0XHRcdFx0XHRcdH0uYmluZCh0aGlzKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHNnWGhyKHRoaXMucHJvcHMuZGF0YS5waWNTLCBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHBpY1M6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IHRoaXMucHJvcHMuZGF0YS5waWNTLCBhbHQ6IHRoaXMucHJvcHMuZGF0YS5uYW1lLCBjbGFzc05hbWU6IFwiYm9yZGVyMVwiIH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHNnWGhyKFwiL2ljb25zL2luZm8ucG5nXCIsIGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0cGljTzogUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogXCIvaWNvbnMvaW5mby5wbmdcIiwgYWx0OiBcIlxcdTA0MkRcXHUwNDQyXFx1MDQzRSBcXHUwNDMyXFx1MDQzMFxcdTA0NDggXFx1MDQ0MlxcdTA0M0VcXHUwNDMyXFx1MDQzMFxcdTA0NDBcIiwgdGl0bGU6IFwiXFx1MDQyRFxcdTA0NDJcXHUwNDNFIFxcdTA0MzJcXHUwNDMwXFx1MDQ0OCBcXHUwNDQyXFx1MDQzRVxcdTA0MzJcXHUwNDMwXFx1MDQ0MFwiLCBjbGFzc05hbWU6IFwiZmxvYXRyaWdodFwiIH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwicmVuZGVyXCIsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdHZhciBkID0gdGhpcy5wcm9wcy5yb290O1xuXHRcdFx0dmFyIGcgPSB0aGlzLnByb3BzLmRhdGE7XG5cdFx0XHR2YXIgTGluayA9IGcudXJsID8gXCJhXCIgOiBcInNwYW5cIjtcblx0XHRcdC8vINCi0YPRgiBKU1gsINC00LvRjyDQv9GA0L7QsdGLOyDQvdC1INC/0L4g0L3RgNCw0LLRgyDRh9GC0L4t0YLQvuKAplxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcIm9iamVjdF9nb29kcyBibG9ja18wMSB0aHVtYiBib3VuZGVkXCIgKyAodGhpcy5wcm9wcy5vcmRlciA8IHRoaXMucHJvcHMuaWR4IHx8IHRoaXMucHJvcHMub3JkZXIgPj0gdGhpcy5wcm9wcy5pZHggKyB0aGlzLnByb3BzLmNvdW50ID8gXCIgaGlkZVwiIDogXCIgc2hvd1wiKSB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyBpZDogXCJzZ1wiICsgdGhpcy5wcm9wcy5pZHhDb250ICsgXCJfbnVtX1wiICsgdGhpcy5wcm9wcy5kYXRhLmlkLCBuYW1lOiBcIm51bVwiLCB0eXBlOiBcImhpZGRlblwiLCB2YWx1ZTogXCIxXCIgfSksXG5cdFx0XHRcdGQuaXNTZWxsZXIgJiYgZC5pc1NlbGxlciA9PSAxICYmIHRoaXMuc3RhdGUucGljTyxcblx0XHRcdFx0Zy5ob3RUeXBlICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0XHR7IHN0eWxlOiB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfSB9LFxuXHRcdFx0XHRcdGcuaG90UGljICYmIC9ec3RfLy50ZXN0KGcuaG90UGljKSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHRcImRpdlwiLFxuXHRcdFx0XHRcdFx0eyBjbGFzc05hbWU6IGcuaG90UGljIH0sXG5cdFx0XHRcdFx0XHRnLmhvdFR5cGVcblx0XHRcdFx0XHQpIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJpbXAgbWFyZ2luX2JvdHRvbVwiIH0sXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBnLmhvdFBpYywgY2xhc3NOYW1lOiBcInNnYV9ob3RwaWNcIiwgYWx0OiBnLmhvdFR5cGUgfSksXG5cdFx0XHRcdFx0XHRnLmhvdFR5cGVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGQuU2hvd1BpY0luVGJsR29vZHMgJiYgZC5TaG93UGljSW5UYmxHb29kcyAhPSAwICYmICh0aGlzLnN0YXRlLnBpY00gfHwgdGhpcy5zdGF0ZS5waWNTKSAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdExpbmssXG5cdFx0XHRcdFx0eyBocmVmOiBnLnVybCwgY2xhc3NOYW1lOiBcInNnYV9waWNcIiB9LFxuXHRcdFx0XHRcdHRoaXMuc3RhdGUucGljTSA/IHRoaXMuc3RhdGUucGljTSA6IHRoaXMuc3RhdGUucGljU1xuXHRcdFx0XHQpLFxuXHRcdFx0XHRkLlNob3dQaWNJblRibEdvb2RzICYmIGQuU2hvd1BpY0luVGJsR29vZHMgIT0gMCAmJiB0aGlzLnN0YXRlLnBpY00gJiYgdGhpcy5zdGF0ZS5waWNTICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0TGluayxcblx0XHRcdFx0XHR7IGhyZWY6IGcudXJsLCBpZDogXCJzZ1wiICsgdGhpcy5wcm9wcy5pZHhDb250ICsgXCJfcG9wdXBkaXZfXCIgKyBnLmlkLCBjbGFzc05hbWU6IFwicG9wdXBkaXYgYmxvY2tfMDJcIiB9LFxuXHRcdFx0XHRcdHRoaXMuc3RhdGUucGljU1xuXHRcdFx0XHQpLFxuXHRcdFx0XHRnLm5hbWUgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcImgzXCIsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0TGluayxcblx0XHRcdFx0XHRcdHsgaHJlZjogZy51cmwgfSxcblx0XHRcdFx0XHRcdGcubmFtZVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0Zy5yZXZpZXcgJiYgKCFkLmlzU2hvd0Rlc2NyIHx8IGQuaXNTaG93RGVzY3IgIT0gMCkgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcInBcIixcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdGcucmV2aWV3LFxuXHRcdFx0XHRcdGcudXJsICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHRcImFcIixcblx0XHRcdFx0XHRcdHsgaHJlZjogZy51cmwsIHN0eWxlOiB7IGRpc3BsYXk6IFwiYmxvY2tcIiB9IH0sXG5cdFx0XHRcdFx0XHRcIlxcdTA0MUZcXHUwNDNFXFx1MDQzNFxcdTA0NDBcXHUwNDNFXFx1MDQzMVxcdTA0M0RcXHUwNDM1XFx1MDQzNVxcdTIwMjZcIlxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0Zy5yZXBvcnRzID4gMCAmJiBkLnJlcG9ydHMgIT0gMCAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFwicFwiLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XCJcXHUwNDFFXFx1MDQ0MlxcdTA0MzdcXHUwNDRCXFx1MDQzMlxcdTA0M0VcXHUwNDMyOiBcIixcblx0XHRcdFx0XHRnLnJlcG9ydHNcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gR29vZDtcbn0oUmVhY3QuQ29tcG9uZW50KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NlbGVjdGVkZ29vZHMuanN4XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OzsiLCJzb3VyY2VSb290IjoiIn0=