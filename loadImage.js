// 加载图片的设计思路：
// 1、把指定的图片地址添加到一个数组里。
// 2、根据这个数组里的地址加载图片。按照加载情况分别处理。
// 3、加载时执行检测加载情况函数。
// 4、当加载完一遍是执行callback。
// exmple:
// var loadImg = new LoadImage();
// loadImg.queueImage( '../image/kid.png' );
// loadImg.callback = fn;
// loadImg.loadImages();
var LoadImage = function () {
    this.images = [];
    this.imageUrls = [];
    this.imagesLoaded = 0;// 加载成功的数量
    this.imagesFailedToLoad = 0;// 加载失败的数量
    this.imagesIndex = 0;
    this.completePercent = 0;
    this.intervalTime = 20;
    this.callback = null;
};
// 添加图片链接
LoadImage.prototype.queueImage = function ( imageUrl ) {
    this.imageUrls.push( imageUrl );
}
// 加载图片
LoadImage.prototype.loadImage = function ( imageUrl ) {
    var self = this;
    var image = new Image();
    image.src = imageUrl;
    $.li.EventUtil.addHandler( image, 'load', function () {
        self.imagesLoaded++;
    } );
    $.li.EventUtil.addHandler( image, 'error', function () {
        self.imagesFailedToLoad++;
    });
    this.imagesIndex++;
    this.images[ imageUrl ] = image;
}
LoadImage.prototype.loadImages = function () {
    this.interval();
    for ( var i in this.imageUrls ) {
        this.loadImage( this.imageUrls[i] );
    }
}
// 检测加载情况
LoadImage.prototype.interval = function () {
    var self = this;
    var time = self.intervalTime;
    var interval = setInterval( function ( event ) {
        self.completePercent = (self.imagesLoaded + self.imagesFailedToLoad) / self.imageUrls.length * 100;
        self.completePercent >= 100 ? 100 : self.completePercent;
        if ( self.completePercent == 100 ) {
            // console.log( '完成' );
            clearInterval( interval );
            if ( self.callback ) {
                self.callback();
            }
        } else {
            // console.log( '加载未完成' );
        }
    }, time );
}