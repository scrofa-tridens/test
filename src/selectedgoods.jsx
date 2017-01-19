// Скрипт прокручиваемого списка товаров с их асинхронной подгрузкой

var sgConts;
sgStart();

function sgOnError(a) {
	if(a.abort) {
		if(typeof a.message === "undefined") {a.message = "Что-то пошло не так…";}
		if(typeof a.container !== "undefined") {a.container.sgFailed = a.message;}
		throw a.message;
	}
}
// Асинхронный вызов указанной функции, которой передаётся объект XMLHttpRequest
function sgXhr(url, func, container, idx, abort) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {
			if(xhr.status === 200) {
				func(xhr, container, idx);
			} else {
				sgOnError({
					message: "Не могу получить вот это: " + url,
					container: container, abort: abort
				});
			}
		}
	}
	xhr.open("GET", url, true);
	xhr.send(null);
}
// Самое начало: сбор контейнеров на странице и инициализация каждого из них
function sgStart() {
	sgConts = document.getElementsByClassName("sga_container");
	for(var i = sgConts.length - 1; i >= 0 ; i--) {
		if(!sgConts[i].sgInitialized && !sgConts[i].sgFailed) {
			sgXhr(sgConts[i].getAttribute("sgGoodsXml"), createGoods, sgConts[i], i, true);
			if(!sgConts[i].sgFailed) {sgConts[i].sgInitialized = true;}
		}
	}
}
// Создание для контейнера массива объектов товаров и представления
function createGoods(xhr, target, idxCont) {
	var rootObject = {}; var goodsObjects = [];
	var root = xhr.responseXML.documentElement;
	for(var i = root.attributes.length - 1; i >= 0; i--) {
		rootObject[root.attributes[i].name] = root.attributes[i].value;
	}
	var goods = xhr.responseXML.getElementsByTagName("good");
	var goodsCount = Math.min(Number(target.getAttribute("sgCount")), goods.length);
	var goodsScrollCount = target.getAttribute("sgScrollCount") ? Number(target.getAttribute("sgScrollCount")) : 1;
	for(var i = 0; i < goods.length; i++) {
		goodsObjects.push(new GoodObject(goods[i], i));
	}
	ReactDOM.render(React.createElement(
		Goods, {
			idxCont: idxCont,
			data: rootObject,
			goods: goodsObjects,
			count: goodsCount,
			scroll: goodsScrollCount,
		}
	), target);
}
// Конструктор объекта товара
function GoodObject(g, p) {
	this.loaded = false;
	this.order = null;
	for(var i = g.attributes.length - 1; i >= 0; i--) {
		switch(true) {
			case /^\s*$/.test(g.attributes[i].value) :
				break;
			case /^[0-9.,]+$/.test(g.attributes[i].value) :
				this[g.attributes[i].name] = Number(g.attributes[i].value);
				break;
			default :
				this[g.attributes[i].name] = g.attributes[i].value;
		}
	}
	this.key = this.id ? this.id : p;
	if(this.url) {
		this.url = this.articul ? this.url + "/" + this.articul : this.url + "/goods_" + this.id;
	}
	if(this.pic) {
		this.picM = "/pic/micro/" + this.pic;
		this.picS = "/pic/small/" + this.pic;
		this.picB = "/pic/big/" + this.pic;
	}
}

// React
class Goods extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			idx: 0,
			idxLoadedL: null,
			idxLoadedR: null,
		};
	}
	// Передвижение товаров на d (±; прибавляется к текущему индексу this.state.idx)
	move(d) {
		var n = Math.max(0, Math.min(this.state.idx + d, this.props.goods.length - this.props.count));
		var l = this.state.idxLoadedL !== null ? Math.min(this.state.idxLoadedL, n) : n;
		var r = this.state.idxLoadedR !== null ? Math.max(this.state.idxLoadedR, n + this.props.count) : n + this.props.count;
		// Добавление отсутствующих элементов при необходимости
		for(var i = n; i < this.state.idxLoadedL; i++) {
			this.props.goods[i].order = i;
			this.props.goods[i].loaded = true;
		}
		for(var i = this.state.idxLoadedR !== null ? this.state.idxLoadedR : n; i < n + this.props.count; i++) {
			this.props.goods[i].order = i;
			this.props.goods[i].loaded = true;
		}
		this.setState({idx: n, idxLoadedL: l, idxLoadedR: r});
	}
	componentDidMount() {
		this.move(0);
	}
	render() {
		// Тут не JSX, для пробы
		return (
			React.createElement(
				"div",
				{className: "sga_component_goods"},
				this.props.count < 1
					? "Нет товаров."
					: React.createElement("div", {className: "sga_goods"},
						this.props.goods.map((good) => {
							if(good.loaded) {
								return React.createElement(Good, {
									idxCont: this.props.idxCont,
									idx: this.state.idx,
									count: this.props.count,
									root: this.props.data,
									key: good.key,
									order: good.order,
									data: good,
								});
							}
						})
					),
				React.createElement("a", {
					href: "javascript:void(0);",
					className: "sga_prev",
					onClick: ()=>this.move(-this.props.scroll)
				}),
				React.createElement("a", {
					href: "javascript:void(0);",
					className: "sga_next",
					onClick: ()=>this.move(+this.props.scroll)
				})
			)
		);
	}
}
class Good extends React.Component {
	constructor(props) {
		super(props);
		this.state = {picM: "", picS: "", picO: ""};
	}
	componentDidMount() {
		sgXhr(this.props.data.picM, function(xhr) {
			this.setState({
				picM: <img src={this.props.data.picM} alt={this.props.data.name} className="border1"
					onMouseOver={function(evt) {
						evt.persist();
						popup_up(evt.target, "sg" + this.props.idxCont + "_popupdiv_" + this.props.data.id, evt);
					}.bind(this)}
				/>
			});
		}.bind(this));
		sgXhr(this.props.data.picS, function(xhr) {
			this.setState({
				picS: <img src={this.props.data.picS} alt={this.props.data.name} className="border1" />
			});
		}.bind(this));
		sgXhr("/icons/info.png", function(xhr) {
			this.setState({
				picO: <img src="/icons/info.png" alt="Это ваш товар" title="Это ваш товар" className="floatright" />
			});
		}.bind(this));
	}
	render() {
		var d = this.props.root;
		var g = this.props.data;
		var Link = g.url ? `a` : `span`;
		// Тут JSX, для пробы; не по нраву что-то…
		return (

<div className={"object_goods block_01 thumb bounded" + (
	this.props.order < this.props.idx ||
	this.props.order >= this.props.idx + this.props.count
		? " hide" : " show")}>
	{/* hidden num */}
	<input id={"sg" + this.props.idxCont + "_num_" + this.props.data.id} name="num" type="hidden" value="1" />
	{/* Картинка принадлежности товара */}
	{d.isSeller && d.isSeller == 1 && this.state.picO}
	{/* Вид предложения */}
	{g.hotType &&
		<div style={{width: 0, height: 0}}>
			{g.hotPic && /^st_/.test(g.hotPic) ?
				<div className={g.hotPic}>{g.hotType}</div>
			:
				<div className="imp margin_bottom">
					<img src={g.hotPic} className="sga_hotpic" alt={g.hotType} />
					{g.hotType}
				</div>
			}
		</div>
	}
	{/* Картинка, показываемая в блоке товара */}
	{d.ShowPicInTblGoods && d.ShowPicInTblGoods != 0 && (this.state.picM || this.state.picS) &&
		<Link href={g.url} className="sga_pic">
			{this.state.picM ? this.state.picM : this.state.picS}
		</Link>
	}
	{/* Всплывающия картинка */}
	{d.ShowPicInTblGoods && d.ShowPicInTblGoods != 0 && this.state.picM && this.state.picS &&
		<Link href={g.url} id={"sg" + this.props.idxCont + "_popupdiv_" + g.id} className="popupdiv block_02">
			{this.state.picS}
		</Link>
	}
	{/* Название */}
	{g.name && <h3><Link href={g.url}>{g.name}</Link></h3>}
	{/* Краткое описание */}
	{g.review && (!d.isShowDescr || d.isShowDescr != 0) &&
		<p>
			{g.review}
			{g.url && <a href={g.url} style={{display: "block"}}>Подробнее…</a>}
		</p>
	}
	{/* Количество отзывов */}
	{g.reports > 0 && d.reports != 0 && <p>Отзывов: {g.reports}</p>}
	{/* Дальше всякие цены, характеристики, отзывы и пр., но это уже рутина; позже. */}
</div>

		);
	}
}
