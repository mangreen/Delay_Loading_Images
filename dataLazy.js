/**
 * JS圖片延遲加載
 * @constructor {DataLazyLoad}
 * @param {options} 對象傳參
 * @time 2014-1-10
 */
/*
 * 延遲加載的原理：滾動時：待加載的資源相對於遊覽器頂端的距離 - threshold <= 可視區域相對於瀏覽器頂端的距離 true 就加載
 * 否則的話 不加載
 */
 function DataLazyLoad(options){
    
    this.config = {

        container      :   window,   //容器 默認為window
        threshold      :   0,        // 離多少像素渲染圖片
        event          :  'scroll',  // 默認為scroll(滾動)
        effect         :  'fadeIn',  // 默認為fadeIn 也可以為fadeIn, slideDown 等 jQuery 自帶的效果
        effectspeed    :  1000,      // 時間  
        suffix         :  'img',     // img屬性 默認以data-img 也可以自定義後綴
        skip_invisible : true       // 如果img標籤為隱藏的 那麼不強制加載
    };

    this.cache = {};

    this.init(options);
 }
 
 DataLazyLoad.prototype = {
    
    init: function(options){
        
        this.config = $.extend(this.config, options || {});
        var self = this,
            _config = self.config,
            _cache = self.cache;
        
        // 滾動時(或者其他事件) 觸發事件
        $(_config.container).unbind(_config.event);
        $(_config.container).bind(_config.event,function(){
            self._update();
        });
    },
    /*
     * 加載對應的圖片
     */
    _eachImg: function(item) {
        var self = this,
            _config = self.config,
            _cache = self.cache;
        
        if($(item).attr('isload') == 'false') {
            var dataImg = $(item).attr('data-'+_config.suffix),
                src = $(item).attr('src');
             $(item).hide();
             $(item).attr('src',dataImg);
             $(item).attr('data-'+_config.suffix,'');
             $(item)[_config.effect](_config.effectspeed);
             $(item).attr('isload','true');
        } 
    },
    _update:function(){
        var self = this,
            _config = self.config,
            _cache = self.cache;
         if(_config.container === window) {
             
             $('img').each(function(index,item){
                // 如果圖片隱藏的 那麼不強制加載
                if(_config.skip_invisible && !$('img').is(":visible")) {
                    return;
                }
                if (self._abovethetop(item) ||
                    self._leftofbegin(item)) {
                        // 什麼都不處理
                } else if (self._belowthefold(item) &&
                    self._belowthefold(item)) {
                        self._eachImg(item);
                } 
            })
            
         }else {
            $('img',$(_config.container)).each(function(index,item){
                // 如果圖片隱藏的 那麼不強制加載
                if(_config.skip_invisible && !$('img').is(":visible")) {
                    return;
                }
                if (self._abovethetop(item) ||
                    self._leftofbegin(item)) {
                        
                } else if (self._belowthefold(item) &&
                    self._rightoffold(item)) {
                        self._eachImg(item);
                } 

            })
         }
         
    },
    /*
     * 往下滾動時 判斷待加載的元素是否在可視區域內
     * @return {Boolean}
     */
    _belowthefold: function(elem){
        var self = this,
            _config = self.config;
        var fold;
        if(_config.container === window) {
            fold = $(window).height() + $(window).scrollTop();
        }else {
            fold = $(_config.container).offset().top + $(_config.container).height();
        }

        return fold >= $(elem).offset().top - _config.threshold;
    },
    /* 
     * 往右滾動時 判斷待加載的元素是否在可視區域內
     * @return {Boolean}
     */
    _rightoffold: function(elem){
        var self = this,
            _config = self.config;
        var fold;
        if(_config.container === window) {
            fold = $(window).width() + $(window).scrollLeft();
        }else {
            fold = $(_config.container).offset().left + $(_config.container).width();
        }
        
        return fold >= $(elem).offset().left - _config.threshold;
    },
    /*
     * 往上滾動
     * @return {Boolean}
     */
    _abovethetop: function(elem){
        var self = this,
            _config = self.config;
        var fold;
        if(_config.container === window) {
            fold = $(window).scrollTop();
        }else {
            fold = $(_config.container).offset().top;
        }
        return fold >= $(elem).offset().top + _config.threshold  + $(elem).height();
    },
    /*
     * 往左滾動
     * @return {Boolean}
     */
    _leftofbegin: function(elem) {
        var self = this,
            _config = self.config;
        var fold;
        
        if (_config.container === window) {
            fold = $(window).scrollLeft();
        } else {
            fold = $(_config.container).offset().left;
        }
        return fold >= $(elem).offset().left + _config.threshold + $(elem).width();
    }
    
 };

 // 初始化的方式
 $(function(){
    
    var datalazy = new DataLazyLoad({
        container: '#demo'
    });
 });