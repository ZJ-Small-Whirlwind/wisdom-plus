export default (function(w,d){
	function S(el, $el){
        this.d = typeof el === 'string' ?  d.querySelector(el) : el;
        this.$el =  $el;
        if(!this.d){
        	alert('not find dom');
        };
        this.offset = 0;
        this.s = {
        	top : function(){},
        	bottom : function(){}
        };
        this.dom = this.d.children[0];
        this.dom.timer = null;
        this.dom.off = true;
    };
    S.prototype.init = function(o){
    	var _this = this;
    	this.extend(this.s,o);
    	if(this.dom.offsetHeight < this.d.offsetHeight){
    		return false;
    	};
    	this.createBar();
    	function setHeight(){
     		_this.h = (_this.d.clientHeight - _this.dom.clientHeight);
			_this.bh = _this.d.offsetHeight * _this.d.offsetHeight / _this.dom.offsetHeight;
			if(_this.bh <= 40){
				_this.bh = 40;
			}else if( _this.bh >= _this.d.offsetHeight){
				_this.bh = 0;
			};
			_this.bar.style.height = _this.bh +'px';
			_this.move();
    	};
    	setHeight();
    	_this.addEvent(w,'resize',setHeight)
		this.wheel();
		this.drag();
    };
    S.prototype.createBar = function(){
    	var sitem = d.createElement('div');
    	sitem.className = 'scroll-barCon';
    	sitem.innerHTML = '<div class="scroll-bar"><span></span></div>';
        this.$el.appendChild(sitem)
    	this.bar = this.$el.querySelector('.scroll-bar');
    	this.barCon = this.$el.querySelector('.scroll-barCon');
    };
    S.prototype.drag = function(){
    	var _this = this;
        _this.barCon.style.height = (_this.d.offsetHeight) +'px';
    	this.barCon.onclick = function(ev){
    		var e = ev || event;
    		var _target = e.target || e.srcElement;
    		if(_target.className == 'scroll-barCon'){
    			var doc = document.documentElement, body = document.body;
    			var y = e.clientY + (doc && doc.scrollTop  ||  body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
    			_this.offset =Math.floor(((y - _this.getposi(_this.d).top)/_this.d.offsetHeight) * _this.h); //姣斾緥
    			_this.move();
     		};
     		if (e.stopPropagation) {
     		 	e.stopPropagation();
     		} else{
     		 	e.cancelBubble = true;
     		};
    		return false;
    	};
    	_this.addEvent(_this.bar,'mousedown', eventDown);
    	var y,y2,t;
    	function preventDefault(event){
		    if(document.all){
		      window.event.returnValue = false;
		    }else{
		      event.preventDefault();
		    };
		};
    	function eventDown(ev){
     		var e = ev || event;
    		y = e.clientY;
     		t =  parseInt(_this.getstyle(_this.bar,'top'));
            _this.barCon.style.height = (_this.d.offsetHeight) +'px';
	     	_this.addEvent(document,'mousemove', eventMove);
    		_this.addEvent(document,'mouseup', eventUp);
		    preventDefault(e);
    		return false;
		};
    	function eventMove(ev){
      		var e = ev || event;
     		y2 = e.clientY;
    		var st = y2 -y+t;
     		if(st <0){
    			st = 0;
    		}else if(st > _this.d.offsetHeight - _this.bar.offsetHeight){
    			st = _this.d.offsetHeight - _this.bar.offsetHeight
    		};
            _this.barCon.style.height = (_this.d.offsetHeight) +'px';
    		_this.bar.style.top = (st) +'px';
    		var scale = st/(_this.d.offsetHeight - _this.bar.offsetHeight);
    		var st2 = Math.floor(scale*(_this.h))
    		_this.dom.style.top =st2 +'px';
    		_this.offset = st2;
    		preventDefault(e);
    		return false;
		};
		function eventUp(){
		    _this.removeEvent(document,'mousemove', eventMove);
		    _this.removeEvent(document,'mouseup', eventUp);
		};
    };
    S.prototype.wheel = function(){
    	var _this = this;
    	_this.onwheel(_this.d,function (n) {
			if(n){
				_this.offset-=50
			}else{
				_this.offset+=50
			};
			if(_this.dom.off){
				_this.move();
				_this.dom.off = false;
			};
		});
    };
    S.prototype.move = function(n){
    	var _this = this;
    	;(function(){
    		clearInterval(_this.dom.timer);
			_this.dom.timer = setInterval(function(){
				var t  = parseInt(_this.getstyle(_this.dom,'top'));
				var _t1 = (_this.offset-t)/10;
 				_t1 = _t1>0 ? Math.ceil(_t1) : Math.floor(_t1);
 				if(_this.offset>0){
 					_this.s.top.call(_this.d,0);
					_this.offset = 0;
				}else if(Math.floor(_this.offset)<_this.h){
					_this.s.bottom.call(_this.d,_this.h);
					_this.offset = _this.h;
				}else{
					_this.dom.style['top'] = (t+_t1)+'px'
				};
				if(t == _this.offset){
					clearInterval(_this.dom.timer);
					_this.dom.off = true;
				};
				var scale = t / (_this.h);
				var tt = scale* (_this.d.clientHeight - _this.bar.offsetHeight);
				_this.bar.style['top'] = tt+'px'
			},13);
		})();
    };
    S.prototype.onwheel = function(obj,fn){
		function onWheel_s(ev){
			var e = ev || event;
			var bCur = e.detail?e.detail>0:e.wheelDelta<0;
			fn.call(obj,bCur)
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			};
		};
		this.addEvent(obj,'DOMMouseScroll',onWheel_s);
		this.addEvent(obj,'mousewheel',onWheel_s);
	}
    S.prototype.addEvent = function(obj,name,fn){
		return obj.addEventListener? obj.addEventListener(name, fn, false):obj.attachEvent('on'+name,fn);
	};
	S.prototype.removeEvent = function(obj,name,fn){
		return obj.removeEventListener? obj.removeEventListener(name, fn, false):obj.detachEvent('on'+name, fn);
	};
    S.prototype.getstyle = function (obj,attr){
    	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj,null)[attr];
	};
	S.prototype.extend = function(n,n1){
        for(var i in n1){n[i] = n1[i]};
    };
	S.prototype.getposi = function(obj){
	    var t = 0,l = 0;
	    while(obj){t+=obj.offsetTop;l+=obj.offsetLeft;obj = obj.offsetParent;};
	    return {top:t,left:l};
	};
	function s(o, $el){return new S(o,$el)};
    // w.simpleScroll = s;
    return s;
})(typeof global !== "undefined" ? global : window, typeof global !== "undefined" ? {} : document);
