var Sprite = function ( name, painter, behaviors ) {
    this.name = name === undefined ? undefined : name;
    this.painter = painter === undefined ? undefined : painter;
    this.top = 0;
    this.left = 0;
    this.width = 10;
    this.height = 10;
    this.radius = 5;
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityRadian = 0;
    this.visible = true;
    this.animate = false;
    this.behaviors = behaviors || [];
    return this;
};
Sprite.prototype = {
    paint: function ( context ) {
        if (this.painter !== undefined && this.visible ) {
            this.painter.paint( this, context );
        }
    },
    update: function ( context, time ) {
        // 执行行为数组中每一个execute方法
        for ( var i = 0; i < this.behaviors.length; ++i ) {
            this.behaviors[i].execute( this, context, time );
        }
    }
};
// 形状
var Shape = function () {
    this.shape = {
        type : 'arc',// 'arc' / 'rect' / 'custom'
        data : {
            x: 0, y: 0, r: 15, beginRadian: 0, endRadian: 2*Math.PI, counterClockWise: false
        }
        // data: { x: 0, y: 0, w: 15, h: 15 }// rect
        // data: [ 
        //     {x:15*Math.cos((1/6)*Math.PI),y:15*Math.sin((1/6)*Math.PI)}, 
        //     {x:0,y:15}, 
        //     {x:-15*Math.cos((1/6)*Math.PI),y:15*Math.sin((1/6)*Math.PI)}, 
        //     {x:-15*Math.cos((1/6)*Math.PI),y:-15*Math.sin((1/6)*Math.PI)}, 
        //     {x:0,y:-15}, 
        //     {x:15*Math.cos((1/6)*Math.PI),y:-15*Math.sin((1/6)*Math.PI)} 
        // ]// custom
    }
    this.stroke = {
        isStroke : true,
        // useGradient : false,
        strokeStyle : 'black'
    };
    this.fill = {
        isFill : false,
        // useGradient : false,
        fillStyle : 'black'
    };
    this.rotate = 0;
    this.offset = {
        left: 0,
        top: 0
    }
};
Shape.prototype = {
    paint: function ( sprite, context ) {
        var shape = this.shape,
            stroke = this.stroke,
            fill = this.fill,
            rotate = this.rotate,
            offset = this.offset,
            left = sprite.left,
            top = sprite.top;
        
        context.save();
        context.translate( left, top );
        context.rotate( rotate );
        context.beginPath();
        // 绘制
        switch ( shape.type ) {
            case 'arc':
            default:
                context.arc( shape.data.x + offset.left, shape.data.y + offset.top, shape.data.r, shape.data.beginRadian, shape.data.endRadian, shape.data.counterClockWise );
                break;
            case 'rect':
                context.rect( 
                    shape.data.x + offset.left, 
                    shape.data.y + offset.top, 
                    shape.data.w, 
                    shape.data.h 
                );
                break;
            case 'custom':
                context.moveTo( shape.data[0].x + offset.left, shape.data[0].y + offset.top );
                for ( var i = 1, len = shape.data.length; i < len; i++ ) {
                    context.lineTo( shape.data[i].x + offset.left, shape.data[i].y + offset.top );
                }
                break;
        }
        context.closePath();
        // 描边、填充
        if ( stroke.isStroke ) {
            context.strokeStyle = stroke.strokeStyle;
            context.stroke();
        }
        if ( fill.isFill ) {
            context.fillStyle = fill.fillStyle;
            context.fill();
        }
        context.restore();
    },
    getShape : function () {
        return this.shape;
    },
    getStroke : function () {
        return this.stroke;
    },
    getFill : function () {
        return this.fill;
    },
    getRotate : function () {
        return this.rotate;
    },
    getOffset: function () {
        return this.offset;
    }
}
// 椭
// 只用压缩法。除此外还有参数方程法、三次贝塞尔曲线法一/三次贝塞尔曲线法二/光栅法
// 基本上所有的方法都不可能达到100%精确，因为受显示器分辨率的限制。
// 其实最好的方法应该是arc()+scale()。canvas绘图库KineticJS就是用的这种方法。
var Ellipse = function () {
    this.ratio = { x: 1, y: 0.5, reasonableScale: false };// 没做好reasonableScale = true
    this.offset = { x: 0, y: 0 };
    this.data = { x: 0, y: 0, r: 15, beginRadian: 0, endRadian: 2*Math.PI, counterClockWise: false };
    this.rotate = 0;
    this.fill = {
        isFill : false,
        fillStyle : 'black'
    };
    this.stroke = {
        isStroke : false,
        strokeStyle : 'black'
    };
    this.lineWidth = 1;
};
Ellipse.prototype = {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            ratio = this.ratio,
            offset = this.offset,
            data = this.data,
            fill = this.fill,
            stroke = this.stroke,
            rotate = this.rotate,
            lineWidth = this.lineWidth;

        context.save();
        context.translate( left, top );
        context.rotate( rotate );
        context.beginPath();
        context.lineWidth = lineWidth;
        if ( ratio.reasonableScale ) {
            // context.arc(  );
        } else {
            context.scale( ratio.x, ratio.y );
            context.arc( data.x + offset.x, data.y + offset.y, data.r, data.beginRadian, data.endRadian, data.counterClockWise );
        }
        if ( stroke.isStroke ) {
            context.strokeStyle = stroke.strokeStyle;
            context.stroke();
        }
        if ( fill.isFill ) {
            context.fillStyle = fill.fillStyle;
            context.fill();
        }
        context.restore();
    }
};
var RoundedRect = function () {
    this.roundCorner = {
        // isRound: true,// 如果允许不圆角就是直角矩形了。可以使用Shape。
        radius: 10
    };
    // this.width = 100; 使用sprite的宽度
    // this.height = 62; 使用sprite的高度
    this.offset = { left: 0, top: 0 };
    this.rotate = 0;
    // this.data 保留了圆角其他形状（例如：圆角三角形、圆角五角形。）
    this.fill = {
        isFill : false,
        fillStyle : 'black'
    };
    this.stroke = {
        isStroke : false,
        strokeStyle : 'black'
    };
    this.lineWidth = 1;
};
RoundedRect.prototype = {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            width = sprite.width,
            height = sprite.height,
            roundCorner = this.roundCorner,
            offset = this.offset,
            rotate = this.rotate,
            fill = this.fill,
            stroke = this.stroke,
            lineWidth = this.lineWidth;
        context.save();
        context.translate( sprite.left, sprite.top );
        context.rotate( rotate );
        context.lineWidth = lineWidth;
        var pointPosition = [
            [ 0, roundCorner.radius ], // 第0个点
            [ 0, 0, roundCorner.radius, 0, roundCorner.radius ], // 第1个点
            [ width-roundCorner.radius, 0 ], // 第2个点
            [ width, 0, width, roundCorner.radius, roundCorner.radius ], // 第3个点
            [ width, height-roundCorner.radius ], // 第4个点
            [ width, height, width-roundCorner.radius, height, roundCorner.radius ], // 第5个点
            [ roundCorner.radius, height ], // 第6个点
            [ 0, height, 0, height-roundCorner.radius, roundCorner.radius ], // 第7个点
         ];
        context.beginPath();
        context.moveTo( pointPosition[0][0] + offset.left, pointPosition[0][1] + offset.top );
        context.arcTo( pointPosition[1][0] + offset.left, pointPosition[1][1] + offset.top, pointPosition[1][2] + offset.left, pointPosition[1][3] + offset.top, roundCorner.radius );
        for ( var i = 2, len = pointPosition.length; i < len; i++ ) {
            if ( i%2 == 0 ) {
                context.lineTo( pointPosition[i][0] + offset.left, pointPosition[i][1] + offset.top );
            } else {
                context.arcTo( pointPosition[i][0] + offset.left, pointPosition[i][1] + offset.top, pointPosition[i][2] + offset.left, pointPosition[i][3] + offset.top, roundCorner.radius );
            }
        }
        context.closePath();
        if ( fill.isFill ) {
            context.fillStyle = fill.fillStyle;
            context.fill();
        }
        if ( stroke.isStroke) {
            context.strokeStyle = stroke.strokeStyle;
            context.stroke();
        }
        context.restore();
    }
};
// 绘制小球
var Ball = function () {
    this.fill = {
        isFill : true,
        fillStyle : 'rgba(218,165,32,0.1)'
    };
    this.stroke = {
        isStroke : true,
        strokeStyle : 'rgba(100, 100, 195, 1)'
    };
    this.shadow = {
        isShadow : true,
        shadowColor: 'rgb(0,0,0)',
        shadowOffsetX: -4,
        shadowOffsetY: -4,
        shadowBlur: 8
    }
    this.offset = { x: 0, y: 0 };
    this.rotate = 0;
    this.lineWidth = 2;
};
Ball.prototype = {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            // width = sprite.width,
            // height = sprite.height,
            radius = sprite.radius / 2,
            fill = this.fill,
            stroke = this.stroke,
            shadow = this.shadow,
            offset = this.offset,
            rotate = this.rotate,
            lineWidth = this.lineWidth;

        context.save();
        context.translate( left, top );
        context.rotate( rotate );
        context.lineWidth = lineWidth;
        context.beginPath();
        context.arc( offset.x, offset.y, radius, 0, 2*Math.PI, false );
        context.clip();
        if ( shadow.isShadow ) {
            context.shadowColor = shadow.shadowColor;
            context.shadowOffsetX = shadow.shadowOffsetX;
            context.shadowOffsetY = shadow.shadowOffsetY;
            context.shadowBlur = shadow.shadowBlur;
        }
        if ( fill.isFill ) {
            context.fillStyle = fill.fillStyle;
            context.fill();
        }
        if ( stroke.isStroke) {
            context.strokeStyle = stroke.strokeStyle;
            context.stroke();
        }
        context.restore();
    }
};
// 绘制图片
var ImagePainter = function ( imageUrl ) {
    this.image = new Image();
    this.image.src = imageUrl;
    this.state = false;
    this.clipShape = {
        isClip : false,
        // shape : 'geometry',// geometry/arc
        shape : 'arc',// geometry/arc
        // data : [ { x: 0, y: 0}, { x: 30, y: 0 }, { x: 30, y: 30 }, { x: 0, y: 30 } ]
        data: { x: 0, y: 0, r: 15, beginRadian: 0, endRadian: 2*Math.PI, counterClockWise: false }
    };
    this.left = 0;// 偏移量
    this.top = 0;
    this.rotate = 0;
    this.callback = null;// 绘制玩图片后执行的函数
};
ImagePainter.prototype = {
    paint: function ( sprite, context ) {
        var self = this,
            clipShape = this.clipShape,
            left = this.left,
            top = this.top,
            rotate = this.rotate;

        if ( self.image.complete ) {
            context.drawImage( self.image, sprite.left, sprite.top, sprite.width, sprite.height );
        }

        // var intervalLoadImg = setInterval( function ( e ) {
        //     if ( self.image.complete ) {
        //         // console.log('加载完成');
                
        //         context.save();
        //         context.translate( left, top );
        //         context.rotate( rotate );
        //         // 是否允许裁剪
        //         if ( clipShape.isClip ) {
        //             // 根据参数设置裁剪
        //             switch ( clipShape.shape ) {
        //                 case 'geometry':
        //                 default:
        //                     context.beginPath();
        //                     context.moveTo( clipShape.data[0].x, clipShape.data[0].y );
        //                     for ( var i = 1; i < clipShape.data.length; i++ ) {
        //                         context.lineTo( clipShape.data[i].x, clipShape.data[i].y );
        //                     }
        //                     break;
        //                 case 'arc':
        //                     context.beginPath();
        //                     context.arc( clipShape.data.x, clipShape.data.y, clipShape.data.r, clipShape.data.beginRadian, clipShape.data.endRadian, clipShape.data.counterClockWise );
        //                     break;
        //             }
        //             context.closePath();
        //             // context.stroke();
        //             context.clip();
        //         }
        //         context.drawImage( self.image, sprite.left, sprite.top, sprite.width, sprite.height );
        //         context.restore();
        //         console.log('绘制完成');

        //         clearInterval( intervalLoadImg );
        //         self.state = true;
        //         if ( self.callback ) {
        //             self.callback();
        //         }
        //     } else {
        //         // context.drawImage( self.image, sprite.left, sprite.top, sprite.width, sprite.height );
        //         console.log('正在加载');
        //     }
        // }, 16 );
    },
    getState: function () {
        return this.state;
    }
};
// 绘制渐变圆
var GradientArc = function () {
    this.radius = 5;
    this.lineWidth = 1;
    this.stroke = {// 描边
        isStroke: false,
        useGradient: false,
        strokeStyle: 'rgba(0,0,0,1)',
        gradient: {
            type: 'linear',//渐变样式：linear/radial
            startAndStop: {// 用于线性渐变
                x0: 0,
                y0: 0,
                x1: 10,
                y1: 10
            },
            startArcAndStopArc: {// 用于圆形渐变
                x0: 0,
                y0: 0,
                r0: 10,
                x1: 0,
                y1: 0,
                r1: 30,
            },
            colorStop: [//分段颜色组成的数组
                { position: 0, color: 'black' },
                { position: 1, color: 'white' }
            ]
        }
    };
    this.fill = {// 填充
        isFill: false,
        useGradient: false,
        fillStyle: 'rgba(0,0,0,1)',
        gradient: {
            type: 'linear',//渐变样式：linear/radial
            startAndStop: {// 用于线性渐变
                x0: 0,
                y0: 0,
                x1: 10,
                y1: 10
            },
            startArcAndStopArc: {// 用于圆形渐变
                x0: 0,
                y0: 0,
                r0: 10,
                x1: 0,
                y1: 0,
                r1: 30,
            },
            colorStop: [//分段颜色组成的数组
                { position: 0, color: 'black' },
                { position: 1, color: 'white' }
            ]
        }
    };
    this.shadow = {
        isShadow: false,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowBlur: 8
    };
    this.rotate = 0;
    this.scale = { x: 1, y: 1 };
    this.translate = { x: 0, y:0 };
    this.globalAlpha = 1;
};
GradientArc.prototype = {
    paint: function ( sprite, context ) {
        var x = sprite.left,
            y = sprite.top,
            r = this.radius,
            rotate = this.rotate,
            scaleX = this.scale.x,
            scaleY = this.scale.y,
            translateX = this.translate.x,
            translateY = this.translate.y,
            alpha = this.globalAlpha,
            lineWidth = this.lineWidth;

        /* 得到渐变 */
        if ( this.stroke.useGradient ) {
            var gradient;
            switch ( this.stroke.gradient.type ) {
                case 'linear':
                    gradient = context.createLinearGradient(
                        this.stroke.gradient.startAndStop.x0,
                        this.stroke.gradient.startAndStop.y0,
                        this.stroke.gradient.startAndStop.x1,
                        this.stroke.gradient.startAndStop.y1
                    );
                    for ( var i = 0, len = this.stroke.gradient.colorStop.length; i < len; i++ ) {
                        gradient.addColorStop(
                            this.stroke.gradient.colorStop[i].position,
                            this.stroke.gradient.colorStop[i].color
                        );
                    }
                    break;
                case 'radial':
                    gradient = context.createRadialGradient(
                        this.stroke.gradient.startArcAndStopArc.x0,
                        this.stroke.gradient.startArcAndStopArc.y0,
                        this.stroke.gradient.startArcAndStopArc.r0,
                        this.stroke.gradient.startArcAndStopArc.x1,
                        this.stroke.gradient.startArcAndStopArc.y1,
                        this.stroke.gradient.startArcAndStopArc.r1
                    );
                    for ( var i = 0, len = this.stroke.gradient.colorStop.length; i < len; i++ ) {
                        gradient.addColorStop(
                            this.stroke.gradient.colorStop[i].position,
                            this.stroke.gradient.colorStop[i].color
                        );
                    }
                    break;
                default:
                break;
            }
            this.stroke.strokeStyle = gradient;
        };
        if ( this.fill.useGradient ) {
            var gradient;
            switch ( this.fill.gradient.type ) {
                case 'linear':
                    gradient = context.createLinearGradient(
                        this.fill.gradient.startAndStop.x0,
                        this.fill.gradient.startAndStop.y0,
                        this.fill.gradient.startAndStop.x1,
                        this.fill.gradient.startAndStop.y1
                    );
                    for ( var i = 0, len = this.fill.gradient.colorStop.length; i < len; i++ ) {
                        gradient.addColorStop(
                            this.fill.gradient.colorStop[i].position,
                            this.fill.gradient.colorStop[i].color
                        )
                    }
                    break;
                case 'radial':
                    gradient = context.createRadialGradient(
                        this.fill.gradient.startArcAndStopArc.x0,
                        this.fill.gradient.startArcAndStopArc.y0,
                        this.fill.gradient.startArcAndStopArc.r0,
                        this.fill.gradient.startArcAndStopArc.x1,
                        this.fill.gradient.startArcAndStopArc.y1,
                        this.fill.gradient.startArcAndStopArc.r1
                        // 0, 0, 10, 0, 0, 25
                    );
                    for ( var i = 0, len = this.fill.gradient.colorStop.length; i < len; i++ ) {
                        gradient.addColorStop(
                            this.fill.gradient.colorStop[i].position,
                            this.fill.gradient.colorStop[i].color
                        )
                    }
                    // gradient.addColorStop( 0, 'red' );
                    // gradient.addColorStop( 1, 'gray' );
                    break;
                default:
                break;
            }
            this.fill.fillStyle = gradient;
        }

        context.save();

        // console.log( rotate );
        // console.log( this.scale );
        // console.log( scaleY );
        context.rotate( rotate );
        context.scale( scaleX, scaleY );
        context.translate( translateX, translateY );
        context.globalAlpha = alpha;

        context.beginPath();
        context.lineWidth = lineWidth;
        context.arc( x, y, r, 0, 2*Math.PI, false );
        if ( this.shadow.isShadow ) {
            context.shadowColor = this.shadow.shadowColor;
            context.shadowOffsetX = this.shadow.shadowOffsetX;
            context.shadowOffsety = this.shadow.shadowOffsety;
            context.shadowBlur = this.shadow.shadowBlur;
        }
        if ( this.fill.isFill ) {
            context.fillStyle = this.fill.fillStyle;
            context.fill();
        }
        if ( this.stroke.isStroke ) {
            context.strokeStyle = this.stroke.strokeStyle;
            context.stroke();
        }
        context.restore();
    }
};
// 绘制精灵表
var SpriteSheetPainter = function ( cells, spriteSheet ) {
    this.cells = cells || [];
    this.cellIndex = 0;
    this.spriteSheet = spriteSheet;
};
SpriteSheetPainter.prototype = {
    advance: function () {
        if ( this.cellIndex == this.cells.length - 1 ) {
            this.cellIndex = 0;
        } else {
            this.cellIndex++;
        }
    },
    paint: function ( sprite, context ) {
        var cell = this.cells[this.cellIndex];
        context.drawImage( this.spriteSheet, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h );
    }
};
// 绘制星光
var StarShine = function () {
    this.color = [ 'rgba( 255, 255, 255, 1 )', 'rgba( 255, 255, 255, 0.7 )', 'rgba( 255, 255, 255, 0.28 )', 'rgba( 255, 255, 255, 0 )' ];
    this.geometryNum = 10;
    // this.rotate = Math.PI / 4;
    this.scale = { x: 1, y: 0.15 };
    this.alpha = 0.6;
};
StarShine.prototype = {
    paint: function ( sprite, context ) {
        var r = sprite.width / 2;
        context.save();
        context.translate( sprite.left, sprite.top );
        var gradient = new GradientArc();
        gradient.radius = r;
        gradient.fill.isFill = true;
        gradient.fill.useGradient = true;
        gradient.fill.gradient.type = 'radial';
        gradient.fill.gradient.startArcAndStopArc = { x0: 0, y0: 0, r0: 0, x1: 0, y1: 0, r1: r };
        // 渐变的颜色和位置
        gradient.fill.gradient.colorStop = [];
        for ( var i = 0, len = this.color.length; i < len; i++ ) {
            gradient.fill.gradient.colorStop.push(
                {
                    position: i/(len-1),
                    color: this.color[i]
                }
            );
        }
        // 旋转的角度
        // gradient.rotate = this.rotate;
        // 各轴缩放
        gradient.scale = this.scale;
        gradient.globalAlpha = this.alpha;

        var part = new Sprite( 'part', gradient, [] );
        // context.scale( 1, 0.15 );
        // context.rotate( Math.PI / 4 );
        // 绘制指定数量的角
        for ( var i = 0, len = this.geometryNum / 2; i < len; i++ ) {
            gradient.rotate = Math.PI/len * i;
            part.paint( context );
        }
        // part.paint( context );
        context.restore();
    }
};
// 环形刻度
var RingDegree = function () {
    this.radiusBig = 20;
    this.radiusSmall = 15;
    this.space = Math.PI/180;
    this.lineWidth = 1;
    this.lineCap = 'round';
    this.color = 'black';
    this.beginRadian = 0;
    this.endRadian = 2*Math.PI;
    this.inArc = false;
    this.outArc = false;
    this.alpha = 1;
    this.rotate = 0;
};
RingDegree.prototype = {
    paint: function ( sprite, context ) {
        var deltaRadian = this.endRadian - this.beginRadian,
            left = sprite.left,
            top = sprite.top,
            space = this.space,
            beginRadian = this.beginRadian,
            endRadian = this.endRadian,
            lineCap = this.lineCap,
            rBig = this.radiusBig,
            rSmall = this.radiusSmall,
            alpha = this.alpha,
            rotate = this.rotate;
        context.save();
        context.translate( left, top );
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color;
        context.lineCap = lineCap;
        context.globalAlpha = alpha;
        context.rotate( rotate );
        for ( var i = 0, len = deltaRadian / space; i < len; i++ ) {
            var elapsedRadian = i * space;
            context.beginPath();
            context.moveTo( rBig*Math.cos(elapsedRadian), rBig*Math.sin(elapsedRadian) );
            context.lineTo( rSmall*Math.cos(elapsedRadian), rSmall*Math.sin(elapsedRadian) );
            context.closePath();
            context.stroke();
        }
        if ( this.inArc ) {
            context.beginPath();
            context.arc( 0, 0, rSmall, beginRadian, endRadian, false );
            // context.closePath();
            context.stroke();
        }
        if ( this.outArc ) {
            context.beginPath();
            context.arc( 0, 0, rBig, beginRadian, endRadian, false );
            // context.closePath();
            context.stroke();
        }
        context.restore();
    }
}
// 指针
var Finger = function () {
    this.lineWidth = 1;
    this.isStroke = true;
    this.strokeStyle = 'black';
    this.isFill = true;
    this.fillStyle = 'white';
    this.lineJoin = 'miter';//两线相交时的拐角样式（bevel,round,miter）
    this.miterLimit = 15;//两线斜接长度极限
    this.scale = { x: 1, y: 1 };
    this.reasonableScale = { x: 1, y: 1 };
    this.rotate = 0;
};
Finger.prototype = {
    paint: function ( sprite, context ) {
        var lineWidth = this.lineWidth,
            strokeStyle = this.strokeStyle,
            fillStyle = this.fillStyle,
            lineJoin = this.lineJoin,
            miterLimit = this.miterLimit,
            scaleX = this.scale.x,
            scaleY = this.scale.y,
            reasonableScaleX = this.reasonableScale.x,
            reasonableScaleY = this.reasonableScale.y,
            rotate = this.rotate,
            pointPosition = {
                x0: 0,
                y0: -5.2,
                x1: 41.5,
                y1: 0,
                x2: 0,
                y2: 5.2,
                x3: -5.2,
                y3: 0
            };
            // pPRadius = {
            //     r0: Math.sqrt( pointPosition.x0 * pointPosition.x0 + pointPosition.y0 * pointPosition.y0 ),
            //     r1: Math.sqrt( pointPosition.x1 * pointPosition.x1 + pointPosition.y1 * pointPosition.y1 ),
            //     r2: Math.sqrt( pointPosition.x2 * pointPosition.x2 + pointPosition.y2 * pointPosition.y2 ),
            //     r3: Math.sqrt( pointPosition.x3 * pointPosition.x3 + pointPosition.y3 * pointPosition.y3 )
            // },
            // pPRotate = {
            //     x0: pPRadius.r0 * Math.sin(rotate),
            //     y0: pPRadius.r0 * Math.cos(rotate),
            //     x1: pPRadius.r1 * Math.sin(rotate),
            //     y1: pPRadius.r1 * Math.cos(rotate),
            //     x2: pPRadius.r2 * Math.sin(rotate),
            //     y2: pPRadius.r2 * Math.cos(rotate),
            //     x3: pPRadius.r3 * Math.sin(rotate),
            //     y3: pPRadius.r3 * Math.cos(rotate)
            // };
        // console.log( rotate );
        // console.log( pPRadius );
        // console.log( pPRotate );
        context.save();

        context.translate( sprite.left, sprite.top );
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.fillStyle = fillStyle;
        context.lineJoin = lineJoin;
        context.miterLimit = miterLimit;
        context.scale( scaleX, scaleY );
        context.rotate( rotate );
        // 描边
        if ( this.isStroke ) {
            context.beginPath();
            context.moveTo( pointPosition.x0, pointPosition.y0 * reasonableScaleY );
            context.lineTo( pointPosition.x1 * reasonableScaleX, pointPosition.y1 );
            context.lineTo( pointPosition.x2, pointPosition.y2 * reasonableScaleY );
            context.lineTo( pointPosition.x3 * reasonableScaleX, pointPosition.y3 );
            context.closePath();
            context.stroke();
        }
        // 填充
        if ( this.isFill ) {
            context.beginPath();
            context.moveTo( pointPosition.x0, pointPosition.y0 * reasonableScaleY + lineWidth / 2 );
            context.lineTo( pointPosition.x1 * reasonableScaleX - lineWidth / 2, pointPosition.y1 );
            context.lineTo( pointPosition.x2, pointPosition.y2 * reasonableScaleY - lineWidth / 2 );
            context.lineTo( pointPosition.x3 * reasonableScaleX + lineWidth / 2, pointPosition.y3 );
            context.fill();
        }

        context.restore();
    }
};
// 扇形
var Fan = function () {
    this.radiusBig = 10;
    this.radiusSmall = 5;
    this.lineWidth = 1;
    this.beginRadian = 0;
    this.endRadian = (1/2)*Math.PI;
    this.counterClockWise = true;//true:逆时针,false:顺时针
    this.stroke = {// 描边
        isStroke: false,
        strokeStyle: 'black'
    };
    this.fill = {// 填充
        isFill: false,
        fillStyle: 'black'
    };
    this.shadow = {
        isShadow: false,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowBlur: 8
    };
    this.rotate = 0;
    this.scale = { x: 1, y: 1 };
    this.translate = { x: 0, y:0 };
    this.globalAlpha = 1;
};
Fan.prototype = {
    paint: function( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            rBig = this.radiusBig,
            rSmall = this.radiusSmall,
            lineWidth = this.lineWidth,
            beginRadian = this.beginRadian,
            endRadian = this.endRadian,
            counterClockWise = this.counterClockWise,
            rotate = this.rotate,
            scaleX = this.scale.x,
            scaleY = this.scale.y,
            translateX = this.translate.x,
            translateY = this.translate.y,
            alpha = this.globalAlpha;

        context.save();
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo( rBig * Math.cos( beginRadian ) + left, rBig * Math.sin( beginRadian ) + top );
        context.arc( left, top, rBig, beginRadian, endRadian, counterClockWise );
        context.lineTo( rSmall * Math.cos( endRadian ) + left, rSmall * Math.sin( endRadian ) + top );
        context.arc( left, top, rSmall, endRadian, beginRadian, !counterClockWise );
        context.closePath();
        if ( this.shadow.isShadow ) {
            context.shadowColor = this.shadow.shadowColor;
            context.shadowOffsetX = this.shadow.shadowOffsetX;
            context.shadowOffsety = this.shadow.shadowOffsety;
            context.shadowBlur = this.shadow.shadowBlur;
        }
        if ( this.fill.isFill ) {
            context.fillStyle = this.fill.fillStyle;
            context.fill();
            // console.log('fill');
        }
        if ( this.stroke.isStroke ) {
            context.strokeStyle = this.stroke.strokeStyle;
            context.stroke();
            // console.log('stroke');
        }
        context.restore();
    }
}
// 三角形
// 只有sss做好了
var Trigon = function () {
    this.type = 'asa'; //确定三角形唯一的方法（sss, sas, asa, aas）
    // s: 相应的边长
    // a: 与水平正方向的夹角
    this.date = [ (1/6)*Math.PI, 50, (1/3)*Math.PI ];
    this.rotate = 0;
    this.fill = {// 填充
        // a: 'a',
        isFill: false,
        fillStyle: 'black'
        // b: true,
        // s: 'blue',
        // c: null
        // d: 'no',
    };
    this.stroke = {// 描边
        isStroke: false,
        strokeStyle: 'black'
    };
};
Trigon.prototype =  {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            rotate = this.rotate;
        context.save();
        context.translate( left, top );
        context.rotate( rotate );
        switch ( this.type ) {
            case 'sss':
                // console.log('sss');
                var l0 = Math.abs(this.date[0]),
                    l1 = Math.abs(this.date[1]),
                    l2 = Math.abs(this.date[2]);
                // 能否组成三角形
                var array = [ l0, l1, l2 ];
                array = bubbleSort( array );
                // console.log( array );
                if ( array[0] >= array[1] + array[2] ) {
                    console.log( '不能组成三角形' );
                    return false;
                }
                // 确定外心
                var p0 = { x: -l0/2, y: 0 },
                    p1 = { x: l0/2, y: 0 },
                    p2 = { x: null, y: null },
                    left = ( l2*l2 - l1*l1 + l0*l0 ) / ( 2*l0 ),
                    right = l0 - left;
                p2.y = Math.sqrt( l2*l2 - left*left );
                k2 = (p2.y - p0.y) / (p2.x - p0.x);
                p2.x = -l0/2 + left;
                var deltaP02Centre = { x: (p2.x+p0.x) / 2, y: (p2.y+p0.y) / 2 },
                    kCentre = -1 / k2,
                    cCentre = deltaP02Centre.y - kCentre * deltaP02Centre.x,
                    pOut = { x: 0, y: cCentre };
                // 绘制
                context.save();
                context.translate( -pOut.x, -pOut.y );
                context.beginPath();
                context.moveTo( p0.x, p0.y );
                context.lineTo( p1.x, p1.y );
                context.lineTo( p2.x, p2.y );
                context.closePath();
                // context.stroke();
                if ( this.stroke.isStroke ) {
                    context.strokeStyle = this.stroke.strokeStyle;
                    context.stroke();
                }
                // console.log( this.fill );
                if ( this.fill.isFill ) {
                    // console.log( this.fill.fillStyle );
                    context.fillStyle = this.fill.fillStyle;
                    context.fillStyle = this.fill.s;
                    context.fill();
                }
                context.restore();
                break;
            case 'sas':
                console.log('sas');
                // 是否是直角三角形
                if ( ( this.date[1] + (1/2)*Math.PI ) % Math.PI == 0 ) {// 直角三角形
                    console.log( '直角三角形' );
                    var periphery = ( this.date[1] + (1/2)*Math.PI ) / Math.PI;
                    // console.log( periphery );
                    var direction;
                    if ( periphery / 2 == 0 ) {
                        direction = true;// 表示正的
                    } else {
                        direction = false;// 表示负的
                    };
                    var pOut = { x: null, y: null },
                        l0 = Math.abs( this.date[0] ),
                        l1 = Math.abs( this.date[2] ),
                        p0 = { x: -l0/2, y: 0 },
                        p1 = { x: l0/2, y: 0 },
                        p2 = { x: p1.x, y: direction ? l1 : -l1 };
                    pOut = { x: 0, y: p2.y/2 };// 外心
                    // 绘制
                    context.save();
                    context.translate( -pOut.x, -pOut.y );
                    context.beginPath();
                    context.moveTo( p0.x, p0.y );
                    context.lineTo( p1.x, p1.y );
                    context.lineTo( p2.x, p2.y );
                    context.closePath();
                    context.stroke();
                    context.restore();
                    console.log( '绘制直角三角形完成' );
                    console.log( p0 );
                    console.log( p1 );
                    console.log( p2 );
                } else { // 非直角三角形
                    console.log( '非直角三角形' );
                    var l0 = Math.abs( this.date[0] ),
                        l1 = Math.abs( this.date[2] ),
                        p0 = { x: -l0/2, y: 0 },
                        p1 = { x: l0/2, y: 0 },
                        p2 = { x: null, y: null },
                        a1 = this.date[1],
                        k1 = Math.tan( a1 ),
                        c1 = p1.y - k1 * p1.x,
                        pOut = { x: null, y: null },
                        kCentre = -1 / k1,
                        deltaP12Centre = { x: null, y: null },
                        cCentre;
                    p2.x = l1 * Math.cos( a1 );
                    p2.y = l1 * Math.sin( a1 );
                    deltaP12Centre.x = (p2.x + p1.x) / 2;
                    deltaP12Centre.y = (p2.y + p1.y) / 2;
                    cCentre = deltaP12Centre.y - kCentre * deltaP12Centre.x;
                    pOut.x = 0,
                    pOut.y = cCentre;
                    // 绘制
                    context.save();
                    context.translate( -pOut.x, -pOut.y );
                    context.beginPath();
                    context.moveTo( p0.x, p0.y );
                    context.lineTo( p1.x, p1.y );
                    context.lineTo( p2.x, p2.y );
                    context.closePath();
                    context.stroke();
                    context.restore();
                    console.log( '绘制非直角三角形完成' );
                    console.log( p0 );
                    console.log( p1 );
                    console.log( p2 );
                }
                break;
            case 'asa':
                console.log('asa');
                // 不可以都垂直于x轴
                if ( ( Math.abs(this.date[0]) + (1/2)*Math.PI ) % Math.PI == 0 && ( Math.abs(this.date[2]) + (1/2)*Math.PI ) % Math.PI == 0 ) {
                    console.log('应该是不存在的三角形');
                    return false;
                }
                // 若有一个角是90度则按照直角三角形处理
                if ( ( Math.abs(this.date[0]) + (1/2)*Math.PI ) % Math.PI == 0 || ( Math.abs(this.date[2]) + (1/2)*Math.PI ) % Math.PI == 0 ) {// 直角三角形
                    console.log( '直角三角形' );
                    // 得到不是直角的那个角
                    var notRightAngle;
                    if ( ( Math.abs(this.date[0]) + (1/2)*Math.PI ) % Math.PI == 0 ) {
                        notRightAngle = this.date[2];
                    } else {
                        notRightAngle = this.date[0];
                    }
                    // 算出外心
                    var pOut = { x: null, y: null },// 外心
                        l = Math.abs(this.date[1] ),
                        k0 = Math.tan( notRightAngle ),
                        p0 = { x: -(l/2), y: 0 },
                        p1 = { x: l/2, y: 0 },
                        p2 = { x: l/2, y: l * k0 };
                    pOut.x = 0;
                    pOut.y = Math.abs( p0.x ) * k0;
                    // 绘制
                    context.save();
                    context.translate( -pOut.x, -pOut.y );
                    context.beginPath();
                    context.moveTo( p0.x, p0.y );
                    context.lineTo( p1.x, p1.y );
                    context.lineTo( p2.x, p2.y );
                    context.closePath();
                    context.stroke();
                    context.restore();
                    console.log( '绘制直角三角形完成' );
                    console.log( p0 );
                    console.log( p1 );
                    console.log( p2 );
                } else {// 非直角三角形
                    console.log( '非直角三角形' );
                    var l = Math.abs( this.date[1] ),
                        a0 = this.date[0],
                        a1 = this.date[2],
                        k0 = Math.tan( a0 ),
                        k1 = Math.tan( a1 ),
                        kCentre = -1 / k0,
                        p0 = { x: -l / 2, y: 0 },
                        p1 = { x: l / 2, y: 0 },
                        c0 = p0.y - k0 * p0.x,
                        c1 = p1.y - k1 * p1.x,
                        p2 = { x: null, y: null },
                        deltaP02Centre,
                        cCentre,
                        pOut = { x: null, y: null };
                    p2.x = (c1-c0)/(k0-k1);
                    p2.y = k0 * p2.x + c0; // 得到p2点
                    deltaP02Centre = { x: (p2.x - p1.x) / 2, y: (p2.y-p0.y) / 2 },
                    cCentre = deltaP02Centre.y - kCentre * deltaP02Centre.x,
                    pOut = { x: 0, y: cCentre };
                    // 绘制
                    context.save();
                    context.translate( -pOut.x, -pOut.y );
                    context.beginPath();
                    context.moveTo( p0.x, p0.y );
                    context.lineTo( p1.x, p1.y );
                    context.lineTo( p2.x, p2.y );
                    context.closePath();
                    context.stroke();
                    context.restore();
                    console.log( '绘制非直角三角形完成' );
                    console.log( p0 );
                    console.log( p1 );
                    console.log( p2 );
                }
                break;
            case 'aas':
                console.log('aas');
                // // 出去不可能的情况 （两角和大于180）
                // // 不可以都垂直于y轴
                // if ( this.date[0] % Math.PI == 0 && this.date[1] % Math.PI == 0 ) {
                //     console.log('应该是不存在的三角形');
                //     return false;
                // }
                // // 分别处理直角三角形与非直角三角形
                // if ( this.date[0] % Math.PI == 0 || this.date[1] % Math.PI == 0 ) {// 直角三角形
                    
                // } else {// 非直角三角形

                // }
                break;
            default:
                console.log('default');
                break;
        }
        context.restore();
    }
}
// 坐標系
var Axis = function (  ) {
    this.axisWidth = 1;
    this.origin = { x: 0, y: 0 };
    this.arrowHead = { x: 5, y: 15 };
    this.xDircttion = true;// 表示正方向
    this.yDircttion = false;// 表示正方向
    this.rotate = 0;
    this.fill = {
        isFill : true,
        fillStyle : 'black'
    };
    this.stroke = {
        isStroke : true,
        strokeStyle : 'black'
    };
};
Axis.prototype = {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            origin = this.origin,
            arrowHead = this.arrowHead,
            width = sprite.width,
            height = sprite.height,
            rotate = this.rotate;

        context.save();
        context.translate( left + origin.x, top + origin.y );
        context.rotate( rotate );
        context.lineWidth = this.axisWidth;
        // 表示原点 use to test
        // context.arc( 0, 0, 5, 0, 2*Math.PI, false );
        // context.fill();
        // 绘制X线
        context.beginPath();
        context.moveTo( 0 - origin.x, 0 );
        context.lineTo( width - origin.x, 0 );
        // context.stroke();
        // 绘制Y线
        // context.beginPath();
        context.moveTo( 0, 0 - origin.y );
        context.lineTo( 0, height - origin.y );
        // context.stroke();
        if ( this.stroke.isStroke ) {
            context.strokeStyle = this.stroke.strokeStyle;
            context.stroke();
        }
        // 绘制X箭头
        var trigonXPainter = new Trigon();
        trigonXPainter.type = 'sss';
        trigonXPainter.date = [ arrowHead.x, Math.sqrt( arrowHead.x*arrowHead.x/4 + arrowHead.y*arrowHead.y ), Math.sqrt( arrowHead.x*arrowHead.x/4 + arrowHead.y*arrowHead.y ) ];
        trigonXPainter.rotate = -(1/2)*Math.PI;
        trigonXPainter.fill.isFill = this.fill.isFill;// 根据参数设置的是否填充、填充什么样式去填充
        trigonXPainter.fill.fillStyle = this.fill.fillStyle;
        var arrowHeadX = new Sprite( 'arrowHeadX', trigonXPainter, [] );
        arrowHeadX.left = width-origin.x;
        arrowHeadX.top = 0;
        arrowHeadX.paint( context );
        // 绘制Y箭头
        var trigonYPainter = new Trigon();
        trigonYPainter.type = 'sss';
        trigonYPainter.date = [ arrowHead.x, Math.sqrt( arrowHead.x*arrowHead.x/4 + arrowHead.y*arrowHead.y ), Math.sqrt( arrowHead.x*arrowHead.x/4 + arrowHead.y*arrowHead.y ) ];
        trigonYPainter.rotate = -(2/2)*Math.PI;
        trigonYPainter.fill.isFill = this.fill.isFill;
        trigonYPainter.fill.fillStyle = this.fill.fillStyle;
        var arrowHeadY = new Sprite( 'arrowHeadY', trigonYPainter, [] );
        arrowHeadY.left = 0;
        arrowHeadY.top = 0 - origin.y;
        arrowHeadY.paint( context );
        context.restore();

    }
}
// 虚线
var Dash = function () {
    this.start = { x: 0, y: 0 };
    this.end = { x: 100, y: 100 };
    this.fillLength = 10;
    this.emptyLength = 5;
};
Dash.prototype = {
    paint: function ( sprite, context ) {
        fillLength = fillLength === undefined ? 10 : fillLength;
        emptyLength = emptyLength === undefined ? 10 : emptyLength;
        var x0 = this.start.x,
            y0 = this.start.y,
            x1 = this.end.x,
            y1 = this.end.y,
            fillLength = this.fillLength,
            emptyLength = this.emptyLength,
            deltaX = x1 - x0,
            deltaY = y1 - y0,
            fillAndEmpty = fillLength + emptyLength,
            allLength = Math.sqrt( deltaX*deltaX + deltaY*deltaY ),
            dashNum = Math.floor( allLength / fillAndEmpty ),// 完整的虚线数量
            completeDash = fillAndEmpty * dashNum,//完整的虚线组成的长度
            fillAndEmptyX = fillAndEmpty * deltaX / allLength,
            fillAndEmptyY = fillAndEmpty * deltaY / allLength,
            fillLengthX = fillAndEmptyX * fillLength / fillAndEmpty,
            fillLengthY = fillAndEmptyY * fillLength / fillAndEmpty,
            emptyLengthX = fillAndEmptyX - fillLengthX,
            emptyLengthY = fillAndEmptyY - fillLengthY,
            startX,
            startY,
            endX,
            endY;

        context.save();
        context.beginPath();
        for ( var i = 0; i < dashNum; i++ ) {
            startX = parseFloat(x0) + parseFloat(fillAndEmptyX * i);
            startY = parseFloat(y0) + parseFloat(fillAndEmptyY * i);
            endX = startX + fillLengthX;
            endY = startY + fillLengthY;
            context.moveTo( startX, startY );
            context.lineTo( endX, endY );
        }
        context.moveTo( parseFloat(x0) + parseFloat(fillAndEmptyX * i), parseFloat(y0) + parseFloat(fillAndEmptyY * i) );
        context.lineTo( x1, y1 );
        context.stroke();
        context.restore();
    }
}
// 虚线网格
var DottedGrid = function () {
    this.start = { x: 0, y: 0 };
    this.end = { x: 100, y: 100 };
    this.step = { x: 10, y: 10 };
    this.boundary = true;// 是否有边框
    this.fillLength = 10;
    this.emptyLength = 5;
    this.offset = { x: 0, y: 0 };
};
DottedGrid.prototype = {
    paint: function ( sprite, context ) {
        var start = this.start,
            end = this.end,
            step = this.step,
            boundary = this.boundary,
            fillLength = this.fillLength,
            emptyLength = this.emptyLength,
            deltaX = end.x - start.x,
            deltaY = end.y - start.y,
            numX = deltaX / step.x,
            numY = deltaY / step.y,
            offset = this.offset,
            left = sprite.left,
            top = sprite.top;

        context.save();
        context.translate( left, top );
        context.beginPath();
        // 绘制横着排的竖线
        for ( var i = 0; i < numX; i++ ) {
            var verticalPainter = new Dash();
            verticalPainter.start = { x: start.x + step.x * i + offset.x, y: start.y };
            verticalPainter.end = { x: start.x + step.x * i + offset.x, y: end.y };
            verticalPainter.fillLength = fillLength;
            verticalPainter.emptyLength = emptyLength;
            var vertical = new Sprite( 'vertical', verticalPainter, [] );
            vertical.paint( context );
        }
        // 绘制竖着排的横线
        for ( var i = 0; i < numY; i++ ) {
            var horizontalPainter = new Dash();
            horizontalPainter.start = { x: start.x, y: start.y + step.y * i + offset.y };
            horizontalPainter.end = { x: end.x, y: start.y + step.y * i + offset.y };
            horizontalPainter.fillLength = fillLength;
            horizontalPainter.emptyLength = emptyLength;
            var horizontal = new Sprite( 'horizontal', horizontalPainter, [] );
            horizontal.paint( context );
        }
        if ( this.boundary ) {
            context.rect( start.x + offset.x, start.y + offset.y, deltaX, deltaY );
            context.stroke();
        }
        context.restore();
    }
}
// 实线网格
var SolidGrid = function () {
    this.start = { x: 0, y: 0 };
    this.end = { x: 100, y: 100 };
    this.step = { x: 10, y: 10 };
    this.boundary = true;// 是否有边框
    this.offset = { x: 0, y: 0 };//偏差
}
SolidGrid.prototype = {
    paint: function ( sprite, context ) {
        var left = sprite.left,
            top = sprite.top,
            width = sprite.width,
            height = sprite.height,
            step = this.step,
            boundary = this.boundary,
            offset = this.offset,
            deltaX = this.end.x - this.start.x,
            deltaY = this.end.y - this.start.y,
            countHorizontal = deltaX / step.x,
            countVertical = deltaY / step.y,
            start = this.start,
            end = this.end;

        context.save();
        context.translate( left, top );
        context.beginPath();
        // horizontal
        for ( var i = 1; i < countHorizontal; i++ ) {
            context.moveTo( start.x + offset.x + step.x * i, start.y );
            context.lineTo( start.x + offset.x + step.x * i, end.y );
        }
        // vertical
        for ( var i = 1; i < countVertical; i++ ) {
            context.moveTo( start.x, start.y + offset.y + step.y * i );
            context.lineTo( end.x, start.y + offset.y + step.y * i );
        }
        switch ( boundary ) {
            case true:
            default:
                context.rect( start.x, start.y, deltaX, deltaY );
                break;
            case false:
                break;
        }
        context.stroke();
        context.restore();
    }
}
// 网点
var GridPoint = function () {
    this.start = { x: 0, y: 0 };
    this.end = { x: 100, y: 100 };
    this.shape = 'rect';// 形状（rect/arc）
    this.pointSize = 5;// 点的大小
    this.drawMethod = 'fill';// 绘制的方法（fill/stroke）
    this.step = { x: 5, y: 5 };
};
GridPoint.prototype = {
    paint: function ( sprite, context ) {
        var start = this.start,
            end = this.end,
            shape = this.shape,
            pointSize = this.pointSize,
            drawMethod = this.drawMethod,
            step = this.step,
            deltaX = end.x - start.x,
            deltaY = end.y - start.y,
            fillAndEmpty = { x: pointSize + step.x, y: pointSize + step.y },
            countHorizontal = Math.ceil( deltaX / fillAndEmpty.x ),
            countVertical = Math.ceil( deltaY / fillAndEmpty.y ),
            left = sprite.left,
            top = sprite.top;

        context.save();
        console.log( left );
        console.log( top );
        context.translate( left, top );
        context.beginPath();
        switch ( shape ) {
            case 'rect':
            default:
                console.log( shape );
                for ( var i = 0; i < countVertical; i++ ) {
                    for ( var j = 0; j < countHorizontal; j++ ) {
                        context.rect( start.x + fillAndEmpty.x * j, start.y + fillAndEmpty.y * i, pointSize, pointSize );
                    }
                }
                context.restore();
                break;
            case 'arc':
                console.log( shape );
                for ( var i = 0; i < countVertical; i++ ) {
                    for ( var j = 0; j < countHorizontal; j++ ) {
                        context.arc( start.x + fillAndEmpty.x * j, start.y + fillAndEmpty.y * i, pointSize, 0, 2*Math.PI, false );
                        context.closePath();
                    }
                }
                break;
        }
        switch ( drawMethod ) {
            case 'fill':
            default:
                context.fill();
                break;
            case 'stroke':
                context.stroke();
                break;
        }
        context.restore();
    }
}

// 角度渐变
var AngleGradientArc = function () {
    this.radius = { big: 50, small: 20 };// 半径
    this.radian = { begin: 0, end: (1/3)*Math.PI };// 弧度
    this.stroke = {
        strokeStyle : 'black',
        useGradient : false,
        colorStop: [
            {
                position: 0,
                color: 'red'
            },
            {
                position: 1,
                color: 'green'
            }
        ]
    }
    // this.colorStop = [
    //     {
    //         position: 0,
    //         color: 'red'
    //     },
    //     {
    //         position: 1,
    //         color: 'green'
    //     }
    // ];
    this.stepRadian = (1/180)*Math.PI;// 角度间隔
    this.alpha = { begin: null, end: null };// alpha范围
    // this.stepAlpha = null;// alpha间隔
    this.rotate = 0,// 旋转的角度
    this.lineWidth = 1;// 线宽
}
AngleGradientArc.prototype = {
    paint: function ( sprite, context ) {
        var radius = this.radius,
            radian = this.radian,
            stroke = this.stroke,
            // colorStop = this.colorStop,
            stepRadian = this.stepRadian,
            alpha = this.alpha,
            deltaAlpha = alpha.end - alpha.begin,
            // stepAlpha = this.stepAlpha,
            rotate = this.rotate,
            lineWidth = this.lineWidth,
            left = sprite.left,
            top = sprite.top;
        var deltaRadian = radian.end - radian.begin,
            count = deltaRadian / stepRadian,
            stepAlpha = null;
        if ( alpha.begin != null && alpha.end != null ) {
            stepAlpha = (alpha.end - alpha.begin) / count;
        }

        context.save();
        context.translate( left, top );
        context.rotate( rotate );
        context.lineWidth = lineWidth;
        for ( var i = 0, len = count; i < len; i++ ) {
            // 不透明度值
            if ( stepAlpha ) {
                context.globalAlpha = alpha.begin + stepAlpha * i;
            }
            context.beginPath();
                // 为了减少计算量，保存始末点坐标值
                var x0 = radius.small*Math.sin(radian.begin+stepRadian*i),
                    y0 = radius.small*Math.cos(radian.begin+stepRadian*i),
                    x1 = radius.big*Math.sin(radian.begin+stepRadian*i),
                    y1 = radius.big*Math.cos(radian.begin+stepRadian*i);
            // 渐变角度
            if ( stroke.useGradient ) {// 是否允许添加渐变
                var gradient = context.createLinearGradient( x0, y0, x1, y1 );
                for ( var j = 0, jLen = stroke.colorStop.length; j < jLen; j++ ) {
                    gradient.addColorStop( stroke.colorStop[j].position, stroke.colorStop[j].color );
                }
                context.strokeStyle = gradient;
            } else {// 不使用渐变
                context.strokeStyle = stroke.strokeStyle;
            }
                // 线段位置
                context.moveTo( x0, y0 );
                context.lineTo( x1, y1 );
            context.stroke();
        }
        context.restore();
    }
}
// sin
var Sin = function () {
    this.rangeRadian = { begin: 0, end: 2*Math.PI };
    this.step = 1;// 步长是一个像素
    this.lineWidth = 1;
    this.velocitySin = 0;
    this.a = 30;
    this.w = 1;
    this.f = 0;
    this.b = 0;
    // 没有设置偏差量
    this.fill = {
        isFill : false,
        fillStyle : 'black'
    };
    this.stroke = {
        isStroke : false,
        strokeStyle : 'black'
    };
}
Sin.prototype = {
    advance: function ( fps ) {
        var begin = this.rangeRadian.begin,
            end = this.rangeRadian.end,
            delta = end - begin,
            velocitySin = this.velocitySin,
            w = this.w,
            t = 2*Math.PI / Math.abs(w);
        if ( begin > t ) {
            begin -= t;
        }
        if ( begin < t ) {
            begin += t;
        }
        // console.log( begin + ", " + end );


        this.rangeRadian = { begin: begin + velocitySin / fps, end: begin + delta + velocitySin / fps };
    },
    paint: function ( sprite, context ) {
        var rangeRadian = this.rangeRadian,
            deltaRadian = rangeRadian.end - rangeRadian.begin,// 角度差
            step = this.step,
            fill = this.fill,
            stroke = this.stroke,
            left = sprite.left,
            top = sprite.top;
        var a = this.a,
            w = this.w,
            f = this.f,
            b = this.b,
            t = 2*Math.PI / Math.abs(w),// 周期
            l = a * deltaRadian, // 长度
            countX = l / step, // 步的总数
            radianPerStep = deltaRadian / countX;// 每步长对应的弧度量

        context.save();
        context.translate( left, top );
        context.beginPath();
        context.moveTo( 0, a * Math.sin( w * rangeRadian.begin + f ) + b );
        for ( var i = 0; i < countX; i++ ) {
            var x = step * i;
            var y = a * Math.sin( w * (rangeRadian.begin + radianPerStep * i) + f ) + b;
            context.lineTo( x, y );
        }
        // context.closePath();
        if ( stroke.isStroke ) {
            context.strokeStyle = stroke.strokeStyle;
            context.stroke();
        }
        if ( fill.isFill ) {
            context.fillStyle = fill.fillStyle;
            context.fill();
        }
        context.restore(  );
    }
}
// linkUnitArc
var LinkUnitArc = function () {
    this.r = 20;
    this.radianArc = 0;
    // this.rangeRadian = { begin: 0, end: 2*Math.PI };
    this.offset = { left: 0, top: 0 };// 没有用到！
    this.type = 'solid';// 连接线的样式： solid/dotted
    this.velocityRadianArc = (1/3)*Math.PI;// 单位圆的角速度
};
LinkUnitArc.prototype = {
    advance: function ( fps ) {
        var radianArc = this.radianArc,
            velocityRadianArc = this.velocityRadianArc;

        if ( radianArc > 2*Math.PI ) {
            radianArc -= 2*Math.PI;
        }
        if ( radianArc < -2*Math.PI ) {
            radianArc += 2*Math.PI
        }
        this.radianArc += this.velocityRadianArc / fps;
        // console.log( fps );
        // console.log( velocityRadianArc );
        // console.log( velocityRadianArc / fps );
        // console.log( radianArc );
        // console.log( this.getRotateArc() );
    },
    paint: function ( sprite, context ) {
        var r = this.r,
            radianArc = this.radianArc,
            offset =this.offset,
            type = this.type,
            left = sprite.left,
            top = sprite.top;

        context.save();
        context.translate( left, top );
        context.beginPath();
                var x0 = r * Math.cos(radianArc),
                    y0 = r * Math.sin(radianArc),
                    x1 = 0,
                    y1 = y0;
        switch ( type ) {
            case 'solid':
            default:
                context.moveTo( x0, y0 );
                context.lineTo( x1, y1 );
                break;
            case 'dotted':
                var dashPainter = new Dash();
                dashPainter.start = { x: x0, y: y0 };
                dashPainter.end = { x: x1, y: y1 };
                var dash = new Sprite( 'dash', dashPainter, [] );
                dash.paint( context );
                break;
        }
        context.stroke();
        context.restore();
        // console.log( this.getRotateArc() );
    },
    getRotateArc: function () {
        return this.radianArc;
    }
}

// 把指定的图片添加到数组里
function queueImage ( array, url ) {
    var image = new Image();
    image.src = url;
    return array.push( image );
}
// 加载一张图片后执行callback
// 缺点：有没加载完的就一直卡着
function imageLoad( img, callback ) {
    var timer = setInterval( function () {
        if ( img.complete ) {
            callback();
            clearInterval( timer );
        }
    }, 50 );
}
// 加载一个数组的图片后执行callback
function imagesLoad( array, callback ) {
    for ( var i = 0, len = array.length; i < len; i++ ) {
        // 这样做会出错。i = len是还在运行
        // var timer = setInterval( function () {
        //     if ( array[i].complete ) {
        //         console.log( array[i] );
        //         callback();
        //         clearInterval( timer );
        //     } else {
        //         console.log( '再加载一次' + i );
        //     }
        // }, 50 );
        imageLoad( array[i], callback );
    }
}
/* 擦除 */
var eraser = function ( context ) {
    context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
}
/* 计算fps */
// var lastTime = 0,
//     fps = 60;
// var calculateFps = function ( now, lastTime ) {
//     var fps = 1000 / ( now - lastTime );
//     lastTime = now;
//     return fps;
// }
// 切帧
// var runInPlace = {
//     lastAdvance : 0,
//     interval : 100,
//     execute: function ( sprite, context, time ) {
//         if ( time - this.lastAdvance > this.interval ) {
//             sprite.painter.advance();
//             this.lastAdvance = time;
//         }
//     }
// };
// 位移
// var moveLeftToRight = {
//     lastTime: 0,
//     reset: function ( sprite ) {
//         sprite.left = 15;
//         sprite.top = 50;
//     },
//     updatePosition: function ( sprite, elapsed ) {
//         sprite.left += sprite.velocityX * elapsed / 1000;
//     },
//     execute: function ( sprite, context, time ) {
//         var animationElapsed = animationTimer.getElapsedTime(),
//             elapsed;
//         animationTimer.timeWarp = animationTimer.makeBounce(3);//赋给一个函数
//         if ( animationTimer.isRunning() ) {
//             // console.log( 'true' );
//             if ( this.lastTime !== undefined ) {
//                 elapsed = animationElapsed - this.lastTime;//经过多少毫秒
//                 this.updatePosition( sprite, elapsed );
//                 if ( animationTimer.isOver() ) {
//                     animationTimer.stop();
//                     this.reset( sprite );
//                 }
//             }
//         }
//         this.lastTime = animationElapsed;
//     }
// };
// 旋转行为
// var rotate = {
//     execute: function  ( sprite, context, time ) {
//         if ( sprite.painter.rotate > 2*Math.PI ) {
//             sprite.painter.rotate -= 2*Math.PI;
//         }
//         sprite.painter.rotate += sprite.velocityRadian / fps;
//         console.log( sprite.painter.rotate );
//     }
// }