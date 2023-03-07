//新版桃江麻将
var majiang_gameOver_taoJiang = majiang_gameOver_yueyang.extend({});
//Override
majiang_gameOver_taoJiang.prototype.getEndallStatisticsName = function(player) {  
    return player.roomStatistics; 
};

//Override
majiang_gameOver_taoJiang.prototype.getEndallStatisticsKey = function(player) {  
    return player.roomStatisticsDesc;
};

// 设置房间统计内容
majiang_gameOver_taoJiang.prototype.setRoomStatistics = function(layout_typeText,pl) { 
    var infoType = this.getEndallStatisticsName(pl);
    var infoName = this.getEndallStatisticsKey(pl);

    var text_score = layout_typeText.getChildByName("text_score");
    var text_type = layout_typeText.getChildByName("text_type");
    var scoreSize = 28 * 1.2; // CSD中的高度 * 额外增加一点间距 
    for (var i = 0; i < infoType.length; i++) {
        var cloneName = text_type;
        var cloneScore = text_score;
        if(i != 0){
            cloneName = text_type.clone();
            cloneScore = text_score.clone();
            layout_typeText.addChild(cloneName);
            layout_typeText.addChild(cloneScore);
        } 
        cloneName.y -= scoreSize*i;
        cloneScore.y -= scoreSize*i;
        cloneName.ignoreContentAdaptWithSize(true);
        cloneScore.ignoreContentAdaptWithSize(true);
        var statistics = infoType[i].toString();
        cloneScore.setTextColor(pl.winall < 0 ? cc.color("#00824C") : cc.color("#D3260E"));
        cloneScore.setString(statistics > 0 ? statistics : "0");
        cloneName.setString(infoName[i]);
    }
};