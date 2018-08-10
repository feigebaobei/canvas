
/*
用途：
	记录开始、结束、经过的时间。
 */




var StopWatch = function () {
}
StopWatch.prototype = {
	startDate : null,
	endDate : null,
	elapseMimlliseconds : 0,
	running : false,
	start : function () {
		this.running = true;
		this.startDate = +new Date();// 设置开始的时间并返回
		elapseMimlliseconds = null;
		// this.startDate = performance.now();// performance now() 比 new Date() 更精确
	},
	stop : function () {
		this.running = false;
		this.endDate = +new Date();
		// this.endDate = performance.now();
		this.elapseMimlliseconds = this.endDate - this.startDate;
	},
	isRunning: function	() {
		return this.running;
	},
	getElapsedTime : function () {// 返回进过了多少时间
		if ( this.isRunning() ) {
			return (+new Date()) - this.startDate;
		} else {
			return this.elapseMimlliseconds;
		}
	},
	reset : function () {
		this.startDate = null;
		this.endDate = null;
		this.elapseMimlliseconds = null;
	}
}












