//新版新宁麻将
var majiang_gameOver_xinNing = majiang_gameOver_shaoyang.extend({});

//Override
majiang_gameOver_xinNing.prototype.getEndallStatisticsName = function() {  
    return ["zimoTotal","dianpaoTotal","angangTotal","minggangTotal"];
};

//Override
majiang_gameOver_xinNing.prototype.getEndallStatisticsKey = function() {  
    return ["自摸次数","点炮次数","暗杠次数","明杠次数"];
};