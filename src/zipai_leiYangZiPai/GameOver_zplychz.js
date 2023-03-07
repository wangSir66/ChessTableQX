var GameOverLayer_zplychz = cc.Layer.extend({
    sprite:null,
    jsBind:{
        back:{
            share:{
                img_shine:{
                    _visible:false
                },
                img_txt:{
                    _visible:false
                },
                img_point:{
                    _visible:false
                },
                _event:{
                    captureScreen_OK:function(){
                        if (MjClient.endallui.capture_screen != true)
                            return;
                        MjClient.endallui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                        if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    }
                }
            },
        }
    },
    ctor:function () {
        this._super();

        // MjClient.data.sData = {"players":{"1000140":{"mjhand":[3,3,3,22,4,21,2,2,9,10,7,26,27,8,7,26,29,26,6,9],"mjdesc":[" ÓÚ2018-04-26 13:38:16ÉêÇë½âÉ¢"],"winone":0,"winall":0,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000140,"appid":"shaoyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/1.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"190.164.42.170","lastLoginTime":1524712329360,"lastShareDay":0,"createRoomNum":10,"createTime":1524574371329,"money":0,"integral":0,"limitMoney":0,"myMemberId":682172,"memberId":682172,"bindHistory":0,"sid":262,"fid":"pkcon000","remoteIP":"172.17.100.42","lockMoney":-20,"did":"pkplayer000","lastGameTime":1524720918992},"tableMsg":[0,0],"longCard":[],"isHuByHand":false,"winScore":-30},"1000141":{"mjhand":[29,27,8,2,29,2,30,23,5,21,28,24,1,23,6,7,28,9,10,1,3],"mjdesc":["Í¬Òâ½âÉ¢"],"winone":0,"winall":29,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"hzdesc":{},"zimoTotal":1,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000141,"appid":"shaoyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/3.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"253.206.131.105","lastLoginTime":1524712331197,"lastShareDay":0,"createRoomNum":10,"createTime":1524574371329,"money":40,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":263,"fid":"pkcon001","remoteIP":"172.17.100.42","lockMoney":-40,"did":"pkplayer001","lastGameTime":1524720918992},"tableMsg":[29,0],"longCard":[],"isHuByHand":false,"winScore":60},"1000142":{"mjhand":[22,30,4,27,4,5,25,23,10,4,5,21,23,5,30,28,7,1,24,25],"mjdesc":["Í¬Òâ½âÉ¢"],"winone":0,"winall":0,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000142,"appid":"shaoyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/3.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"22.184.15.205","lastLoginTime":1524720769431,"lastShareDay":0,"createRoomNum":10,"createTime":1524574371329,"money":60,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":263,"fid":"pkcon000","remoteIP":"172.17.100.42","lockMoney":20,"did":"pkplayer000","lastGameTime":1524720918992},"tableMsg":[0,0],"longCard":[],"isHuByHand":false,"winScore":-30}},"tData":{"initCoin":0,"gameType":2018074,"roundAll":100,"roundNum":-2,"isValidTable":true,"fanNum":0,"maxPlayer":3,"uids":[1000142,1000140,1000141],"owner":1000142,"maxHunNum":4,"tableid":"263555","cardNext":61,"winner":-1,"zhuang":2,"curPlayer":2,"lastPutPlayer":2,"putType":1,"lastDrawPlayer":2,"tState":6,"lastPutCard":3,"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":1000140,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"datuoNum":0,"mingCard":0,"areaSelectMode":{"maxPlayer":3,"payWay":0,"isHongheidian":true,"isTianDiHu":true,"isLianZhuang":true,"fengDing":-1,"zuoXing":false},"minHuxi":10,"gameCnName":"ÉÛÑô°þÆ¤","hasReadyBtn":true,"hunCard":-1,"currCard":-1,"drawType":0,"isLastDraw":true,"lastPlayer":2,"isFirstPut":false,"hasPay":true,"hePai":false,"roundNumPre":99},"cards":[29,27,8,2,29,2,30,23,5,21,28,24,1,23,6,7,28,9,10,1,22,30,4,27,4,5,25,23,10,4,5,21,23,5,30,28,7,1,24,25,3,3,3,22,4,21,2,2,9,10,7,26,27,8,7,26,29,26,6,9,3,29,8,6,24,8,25,21,26,22,30,28,10,22,6,27,9,1,25,24],"hunCard":-1,"roundEndTime":"2018-04-26 13:35:18","isDismiss":true,"playInfo":{"gametype":2018074,"owner":1000142,"money":20,"now":"2018-04-26 13:35:18","tableid":"263555","players":[{"uid":1000140,"winall":0,"nickname":"%u6E38%u5BA2140","money":0},{"uid":1000141,"winall":29,"nickname":"%u6E38%u5BA2141","money":40},{"uid":1000142,"winall":0,"nickname":"%u6E38%u5BA2142","money":60}]}};
        var endallui = ccs.load("endAll_YZPHZ.json");
        BindUiAndLogic(endallui.node,this.jsBind);
        this.addChild(endallui.node);
        MjClient.endallui=this;

        var _block = endallui.node.getChildByName("block");
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
        /*
            changed by sking
         */
        var _back = endallui.node.getChildByName("back");
        setWgtLayout(_back,[1,1],[0.5,0.5],[0,0]);
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            setWgtLayout(_back,[1,1],[0.5,0.5],[0, 0]);
        }

        //分享
        var _share =  _back.getChildByName("share");
        var tData = MjClient.data.sData.tData;
        _share.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;

        //_share.x = 713.24;//屏蔽再来一局的时候，坐标要移动一下
        _share.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        COMMON_UI.getShareCodeTexture(tData.tableInfoUrl,_back,function(){
                            cc.log("====================capture_screen=======================");
                            postEvent("capture_screen");
                            if(MjClient.endallui && cc.sys.isObjectValid(MjClient.endallui)){
                                MjClient.endallui.capture_screen = true;
                            }
                            _share.setTouchEnabled(false);
                        });
                    });
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fanxiang",  {uid:SelfUid(),gameType:MjClient.gameType});
                    break;
                default :
                    break;
            }
        },this);
        var clubInfoTable = getClubInfoInTable();

        // 如果是亲友圈的房间显示亲友圈图标及名称
        var image_title = _back.getChildByName("Image_title");
        var clubNode = _back.getChildByName("Image_club");
        if (clubInfoTable && typeof(clubInfoTable.clubAvatar) != "undefined" && clubInfoTable.clubId && clubNode != null)
        {
            if (image_title)
                image_title.setVisible(false);

            var clubName = clubNode.getChildByName("Text_name");
            clubName.ignoreContentAdaptWithSize(true);
            clubName.setString("" + unescape(clubInfoTable.clubTitle));

            var _nameStr = unescape(clubInfoTable.ruleName);
            var _ruleName = clubName.clone();
            _ruleName.ignoreContentAdaptWithSize(true);
            _ruleName.setString(_nameStr);
            _ruleName.y = clubName.y + clubName.height/2 + _ruleName.height/2;
            _ruleName.x = clubName.x;
            clubNode.addChild(_ruleName);

            cc.loader.loadImg(clubInfoTable.clubAvatar ? clubInfoTable.clubAvatar : "png/default_headpic.png", {
                isCrossOrigin: true
            }, function(err, texture) {
                if (err || !texture || !sys.isObjectValid(clubNode))
                    return;

                var sp = new cc.Sprite(texture);
                if (!sp)
                    return;

                sp.setScale((clubNode.width - 8) / sp.width);
                sp.setPosition(cc.p(clubNode.width / 2, clubNode.height / 2));
                clubNode.addChild(sp);
            });
        }
        else if (clubNode != null)
        {
            clubNode.setVisible(false);
        }

        //信息 说明
        var _infoMation =  _back.getChildByName("infoMation");
        _infoMation.visible = true;
        function _infoText(){
            var sData=MjClient.data.sData;
            var tData=sData.tData;
            var text = "";

            if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI){
                text += "扯胡子三人场,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_ER){
                text += "扯胡子二人场,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR){
                text += "四人场(坐醒),";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.LUO_DI_SAO){
                text += "落地扫,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King){
                text += "四王扯胡子,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
                text += "四王坐醒,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King){
                text += "四王单挑场,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ){
                text += "耒阳字牌,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG){
            	text += "六胡抢,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA){
            	text += "十胡卡,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI){
                text += "衡阳十五胡,";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.JIANG_YONG_15Z){
                text += "江永十五张";
            }if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI){
                text += "邵阳字牌,";
            }if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                text += "邵阳剥皮,";
            }

            if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King || 
                MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King ||
                MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King){
                text += MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King ? "" : "四王,";
                text += (tData.areaSelectMode.isKing == true) ? "按王限胡," : "按番限胡," ;
            }else if(MjClient.gameType != MjClient.GAME_TYPE.ZP_LY_CHZ && 
                    MjClient.gameType != MjClient.GAME_TYPE.HY_LIU_HU_QIANG && 
                    MjClient.gameType != MjClient.GAME_TYPE.HY_SHI_HU_KA &&
                    MjClient.gameType != MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI && 
                    MjClient.gameType != MjClient.GAME_TYPE.SHAO_YANG_BO_PI && 
                    MjClient.gameType != MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI){
                text += (tData.areaSelectMode.kingNum == 0) ? "无王," :(tData.areaSelectMode.kingNum == 1) ? "单王," : (tData.areaSelectMode.kingNum == 2)?"双王,":"三王,";
            }
            if(MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ){
                text += (tData.areaSelectMode.jushou) ? "举手做声," : "" ;
                text += (tData.areaSelectMode.budaihu) ? "不带无胡," : "带无胡," ;
                text += (tData.areaSelectMode.budaiyihong) ? "不带一点红," : "带一点红," ;
                text += (tData.areaSelectMode.isPutLimit) ? "吃边打边," : "" ;
                text += (MjClient.MaxPlayerNum_leiyang == 3) ? "三人" : ((MjClient.MaxPlayerNum_leiyang == 2) ? "二人" : "四人");
                text += (tData.areaSelectMode.trustTime > 0) ? ("," + Math.floor(tData.areaSelectMode.trustTime / 60) + "分钟后托管") : "";
                text += (tData.areaSelectMode.isManualCutCard) ? ",手动切牌" : ",系统切牌" ;
                text += tData.areaSelectMode.fanBei == 1 ? ",小于" + tData.areaSelectMode.fanBeiScore + "分翻倍" : "";
                text += ",底分" + tData.areaSelectMode.jieSuanDiFen;
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG){
                text += (tData.areaSelectMode.xiNum == 6) ? "6息," : (tData.areaSelectMode.xiNum == 9) ? "9息," : "15息," ;
                text += (tData.areaSelectMode.suanfenType == 0) ? "" : (tData.areaSelectMode.suanfenType == 1) ? "底分2分," : "1息1囤,";
                text += ["有胡必胡," , "点炮必胡,", " "][tData.areaSelectMode.bihuType] ;
                text += (tData.areaSelectMode.isMingwei) ? "明偎,\n" : "\n" ;
                text += (tData.areaSelectMode.isYiwushi) ? "一五十," : "" ;
                text += (tData.areaSelectMode.isHongheidian) ? "红黑点," : "" ;

                text += (tData.areaSelectMode.isTiandihu) ? "天地胡," : "" ;
                text += (tData.areaSelectMode.isTianhu) ? "天胡," : "" ;
                text += (tData.areaSelectMode.isDihu) ? "地胡," : "" ;
                text += (tData.areaSelectMode.isMaiPai) ? "埋牌20张," : "" ;
                text += (tData.areaSelectMode.is21Zhang) ? "21张," : "" ;
                text += (tData.areaSelectMode.xingType == 0) ? "不带醒," : (tData.areaSelectMode.xingType == 2) ? "翻醒," : "随醒," ;
                text += (MjClient.MaxPlayerNum_leiyang == 3) ? "三人" : (MjClient.MaxPlayerNum_leiyang == 2) ? "二人" : "三人";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA){
                text += ["有胡必胡," , "点炮必胡,", " "][tData.areaSelectMode.bihuType] ;
                if(tData.areaSelectMode.isHongheidian){
                    text += "红黑点,";
                    text += (tData.areaSelectMode.hongziType == 0) ? "10红3倍13红5倍," : "10红3倍多一红+3胡," ;
                } 
                text += ["3倍,", "2倍,", "1倍," ][tData.areaSelectMode.fangpaoType];
                text += (tData.areaSelectMode.isErfen) ? "底分2分," : "" ;
                text += (tData.areaSelectMode.isYiwushi) ? "一五十," : "" ;
                text += (tData.areaSelectMode.isTiandihu) ? "天地胡," : "" ;
                text += (tData.areaSelectMode.isTianhu) ? "天胡," : "" ;
                text += (tData.areaSelectMode.isDihu) ? "地胡," : "" ;
                text += (tData.areaSelectMode.isHaidihu) ? "海底胡," : "" ;
                text += (tData.areaSelectMode.isPiaoHu) ? "飘胡," : "" ;
                text += (tData.areaSelectMode.isMaiPai) ? "埋牌20张," : "" ;
                text += (tData.areaSelectMode.isHuLiangZhang) ? "可胡示众牌," : "" ;
                text += (tData.areaSelectMode.isYiHongSanBei) ? "一点红三倍," : "" ;
                text += (tData.areaSelectMode.isZiMoFanBei) ? "自摸翻倍," : "" ;
                text += (tData.areaSelectMode.xingType == 0) ? "不带醒," : (tData.areaSelectMode.xingType == 2) ? "翻醒," : "随醒," ;
                text += (MjClient.MaxPlayerNum_leiyang == 3) ? "三人" : "二人";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI){
                text += (tData.areaSelectMode.huXiType == 3)?"3息一囤":"5息一囤";
            }else if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                var arr = ["", "一", "二", "三", "四"];
                text += arr[tData.areaSelectMode.maxPlayer] + "人";
                text += tData.areaSelectMode.isHongheidian ? ",红黑点" : "";
                text += tData.areaSelectMode.isTianDiHu ? ",天地胡" : "";
                if(tData.areaSelectMode.isLianZhuang){
                    text += ",可连庄";
                    if(tData.areaSelectMode.fengDing == -1){
                        text += ",不封顶"
                    }else{
                        text += "," + tData.areaSelectMode.fengDing + "胡封顶"
                    }
                    
                }
            }else if(MjClient.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI){
                text += (tData.areaSelectMode.bihuType == 0) ? "有胡必胡," : (tData.areaSelectMode.bihuType == 1) ? "点炮必胡," : "无点炮胡,";
                text += (tData.areaSelectMode.xingType == 0) ? "不带醒\n" : (tData.areaSelectMode.xingType == 2) ? "翻醒\n" : "随醒\n" ;
                text += (tData.areaSelectMode.isErfen) ? "底分2分," : "" ;
                text += (tData.areaSelectMode.isZiMoRate) ? "自摸翻倍," : "" ;
                text += (tData.areaSelectMode.isHongheidian) ? "红黑胡," : "" ;
                text += (tData.areaSelectMode.isAlldemit) ? "解散须全部人同意," : "" ;
                text += "三人";
            }else {
                text += (tData.areaSelectMode.isGenXing == true) ? "跟醒," : "翻醒,";
                text += (tData.areaSelectMode.isFanXing == 1) ? "单醒," : "双醒,";
                text += (tData.areaSelectMode.hongZhuan == true) ? "红转朱黑," : "";
                text += (tData.areaSelectMode.fengDing == -1) ? "无上限," : (tData.areaSelectMode.fengDing == 300)?"300分封顶,":"600分封顶,";
                text += (MjClient.gameType != MjClient.GAME_TYPE.PAO_HU_ZI_LR_King && MjClient.MaxPlayerNum_zplychz == 3) ? "三人" : ((MjClient.MaxPlayerNum_zplychz == 2) ? "二人" : "四人");
            }

            if(MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || 
                MjClient.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA){
                text += ",房间号:"+tData.tableid;
            }else{
                text += "\n房间号:"+tData.tableid;
            }
            

            if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                text += "";
            }else{
                text += ",局数:"+tData.roundAll+"局";
            }
            return text;
        }
        _infoMation.setString(_infoText());
        if(MjClient.getAppType() != MjClient.APP_TYPE.QXYZQP && MjClient.getAppType() != MjClient.APP_TYPE.QXYYQP && MjClient.getAppType() != MjClient.APP_TYPE.YLHUNANMJ){
            _infoMation.ignoreContentAdaptWithSize(true);
        }




        //解散信息 说明
        var _infoMation_1 =  _back.getChildByName("infoMation_1");
        _infoMation_1.visible = true;
        function _info1Text(){
            var sData=MjClient.data.sData;
            var tData=sData.tData;
            var text = "";

            //描述结算
            if (MjClient.isDismiss)
            {
                var id = tData.firstDel;
                var pl = sData.players[id];
                if(pl) {
                    var name  =  unescape(pl.info.nickname);
                    var delStr = name + pl.mjdesc[0];
                    text += "" + delStr;
                } else {
                    text += "" + '会长解散';
                }
            }
            return text;
        }
        _infoMation_1.setString(_info1Text());


        //时间
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString("");
        cc.log("MjClient.roundEndTime == " + MjClient.roundEndTime);

        if(MjClient.roundEndTime){
            _time.setString(MjClient.roundEndTime);
        }else {
            _time.setString("");
        }
        _time.ignoreContentAdaptWithSize(true);


        var nantongReplay = function() {
            var tData = MjClient.data.sData.tData;
            var para = tData.areaSelectMode;
            var inviteVipTable = MjClient.data.inviteVipTable;
            para.maxPlayer = tData.maxPlayer;
            para.gameType = tData.gameType;
            MjClient.showMsg("是否再来一局？", function () {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zailaiyiju", {uid:SelfUid(),gameType:para.gameType});

                if (inviteVipTable)
                {
                    MjClient.joinGame(inviteVipTable);
                }
                else
                {
                    MjClient.createRoom(para, tData.roundAll, tData.areaSelectMode.payWay, function (rtn)
                    {
                        if(rtn.result==0)
                        {
                            MjClient.rematchInfo(MjClient.data.vipTable, tData.uids);
                        }
                    });
                }
            }, function(){}, "1", "nantongReplay");
        };

        //close ,关闭
        var _close1 =  _back.getChildByName("close");
        _close1.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Tuichu", {uid:SelfUid(),gameType:MjClient.gameType});
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP && !tData.matchId)//南通APP再来一局退出到主界面再提示
                        nantongReplay();

                    var tData = MjClient.data.sData.tData;
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable && !(MjClient.rePlayVideo >= 0 && MjClient.replayui)) {
                        if (!MjClient.FriendCard_main_ui)
                            MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                    }

                    // MjClient.leaveGame();
                    //这里的leaveGame肯定会返回{"result":0,"msg":"alreadyLeave"}，所以不用等待返回后再继续，为了优化永州垃圾网络
                    //MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.gamenet.request("pkplayer.handler.LeaveGame",{},function(rtn){});
                    delete MjClient.data.sData;
                    delete MjClient.gameType;
                    postEvent("LeaveGame");
                    if(MjClient.rePlayVideo >= 0 && MjClient.replayui){
                        MjClient.replayui.replayEnd();
                    }
                    

                    if(MjClient.endallui){
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }
                    break;
                default :
                    break;
            }
        },this);



        //再来一局
        var _btnReplay =  _back.getChildByName("btnReplay");
        var tData = MjClient.data.sData.tData;
        _btnReplay.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;

        _btnReplay.visible = false;  //屏蔽再来一局

        _btnReplay.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP)//南通APP再来一局退出到主界面再提示
                    {
                        nantongReplay();
                        MjClient.leaveGame();
                        if(MjClient.endallui){
                            MjClient.endallui.removeFromParent(true);
                            MjClient.endallui = null;
                        }

                    }
                    else
                    {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zailaiyiju", {uid:SelfUid(),gameType:MjClient.gameType});
                        if (MjClient.data.inviteVipTable)
                        {
                            MjClient.leaveGame(function()
                            {
                                MjClient.joinGame(MjClient.data.inviteVipTable);
                            });
                        }
                        else
                        {
                            MjClient.reCreateRoom();
                        }
                    }
                    break;
                default :
                    break;
            }
        },this);

        //复制战绩
        addCopyBtnToGameOverLayer(endallui.node);

        var self = this;
        if(tData.matchId){
            _close1.setVisible(false);
            // function delayExe()
            // {
            //   self.addChild(new roundEndLayer(),500);
            // }
            // this.runAction(cc.sequence(cc.DelayTime(3),cc.callFunc(delayExe)));
            var endTitle = _back.getChildByName("end_title");
            endTitle.loadTexture("winGame/BL_jieshu.png");

            var _btnReplay =  _back.getChildByName("roundEndText");
            _btnReplay.setVisible(true);
        }
        var textNum =  _back.getChildByName("Text_num");
        var text3 =  _back.getChildByName("Text_3");
        var text5 =  _back.getChildByName("Text_5");
        UIEventBind(null,this,"leftTable",function(data){
            //num.setString(self._data.condition - data.signUpCount);
            textNum.setString(data.leftTable);
            textNum.setVisible(true);
            text3.setVisible(true);
            text5.setVisible(true);
        })

        //四个玩家的详细信息
        var infoBg = _back.getChildByName("infoBg");
        var infoBgSize = infoBg.getCustomSize();

        var info = infoBg.getChildByName("info");
        info.visible = false;
        var bgSize = info.getCustomSize();
        var sData = MjClient.data.sData;
        var players = sData.players;
        var playerCount = Object.keys(players).length;


        var startPos = cc.p((infoBgSize.width - bgSize.width*(playerCount - 1) - 8*(playerCount + 1))/2,infoBgSize.height/2);
        var clone = null;
        for(var i = 0 ; i < playerCount ; i++){
            clone = info.clone();
            clone.visible = true;
            clone.setPosition(startPos);
            infoBg.addChild(clone);
            SetGameOverLayer_zplychz(clone,i);

            COMMON_UI.addGameOverNotSameClubUI(clone,MjClient.getPlayerByIndex(i))
            
            startPos = cc.p(startPos.x + bgSize.width + 18 , startPos.y);
        }
        return true;
    },
    onEnter:function()
    {
        this._super();
        if (MjClient.homeui && MjClient.systemConfig.rankEnable == "true")
        {
            MjClient.homeui.gameRankLayer();
        }
    }
});

//跑胡子(设置单个玩家的信息)
function SetGameOverLayer_zplychz(node,off){
    var sData=MjClient.data.sData;
    var tData=sData.tData;
    var pl=MjClient.getPlayerByIndex(off);
    if(!pl){
        node.setVisible(false);
        return;
    }
    var uidSelf = SelfUid();
    var MaxWinAll=0;
    var MaxDianPao=0;
    var MaxlosePlayer = null;
    var MaxWinPlayer = null;
    var MaxloseAll = 999999999;

    setDismissTypeImg(pl,node,0.5,0.3,"chang");

    //计算所有人数据
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            if (MaxWinAll < pi.winall) {
                MaxWinAll = pi.winall;
                MaxWinPlayer = uid;

            }else if (MaxWinAll == pi.winall) {
                if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                    MaxWinAll = pi.winall;
                    MaxWinPlayer = uid;
                }
            }
            if (pi.winall < MaxloseAll) {
                MaxloseAll = pi.winall;
                MaxlosePlayer = uid;
            }else if (pi.winall == MaxloseAll) {
                if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                    MaxloseAll = pi.winall;
                    MaxlosePlayer = uid;
                }
            }
        }
    }
    // setDismissTypeImg(pl,node,0.5,0.19,"chang");

    var uibind={
        name:{
            _text:function(){
                if(!pl){
                    return "";
                }
                return unescape(pl.info.nickname)+"";
            }
        },
        id: {
            _run:function(){
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                if(!pl){
                    return "";
                }
                return "" + pl.info.uid.toString();
            }
        },
        allscore:{
            winNum1:{
            },
            winNum2:{
            },
            bigWinner:{
                _visible : false
            }
        },
        huxiBg:{
            _visible:function(){
                if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                    return true;
                }
                return false;
            },
            score:{
                _run:function(){
                    if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                        this.setString(pl.winall);
                    }
                }
            }
        },
        listView:{
            _run:function(){
                var pos = this.getPosition();
                if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                    this.setPosition(cc.p(pos.x, pos.y - 46));
                }
                this.setScrollBarEnabled(false);
                var itemModel = this.children[0];
                this.setItemModel(itemModel);
                this.removeAllChildren();
                var tableMsg = pl.tableMsg;
                var listView = this;
                for(var i = 0;i < tableMsg.length;i++){
                    listView.pushBackDefaultItem();
                    var children = listView.children;
                    var insertItem = children[children.length-1];
                    insertItem.getChildByName("title").setString("第"+(i+1)+"局");
                    insertItem.getChildByName("score").setString(tableMsg[i]);
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                        if(pl.winall == MaxWinAll && pl.winall != 0){
                            insertItem.getChildByName("score").setTextColor(cc.color("#a80e0e"));
                        }
                    }
                    if(tableMsg[i]>0){
                        insertItem.getChildByName("score").setString("+"+tableMsg[i]);
                    }
                    // if(pl.winall > 0){
                    //     insertItem.getChildByName("title").setTextColor(cc.color("#a3544a"));
                    //     insertItem.getChildByName("score").setTextColor(cc.color("#a3544a"));
                    // }else {
                    //     insertItem.getChildByName("title").setTextColor(cc.color("#4a88a0"));
                    //     insertItem.getChildByName("score").setTextColor(cc.color("#4a88a0"));
                    // }
                    insertItem.getChildByName("title").ignoreContentAdaptWithSize(true);
                    insertItem.getChildByName("score").ignoreContentAdaptWithSize(true);
                }
            
            }
        },
    };

    var wxNode = node.getChildByName("head");
    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
        addWxHeadToEndUI_zplychz(wxNode,off);
    }else if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ){
        CircularCuttingHeadImg(wxNode, pl);
    }else{
        addWxHeadToEndUI(wxNode,off);
    }
    BindUiAndLogic(node,uibind);
    // node.getChildByName("fangzhu").visible =false;
    if(!pl)
    {
        uibind.allscore.visible = false;
        node.getChildByName("fangzhu").visible =false;
        return;
    }

    var numValue = Math.abs(pl.winall) + "";
    if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
        numValue = Math.abs(pl.winScore) + "";
    }
    
    uibind.allscore.visible = true;
    uibind.allscore.bigWinner._node.visible = false;
 
    if (pl.winall > 0) {
        var nodeParent = node.getParent().getParent();
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
            node.loadTexture("gameOver/zipai_winbg.png");
            var scoreBg = node.getChildByName("scoreBg");
            if(scoreBg){
                scoreBg.loadTexture("gameOver/huangBg.png");
            }
        }else if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ){
            if(pl.winall == MaxWinAll && pl.winall != 0){
                node.loadTexture("gameOver/over_box_1.png");
            }  
        }else{
            node.loadTexture("gameOver/pjjs_12.png");
            node.getChildByName("allscore").loadTexture("gameOver/pjjs_14.png");

            var scoreBg = node.getChildByName("scoreBg");
            if(scoreBg){
                scoreBg.loadTexture("gameOver/huangBg.png");
            }
        }
    } else {
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
            node.loadTexture("gameOver/zipai_loserbg.png");
            var scoreBg = node.getChildByName("scoreBg");
            if(scoreBg){
                scoreBg.loadTexture("gameOver/huangBg.png");
            }
        }else if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ){
            //do nothing
        }else{
            node.loadTexture("gameOver/pjjs_9.png");
            node.getChildByName("allscore").loadTexture("gameOver/pjjs_14.png");

            var scoreBg = node.getChildByName("scoreBg");
            if(scoreBg){
                scoreBg.loadTexture("gameOver/lanBg.png");
            }
        }
    }

    var winNum1 = node.getChildByName("allscore").getChildByName("winNum1");
    winNum1.ignoreContentAdaptWithSize(true);
    winNum1.setString(pl.winall + "");
    if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
        winNum1.setString(pl.winScore);
    }
    
    var winNum2 = node.getChildByName("allscore").getChildByName("winNum2");
    winNum2.ignoreContentAdaptWithSize(true);
    winNum2.setString(pl.winall + "");
    if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
        winNum2.setString(pl.winScore);
    }
    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
        winNum2.setString(Math.abs(pl.winall));
    }
    // winNum1.setContentSize(cc.size(numValue.length *33,48));
    // winNum2.setContentSize(cc.size(numValue.length *33,48));
    // if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP)
    // {
    //     winNum1.setContentSize(cc.size(numValue.length *33,62));
    //     winNum2.setContentSize(cc.size((numValue.length + 1) * 33,62));
    // }
    
    if(MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
       if(pl.winScore > 0){
            winNum1.visible = true;
            winNum2.visible = false;
        }else {
            winNum1.visible = false;
            winNum2.visible = true;
        }
    }else{
        if(pl.winall > 0){
            winNum1.visible = true;
            winNum2.visible = false;
        }else {
            winNum1.visible = false;
            winNum2.visible = true;
        }
    }
    
    //最高得分
    var nodeParent = node.getParent().getParent();
    var _share = nodeParent.getChildByName("share");
    var _shine = _share.getChildByName("img_shine");
    var _point = _share.getChildByName("img_point");
    var _txt = _share.getChildByName("img_txt");
    if(pl.winall == MaxWinAll && pl.winall != 0){
        uibind.allscore.bigWinner._node.visible = true;
        var act_Func = function() {
            var a = cc.scaleTo(0.5, 1.0);
            var aa = cc.fadeIn(0.5);
            var a1 = cc.scaleTo(1.0, 4);
            var a2 = cc.fadeOut(1.0);
            var act_2 = cc.rotateBy(0.8, 30);
            var act_3 = cc.rotateBy(0.8, -30);
            var a3 =  cc.callFunc(function() {
                _shine.setScale(1);
            }.bind(_shine));
            _shine.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2),a3,cc.delayTime(0.1)).repeatForever());
            _point.runAction(cc.sequence(act_2, act_3).repeatForever());

        }
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && pl.info.uid == SelfUid()) {
            _shine.setVisible(false);
            _point.setVisible(false);
            _txt.setVisible(false);
            act_Func();
        }
        
    }

    AddFangKaIcon(sData, uibind.allscore._node, tData, pl, MaxWinAll, MaxWinPlayer,  MaxloseAll, MaxlosePlayer, cc.p(30, 425));

    if (tData.owner == pl.info.uid)
    {
        node.getChildByName("fangzhu").visible =true;
    }
    else{
        node.getChildByName("fangzhu").visible =false;
    }

    if(tData.isFanBei){
        var fanBei_text = node.getChildByName("fanBei");
        fanBei_text.visible = true;
        fanBei_text.setString("( " + pl.winall * 0.5 + " x2 )");
        fanBei_text.ignoreContentAdaptWithSize(true);
        if(pl.winall < 0){
            fanBei_text.setTextColor(cc.color(165,255,255));
            fanBei_text.enableOutline(cc.color(66,60,102), 2);
        }
    }
}