//邵阳红中麻将
var majiang_gameOver_huaihuaMaJiang = majiang_gameOver_shaoyang.extend({
    jsBind:{
     
    },
    ctor : function(jsonSrc){
        this._super(jsonSrc);
    }
});

majiang_gameOver_huaihuaMaJiang.prototype.getEndallStatisticsName = function() {  
    return ["zimoTotal","dianpaoTotal","angangTotal","minggangTotal"];
};

majiang_gameOver_huaihuaMaJiang.prototype.getEndallStatisticsKey = function() {  
    return ["自摸次数","点炮次数","暗杠次数","明杠次数"];
};