
 
function setEndOneUserDataView(node){
    var parent = node.getParent();

    // var cloneCp = node.Clone(); 
    

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var sortIDList = []; 
       // ttt.setProperty("100", "gameOver/pjjs_29_MJ.png", 40, 51, "0");
    // 设置item 数据
    var setCloneItemData = function(type,cloneItem,off){ 
        var imgName = type ? "hong_di.png" : "lan_di.png"; 
        cloneItem.loadTexture("playing/diantuo/winGameView/" + imgName);
        // 头像数据部分  
        var pl = sData.players[ sortIDList[off] ]; //getUIPlayer_diantuo(off);


        var youIndex = tData.rank.indexOf(pl.info.uid);
        cc.log("tData.rank = ",JSON.stringify(tData.rank)); 
        cc.log("pl.uid = ",pl.info.uid);
        cc.log("youIndex = ",youIndex);
   
        var you = cloneItem.getChildByName("youxiImg");
        you.loadTexture("playing/niushibie/Ui_you" + (youIndex + 1) + ".png");
        if(MjClient.data.sData.tData.duZhanPlayer != -1) 
            you.setVisible(false);

        if(!pl) return;
        loadtWXHeadAndName(cloneItem,pl);

        //////
        var cardItem = cloneItem.getChildByName("cardItem"); 
  
        // 复制剩余的扑克牌
        var testCardData = pl.mjhand||[];
        cc.log(" pl.info.uid = ",pl.info.uid + " card = " + testCardData);
        for (var i = 0; i < testCardData.length; i++) {
            var cloneCardItem = cardItem;
            cloneCardItem.setVisible(true);
            if(i != 0){
                cloneCardItem = cardItem.clone();
                cloneItem.addChild(cloneCardItem);
            }
            cloneCardItem.x += cardItem.width * 0.15 * i;
            cloneCardItem.loadTexture("playing/diantuo/cards/" + testCardData[i] + ".png");
        }   
 
 
        // 显示得分 
        var xiFen = pl.score_xi || 0;// 喜分
        // var deFen = pl.winone; // 得分
        // var sumFen = faFen + pl.winone;// 本局得分

        var itemList = [];
        for (var i = 1; i < 6; i++) { 
            var item = cloneItem.getChildByName("item_" + i);
            itemList.push(item);
        }
        var scoreList = [];
        for (var i = 1; i < 5; i++) { 
            var item = cloneItem.getChildByName("score_" + i);
            item.ignoreContentAdaptWithSize(true);
            scoreList.push(item);
        }  

        if(!(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore) || tData.areaSelectMode.nScoreLine === 600){
            scoreList[0].setVisible(false);
            itemList[0].setVisible(false);
        } 

        if( tData.duZhanPlayer != -1){ // 独站
            // 只显示总分 和喜分
            for (var i = 1; i < 3; i++) {
                scoreList[i].setVisible(false);
                itemList[i].setVisible(false);
            }
            // 0 喜分 1 罚分 2 得分 3 总分
            scoreList[0].setString("/" + xiFen); 
            if(xiFen < 0) {
                scoreList[0].setProperty("/" + xiFen, "gameOver/pjjs_29.png", 40, 58, ".");
            }
           
            itemList[4].visible = false;
            itemList[3].visible = true;

            // 总分
            if(pl.winone < 0){
                scoreList[3].setProperty( "0", "gameOver/pjjs_29.png", 40, 58, ".");
            }
            scoreList[3].setString("/" + pl.winone); 

        }else{
            // 全部都显示
            var teamData = {}; 
            var faFen = 0; // 罚分
            var deFen = 0; // 得分
            if(tData.maxPlayer == 3 || tData.areaSelectMode.isSanFuPai){
                faFen = pl.score_rank;
                deFen = pl.table_draw;
            }else{
                teamData = sData.teams[pl.teamid] || {};

                faFen = teamData.score_rank; // 罚分
                teamData = sData.teams[pl.teamid]; 
                deFen = teamData.score_draw;
            }
            // 0 喜分 1 罚分 2 得分 3 总分
            scoreList[0].setString("/" + xiFen);
            scoreList[1].setString("/" + faFen); 
            scoreList[2].setString("/" + deFen);
           
            //喜分 罚分 总分 本局的分都有负数
            if(xiFen < 0) {
                scoreList[0].setProperty("/" + xiFen, "gameOver/pjjs_29.png", 40, 58, ".");
            }
            if(faFen < 0){
                scoreList[1].setProperty("/" + faFen, "gameOver/pjjs_29.png", 40, 58, ".");
            }
            var scoreText = 0; // 总分或者本局得分

            if(tData.maxPlayer == 3){
                // 总分 
                scoreText = pl.winall;
                if(tData.areaSelectMode.nScoreLine !== 400 ){
                    itemList[4].visible = true;
                    itemList[3].visible = false;
                } 
            }else if (tData.areaSelectMode.isSanFuPai) {    //各打各的
                scoreText = pl.winone;  //本局得分
                itemList[4].visible = true;
                itemList[3].visible = false;
            }else {
                if(tData.areaSelectMode.nScoreLine === 600 ){
                    // 总分 
                    scoreText = pl.winall;
                }else{  // 本局得分
                    itemList[4].visible = true;
                    itemList[3].visible = false;
                    scoreText = teamData.winone; 
                }  
            }

            if(scoreText < 0){
                scoreList[3].setProperty("/" + scoreText, "gameOver/pjjs_29.png", 40, 58, ".");
            }

            scoreList[3].setString("/" + scoreText);

        }  

    }
   
    
    var uids = MjClient.data.sData.tData.uids.slice();

    if(tData.maxPlayer == 3 || tData.areaSelectMode.isSanFuPai){
        for (var i = 0; i < uids.length; i++) {
            sortIDList.push(uids[i]);
        }
    }else{
        for (var name in sData.teams) {
            var team = sData.teams[name]; 
            for (var c = 0; c < team.uids.length; c++) {
                sortIDList.push(team.uids[c]); 
            }
        } 
    }
 
    cc.log("111111111111111111 = ",JSON.stringify(uids));
    // node 下复制的节点需要清除一遍
    var tempCloneNode = node.clone();
    for (var i = 0; i < uids.length; i++) {
        var cloneItem = node;
        if(i != 0){ // 除第一个以外都要重新复制
            cloneItem = tempCloneNode.clone();
            parent.addChild(cloneItem); 
            cloneItem.y -= cloneItem.height * i; 
        }   
        var color = function(){
            var isRed = false;
            
            var pl = sData.players[ sortIDList[i] ]; //getUIPlayer_diantuo(off);
            if(tData.maxPlayer == 3 || tData.areaSelectMode.isSanFuPai) return true;
            if( MjClient.data.sData.tData.duZhanPlayer == -1){
                isRed = i < 2;
            }else {
                // 独站只有一个红色 
                if(MjClient.data.sData.tData.duZhanPlayer == pl.info.uid){
                    isRed = true;
                }else{
                    isRed = false;
                }
            }
            return isRed;
        }

        // 设置数据 
        setCloneItemData(color(),cloneItem,i)
    }
    tempCloneNode.removeFromParent(true);

    


}

var EndOneView_dianTuo = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },

        uiNode:{
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            _run:function(){ 
                if(isIPhoneX() || isIPad()) {
                    setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0]);
                }
            },
            playerImgiew:{
                _run:function(){
                    // setEndOneUserDataView(this);
                    if(isIPhoneX()) {
                        this.width *= 1.2;
                    }
                }
            } ,
            title_img:{
                _run: function(){
                    var sData = MjClient.data.sData
                    var tData = sData.tData;
                    var score = 0;
                    var pl = getUIPlayer_dianTuo(0);
                    if(!pl) return;
                    if( tData.duZhanPlayer != -1) { // 独站  
                        score = pl.winone;
                    }else if (tData.maxPlayer == 3) {
                        //3人分数相等则显示平局, 否则.1胜2负 或者 2胜1负(两个相同的高分)
                        var oneScore = [];
                        for (var i = 0; i < sData.players.length; i++) {
                            var p = sData.players[i];
                            if(p && p.winone) {
                                oneScore.push(p.winone);
                            }
                        }
                        var max = Math.max.apply(Math, oneScore);
                        var min = Math.min.apply(Math, oneScore);
                        if (pl.winone < max) {
                            score = -1;
                        } else if (pl.winone == max && max == min) {
                            score = 0;   //平局
                        } else {
                            score = 1;
                        }
                    } else if (tData.areaSelectMode.isSanFuPai) {
                        score = pl.winone >= 0;
                    } else {
                        /*
                        // 全部都显示 
                        var teamData = sData.teams[pl.teamid]; 
                        score = teamData.score_rank; // 罚分
                        */
                        var myTeamData = sData.teams[pl.teamid];
                        var otherTid = pl.teamid == "A" ? "B" : "A";
                        var otherTeamData = sData.teams[otherTid];
                        score = myTeamData.winone - otherTeamData.winone;
                    }  
                    if(MjClient.isDismiss){
                        this.loadTexture("gameOver/newOver/title_2.png");
                        return;
                    }
                    // 如果有罚分就用罚分判断，没有罚分就用winone判断
                     
                    if(score > 0){ 
                        this.loadTexture("gameOver/newOver/title_3.png");
                    }else if(score == 0){
                        this.loadTexture("gameOver/newOver/title_5.png");
                    }else{
                        this.loadTexture("gameOver/newOver/title_4.png");
                    }  
                    
                }
            },
            btnReady:{
                _run:function(){ 
                },
                _click:function(){
                     
                    postEvent("clearCardUI");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else { 
                        if (MjClient.playui.GameOverLayer)
                        { 
                            MjClient.playui.GameOverLayer.visible = true;
                            delete MjClient.playui.GameOverLayer;
                        }

                        //GameOverLayer
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "PKPass"
                        });

                    }
                }
            },
            roomID:{
                _run: function(){ 
                    this.ignoreContentAdaptWithSize(true);
                    var tData = MjClient.data.sData.tData;

                    
                    var text = "房号：" + MjClient.data.sData.tData.tableid;
                    
                    if(tData.roundNum_play){ 
                        text += "     第"+ (tData.roundNum_play) + "局"
                    }else{ 
                        text += "     第1局"
                    }
                    this.setString(text); 

                },
            },
            roomData:{
                _run: function(){ 
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.data.sData.tData.tableid);

                    var tData = MjClient.data.sData.tData;
                    var str = "";

                    if(MjClient.MaxPlayerNum == 3){
                        // str += "去掉3、4,去两张牌,不分组,";
                    }

                    var score = Number(tData.areaSelectMode.nScoreLine);
                    if(score == 1 || score == 2 || score == 4) {
                        score = score + "局,";
                    }else {
                        score = score + "分,";
                    }
                    str +=  score;
                    str += tData.areaSelectMode.isSanFuPai ? "三副牌," : "";
                    str +=  (!tData.areaSelectMode.isFullCard && MjClient.MaxPlayerNum != 3) ? "去掉3、4," : "";
                    str +=  (tData.areaSelectMode.isSeeTeamCard && MjClient.MaxPlayerNum == 3 ) ? "看队友牌," : "";
                    str +=  tData.areaSelectMode.isRdTeam ? "随机分组," : "";
                    // str +=  tData.areaSelectMode.isShowRemainCards ? "看手牌数," : ""; // 产品要求，不显示看手牌数
                    str +=  tData.areaSelectMode.isNoShunZi ? "不打顺子," : "";
                    str +=  tData.areaSelectMode.isBuDaGang ? "不打港," : "";

                    str +=  tData.areaSelectMode.isZhaNoKing ? "炸弹不带王," : "";
                    str +=  tData.areaSelectMode.isHuaSeValid ? "正五十K分花色," : "";
                    str +=  tData.areaSelectMode.isZuiHouShaoDai ? "仅最后飞机三条可少带," : "";

                    str +=  tData.areaSelectMode.isBombScore ? "炸弹有喜," : "";
                    str +=  tData.areaSelectMode.isRedBlackScore ? "四红四黑," : ""; 
                    if(tData.areaSelectMode.nTianZhaScore > 0){
                        str += "天炸"+ tData.areaSelectMode.nTianZhaScore + "分,";
                    }
                     
                    str += '积分底分' + tData.areaSelectMode.jieSuanDiFen;
                    // if(tData.maxPlayer == 3){
                    //     str += "去掉3、4,去两张牌,不分组,";
                    // }


                    // str +=  tData.areaSelectMode.nScoreLine + "分,";

                    // str +=  (!tData.areaSelectMode.isFullCard && tData.maxPlayer != 3) ? "去掉3、4," : "";
                    // str +=  tData.areaSelectMode.isSeeTeamCard ? "看队友牌," : "";
                    // str +=  tData.areaSelectMode.isRdTeam ? "随机分组," : "";
                    // str +=  tData.areaSelectMode.isShowRemainCards ? "看手牌数," : "";
                    

                    // str +=  tData.areaSelectMode.isBombScore ? "炸弹有喜," : "";
                    // str +=  tData.areaSelectMode.isRedBlackScore ? "四红四黑," : ""; 
                    // if(tData.areaSelectMode.nTianZhaScore > 0){
                    //     str += "天炸"+ tData.areaSelectMode.nTianZhaScore + "分,";
                    // }



                    this.setString(str);
    
                },
            }
        }

     
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_diantuo.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        //playerImgiew
        var uiNode = endoneui.node.getChildByName("uiNode"); 
        var playerImgiew = uiNode.getChildByName("playerImgiew");

        setEndOneUserDataView(playerImgiew);

        MjClient.endoneui = this;
        return true;
    }
});