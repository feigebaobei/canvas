
/*
设计思路：
    -在离屏canvas上绘制图像。再使用drawImage绘制到canvas上。
    -修改了书上的写参数的方法。改为设置属性的方法。（LI的习惯）
    -使用寄生组合式继承。把每一个对象（例如：RoundedRectangle）继承自COREHTML5。
 */

var COREHTML5 = function () {
}
COREHTML5.prototype = {
    erase: function ( context, x0, y0, x1, y1 ) {
        context.clearRect( x0, y0, x1, y1 );
        return context;
    },
    get: function ( name ) {
        for ( var i in this ) {
            // console.log( i );
            if ( i == name ) {
                var value = eval( 'this.' + name );
                return value;
            }
        }
    },
    windowToCanvas: function ( box, x, y ) {
        // box this.context.canvas
        var bbox = box.getBoundingClientRect();
        return {
            x: (x-bbox.left) * ( box.width / bbox.width ),
            y: (y-bbox.top) * ( box.height / bbox.height )
        }
    },
    createCanvas: function () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    },
    createOffCanvas: function () {
        this.offCanvas = document.createElement('canvas');
        this.offContext = this.offCanvas.getContext('2d');
    },
    createDOMElement: function () {
        this.domElement = document.createElement('div');
        this.domElement.appendChild( this.canvas );
    },
    setSizeCanvas: function ( w, h ) {
        // w, h is number
        // var w = this.canvasSize.width,
        //     h = this.canvasSize.height;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.context.canvas.width = w;
        this.context.canvas.height = h;
        this.offCanvas.style.width = w + 'px';
        this.offCanvas.style.height = h + 'px';
        this.offContext.canvas.width = w;
        this.offContext.canvas.height = h;
        // this.setSizeFigure( this.area.horizontal, this.area.vertical );// set size of figure
    },
    matchSizeCanvas: function ( jqueryObj ) {
        var w = parseFloat(jqueryObj.css('width')),
            h = parseFloat(jqueryObj.css('height'));
        this.setSizeCanvas( w, h );
    }




}
// RoundedRectangle 圆角矩形
var RoundedRectangle = function () {
    this.area = { horizontal: 0.9, vertical: 0.5 };
    this.canvasSize = { width : 400, height: 500 };
    this.strokeStyle = 'black';
    this.fillStyle = 'blue';
    this.createCanvas();
    this.createOffCanvas();
    this.createDOMElement();
    // this.setSizeCanvas();// set size of canvas
    return this;
}
// 使用寄生组合式继承
$.li.inheritPrototype( RoundedRectangle, COREHTML5 );
/* 这里不能用字面量形式定义属性，须要用添加属性的方法添加属性。 */
RoundedRectangle.prototype.createCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }
RoundedRectangle.prototype.createOffCanvas = function () {
        this.offCanvas = document.createElement('canvas');
        this.offContext = this.offCanvas.getContext('2d');
    }
RoundedRectangle.prototype.createDOMElement = function () {
        this.domElement = document.createElement('div');
        this.domElement.appendChild( this.canvas );
    }
RoundedRectangle.prototype.setSizeCanvas = function () {
        // w, h is number
        var w = this.canvasSize.width,
            h = this.canvasSize.height;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.context.canvas.width = w;
        this.context.canvas.height = h;
        this.offCanvas.style.width = w + 'px';
        this.offCanvas.style.height = h + 'px';
        this.offContext.canvas.width = w;
        this.offContext.canvas.height = h;
        this.setSizeFigure( this.area.horizontal, this.area.vertical );// set size of figure
    }
RoundedRectangle.prototype.matchSizeCanvas = function ( jqueryObj ) {
        var w = parseFloat(jqueryObj.css('width')),
            h = parseFloat(jqueryObj.css('height'));
        // this.canvas.style.width = w + 'px';
        // this.canvas.style.height = h + 'px';
        // this.context.canvas.width = w;
        // this.context.canvas.height = h;
        // this.offCanvas.style.width = w + 'px';
        // this.offCanvas.style.height = h + 'px';
        // this.offContext.canvas.width = w;
        // this.offContext.canvas.height = h;
        // this.setSizeFigure( this.area.horizontal, this.area.vertical );
        this.setSizeCanvas( w, h );
    }
RoundedRectangle.prototype.setSizeFigure = function ( horizontalPercent, verticalPercent ) {// set size of figure
        var widthCan = parseInt( this.context.canvas.width ),
            heightCan = parseInt( this.context.canvas.height ),
            widthFigure = widthCan * horizontalPercent,
            heightFigure = heightCan * verticalPercent;
        this.margin = {
            horizontal: widthCan * ( 1 - horizontalPercent ) / 2,
            vertical: heightCan * ( 1 - verticalPercent ) / 2
        }
        this.top = this.margin.vertical;
        this.left = this.margin.horizontal;
        this.right = this.left + widthFigure;
        this.bottom = this.top + heightFigure;
        this.cornerRadius = heightFigure / 2 < widthFigure / 2 ? heightFigure / 2 : widthFigure / 2;// get small
        this.directionFigure = widthFigure > heightFigure ? 'horizontal' : 'vertical';
    }
RoundedRectangle.prototype.appendTo = function ( jqueryObj ) {
        jqueryObj.append( this.domElement );
    }
RoundedRectangle.prototype.drawOff = function (  ) {
        this.setSizeCanvas();
        // 在离屏canvas上
        // -描边
        // -填充颜色
        // -填充高光
        var context = this.offContext;
        context.save();
        context.beginPath();
        if ( this.directionFigure == 'horizontal' ) {
            context.moveTo( this.left+this.cornerRadius, this.top );
            context.arcTo( this.right, this.top, this.right, this.top+this.cornerRadius, this.cornerRadius );
            context.arcTo( this.right, this.bottom, this.right-this.cornerRadius, this.bottom, this.cornerRadius );
            context.arcTo( this.left, this.bottom, this.left, this.bottom-this.cornerRadius, this.cornerRadius );
            context.arcTo( this.left, this.top, this.left+this.cornerRadius, this.top, this.cornerRadius );
        } else {
            context.moveTo( this.left, this.top+this.cornerRadius );
            context.arcTo( this.left, this.top, this.left+this.cornerRadius, this.top, this.cornerRadius );
            context.arcTo( this.right, this.top, this.right, this.top+this.cornerRadius, this.cornerRadius );
            context.arcTo( this.right, this.bottom, this.right-this.cornerRadius, this.bottom, this.cornerRadius );
            context.arcTo( this.left, this.bottom, this.left, this.bottom-this.cornerRadius, this.cornerRadius );
        }
        context.closePath();
        context.lineWidth = 0.4;
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.fillStyle = this.fillStyle;
        context.fill();
        var gradient = context.createLinearGradient( this.left, this.top, this.left, this.bottom );
        gradient.addColorStop( 0, 'rgba( 255, 255, 255, 0.4 )' );
        gradient.addColorStop( 0.2, 'rgba( 255, 255, 255, 0.6 )' );
        gradient.addColorStop( 0.25, 'rgba( 255, 255, 255, 0.7 )' );
        gradient.addColorStop( 0.3, 'rgba( 255, 255, 255, 0.9 )' );
        gradient.addColorStop( 0.40, 'rgba( 255, 255, 255, 0.7 )' );
        gradient.addColorStop( 0.45, 'rgba( 255, 255, 255, 0.6 )' );
        gradient.addColorStop( 0.60, 'rgba( 255, 255, 255, 0.4 )' );
        gradient.addColorStop( 1, 'rgba( 255, 255, 255, 0.1 )' );
        context.fillStyle = gradient;
        context.fill();
        context.restore();
    }
RoundedRectangle.prototype.draw = function ( context ) {
        // 在离屏canvas上绘制好后再绘制到canvas中
        // 默认绘制在canvas上
        this.drawOff();
        if ( context == undefined ) {
            context = this.context;
        }
        context.drawImage(
            this.offContext.canvas,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height
        );
        // 释放内存，移除dom
        // this.canvas.parentNode.removeChild( this.canvas );//DOM 需要了解您需要删除的元素，以及它的父元素。
        // this.offCanvas.parentNode.removeChild( this.offCanvas );//DOM 需要了解您需要删除的元素，以及它的父元素。
    }
// RoundedRectangle.prototype.get = function ( name ) {
//         for ( var i in this ) {
//             // console.log( i );
//             if ( i == name ) {
//                 // console.log( i );
//                 // console.log( this.name );
//                 var value = eval( 'this.' + name );
//                 // eval( 'return this.' + name + ';' );
//                 return value;
//             }
//         }
//     }



// roundedRectangle.COREHTML5.RoundedRectangle();
// roundedRectangle.appendTo( $('#id') );
// roundedRectangle.draw();

// progressbar
// 缺点：不能实现用户自定义事件
var Progressbar = function () {
    this.area = { horizontal: 0.9, vertical: 0.5 };
    this.canvasSize = { width: 400, height: 500 };
    this.strokeStyle = 'black';
    this.fillStyle = 'blue';
    this.percentComplete = 10;
    // this.createTrough();// create roundedRectangle
    this.createCanvas();
    this.createOffCanvas();
    this.createDOMElement();
    // this.calcPercentComplete();
}
// 使用寄生组合式继承
$.li.inheritPrototype( Progressbar, COREHTML5 );
/* 这里不能用字面量形式定义属性，须要用添加属性的方法添加属性。 */
Progressbar.prototype.createTrough = function () {
        this.trough= new COREHTML5.RoundedRectangle();
        this.trough.area = this.area;
        this.trough.canvasSize = this.canvasSize;
        this.trough.strokeStyle = this.strokeStyle;
        this.trough.fillStyle = this.fillStyle;
    };
Progressbar.prototype.createCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    };
Progressbar.prototype.createOffCanvas = function () {
        this.offCanvas = document.createElement('canvas');
        this.offContext = this.offCanvas.getContext('2d');
    };
Progressbar.prototype.createDOMElement = function () {
        this.domElement = document.createElement('div');
        this.domElement.appendChild( this.canvas );
    };
Progressbar.prototype.calcPercentComplete = function() {
        this.percentComplete = this.percentComplete < 0 ? 0 : this.percentComplete;
        this.percentComplete = this.percentComplete > 1 ? this.percentComplete / 100 : this.percentComplete;
    };
Progressbar.prototype.setSizeCanvas = function ( w, h ) {
        // w, h is number
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.context.canvas.width = w;
        this.context.canvas.height = h;
        this.offCanvas.style.width = w + 'px';
        this.offCanvas.style.height = h + 'px';
        this.offContext.canvas.width = w;
        this.offContext.canvas.height = h;
        this.setSizeFigure( this.area.horizontal, this.area.vertical );
    };
Progressbar.prototype.setSizeFigure = function ( horizontalPercent, verticalPercent ) {// set size of figure
        var widthCan = parseInt( this.context.canvas.width ),
            heightCan = parseInt( this.context.canvas.height ),
            widthFigure = widthCan * horizontalPercent,
            heightFigure = heightCan * verticalPercent;
        this.margin = {
            horizontal: widthCan * ( 1 - horizontalPercent ) / 2,
            vertical: heightCan * ( 1 - verticalPercent ) / 2
        }
        this.top = this.margin.vertical;
        this.left = this.margin.horizontal;
        this.right = this.left + widthFigure;
        this.bottom = this.top + heightFigure;
        this.cornerRadius = heightFigure / 2 < widthFigure / 2 ? heightFigure / 2 : widthFigure / 2;// get small
        this.directionFigure = widthFigure > heightFigure ? 'horizontal' : 'vertical';
    };
Progressbar.prototype.matchSizeCanvas = function ( jqueryObj ) {
        var w = parseFloat(jqueryObj.css('width')),
            h = parseFloat(jqueryObj.css('height'));
        this.setSizeCanvas( w, h );
    };
Progressbar.prototype.appendTo = function ( jqueryObj ) {
        jqueryObj.append( this.domElement );
    };
Progressbar.prototype.drawOff = function () {
        this.createTrough();
        this.trough.draw( this.offContext );
    };
Progressbar.prototype.draw = function ( context ) {
        this.drawOff();
        if ( context == undefined ) {
            context = this.context;
        }
        var margin = this.trough.get('margin');
        this.calcPercentComplete();
        // console.log( margin );
        if ( this.trough.get('directionFigure') == 'horizontal' ) {
            context.drawImage( 
                this.offContext.canvas,
                0,
                0,
                margin.horizontal + (this.offContext.canvas.width - 2*margin.horizontal) * this.percentComplete,
                this.offContext.canvas.height,
                0,
                0,
                margin.horizontal + (this.offContext.canvas.width - 2*margin.horizontal) * this.percentComplete,
                this.offContext.canvas.height
            );
        }
        if ( this.trough.get('directionFigure') == 'vertical' ) {
            context.drawImage( 
                this.offContext.canvas,
                0,
                0,
                this.offContext.canvas.width,
                margin.vertical + (this.offContext.canvas.height - 2*margin.vertical) * this.percentComplete,
                0,
                0,
                this.offContext.canvas.width,
                margin.vertical + (this.offContext.canvas.height - 2*margin.vertical) * this.percentComplete
            );
        }
    };
Progressbar.prototype.get = function ( name ) {
        for ( var i in this ) {
            if ( i == name ) {
                var value = eval( 'this.' + name );
                return value;
            }
        }
    };
Progressbar.prototype.getPercentComplete = function () {
        return this.percentComplete;
    };
// slider
var Slider = function () {
    this.area = { horizontal: 0.9, vertical: 0.2 };
    this.canvasSize = { width: 400, height: 500 };
    this.trough = { strokeStyle : 'black', fillStyle : 'blue' };
    this.trough.percentComplete = 100;
    this.knob = {
        percent : 20,// 0~100
        fillStyle : 'rgba( 0, 255, 30, 0.5 )',
        strokeStyle: 'black'
    };
    this.respondArea = null;// 响应区域
    this.callback = null;
    this.createCanvas();
    this.createOffCanvas();
    this.createDOMElement();

    // this.knob.area = { horizontal: }
    this.addMouseHandlers();
}
// 使用寄生组合式继承
$.li.inheritPrototype( Slider, COREHTML5 );
/* 这里不能用字面量形式定义属性，须要用添加属性的方法添加属性。 */
Slider.prototype.createTrough = function () {
        this.trough= new RoundedRectangle();
        this.trough.area = this.area;
        this.trough.canvasSize = this.canvasSize;
        this.trough.strokeStyle = this.trough.strokeStyle;
        this.trough.fillStyle = this.trough.fillStyle;
    }
Slider.prototype.createCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }
Slider.prototype.createOffCanvas = function () {
        this.offCanvas = document.createElement('canvas');
        this.offContext = this.offCanvas.getContext('2d');
    }
Slider.prototype.createDOMElement = function () {
        this.domElement = document.createElement('div');
        this.domElement.appendChild( this.canvas );
    }
Slider.prototype.setSizeCanvas = function ( w, h ) {
        // w, h is number
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.context.canvas.width = w;
        this.context.canvas.height = h;
        this.offCanvas.style.width = w + 'px';
        this.offCanvas.style.height = h + 'px';
        this.offContext.canvas.width = w;
        this.offContext.canvas.height = h;
        this.setSizeFigure( this.area.horizontal, this.area.vertical );
    }
Slider.prototype.setSizeFigure = function ( horizontalPercent, verticalPercent ) {// set parameter of figure
        var widthCan = parseInt( this.context.canvas.width ),
            heightCan = parseInt( this.context.canvas.height ),
            widthFigure = widthCan * horizontalPercent,
            heightFigure = heightCan * verticalPercent;
        this.margin = {
            horizontal: widthCan * ( 1 - horizontalPercent ) / 2,
            vertical: heightCan * ( 1 - verticalPercent ) / 2
        }
        this.widthFigure = widthFigure;
        this.heightFigure = heightFigure;
        this.top = this.bottom = this.margin.vertical;
        this.left = this.right = this.margin.horizontal;
        // this.right = this.left + widthFigure;
        // this.bottom = this.top + heightFigure;
        this.cornerRadius = heightFigure / 2 < widthFigure / 2 ? heightFigure / 2 : widthFigure / 2;// get small
        this.directionFigure = widthFigure > heightFigure ? 'horizontal' : 'vertical';
        if ( this.directionFigure == 'horizontal' ) {
            this.slideLength = this.widthFigure - this.cornerRadius * 2;
            this.slideRange = [
                this.left + this.cornerRadius,
                this.left + this.cornerRadius + this.slideLength
            ]
        } else {
            this.slideLength = this.heightFigure - this.cornerRadius * 2;
            this.slideRange = [
                this.top + this.cornerRadius,
                this.top + this.cornerRadius + this.slideLength
            ]
        };
        this.setRespondArea();
    }
Slider.prototype.matchSizeCanvas = function ( jqueryObj ) {
        var w = parseFloat(jqueryObj.css('width')),
            h = parseFloat(jqueryObj.css('height'));
        this.setSizeCanvas( w, h );
    }
Slider.prototype.setRespondArea = function ( ) {
        this.respondArea = this.respondArea ? this.respondArea : {
            x0: this.left,
            y0: this.top,
            x1: this.left+this.widthFigure,
            y1: this.top+this.heightFigure
        }
    }
Slider.prototype.appendTo = function ( jqueryObj ) {
        jqueryObj.append( this.domElement );
    }
Slider.prototype.drawTrough = function () {
        this.createTrough();
        this.trough.draw( this.offContext );
    }
Slider.prototype.drawKnob = function () {
        var knobPainter = new Shape()
        knobPainter.shape.data.r = this.cornerRadius * 1.1;
        if ( this.knob.fillStyle ) {
            knobPainter.fill.isFill = true;
            knobPainter.fill.fillStyle = this.knob.fillStyle;
        } else {
            knobPainter.fill.isFill = false;
        }
        if ( this.knob.strokeStyle ) {
            knobPainter.stroke.isStroke = true;
            knobPainter.stroke.strokeStyle = this.knob.strokeStyle;
        } else { 
            knobPainter.stroke.isStroke = false;
        }
        // 根据横竖设置圆形把手的位置
        if ( this.trough.get('directionFigure') == 'horizontal' ) {
            var left = this.left + (this.widthFigure) * this.knob.percent / 100,
                top = this.top + (this.heightFigure) / 2;
            if ( left > this.slideRange[1] ) {
                left = this.slideRange[1];
            }
            if ( left < this.slideRange[0]) {
                left = this.slideRange[0];
            }
            // left = 
            knobPainter.offset = { 
                // left: this.left + (this.widthFigure) * this.knob.percent / 100,
                // top: this.top + (this.heightFigure) / 2 
                left: left,
                top: top
            }
        }
        if (this.trough.get('directionFigure') == 'vertical' ) {
            var left = this.left + (this.widthFigure) / 2,
                top = this.top + (this.heightFigure) * this.knob.percent / 100;
            if ( top > this.slideRange[1] ) {
                top = this.slideRange[1];
            }
            if ( top < this.slideRange[0]) {
                top = this.slideRange[0];
            }
            knobPainter.offset = {
                // left: this.left + (this.widthFigure) / 2,
                // top: this.top + (this.heightFigure) * this.knob.percent / 100
                left: left,
                top: top
            }
        }
        var knob = new Sprite( 'knob', knobPainter, [] );
        knob.paint( this.offContext );
    }
Slider.prototype.draw = function ( context ) {
        if ( context == undefined ) {
            context = this.context;
        }
        this.drawTrough();// draw trough
        context.drawImage(
            this.offContext.canvas,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height
        );
        this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
        this.drawKnob();// draw knob;
        context.drawImage(
            this.offContext.canvas,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height,
            0,
            0,
            this.offContext.canvas.width,
            this.offContext.canvas.height
        );
        this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
    }
Slider.prototype.get = function ( name ) {
        for ( var i in this ) {
            if ( i == name ) {
                var value = eval( 'this.' + name );
                return value;
            }
        }
    }
    // getPercentComplete: function () {
    //     return this.percentComplete;
    // },
    // erase: function ( context, x0, y0, x1, y1 ) {
    //     context.clearRect( x0, y0, x1, y1 );
    // },
    // Event handle......................................................................
Slider.prototype.addMouseHandlers = function () {
        // 因为我会用$的方法移除事件，不会用dom的方法移除匿名事件。所以我采用$的方法添加、移除事件。
        var slider = this;
        var move = function( e ) {
            var mousemoveP = slider.windowToCanvas( e.clientX, e.clientY );
            e.preventDefault();
            slider.knob.percent = slider.knobPositionToPercent( mousemoveP );
            slider.erase( slider.context, 0, 0, slider.context.canvas.width, slider.context.canvas.height );
            slider.draw();
        };
        // dom
        // $.li.EventUtil.addHandler( slider.domElement, 'mousedown', function ( e ) {
        //     // 给定新的位置
        //     var mouse = slider.windowToCanvas( e.clientX, e.clientY );// 得到相对于slider.canvas的坐标
        //     e.preventDefault();
        //     if ( slider.mouseInTrough(mouse) ) {
        //         slider.knob.percent = slider.knobPositionToPercent( mouse );
        //         slider.erase( slider.context, 0, 0, slider.context.canvas.width, slider.context.canvas.height );
        //         slider.draw();
        //     };
        //     // 绑定move事件
        //     $.li.EventUtil.addHandler( slider.domElement, 'mousemove', move );
        // } );
        // $.li.EventUtil.addHandler( slider.domElement, 'mouseup', function ( e ) {
        //     // 解绑move事件
        //     $.li.EventUtil.removeHandler( slider.domElement, 'mousemove', move );
        // } );
        // jQuery
        $(slider.domElement).on( 'mousedown', function ( event ) {
            //
            var mouse = slider.windowToCanvas( event.clientX, event.clientY );
            event.preventDefault();
            if ( slider.mouseInTrough(mouse) ) {
                slider.knob.percent = slider.knobPositionToPercent( mouse );
                slider.erase( slider.context, 0, 0, slider.context.canvas.width, slider.context.canvas.height );
                slider.draw();
            }
            // 绑定move事件
            $(this).on( 'mousemove', move );
        } );
        $(slider.domElement).on( 'mouseup', function ( event ) {
            //
            $(this).off( 'mousemove' );
            // $(this).off( 'mouseup' );
        } );
    }
    // ..........................................................................
Slider.prototype.windowToCanvas = function ( x, y ) {// 返回相对于canvas的坐标
        var bbox = this.context.canvas.getBoundingClientRect();
        return {
            x: (x - bbox.left) * ( this.context.canvas.width / bbox.width ),
            y: (y - bbox.top) * ( this.context.canvas.height / bbox.height )
        }
    }
Slider.prototype.mouseInTrough = function ( mouse ) {
        this.context.beginPath();
        this.context.rect( this.left, this.top, this.widthFigure, this.heightFigure );
        this.context.closePath();
        return this.context.isPointInPath( mouse.x, mouse.y );
    }
Slider.prototype.mouseInKnob = function ( mouse ) {
        this.context.beginPath();
        if ( this.directionFigure == 'horizontal' ) {// horizontal
            this.context.arc(
                this.left + this.widthFigure * this.knob.percent,
                this.top + this.heightFigure / 2,
                this.cornerRadius * 1.1,
                0,
                2*Math.PI,
                false
            );
            return this.context.isPointInPath( mouse.x, mouse.y );
        } else {// vertical
            this.context.arc(
                this.context.arc(
                    this.left + this.widthFigure / 2,
                    this.top + this.heightFigure * this.knob.percent,
                    this.cornerRadius * 1.1,
                    0,
                    2*Math.PI,
                    false
                )
            );
            return this.context.isPointInPath( mouse.x, mouse.y );
        }
    }
Slider.prototype.knobPositionToPercent = function ( position ) {
        var x = position.x,
            y = position.y;
        if ( this.trough.get('directionFigure') == 'horizontal' ) {
            return (x-this.left) / (this.widthFigure ) * 100;
        } else {
            return (y-this.top) / (this.heightFigure ) * 100;
        }
    }
    // 摧毁掉slider控件
    // 使用：slider.destroy();
Slider.prototype.destroy = function () {
        var slider = this;
        // 1、去掉绑定的事件。使浏览器的垃圾回收机制回收，腾出内存。
        // $.li.EventUtil.removeEvent( slider.domElement, 'mousedown',  );
        // dom的方法我不会，我会$的方法
        $(slider.domElement).off();
        // 2、去掉dom元素
        // $(slider.domElement).remove();
        // $(slider).remove();
        // $(slider) canvas标签
        // $(slider.domElement) canvas标签的父标签——div标签
        // console.log( $(slider) );
        // console.log( $(slider.domElement) );
        // console.log( slider );
        // for ( var i in slider ) {
        //     i = null;
        // }
        // console.log( slider );
        $(slider.domElement).remove();
        slider = null;
    }
// var slider = new Slider();
// slider.appedTo( $('#id') );
// slider.setSizeCanvas( 400, 500 );
// slider.draw();
// pan
// 在执行pan.appendTo()时才加载图片。
var Pan = function () {
    // pan
    this.pan = {
        width : 400,
        height : 500,
        stroke: {
            isStroke: true,
            strokeStyle : 'black',
            lineWidth: 1
        },
        // ratio: width / height
    };
    // 可视窗口
    this.viewPort = {
        // 起点。
        xPercent: 0.3,// 占image的30%
        yPercent: 0.5,// 50%
        amplifyRatio: 2, // 放大的倍率
        // 宽高由pan决定
        // width: 0.5,// 50%
        // height: 0.2,// 20%
        stroke: {
            isStroke: false,
            strokeStyle : 'black',
            lineWidth: 1
        },
        // imgx,
        // imgy,
        // imgw,
        // imgh,
        // cx,
        // cy,
        // cw,
        // ch,
        // originPosition,
        // moveAreaAble:{ x, y, w, h },
    };
    // 图片信息
    this.image = {
        // url: null,
        x: 20,
        y: 10,
        width: 150,
        height: 'auto',
        // naturalWidth: 
        // naturalHeight: 
        complete: false,
        img: null,
        stroke: {
            isStroke: false,
            strokeStyle : 'black',
            lineWidth: 1
        },
        globalAlpha: 0.5,
        // scale:
    };
    //
    // this.loadImage();
    this.createCanvas();
    this.createOffCanvas();
    this.setSizeCanvas();
    // this.getImageOriginal();
}
// 使用寄生组合式继承
$.li.inheritPrototype( Pan, COREHTML5 );
/* 这里不能用字面量形式定义属性，须要用添加属性的方法添加属性。 */
Pan.prototype.createCanvas = function () {//
    this.canvas = document.createElement( 'canvas' );
    this.context = this.canvas.getContext( '2d' );
}
Pan.prototype.createOffCanvas = function () {//
    this.offCanvas = document.createElement( 'canvas' );
    this.offContext = this.offCanvas.getContext( '2d' );
}
Pan.prototype.setSizeCanvas = function () {//
    var pan = this.pan;
    this.canvas.style.width = pan.width + 'px';
    this.canvas.style.height = pan.height + 'px';
    this.context.canvas.width = pan.width;
    this.context.canvas.height = pan.height;
    this.offCanvas.style.width = pan.width + 'px';
    this.offCanvas.style.height = pan.height + 'px';
    this.offContext.canvas.width = pan.width;
    this.offContext.canvas.height = pan.height;
}
Pan.prototype.calcImage = function () {
    var img = this.image.img;
    this.image.naturalWidth = img.width;// 无单位
    this.image.naturalHeight = img.height;// 无单位
    this.image.scale = this.image.naturalWidth / this.image.width;
    var w = this.image.width,
        h = this.image.height,
        nw = this.image.naturalWidth,
        nh = this.image.naturalHeight,
        wh = nw / nh;
    if ( $.li.isNumber( w ) && h == 'auto' ) {
        this.image.height = w / wh;
    }
    if ( $.li.isNumber( h ) && w == "auto"  ) {
        this.image.width = h * wh;
    }
    if ( $.li.isNumber( w ) && $.li.isNumber( h ) ) {
        // this.image
    }
    if ( w == "auto" && h == 'auto' ) {
        this.image.width = this.pan.width * 10;
        this.image.height = this.image.width / wh;
    }
}
Pan.prototype.calcViewPort = function ( jqueryObj ) {
    // 都是相当于image的。
    this.viewPort.imgx = this.image.naturalWidth * this.viewPort.xPercent;
    this.viewPort.imgy = this.image.naturalHeight * this.viewPort.yPercent;
    this.viewPort.imgw = this.pan.width / this.viewPort.amplifyRatio * this.image.scale;
    this.viewPort.imgh = this.pan.height / this.viewPort.amplifyRatio * this.image.scale;
    this.viewPort.cx = this.image.width * this.viewPort.xPercent + this.image.x;
    this.viewPort.cy = this.image.height * this.viewPort.yPercent + this.image.y;
    this.viewPort.cw = this.pan.width / this.viewPort.amplifyRatio;
    this.viewPort.ch = this.pan.height / this.viewPort.amplifyRatio;
    this.viewPort.originPosition = { x: this.viewPort.cw / 2 + this.viewPort.cx, y: this.viewPort.ch / 2 + this.viewPort.cy };
    this.viewPort.moveAreaAble = {
        x0: this.image.x - this.viewPort.cw,
        y0: this.image.y - this.viewPort.ch,
        x1: this.image.x + this.image.width + this.viewPort.cw,
        y1: this.image.y + this.image.height + this.viewPort.ch
    }
}
Pan.prototype.caleVPPosition = function ( position ) {// 根据原点计算其他位置
    this.viewPort.originPosition = position;
    this.viewPort.cx = this.viewPort.originPosition.x - this.viewPort.cw / 2;
    this.viewPort.cy = this.viewPort.originPosition.y - this.viewPort.ch / 2;
    // this.viewPort.originPosition = { x: mousemoveP.x - mouse.x, y: mousemoveP.y - mouse.y };
    // this.viewPort.cx = this.viewPort.cx + this.viewPort.originPosition.x;
    // this.viewPort.cy = this.viewPort.cy + this.viewPort.originPosition.y;
}
Pan.prototype.appendTo = function ( jqueryObj ) {
    // this.calcImageNWNH();
    this.calcImage();
    this.calcViewPort();
    jqueryObj.append( this.canvas );
    this.addMouseHandlers();
}
Pan.prototype.drawPan = function () {
    var context = this.offContext;
    context.save();
    context.drawImage(
        this.image.img,
        this.viewPort.imgx,
        this.viewPort.imgy,
        this.viewPort.imgw,
        this.viewPort.imgh,
        0, 
        0,
        this.pan.width,
        this.pan.height
    );
    if ( this.pan.stroke.isStroke ) {
        context.beginPath();
        context.rect( 0, 0, this.pan.width, this.pan.height );
        context.strokeStyle = this.pan.stroke.strokeStyle;
        context.lineWidth = this.pan.stroke.lineWidth;
        context.closePath();
        context.stroke();
    }
    context.restore();
}
Pan.prototype.drawImg = function() {
    // this.calcImageWH();
    var context = this.offContext;
    context.save();
    context.globalAlpha = this.image.globalAlpha;
    context.drawImage(
        this.image.img,
        0,
        0,
        this.image.naturalWidth,
        this.image.naturalHeight,
        this.image.x,
        this.image.y,
        this.image.width,
        this.image.height
    );
    if ( this.image.stroke.isStroke ) {
        context.beginPath();
        context.rect( this.image.x, this.image.y, this.image.width, this.image.height );
        context.closePath();
        context.strokeStyle = this.image.stroke.strokeStyle;
        context.stroke();
    }
    context.restore();
}
Pan.prototype.drawViewPort = function () {
    var context = this.offContext;
    context.save();
    context.drawImage(
        this.image.img,
        this.viewPort.imgx,
        this.viewPort.imgy,
        this.viewPort.imgw,
        this.viewPort.imgh,
        this.viewPort.cx,
        this.viewPort.cy,
        this.viewPort.cw,
        this.viewPort.ch
    );
    if ( this.viewPort.stroke.isStroke ) {
        context.beginPath();
        context.rect( this.viewPort.cx, this.viewPort.cy, this.viewPort.cw, this.viewPort.ch );
        context.closePath();
        context.strokeStyle = this.viewPort.stroke.strokeStyle;
        context.stroke();
    }
    context.restore();
}
Pan.prototype.draw = function ( context ) {
    if ( context == undefined ) {
        context = this.context;
    }
    // 绘制pan
    this.drawPan();
    context.drawImage( this.offContext.canvas, 0, 0 );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
    // 绘制image
    this.drawImg();
    context.drawImage( this.offContext.canvas, 0, 0 );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
    // 绘制viewPort
    this.drawViewPort();
    context.drawImage( this.offContext.canvas, 0, 0 );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
    // this.addMouseHandlers();
    console.log( this );
}
Pan.prototype.addMouseHandlers = function () {
    var self = this;
    $(this.canvas).on( 'mousedown', function ( event ) {
        var mouse = self.windowToCanvas( self.context.canvas, event.clientX, event.clientY );
        // 得到down时的数据
        var op = self.viewPort.originPosition,
            cx = self.viewPort.cx,
            cy = self.viewPort.cy;
        event.preventDefault();
        if ( self.mouseInViewPort(mouse) ) {// 点击在viewport里
            /* 移动viewport */
            // $(this) ：canvas
            $(this).on( 'mousemove', function ( event ) {
                var mousemoveP = self.windowToCanvas( self.context.canvas, event.clientX, event.clientY );
                // 思路：1、算出位移。2、位移+原来的=现在的。
                var dissX = mousemoveP.x - mouse.x,
                    dissY = mousemoveP.y - mouse.y;
                /* 更新viewport图片 */
                self.viewPort.cx = cx + dissX;
                self.viewPort.cy = cy + dissY;
                self.viewPort.cx = self.viewPort.cx < self.viewPort.moveAreaAble.x0 ? self.viewPort.moveAreaAble.x0 : self.viewPort.cx;
                self.viewPort.cy = self.viewPort.cy < self.viewPort.moveAreaAble.y0 ? self.viewPort.moveAreaAble.y0 : self.viewPort.cy;
                self.viewPort.cx = self.viewPort.moveAreaAble.x1 - self.viewPort.cw < self.viewPort.cx ? self.viewPort.moveAreaAble.x1 - self.viewPort.cw : self.viewPort.cx;
                self.viewPort.cy = self.viewPort.moveAreaAble.y1 - self.viewPort.ch < self.viewPort.cy ? self.viewPort.moveAreaAble.y1 - self.viewPort.ch : self.viewPort.cy;
                self.viewPort.imgx = (self.viewPort.cx - self.image.x) * self.image.scale;
                self.viewPort.imgy = (self.viewPort.cy - self.image.y) * self.image.scale;
                // self.viewPort.imgw = self.viewPort.cw / self.viewPort.amplifyRatio;
                // self.viewPort.imgh = self.viewPort.ch / self.viewPort.amplifyRatio;
                /* 更新pan图片 */
                self.erase( self.context, 0, 0, self.context.canvas.width, self.context.canvas.height );
                self.draw();
            });
            console.log( '添加move' );
        }
        if ( !self.mouseInViewPort(mouse) && self.mouseInImage(mouse) ) {// 点击在image里，不在viewport里。
            /* 移动viewport */
            self.erase( self.context, 0, 0, self.context.canvas.width, self.context.canvas.height );
            self.caleVPPosition( mouse );
            /* 更新viewport图片 */
            /* 更新pan图片 */
            self.draw();
        }
    } );
    $(this.canvas).on( 'mouseup', function () {
        $(this).off( 'mousemove' );
        console.log( '去除move' );
    } )
}
Pan.prototype.mouseInViewPort = function ( mouse ) {
    this.context.beginPath();
    this.context.rect( this.viewPort.cx, this.viewPort.cy, this.viewPort.cw, this.viewPort.ch );
    this.context.closePath();
    return this.context.isPointInPath( mouse.x, mouse.y );
}
Pan.prototype.mouseInImage = function ( mouse ) {
    this.context.beginPath();
    this.context.rect( this.image.x, this.image.y, this.image.width, this.image.height );
    this.context.closePath();
    return this.context.isPointInPath( mouse.x, mouse.y );
}
// var pan = new Pan();
// pan.image.img = loadImg.images[ '../image/kid.png' ];
// pan.image.stroke.isStroke = true;
// pan.viewPort.amplifyRatio = 5;
// pan.viewPort.stroke.isStroke = true;
// pan.appendTo( $('#id') );
// pan.draw();
var Key = function () {
    this.text = "A";
    this.width = 50;
    this.height = 50;
    this.font = {
        size: 'accordKey',//数字 或 'accordKey'
        // left: 0,
        // top: 0,
        // family: 'Arial',// 必须是字体的英文名字。
        // textAlign: start,
        text: "A"
    };
    this.offset = { left: 0, top: 0 };
    this.fill = {
        isFill : true,
        fillStyle : 'rgba( 210, 210, 210, 0.5 )'
    };
    this.stroke = {
        isStroke : true,
        strokeStyle : 'rgba( 0, 0, 0, 0.5 )'
    };
    this.shadow = {
        isShadow : false,
        shadowColor: 'rgb(0,0,0)',
        shadowOffsetX: -4,
        shadowOffsetY: -4,
        shadowBlur: 8
    };
    this.lineWidth = 1;
    this.roundCornerRadius = 3;
    this.createCanvas();
    this.createOffCanvas();
    // this.caleFontSize();
};
$.li.inheritPrototype( Key, COREHTML5 );
Key.prototype.caleFontSize = function ( ) {
    this.font.family = "Arial";
    this.font.textAlign = "start";
    if ( this.font.size == 'accordKey' ) {
        var small = Math.min( this.width, this.height );
        if ( small < 20 ) {
            this.font.size = small;
            this.font.top = 0;
            this.font.left = 0;
        } else {
            this.font.size = 20 + (small-20) * 0.2;
            this.font.left = 0 + (small-20) * 0.2;
            this.font.top = this.font.left;
        }

        // console.log( this.context.font );
        this.context.font = this.font.size + 'px ' + this.font.family;
        var fontWidth = this.context.measureText( this.font.text ).width;
        if ( this.width < fontWidth ) {
            var ratio = fontWidth / this.width * 0.9;
            this.font.size = this.font.size / ratio - 0;
            this.context.font = this.font.size + 'px ' + this.font.family;
            // while ( this.width < this.context.measureText( this.font.text ).width ) {
            //     this.font.size -= 0.1;
            //     this.context.font = this.font.size + 'px ' + this.font.family;
            //     console.log(1);
            // }
            // console.log( this.width );
            // console.log( this.context.measureText( this.font.text ).width );
            // this.font.size -= 0.1;
            // this.context.font = this.font.size + 'px ' + this.font.family;
            // console.log( this.context.measureText( this.font.text ).width );

        }
    } else {
        var small = Math.min( this.width, this.height );
        if ( small < 20 ) {
            this.font.size = small;
            this.font.top = 0;
            this.font.left = 0;
        } else {
            this.font.size = 20 + (small-20) * 0.2;
            this.font.left = 0 + (small-20) * 0.2;
            this.font.top = this.font.left;
        }
    }
    this.font.left += this.offset.left;
    this.font.top += this.offset.top;
};
Key.prototype.appendTo = function ( jqueryObj ) {
    if ( jqueryObj ) {
        jqueryObj.append( this.canvas );
    } else {
        
        jqueryObj.append( this.canvas );
    }
};
Key.prototype.drawOff = function (  ) {
    this.caleFontSize();
    var offContext = this.offContext;
    offContext.save();
    // 绘制圆角矩形
    var roundedRectPainter = new RoundedRect();
    roundedRectPainter.fill = this.fill;
    roundedRectPainter.stroke = this.stroke;
    var roundedRect = new Sprite( 'roundedRect', roundedRectPainter, [] );
    roundedRect.width = this.width;
    roundedRect.height = this.height;
    roundedRect.left = this.offset.left;
    roundedRect.top = this.offset.top;
    roundedRect.paint( offContext );
    // 绘制文字
    offContext.font = this.font.size + 'px ' + this.font.family; // 文字的字体和字号
    offContext.textAlign = this.font.textAlign; // 文字的对齐方式
    offContext.fillText( this.font.text, this.font.left + this.offset.left, this.font.top+this.font.size + this.offset.top );// 文字内容和对齐位置
    offContext.restore();
};
Key.prototype.draw = function ( context, left, top ) {
    this.drawOff();
    if ( context == undefined ) {
        context = this.context;
    };
    left = left === undefined ? 0 : left;
    top = top === undefined ? 0 : top;
    // context.drawImage( this.offContext.canvas, 0, 0 );
    context.drawImage( this.offContext.canvas, left, top );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
}
/* KeyBoard */
// 还没做绑定事件
var KeyBoard = function () {
    // this.keyInterval = 0.01;
    // this.keyWidth = 0.89;
    // this.keyPosition = [];
    this.keyBoard = {
        // width
        // height
        // offset: {left:0,top:0}
        stroke : {
            isStroke : true,
            strokeStyle: 'rgba( 0, 0, 0, 0.5 )'
        },
        fill: {
            isFill : true,
            fillStyle : 'rgba( 210, 210, 210, 0.5 )'
        },
        shadow: {
            isShadow : true,
            shadowColor: 'rgb(0,0,0)',
            // shadowOffsetX: -4,
            // shadowOffsetY: -4,
            // shadowBlur: 8
        }
    };
    this.key = {
        texts: [ 
            [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
            ],
            [
            "Q",
            "W",
            "E",
            "R",
            "T",
            "Y",
            "U",
            "I",
            "O",
            "P",
            ],
            [
            "A",
            "S",
            "D",
            "F",
            "G",
            "H",
            "J",
            "K",
            "L",
            ],
            [
            "Shift",
            "Z",
            "X",
            "C",
            "V",
            "B",
            "N",
            "M",
            "Backspace"
            ]
        ],
        // interval
        // position: [], // 相对于keyBoard的。
        // spec,
        fontSize: 'accordKey',
        stroke : {
            isStroke : true,
            strokeStyle: 'rgba( 0, 0, 0, 0.5 )'
        },
        fill: {
            isFill : true,
            fillStyle : 'rgba( 210, 210, 210, 0.5 )'
        },
        shadow: {
            isShadow : true,
            shadowColor: 'rgb(0,0,0)',
            // shadowOffsetX: -4,
            // shadowOffsetY: -4,
            // shadowBlur: 8
        }
    }
    this.whRatio = 100/49.6;// 键盘的宽高比。不能修改。
    this.fill = {
        isFill : true,
        fillStyle : 'rgba( 255, 255, 255, 0.5 )'
    };
    this.stroke = {
        isStroke : true,
        strokeStyle : 'rgba( 0, 0, 0, 0.5 )'
    };
    this.shadow = {
        isShadow : false,
        shadowColor: 'rgb(0,0,0)',
        shadowOffsetX: -4,
        shadowOffsetY: -4,
        shadowBlur: 8
    };
    this.createCanvas();
    this.createOffCanvas();
};
$.li.inheritPrototype( KeyBoard, COREHTML5 );
KeyBoard.prototype.caleKeyBoard = function (  ) {
    var canvasW = this.context.canvas.width,
        canvasH = this.context.canvas.height;
    if ( canvasW / this.whRatio > canvasH  ) {// 左右有空隙，中间放键盘。
        this.keyBoard.height = canvasH / 1.05;
        this.keyBoard.width = this.keyBoard.height * this.whRatio;
        this.keyBoard.offset = { left: (canvasW-this.keyBoard.width)/2, top: this.keyBoard.height * 0.025 };
    } else {// 上下有空隙，中间放键盘。
        this.keyBoard.width = canvasW / 1.05//留出5%的空隙
        this.keyBoard.height = this.keyBoard.width / this.whRatio;
        this.keyBoard.offset = { left: this.keyBoard.width * 0.025, top: (canvasH-this.keyBoard.height)/2 };
    }
    this.caleKey();// 计算键的宽高
};
KeyBoard.prototype.caleKey = function ( jqueryObj ) {
    var kbW = this.keyBoard.width,
        kbH = this.keyBoard.height;
    for ( var i = 0, iLen = this.key.texts.length; i < iLen; i++ ) {
        for ( var j = 0, jLen = i.length; j < jLen; j++ ) {
            this.key.spec[i][j].width = w[i][j];
            this.key.spec[i][j].height = h[i][j];
        }
    }
    this.key.interval = kbW * 0.01;
    this.key.shadow.shadowOffsetX = kbW * 0.02;
    this.key.shadow.shadowOffsetY = kbW * 0.02;
    this.key.shadow.shadowBlur = 0;
    this.caleKeyPosition();
    this.caleKeySpec();
};
KeyBoard.prototype.caleKeyPosition = function ( jqueryObj ) {
    // this.key.position = [ [], [], [], [] ];
    var position = [];
    var kbW = this.keyBoard.width;
    for ( var i = 0, iLen = 4; i < iLen; i++ ) {
        position.push( new Array() );
    }
    // 第0行
    for ( var i = 0, iLen = this.key.texts[0].length; i < iLen; i++ ) {
        var o = new Object();
        o.left = kbW * 0.01 + kbW * (0.01+0.089) * i;
        o.top = kbW * 0.02;
        position[0].push( o );
    }
    // 第1行
    // position[1] = position[0];
    for ( var i = 0, iLen = this.key.texts[1].length; i < iLen; i++ ) {
        var o = new Object();
        o.left = kbW * 0.01 + kbW * (0.01+0.089) * i;
        o.top = kbW * (0.02+(0.089+0.01+0.02));
        position[1].push( o );
    }
    // 第2行
    for ( var i = 0, iLen = this.key.texts[2].length; i < iLen; i++ ) {
        var o = new Object();
        o.left = kbW * (0.01+0.089/2) + kbW * (0.089+0.01) * i;
        o.top = kbW * (0.02+(0.089+0.01+0.02)*2);
        position[2].push( o );
    }
    // 第3行
    for ( var i = 0, iLen = this.key.texts[3].length; i < iLen; i++ ) {
        var o = new Object();
        o.left = kbW * (0.01+0.089/2) + kbW * (0.089+0.01) * i;
        o.top = kbW * (0.02+(0.089+0.01+0.02)*3);
        position[3].push( o );
    }
    position[3][0].left = kbW * 0.01;
    // 使用深复制
    // this.key.position = $.li.deepCopy( position );
    this.key.position =  position;
    position = null;
};
KeyBoard.prototype.caleKeySpec = function ( jqueryObj ) {
    var spec = [];
    var kbW = this.keyBoard.width;
    for ( var i = 0, iLen = this.key.texts.length; i < iLen; i++ ) {
        spec.push( new Array() );
        for ( var j = 0, jLen = this.key.texts[i].length; j < jLen; j++ ) {
            var o = new Object();
            o.width = kbW * 0.089;
            o.height = kbW * 0.089;
            spec[i].push( o );
        }
    }
    spec[3][0].width = kbW * (0.089+0.01+(0.089-0.01)/2);
    spec[3][8].width = kbW * (0.089+0.01+(0.089-0.01)/2);
    this.key.spec = spec;
    // spec = null;
};
KeyBoard.prototype.appendTo = function ( jqueryObj ) {
    jqueryObj.append( this.canvas );
};
KeyBoard.prototype.drawBorder = function ( jqueryObj ) {
    var offContext = this.offContext;
    keyBoard = this.keyBoard;
    offContext.save();
    offContext.beginPath();
    offContext.rect( keyBoard.offset.left, keyBoard.offset.top, keyBoard.width, keyBoard.height );
    offContext.closePath();
    if ( this.stroke.isStroke ) {
        offContext.strokeStyle = keyBoard.stroke.strokeStyle;
        offContext.stroke();
    }
    if ( this.fill.isFill ) {
        offContext.fillStyle = keyBoard.fill.fillStyle;
        offContext.fill();
    }
    offContext.restore();
};
KeyBoard.prototype.drawKey = function () {
    var offContext = this.offContext;
    offContext.save();
    for ( var i = 0, iLen = this.key.texts.length; i < iLen; i++ ) {
        for ( var j = 0, jLen = this.key.texts[i].length; j < jLen; j++ ) {
            var key = new Key();
            key.font.text = this.key.texts[i][j];
            key.width = this.key.spec[i][j].width;
            key.height = this.key.spec[i][j].height;
            key.draw( 
                offContext, 
                this.key.position[i][j].left + this.keyBoard.offset.left, 
                this.key.position[i][j].top + this.keyBoard.offset.top
            );
        }
    }




    offContext.beginPath();
    offContext.closePath();
    offContext.restore();
};
KeyBoard.prototype.draw = function ( context ) {
    this.caleKeyBoard();//计算键盘的宽高
    if ( context == undefined ) {
        context = this.context;
    };
    
    this.drawBorder();//绘制边框
    context.drawImage( this.offContext.canvas, 0, 0 );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );

    this.drawKey();//绘制键
    context.drawImage( this.offContext.canvas, 0, 0 );
    this.erase( this.offContext, 0, 0, this.offContext.canvas.width, this.offContext.canvas.height );
}