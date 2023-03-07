var majiang_winGamePanel_TYZZ = majiang_winGamePanel_yueyang.extend({
    //override
    ctor:function(){
        this._super();
    },
});

//是否可以码牌(默认为false)
majiang_winGamePanel_TYZZ.prototype.isCanShuffleCards = function(){
	return true;
};