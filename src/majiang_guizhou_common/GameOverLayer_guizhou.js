/***
 * 贵州App，通用大结算文件   对应 endAll_maJiang.json
 * @type {void | Class | *}
 */
var GameOverLayer_guizhou = majiang_gameOver.extend({
    jsBind:{
        back:{
            _run: function () {
                if (MjClient.playui.isIPhoneX())
                {
                    setWgtLayout(this, [0.82, 1],[0.5, 0.5],[0,0], true);
                }
                else if (MjClient.playui.isIPad())
                {
                    setWgtLayout(this, [1, 0.82],[0.5, 0.5],[0,0], false);
                }
                else {
                    setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0], true);
                }
            }
        }
    },
    getEndallStatisticsName: function () {
        return ["zimoTotal","jiepaoTotal","dianpaoTotal","tingCount","noTingCount"];
    },
    getEndallStatisticsKey: function () {
        return ["自摸次数","接炮次数","点炮次数","听牌次数","未听次数"];
    },
    setRoomStatistics: function (layout_typeText, pl) {
        var infoType = this.getEndallStatisticsName();
        var infoName = this.getEndallStatisticsKey();

        var text_score = layout_typeText.getChildByName("text_score");
        var text_type = layout_typeText.getChildByName("text_type");
        var scoreSize = 28 * 1.5; // CSD中的高度 * 额外增加一点间距
        for (var i = 0; i < infoType.length; i++) {
            var cloneName = text_type;
            var cloneScore = text_score;
            if(i !== 0){
                cloneName = text_type.clone();
                cloneScore = text_score.clone();
                layout_typeText.addChild(cloneName);
                layout_typeText.addChild(cloneScore);
            }
            cloneName.y -= scoreSize*i;
            cloneScore.y -= scoreSize*i;
            cloneName.ignoreContentAdaptWithSize(true);
            cloneScore.ignoreContentAdaptWithSize(true);
            var statistics = pl[ infoType[i] ];
            cloneScore.setString(statistics > 0 ? statistics : "0");
            cloneName.setString(infoName[i]);
        }
    }
});