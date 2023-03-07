// 岳阳福禄寿 客户端算法
(function() {
    var menziList = []; // 所有可能牌型组合
    var duiList = [];

    var FuLuShouErShi = function() {
        this.handCount = 19;
        this.sortType = 1;
    };

    FuLuShouErShi.prototype.isTingAll = true;  //是否听任意牌
    FuLuShouErShi.prototype.getAllCardsTotal = function() {
        return 96; 
    };

    // 理牌
    FuLuShouErShi.prototype.sortCard = function(hand, sortType) {
        //trace();
        /*手牌理牌逻辑：依照上大人/丘乙己/化三千/七十土/尔小生/八九子/佳作亡/福禄寿从左往右排列，
        每一句话一列，同一张字有多张时重叠放置并在左上角标明，最多存在8列。
        */
        //trace();
        if(hand == 'undefined' || hand.length <= 0) {
            return [];
        }
        //清理无效元素
        for(var i=hand.length-1; i>=0; i--) {
            if(!hand[i]) {
                hand.splice(i, 1);
            }
        }
        hand = hand.slice();
        hand.sort(function(a, b) {
            return a - b;
        });
        
        var matrix = [];
        //依次找出各列的牌
        var row = [];
        var idx = 0;
        for(var i=0; i<hand.length; i++) {
            var pai = hand[i]; 
            if(Math.floor(pai/10)==idx) {
                row.push(pai);
            }else {
                if(row.length > 0) 
                {
                    matrix.push(row);           //上一列放进来
                }
                idx = Math.floor(pai/10);
                row = [];
                row.push(pai);
            }

            if(i==hand.length-1) {
                matrix.push(row);       //最后一列放进来
            }
        }

        //刷手牌时需要额外统计相同牌的数量做堆叠角标
        //cc.log("整理后的手牌", JSON.stringify(matrix));
        return matrix;
    };

    //小结算手牌的统计与排列
    FuLuShouErShi.prototype.sortOverHand = function (hand) {
        var retList = {};        //剩下可以组成门牌的
        retList.hua = [];        //成话
        retList.kan = [];        //成坎
        retList.gang = [];       //成杠
        retList.lan = [];        //烂牌
        if (!hand || hand.length == 0) {
            return retList;
        }
        var copy = hand.slice();
        var handList = this.sortCard(copy);
        //cc.log("结算手牌待统计", JSON.stringify(handList));
        for(var i=0; i<handList.length; i++) {
            var group = handList[i];
            var pai = group[0];
            var cnt = 1;
            //成杠碰的
            var bCanHua = true;
            var groupBak = group.slice();
            for (var j=1; j<group.length; j++) {
                if(group[j] == pai && (j != (group.length-1))) {
                    cnt++;
                } 
                else {
                    if(group[j] == pai && (j == (group.length-1))) {
                        cnt++;
                    }
                    if (cnt == 3) {
                        retList.kan.push([pai, pai, pai]);
                        for(var t=0; t<3; t++) {
                            groupBak.splice(groupBak.indexOf(pai), 1);  //剔除该组中成碰的牌
                        }
                        bCanHua = false;
                    }
                    else if (cnt == 4) {
                        retList.gang.push([pai, pai, pai, pai]);
                        for(var t=0; t<4; t++) {
                            groupBak.splice(groupBak.indexOf(pai), 1);  //剔除该组中成杠的牌
                        }
                        bCanHua = false;
                    }
                    pai = group[j];
                    cnt = 1;        //重置统计数
                }
            }
            //当前组有坎或者杠，则一定成不了话
            if(bCanHua) {
                //递归找出成话牌
                var checkKan = function() {
                    var first = groupBak[0];
                    if(groupBak.indexOf(first+1) > 0 && groupBak.indexOf(first+2) > 0) {
                        retList.hua.push([first, first+1, first+2]);
                        //剔除该句话的一组牌
                        groupBak.splice(groupBak.indexOf(first), 1);
                        groupBak.splice(groupBak.indexOf(first+1), 1);
                        groupBak.splice(groupBak.indexOf(first+2), 1);
                        checkKan();
                    }
                }
                
            }
            //剩下的是烂牌
            retList.lan.push(groupBak);
        }

        //烂牌分组，每4张一组
        var lanGroup = retList.lan.slice();
        //cc.log("分组前烂牌", JSON.stringify(lanGroup));
        var temp = [];
        retList.lan = [];
        for(var i=0; i<lanGroup.length; i++) {
            for (var j=0; j<lanGroup[i].length; j++) {
                temp.push(lanGroup[i][j]);
                if(temp.length == 4) {
                    retList.lan.push(temp);
                    temp = [];
                }
            }
        }

        //最后一组不满4个的
        if(temp.length > 0) {
            retList.lan.push(temp);
        }
        //cc.log("结算手牌统计", JSON.stringify(retList));
        return retList;
    };

    //统计牌组中指定牌的数量
    FuLuShouErShi.prototype.cardHandCount = function (cardArr,card){
        var cardCount = 0;
        for(var i=0,length=cardArr.length;i<length;i++){
            if(cardArr[i] == card){
                cardCount ++ ;
            }
        }
        return cardCount;
    };

    // 获取能打牌的数量
    FuLuShouErShi.prototype.getCanPutCardNum = function(pl) {
        var num = 0;
        var hand = pl.mjhand;
        var canNotPutCard = pl.canNotPutCard || [];
        var hand = pl.mjhand;
        for (var i = 0; i < hand.length; i++) {
            var card = hand[i];
            if (canNotPutCard.indexOf(card) < 0) {
                num++;
            }
        }

        return num;
    };

    FuLuShouErShi.prototype.getCardShowType = function(uid, card) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[uid];
        // 展示
        if (!(pl.mjHide && pl.mjHide.indexOf(card) >= 0)) {
            return 2;
        }

        // 隐藏牌 暗招/暗杠牌玩家自己展示
        if (uid == SelfUid()) {
            return 1;
        }

        return 0;
    };

    FuLuShouErShi.prototype.sortHandCard = function(mjHand){  
        mjHand.sort(function(a,b){return a-b;}); 
        var myCardArr = mjHand;
        var newCardArr = [];
        for (var i = 0; i < 8; i++) {
            newCardArr[i] = [];
        } 
        for (var i = 0; i < mjHand.length; i++) {
            if(!mjHand[i]) continue;
            var index = Math.floor(mjHand[i] * 0.1);  
            newCardArr[index].push(mjHand[i]); 
        }
        return newCardArr;
    };

    // 判断胡牌是不是：红原
    FuLuShouErShi.prototype.isHongYuanHu = function(pl,tb){ 
        var name = ["mjpeng","mjzhao0","mjzhao1","mjgang0","mjgang1"];
        for (var i = 0; i < name.length; i++) {
            if(pl[ name[i] ].length > 0) return false; // 不能有碰招杠
        }

        // 上福的矩阵数量
        var shangFuHuaNum = 0; 

        var huSort = pl.huSort; 
        // 手牌
        for (var i = 0; i < huSort.length; i++) {
            for (var j = 0; j < huSort[i].length; j++) {
                var oneList = huSort[i][j];
                if(oneList.length == 0) continue;  

                if(oneList.length == 3){
                    if(oneList[0] == oneList[1] && oneList[0] == oneList[2]){ 
                        return false; // 黑圆不能有三个一样的
                    }else{
                        // 吃
                        if(oneList[0] == 1 || oneList[0] == 71)
                            shangFuHuaNum++;
                    }
                }else if(oneList.length == 2){
                    if(oneList[0] == oneList[1]){
                        return false;// 黑圆不能有一对
                    }
                }else{
                    return false; // 别的数量都不对
                }
            } 
        }
       
        for (var d = 0; d < pl.mjchi.length; d++) {
            var indexValue = (Math.floor(pl[ name[0] ] * 0.1) * 10) + 1;
            if(indexValue == 1 || indexValue == 71) shangFuHuaNum++; 
        }

        return shangFuHuaNum >= 3;  // 上福的句子，必须是三个以上才成立 
    }
    // 判断胡牌是不是：黑圆
    FuLuShouErShi.prototype.isHeiYuanHu = function(pl,tb){ 
        var name = ["mjpeng","mjzhao0","mjzhao1","mjgang0","mjgang1"];
        for (var i = 0; i < name.length; i++) {
            if(pl[ name[i] ].length > 0) return false; // 不能有碰招杠
        }

        // 上福的矩阵数量
        var shangFuHuaNum = 0; 

        var huSort = pl.huSort; 
        // 手牌
        for (var i = 0; i < huSort.length; i++) {
            for (var j = 0; j < huSort[i].length; j++) {
                var oneList = huSort[i][j];
                if(oneList.length == 0) continue;  

                if(oneList.length == 3){
                    if(oneList[0] == oneList[1] && oneList[0] == oneList[2]){ 
                        return false; // 黑圆不能有三个一样的
                    }else{
                        // 吃
                        if(oneList[0] == 1 || oneList[0] == 71)
                            return false; // 不能有上福的句子
                    }
                }else if(oneList.length == 2){
                    if(oneList[0] == oneList[1]){
                        return false;// 黑圆不能有一对
                    }
                    if(oneList[0] == 1 || oneList[0] == 71)
                        return false; // 不能有上福的句子
                }else{
                    return false; // 别的数量都不对
                }
            } 
        }
       
        for (var d = 0; d < pl.mjchi.length; d++) {
            var indexValue = (Math.floor(pl[ name[0] ] * 0.1) * 10) + 1;
            if(indexValue == 1 || indexValue == 71) shangFuHuaNum++; 
        }

        return shangFuHuaNum == 0;  // 上福的句子，必须是三个以上才成立 
    }


    // 判断胡牌是不是：清
    FuLuShouErShi.prototype.isQingHu = function(pl,tb){ 
        var huSort = pl.huSort; 

        for (var i = 0; i < huSort.length; i++) {
            for (var j = 0; j < huSort[i].length; j++) {
                var oneList = huSort[i][j];
                if(oneList.length == 0) continue; 
                if(oneList[j] == 1 || oneList[j] == 71)
                    return false; // 有上或者福都不是清 

                // 上福的缺口也不算清
                var indexValue = (Math.floor(oneList[j] * 0.1) * 10) ;
                if(oneList.length == 2 && (indexValue == 0 || indexValue == 70) && oneList[0] != oneList[1]){
                    return false; 
                }

            } 
        }

        var name = ["mjchi","mjpeng","mjzhao0","mjzhao1","mjgang0","mjgang1"];
        for (var i = 0; i < name.length; i++) { 
            for (var d = 0; d < pl[ name[i] ].length; d++) {
                if(name[i] == "mjchi"){
                    var indexValue = (Math.floor(pl[ name[0] ] * 0.1) * 10) + 1;
                    if(indexValue == 1 || indexValue == 71) return false; 
                }else { 
                    if(pl[ name[i] ][d] == 1 || pl[ name[i] ][d] == 71) return false; 
                }
            }
        }  
        return true; // 没有上福 为 清
    }

    // 判断是不是黑胡
    FuLuShouErShi.prototype.isHandHeiYuanHu = function(indexs,cardAllType,tb){  
        // 黑圆不能有碰、坎、对、招 如果有，胡息肯定不等于0 所以里面不需要重新判断
        for (var i = 0; i < indexs.length; i++) { 
            var oneCardList = cardAllType[i][ indexs[i] ]; 
            if(!oneCardList) continue;
            for (var j = 0; j < oneCardList.length; j++) {
                var oneList = oneCardList[j];
                if(oneList.length == 0) continue; 
                if(oneList.length == 3){
                    if(oneList[0] == oneList[1] && oneList[0] == oneList[2]){ 
                        return false; // 黑圆不能有三个一样的
                    }
                }else if(oneList.length == 2){
                    if(oneList[0] == oneList[1]){
                        return false;// 黑圆不能有一对
                    }
                } 
            } 
        } 
        return true;
    }
   // 判断手牌是不是十对
    FuLuShouErShi.prototype.isHeadShiDui = function(pl,plHand,tb){ 
        var shiDuiArr = [];
        var mjHand = plHand.slice(0); 

        var name = ["mjchi","mjpeng","mjzhao0","mjzhao1","mjgang0","mjgang1"];
        for (var i = 0; i < name.length; i++) { 
            if(pl[ name[i] ].length > 0)
                return false; // 不允许有吃碰杠招之类的
        }  

        if(mjHand.length != 20)
            mjHand.push(tb.tData.lastPutCard);

        mjHand.sort(function(a,b){return a-b;}); 
        for (var i = 0; i < mjHand.length; i++) {
            if(!mjHand[i+ 1]) return false;
            if(mjHand[i] == mjHand[i+ 1]){
                var index = Math.floor(mjHand[i] * 0.1);  
                shiDuiArr[index] = shiDuiArr[index] || [];
                shiDuiArr[index].push([mjHand[i],mjHand[i+ 1]]); 
                i++; // 跳过 
            }else{
                return false;
            }
        }
        
        pl.huXi = 0;
        var newArr = [];
        for (var i = 0; i < shiDuiArr.length; i++) {
            if(shiDuiArr[i])
                newArr.push(shiDuiArr[i]);
        }

        return newArr; // 十对

    }

    // 判断手里找到的牌是不是碰碰胡
    FuLuShouErShi.prototype.isCardPengPengHu = function(indexs,cardAllType,tb){
        var jiangNum = 0; 
        var oneNum = 0; 
        for (var i = 0; i < indexs.length; i++) { 
            var oneCardList = cardAllType[i][ indexs[i] ]; 
            if(!oneCardList) continue;
            for (var j = 0; j < oneCardList.length; j++) {
                var oneList = oneCardList[j];
                if(oneList.length == 0) continue; 
                if(oneList.length == 3){
                    if(oneList[0] == oneList[1] && oneList[0] == oneList[2]){ 
                    }else{ 
                        return false; // 碰碰胡不支持一句话
                    }
                }else if(oneList.length == 2){
                    if(oneList[0] == oneList[1]){
                        jiangNum++;
                    }else{ 
                        return false;// 碰碰胡不支持缺口
                    }
                }else if(oneList.length == 1){
                    oneNum++;
                }
            } 
            // 可以两队将，或者一个单牌
            if(jiangNum > 0 && oneNum >0)
                return false; 
            if(jiangNum > 2 || oneNum > 1)
                return false;  
        } 
        if(tb.tData.areaSelectMode.isPenPenHuTwo && oneNum > 0){
            return false; //选择，碰碰胡每个字不少于二张，摸任意一张字胡牌按门清或小胡计算，不算碰碰胡。
        } 
        return true;
    };

    // 搜索可以招的牌
    FuLuShouErShi.prototype.searchHandZhao = function(mjHand){
        //
        var searchValue = 0; // 搜索到可以招的内容
        var searchArr = [];// 修改为找到所有能招的牌
        var sortCard = this.sortHandCard(mjHand);
        for (var i = 0; i < sortCard.length; i++) {
            var oneList = sortCard[i];
            // logger.debug("=====GameCode searchHandZhao  979 ======== oneList = ",JSON.stringify(oneList)); 
            var searchNum = 0; // 搜索到的值
            for (var j = 0; j < oneList.length; j++) {
                if(searchValue === 0){
                    searchValue = oneList[j];
                    searchNum++;
                }else if(searchValue == oneList[j]){
                    searchNum++; 
                }else if(searchNum == 4){ 
                    // 找到招
                    searchArr.push(searchValue);
                    searchNum = 0; 
                }else{
                    searchValue = oneList[j];
                    searchNum = 1;
                } 
                if(searchNum == 4) {
                    // 找到招
                    searchArr.push(searchValue);
                    searchNum = 0; 
                }
            }
            // logger.debug("=====GameCode searchHandZhao  996 ======== ",searchNum); 
            // if(searchNum == 4)
            //     return searchValue;
        }
        return searchArr;
        // return 0;
    };

    // 判断胡牌后是否是碰碰胡
    FuLuShouErShi.prototype.isPengPengHu = function(pl,tb){ 
        if(pl.mjchi.length > 0)
        return false;
 
        var huSort = pl.huSort;
        var jiangNum = 0;
        var oneNum = 0;

        for (var i = 0; i < huSort.length; i++) {
            for (var j = 0; j < huSort[i].length; j++) {
                var oneList = huSort[i][j];
                if(oneList.length == 0) continue; 
                if(oneList.length == 3){
                    if(oneList[0] == oneList[1] && oneList[0] == oneList[2]){ 
                    }else{ 
                        return false; // 碰碰胡不支持一句话
                    }
                }else if(oneList.length == 2){
                    if(oneList[0] == oneList[1]){
                        jiangNum++;
                    }else{ 
                        return false;// 碰碰胡不支持缺口
                    }
                }else if(oneList.length == 1){
                    //oneNum++;
                    return false; // 碰碰胡不能有单牌
                }
            }
            if(jiangNum > 0 && oneNum >0)
                return false; 
            if(jiangNum > 2 || oneNum > 1)
                return false;  
        }
     
        //if(tb.tData.areaSelectMode.isPenPenHuTwo && oneNum > 0){
        //    return false; //选择，碰碰胡每个字不少于二张，摸任意一张字胡牌按门清或小胡计算，不算碰碰胡。
        //}
        
        return true; 
    }

    // 排序找到的最优牌
    FuLuShouErShi.prototype.sortHuCardList = function(indexs,cardAllType){
        var newCardList = {}; 
        newCardList.kanArr = [];   // 坎
        newCardList.chiArr = [];   // 话
        newCardList.jiangArr = []; // 将
        newCardList.oneArr = [];   // 单牌 

        // {"kanArr":[],"chiArr":[[1,2,3]],"jiangArr":[],"oneArr":[]}
        for (var i = 0; i < indexs.length; i++) {
            var cardListType = cardAllType[i][indexs[i]]; 
            for (var name in cardListType) {
                if(cardListType[name].length == 0) continue;
                newCardList[name].push(cardListType[name]);
            }
        }
        return newCardList;
    };

    // 拉牛胡
    FuLuShouErShi.prototype.laNiuHu = function(pl,mjHand){
        var card = Math.floor(mjHand[0] * 0.1)*10; 
        var isSort = true; // 是不是顺子
        var isKan = true; // 是不是坎
        var huType = 0;

        if(mjHand.length < 3){
            cc.log("=====GameCode laNiuHu 164 ========牌数量不对",JSON.stringify(mjHand) );
        }

        mjHand.sort(function(a, b) {
            return a - b;
        });
        var lastValue = mjHand[0];
        for (var i = 0; i < mjHand.length; i++) {
            if(lastValue != mjHand[i])
                isKan = false;
            if((card + i + 1) != mjHand[i])
                isSort = false;
        }
        if(isKan) huType = 2;
        if(isSort) huType = 1; 
          
        return huType;
    };

    FuLuShouErShi.prototype.searchHu = function(pl,mjHand,tb){
        var putCard = mjHand[mjHand.length - 1]; // 补进来的牌
        var sortCard = this.sortHandCard(mjHand); 
        var self = this; 

        var putCardNum = 0; // 别人打出来的牌
        if(pl.mjState != TableState.waitPut){
            for (var i = 0; i < mjHand.length; i++) {
                if(putCard == mjHand[i])
                    putCardNum++;
            }
        }  
    
        var shiduiArr = this.isHeadShiDui(pl,mjHand,tb);
        if(shiduiArr) {// 十对就直接返回了 
            return shiduiArr;
        }

        // logger.debug("=====GameCode searchHu  349 ======== maxHuArr = ",JSON.stringify(newType)); 
     
        function checkHu(oneDoubleNum,oneNum,doubleNum){
            // 1个缺口
            if(oneDoubleNum == 1 && oneNum == 0 && doubleNum == 0){
                return 1;
            }
      
            // 123.123.123.111.111.11.11 1对将
            if(oneDoubleNum == 0 && oneNum == 0 && doubleNum == 1){
                return 3;
            }
            // 123（吃）.123.123.111.111.111.1（23） // 只有一个单牌
            // if(oneDoubleNum == 0 && oneNum == 1 && doubleNum == 0){
            //     return 4;
            // }
            // if(oneDoubleNum == 0 && oneNum == 0 && doubleNum == 0)
            //     return 5; 
            return 0;
        }

        var myHandHuXi = 0;
        var handShangDaRenNum = 0; // 上大人，福禄寿
        
        // 计算自己已经吃碰杠招的牌
        function logicHandCard(){
            var name = ["mjchi","mjpeng","mjzhao0","mjzhao1","mjgang0","mjgang1"];

            function cehckISShangFu(indexValue,value){
                return (indexValue == 0 || indexValue == 7) && (value % 10 == 1);
            }

            // for (var idx in name){
            for (var idx = 0; idx < name.length; idx++) {
                // mjchi[[1,2,3],[1,2,3],[11,12,13]]; 

                for (var i = 0; i < pl[ name[idx] ].length; i++) {

                    // logger.debug("pl[ name[idx] ]  = ",JSON.stringify(pl[ name[idx] ]));
                    var value = pl[ name[idx] ][i];  

                    switch (name[idx]) {
                        case "mjchi": 
                            var indexValue = Math.floor(value[0] * 0.1); 
                            if(indexValue == 0 || indexValue == 7){
                                myHandHuXi += 4;
                                handShangDaRenNum++;
                            }
                        break;
                        default:
                            var indexValue = Math.floor(value * 0.1); 
                            // logger.debug("计算杠的胡息  = ",indexValue);
                            if(name[idx] == "mjpeng"){
                                if(cehckISShangFu(indexValue,value)){
                                    myHandHuXi += 3*4;
                                }else{
                                    myHandHuXi += 2;
                                }
                            }else{
                                if(cehckISShangFu(indexValue,value)){
                                    myHandHuXi += 4*4;
                                }else{
                                    myHandHuXi += 6;
                                }
                            }

                        break; 
                    } 
                     
                }
            }
        }
        logicHandCard();

        // pl

        var cardAllType = [];       
        for (var i = 0; i < sortCard.length; i++) {
            var getCardType = this.getAllCardType(sortCard[i]); 
            // logger.debug("1111111111111111111111111getCardType = ",JSON.stringify(sortCard[i]));
            if(getCardType.length == 0) return false;
            cardAllType[i] = getCardType;
        }
        // logger.debug("getAllCardType = end");
     

        var maxHuArr = [];// 所有可以胡的牌型 
        var indexs = []; 
        function pickCardType( beginIndex) {
            // if(beginIndex >= 8) return;

            // 找出一个组合方式 
            if (cardAllType.length <= beginIndex){    

                // // 增加胡息
                var specialKanNum = 0; // 上和福的坎， 加24胡息 
                var specialHuaNum = 0;  // 上大人，福禄寿 这种话 有胡息，剩余的没有
                var specialJiangNum = 0;  // 上，福 这种将在特殊情况额外加更多胡息
                var specialOneNum = 0;  // 上，福 的单牌
                // 首先统计上福的句型，在统计上大人，和福禄寿的列表的句型
                var specialQueKouNum = 0; // 有上、福的缺口
                var shangFuQueKouNum = 0; // 上福列表的缺口
                var isSpeciaListOne = false; // 单独的 “禄寿”“大人”因为上和福都直接加了8胡息，就不累加了

                var kanNum = 0;     // 普通坎  
                var isPeng = false;
                // 胡牌条件
                var jiangNum = 0;   // 将
                var oneNum = 0;     // 单个
                var oneOneNum = 0;  // 缺口

                var isJiang = false; // 最后别人打出来的牌是否让我成将了(自摸也可以胡，学彬说的)
      
                
     
                // 校验类型
                var checkCardType = function(arr){ 
                    for (var i = 0; i < arr.length; i++) { 
                        var indexValue = Math.floor(arr[i][0] * 0.1) * 10; 
                        var isShangFu = arr[i][0] == 1 || arr[i][0] == 71; 

                        if(arr[i].length == 3){ 
                            if(arr[i][0] == arr[i][1] && arr[i][0] == arr[i][2]){ // 坎

                                if(arr[i][0] == putCard && putCardNum == 3 && !isShangFu){
                                    isPeng = true;// 如果我手里只有两张 1 ，别人打了一张1，这个胡息只能算 碰的胡息 因为上福的碰和坎的计算方式一样
                                }else{
                                    kanNum++;
                                } 
                                if(isShangFu)//上和福的坎
                                    specialKanNum++;

                            }//上和福的一句话，可以加胡息
                            else if(isShangFu){
                                specialHuaNum++; 
                            }  
                        }else if(arr[i].length == 2){
                            // 看一下是一对将还是缺口
                            if(arr[i][0] == arr[i][1] ){ // 将
                                jiangNum++;
                                if(isShangFu)
                                    specialJiangNum++;
                                if(arr[i][0] == putCard && putCardNum == 2)
                                    isJiang = true;
                            }else{ // 缺口
                                oneOneNum++; 
                                if(arr[i][0] == 1 || arr[i][0] == 71)
                                    specialQueKouNum++;  // 有上、福的缺口
                                else if(indexValue == 0 || indexValue == 70) 
                                    shangFuQueKouNum++;  // 上福列表的缺口

                            }
                        }else if(arr[i].length == 1){
                            // 单牌
                            oneNum++; 
                            if(isShangFu) 
                                specialOneNum++;
                            else if(indexValue == 0 || indexValue == 70)
                                isSpeciaListOne = true;

                        } 
                    }
                }


                for (var i = 0; i < indexs.length; i++) {
                    var oneCardList = cardAllType[i][indexs[i]];
                    if(!oneCardList || oneCardList.length == 0) continue; 
                    // logger.debug("oneCardList ",oneCardList);
                    checkCardType(oneCardList); 
                } 
                var huType = checkHu(oneOneNum,oneNum,jiangNum);
                if(huType == 0){
                    // logger.debug("=====GameCode searchHu  371 ======== oneCardList = ",JSON.stringify(oneCardList)); 
                    return;  
                }  
                
                // var isOneJiang = jiangNum == 1; // 单独一对将

                // 计算胡息
                var huxiNum = myHandHuXi;
                huxiNum += specialKanNum * 24;  // 上福的胡
                huxiNum += (kanNum - specialKanNum) * 3; // 普通坎3胡息
                huxiNum += specialHuaNum * 4; // 上/福 胡息
                // huxiNum += specialOneNum * 8; // 单独的上或者福
                huxiNum += specialQueKouNum * 4; // 上、福 缺口依然加4，且能对对子加胡息
                huxiNum += specialJiangNum * 2 * 4; // 上 福 的将
                huxiNum += isPeng ? 2 : 0; // 如果我手里只有两张 1 ，别人打了一张1，这个胡息只能算 碰的胡息
                // test log
                for (var i = 0; i < indexs.length; i++) {
                    var oneCardList = cardAllType[i][indexs[i]];
                    if(!oneCardList || oneCardList.length == 0) continue; 
                }    
                 
                var isHandHeiYuanHu = (huxiNum == 0 && self.isHandHeiYuanHu(indexs,cardAllType,tb)); 
                if(huxiNum >= 11 || isHandHeiYuanHu){    
                    var data = indexs.slice(0);  
                    if( maxHuArr.length == 0 || isHandHeiYuanHu){
                        
                        var newType = [];
                        for (var i = 0; i < data.length; i++) {
                            if(!cardAllType[i][data[i]] || cardAllType[i][data[i]].length == 0) continue;
                            newType.push(cardAllType[i][data[i]]);
                        }
                        maxHuArr = newType; 
                        pl.huXi = huxiNum; // 记录一下最后返回的牌型的胡息
                        // logger.debug("=====GameCode searchHu  349 ======== maxHuArr = ",JSON.stringify(newType)); 
                        return;
                    } 
                }
                return;
            }    
             
            for(var i = 0; i < cardAllType[beginIndex].length;i++){ 
                indexs.push(i);
                pickCardType(beginIndex+1);
                indexs.pop();
            }
            if(cardAllType[beginIndex].length == 0){
                indexs.push(i);
                pickCardType(beginIndex+1);
                indexs.pop();
                return;
            }
        }
        pickCardType(0);
        if(maxHuArr.length == 0)
            return false;

        return maxHuArr;//this.sortHuCardList(maxHuArr,cardAllType)
    },

    FuLuShouErShi.prototype.getAllCardType = function(mjHand){
        var menList = [];// 可以组成的门子方式
        menList.push([1, 1, 1], [2, 2, 2], [3, 3, 3], [1, 2, 3]);
 
        var value = Math.floor(mjHand[0] * 0.1) * 10;
        for (var i = 0; i < menList.length; i++) {
            for (var j = 0; j < menList[i].length; j++) {
                 menList[i][j] += value;
            }
        } 
        var allMatrix = [];
        function split(hand, matrix, startIdx) {
            if (hand.length == 2 || hand.length == 1) {
                matrix.push(hand.slice());
                allMatrix.push(matrix);
                return;
            }

            if (hand.length == 0) {
                allMatrix.push(matrix);
                return;
            }

            if (hand.length == 4) { // 找2+2 
                var tmp = matrix.slice();
                if(hand[1] == hand[2]){ 
                    tmp.push([hand[1], hand[2]]);
                    tmp.push([hand[0], hand[3]]); 
                }else{
                    tmp.push([hand[0], hand[1]]);
                    tmp.push([hand[2], hand[3]]);  
                }
                allMatrix.push(tmp); // todo 其他2+2z组合  
             
                // 
            }


            var begin = startIdx;
            if (startIdx <= 2) {
                begin++;
            }

            for (var i = begin; i < menList.length; i++) {
                var menzi = menList[i];
                var copy = hand.slice();
                var isContain = true;

                for (var j = 0; j < 3; j++) {
                    var cd = menzi[j];
                    var idx = copy.indexOf(cd);
                    if (idx >= 0) {
                        copy.splice(idx, 1);
                    } else {
                        isContain = false;
                        break;
                    }
                }

                if (isContain) {
                    // console.log("isContain@ ");
                    var hand_copy = hand.slice();
                    var matrix_copy = matrix.slice();
                    matrix_copy.push(menzi.slice());
                    for (var j = 0; j < 3; j++) {
                        hand_copy.splice(hand_copy.indexOf(menzi[j]), 1);
                    }

                    split(hand_copy, matrix_copy, i);
                }
            }
        }; 
        split(mjHand, [], -1); 
        return allMatrix;
    },

    //计算听牌
    FuLuShouErShi.prototype.canHu = function(pl,card,tb,gangCanHu){ 
        var tData = tb.tData;  
        var hand = pl.mjhand.slice(0);
        hand.push(card) 

        var isHu = this.searchHu(pl,hand,tb);

        if(isHu != false){
            pl.huSort = {};
            pl.huSort = isHu; 

            return true;
        }

        
        return false; 
    } 

    // 获取听牌
    FuLuShouErShi.prototype.getTingCards = function(tb, pl, putCard) {
        //trace();
        var copy = pl.mjhand.slice();
        var tingCards = [];
        if (putCard != undefined) {
            var idx = pl.mjhand.indexOf(putCard);
            if (idx < 0) {
                return [];
            }
            pl.mjhand.splice(idx, 1);
        } 
        // 牌数量合法判断
        if (pl.mjhand.length % 3 != 1) {
            pl.mjhand = copy;
            return [];
        }
        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }
            var p = tb.players[uid];
            var addMenPaiNum = function(list, isPeng) {
                if (!list) return;
                for (var i = 0; i < list.length; i++) {
                    if(isPeng) {
                        add(list[i], 3);
                    } else {
                        add(list[i], 4);
                    }
                }
            }
            addMenPaiNum(p.mjpeng, true);
            addMenPaiNum(p.mjzhao0);
            addMenPaiNum(p.mjgang0);
            if(uid == SelfUid()) {          //是自己才计算暗招和暗杠的牌
                addMenPaiNum(p.mjzhao1);
                addMenPaiNum(p.mjgang1);
            }

            //添加吃的门牌
            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i];
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        var allCards = [];
        for (var i = 0; i <= 7; i++) {
            for (var j = 1; j <= 3; j++) {
                allCards.push(i*10 +j);
            }
        }

        //统计听的牌
        this.isTingAll = true;
        for(var k in allCards) {
            var card = allCards[k];
            //cc.log("验证听牌", card);
            if (this.canHu(pl, card, tb)) {
                //cc.log("可以听", card);
                tingCards.push(card);
            } else {
                //cc.log("不能听", card);
                //不能全听
                this.isTingAll = false;
            }
        }

        for (var i = 0; i < tingCards.length; i++) {
            if (stats[tingCards[i]] >= 4) {
                tingCards.splice(i, 1);
                i--;
            }
        }
        tingCards.sort(function(a, b) {return a - b});

        pl.mjhand = copy;
        return tingCards;
    };

    // 获取听牌统计
    FuLuShouErShi.prototype.getTingStats = function(tb, pl, putCard) {

        var tingCards = this.getTingCards(tb, pl, putCard);
        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }

            var p = tb.players[uid];

            //碰招杠的数据
            var addMenPaiNum = function(list, isPeng) {
                for (var i = 0; i < list.length; i++) {
                    if(isPeng) {
                        add(list[i], 3);
                    } else {
                        add(list[i], 4);
                    }
                }
            }
            addMenPaiNum(p.mjpeng, true);
            addMenPaiNum(p.mjzhao0);
            addMenPaiNum(p.mjgang0);
            if(uid == SelfUid()) {          //是自己才计算暗招和暗杠的牌
                addMenPaiNum(p.mjzhao1);
                addMenPaiNum(p.mjgang1);
            }

            //添加吃的门牌
            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i];
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        var tingStats = {};
        for (var i = 0; i < tingCards.length; i++) {
            var card = tingCards[i];
            var totalNum = 4;
            tingStats[card] = totalNum - (stats[card] || 0);
        }

        return tingStats;
    };

    // 提示打后可听的牌(听角标)
    FuLuShouErShi.prototype.hintPutCardsToTing = function() {
        var tb = sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        if (tData.tState != TableState.waitPut || tData.uids[tData.curPlayer] != pl.info.uid) {
            return [];
        }

        var hand = pl.mjhand.slice();
        if (hand.length % 3 != 2) {
            return [];
        }

        var dict = {};
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }

        var putList = [];
        for (var k in dict) {
            var card = Number(k);
            if (pl.canNotPutCard && pl.canNotPutCard.indexOf(card) >= 0) {
                continue;
            }
            var tingList = this.getTingStats(tb, pl, card);
            for(var key in tingList) {
                if (tingList[key] > 0) {
                    putList.push(card);
                    break;   //只要有一个可听的牌，此牌贴角标
                }
            }
        }

        return putList;
    }

    // 打的牌 -->  听牌统计
    FuLuShouErShi.prototype.put2TingStats = function(tb, pl) {
        return {};
        if (pl.mjhand.length % 3 != 2) {
            return [];
        }

        var stats = {
            21: {
                23: 2,
                24: 1,
            }
        };

        stats = {};

        var dict = {};
        for (var i = 0; i < pl.mjhand.length; i++) {
            var card = pl.mjhand[i];
            if (card == KING) {
                continue;
            }

            dict[card] = true;
        }

        for (var k in dict) {
            var card = Number(k);
            var time1 = +new Date();
            var tingCards = this.getTingCards(tb, pl, card);
            if (tingCards.length > 0) {
                var time2 = +new Date();
                //console.log('card@@ ', time2 - time1);
                stats[card] = {
                };
                for (var i = 0; i < tingCards.length; i++) {
                    
                    stats[card][tingCards[i]] = 1;
                }
            }
        }

        return stats;
    } 

    //test.......
    FuLuShouErShi.prototype.getZhaoList = function() {
        return [11, 12, 13, 21, 22];
    }
    FuLuShouErShi.prototype.getGangList = function() {
        return [31, 32, 33, 41, 42];
    }


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_fulushouErShi = new FuLuShouErShi();
    }   

    function test() {
        var a = new FuLuShouErShi();
        var tb = {tData: {minRedNum: 3, areaSelectMode : true}};
        var pl = {};
        var hand = [8, 9, 27, 21, 4, 27, 26, 5, 2, 3, 91, 91, 91, 91];
        var hand = [2,2,2,7,7,7,22,27,30,24,25,26,21,21];
        pl.mjhand = hand;
        pl.mjpeng = [];
        pl.mjchi = [
        // {
        //     eatCards: [7, 2, 10]
        // },
        ];
        pl.mjchi = [];
        pl.canNotPutCard = [];
        var time1 = + new Date();
        console.log(a.getTingStats(tb, pl, 30));
    }
    // test();
})();