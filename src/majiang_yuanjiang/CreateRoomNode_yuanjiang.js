/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_yuanjiang = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_yuanjiang_yiziqiao                  = "_yuanjiang_yiziqiao";        
        this.localStorageKey.KEY_yuanjiang_zhuang               = "_yuanjiang_ZHUANG";        
        this.localStorageKey.KEY_yuanjiang_menqing              = "_yuanjiang_menqing";       
        this.localStorageKey.KEY_yuanjiang_mamahu                   = "_yuanjiang_mamahu"
        this.localStorageKey.KEY_yuanjiang_kaqiao                    = "_yuanjiang_kaqiao";        
        this.localStorageKey.KEY_yuanjiang_count                     = "_yuanjiang_COUNT";           
        this.localStorageKey.KEY_yuanjiang_fanshu                   = "_yuanjiang_fanshu";       
        this.localStorageKey.KEY_yuanjiang_difen                     = "_yuanjiang_difen";             
        this.localStorageKey.KEY_yuanjiang_tuoguan                  = "_yuanjiang_tuoguan"; 
        this.localStorageKey.KEY_yuanjiang_isOpenTingTip             = "_yuanjiang_isOpenTingTip";
        this.localStorageKey.KEY_yuanjiang_guohuzimo             = "_yuanjiang_guohuzimo";
        this.localStorageKey.KEY_yuanjiang_zhuaniao             = "_yuanjiang_zhuaniao";
        this.localStorageKey.KEY_yuanjiang_qiduimenqing             = "_yuanjiang_qiduimenqing";
        this.localStorageKey.KEY_yuanjiang_fanbei                    = "_yuanjiang_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_yuanjiang_fanbeiscore               = "_yuanjiang_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_yuanjiang_haidikeqianggang               = "_yuanjiang_haidikeqianggang";  //海底牌可抢杠胡 
        this.localStorageKey.KEY_yuanjiang_trustWay              = "_yuanjiang_TRUST_WAY"; // 托管方式 
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_yuanjiang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_yuanjiang").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_yuanjiang");
    },
    initPlayNode: function() {
        var _bgYJNode = this.bg_node;
        var _play = _bgYJNode.getChildByName("play");
         //坐庄
        this.play_FZzuozhuang = _play.getChildByName("play_FZzuozhuang");
        this.play_SJzuozhuang = _play.getChildByName("play_SJzuozhuang");
        var zhuangList = [];
        zhuangList.push(this.play_FZzuozhuang);
        zhuangList.push(this.play_SJzuozhuang);
        this._playNode_zhuang_radio = createRadioBoxForCheckBoxs(zhuangList,this.radioBoxSelectCB);
        this.addListenerText(zhuangList,this._playNode_zhuang_radio);
        this.zhuangList = zhuangList;



        //
        this.play_meixi = _play.getChildByName("play_meixi");
        this.play_youxi = _play.getChildByName("play_youxi");
        var yiziqiaoList = [];
        yiziqiaoList.push(this.play_meixi);
        yiziqiaoList.push(this.play_youxi);
        this._playNode_yiziqiao_radio = createRadioBoxForCheckBoxs(yiziqiaoList,this.radioBoxSelectCB);
        this.addListenerText(yiziqiaoList,this._playNode_yiziqiao_radio);
        this.yiziqiaoList = yiziqiaoList;

        this.play_zhuaniao1 = _play.getChildByName("play_zhuaniao1");
        this.play_zhuaniao2 = _play.getChildByName("play_zhuaniao2");
        var zhuaniaoList = [];
        zhuaniaoList.push(this.play_zhuaniao1);
        zhuaniaoList.push(this.play_zhuaniao2);
        this._playNode_zhuaniao_radio = createRadioBoxForCheckBoxs(zhuaniaoList,this.radioBoxSelectCB);
        this.addListenerText(zhuaniaoList,this._playNode_zhuaniao_radio);
        this.zhuaniaoList = zhuaniaoList;

                //
        this.play_24fan = _play.getChildByName("play_24fan");
        this.addListenerText(this.play_24fan);
        this.play_24fan.addEventListener(this.clickCB, this.play_24fan);

        this.play_menqing = _play.getChildByName("play_menqing");
        this.addListenerText(this.play_menqing);
        this.play_menqing.addEventListener(this.clickCB, this.play_menqing);

        this.play_guohuzimo = _play.getChildByName("play_guohuzimo");
        this.addListenerText(this.play_guohuzimo);
        this.play_guohuzimo.addEventListener(this.clickCB, this.play_guohuzimo);

        this.play_qiduimenqing = _play.getChildByName("play_qiduimenqing");
        this.addListenerText(this.play_qiduimenqing);
        this.play_qiduimenqing.addEventListener(this.clickCB, this.play_qiduimenqing);

        this.play_mamahu = _play.getChildByName("play_mamahu");
        this.addListenerText(this.play_mamahu);
        this.play_mamahu.addEventListener(this.clickCB, this.play_mamahu);

        this.play_haidikeqianggang = _play.getChildByName("play_haidikeqianggang");
        this.addListenerText(this.play_haidikeqianggang);
        this.play_haidikeqianggang.addEventListener(this.clickCB, this.play_haidikeqianggang);

        this.play_kaqiao = _play.getChildByName("play_kaqiao");
        this.addListenerText(this.play_kaqiao);
        this.play_kaqiao.addEventListener(this.clickCB, this.play_kaqiao);

        var that = this;
        this.play_youxi.schedule(function() {
            if(that.play_youxi.isSelected())
            {
                that.play_kaqiao.visible = true;
            }
            else
            {
                that.play_kaqiao.visible = false;
            }
        })

        this.play_menqing.schedule(function() {
            if(that.play_menqing.isSelected())
            {
                that.play_qiduimenqing.visible = true;
            }
            else
            {
                that.play_qiduimenqing.visible = false;
            }
        })

        this._zhuIdx = 1;
        this._ZhuNum = _bgYJNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgYJNode.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx <= 0.1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0) {
                        var step = 0.1;

                        if (this._zhuIdx > 1)
                            step = 1;
                        else if (this._zhuIdx > 0.5)
                            step = 0.5;

                        this._zhuIdx -= step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = _bgYJNode.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        var step = 0.1;

                        if (this._zhuIdx >= 1)
                            step = 1;
                        else if (this._zhuIdx >= 0.5)
                            step = 0.5;

                        this._zhuIdx += step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));
        this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);
    
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, function(index){
            this.radioBoxSelectCB(index, tuoguanNodeList[index], tuoguanNodeList);
            this.setTrustWayPanel(index);
        }.bind(this));
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio, this.setTrustWayPanel.bind(this));
        this.tuoguanNodeList = tuoguanNodeList;

        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);

        if (_play.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_play.getChildByName("play_lessthan"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        //托管方式
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() && _play.getChildByName("tuoguanType_0")){
            this.trustWatTitle = _play.getChildByName("img_tuoGuanFangShiTip");
            this._playNode_tuoguanWay0 = _play.getChildByName("tuoguanType_0");
            this._playNode_tuoguanWay1 = _play.getChildByName("tuoguanType_1");
            this._playNode_tuoguanWay2 = _play.getChildByName("tuoguanType_2");
            var tuoguanWayNodeList = [];
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_0"));
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_1"));
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_2"));
            this._playNode_player_tuoguanType_radio = createRadioBoxForCheckBoxs(tuoguanWayNodeList, this.radioBoxSelectCB);
            this.addListenerText(tuoguanWayNodeList, this._playNode_player_tuoguanType_radio);
            this.tuoguanWayNodeList = tuoguanWayNodeList;
        }
    },

    setTrustWayPanel: function(trustTimeIdx){
        if(!this.tuoguanWayNodeList) return;
        this.trustWatTitle.visible = trustTimeIdx != 0;
        for(var i = 0; i < this.tuoguanWayNodeList.length; i++){
            this.tuoguanWayNodeList[i].visible =  trustTimeIdx != 0;
        }
    },

    setPlayNodeCurrentSelect: function(isClub) {

        var _zhuang;
        if (isClub)
            _zhuang = this.getNumberItem("zhuang", 1);
        else
            _zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_zhuang, 1);
        this._playNode_zhuang_radio.selectItem(_zhuang);
        this.radioBoxSelectCB(_zhuang, this.zhuangList[_zhuang], this.zhuangList);

        var _yiziqiao;
        if (isClub)
            _yiziqiao = this.getNumberItem("yiziqiao", 1);
        else
            _yiziqiao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_yiziqiao, 1);
        this._playNode_yiziqiao_radio.selectItem(_yiziqiao);
        this.radioBoxSelectCB(_yiziqiao, this.yiziqiaoList[_yiziqiao], this.yiziqiaoList);

        var _zhuaniao;
        if (isClub)
            _zhuaniao = [1,2].indexOf(this.getNumberItem("zhuaniao", 0));
        else
            _zhuaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_zhuaniao, 0);
        this._playNode_zhuaniao_radio.selectItem(_zhuaniao);
        this.radioBoxSelectCB(_zhuaniao, this.zhuaniaoList[_zhuaniao], this.zhuaniaoList);

        var _fanshu;
        if (isClub)
            _fanshu = this.getBoolItem("fanshu", true);
        else
            _fanshu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_fanshu, true);
        this.play_24fan.setSelected(_fanshu);
        var text = this.play_24fan.getChildByName("text");
        this.selectedCB(text, _fanshu)

        var _menqing;
        if (isClub)
            _menqing = this.getBoolItem("menqing", true);
        else
            _menqing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_menqing, true);
        this.play_menqing.setSelected(_menqing);
        var text = this.play_menqing.getChildByName("text");
        this.selectedCB(text, _menqing)

        var _guohuzimo;
        if (isClub)
            _guohuzimo = this.getBoolItem("guohuzimo", false);
        else
            _guohuzimo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_guohuzimo, false);
        this.play_guohuzimo.setSelected(_guohuzimo);
        var text = this.play_guohuzimo.getChildByName("text");
        this.selectedCB(text, _guohuzimo)

        var _qiduimenqing;
        if (isClub)
            _qiduimenqing = this.getBoolItem("qiduimenqing", false);
        else
            _qiduimenqing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_qiduimenqing, false);
        this.play_qiduimenqing.setSelected(_qiduimenqing);
        var text = this.play_qiduimenqing.getChildByName("text");
        this.selectedCB(text, _qiduimenqing)

        var _mamahu;
        if (isClub)
            _mamahu = this.getBoolItem("mamahu", false);
        else
            _mamahu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_mamahu, false);
        this.play_mamahu.setSelected(_mamahu);
        var text = this.play_mamahu.getChildByName("text");
        this.selectedCB(text, _mamahu)

        var _haidikeqianggang;
        if (isClub)
            _haidikeqianggang = this.getBoolItem("haidikeqianggang", true);
        else
            _haidikeqianggang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_haidikeqianggang, true);
        this.play_haidikeqianggang.setSelected(_haidikeqianggang);
        var text = this.play_haidikeqianggang.getChildByName("text");
        this.selectedCB(text, _haidikeqianggang)

        var _kaqiao;
        if (isClub)
            _kaqiao = this.getBoolItem("kaqiao", true);
        else
            _kaqiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_kaqiao, true);
        this.play_kaqiao.setSelected(_kaqiao);
        var text = this.play_kaqiao.getChildByName("text");
        this.selectedCB(text, _kaqiao)

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        var index = 0;
        if (_trustTime == 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime == 60) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime == 120) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime == 180) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yuanjiang_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //托管方式
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() &&  this.tuoguanWayNodeList){
            var trustWay;
            if(isClub){
                trustWay = this.getNumberItem("trustWay", 0);
            }else{
                trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yuanjiang_trustWay, 0);
            }
            this._playNode_player_tuoguanType_radio.selectItem(trustWay);
            this.radioBoxSelectCB(trustWay, this.tuoguanWayNodeList[trustWay], this.tuoguanWayNodeList);
            this.setTrustWayPanel(index);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUAN_JIANG_MJ;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuang = 0;//0:庄家 1:随机
        para.yiziqiao = 0;// 
        para.fanshu = 0;//
        para.menqing = false; //胡类型 
        para.mamahu = false; //大胡
        para.kaqiao = false; //七对
        para.difen = this._zhuIdx;
        para.convertible = false;//是否自由人数
        para.trustTime = 0;//托管
        para.guohuzimo = false;
        para.zhuaniao = 1;
        para.qiduimenqing = false;
        para.haidikeqianggang = true;

        var yiziqiaoindex;
        if (this.play_meixi.isSelected()) {
            yiziqiaoindex = 0;
            para.yiziqiao = 0;
        } else if (this.play_youxi.isSelected()) {
            yiziqiaoindex = 1;
            para.yiziqiao = 1;
        }


        var fanshuindex;
        fanshuindex = this.play_24fan.isSelected();
        para.fanshu = fanshuindex ? 24 : 0;


        var zhuaniaoindex;
        if (this.play_zhuaniao1.isSelected()) {
            zhuaniaoindex = 0;
            para.zhuaniao = 1;
        } else if (this.play_zhuaniao2.isSelected()) {
            zhuaniaoindex = 1;
            para.zhuaniao = 2;
        }


        if (this.play_FZzuozhuang.isSelected()) {
            para.zhuang = 0;
        } else if (this.play_SJzuozhuang.isSelected()) {
            para.zhuang = 1;
        }

        para.qiduimenqing = this.play_qiduimenqing.isSelected();
        para.mamahu = this.play_mamahu.isSelected();
        para.menqing = this.play_menqing.isSelected(); //
        para.guohuzimo = this.play_guohuzimo.isSelected();
        para.mamahu = this.play_mamahu.isSelected();
        para.kaqiao = this.play_kaqiao.isSelected();
        para.haidikeqianggang = this.play_haidikeqianggang.isSelected();
        var kaqiaoindex = para.kaqiao;
        if (!para.menqing) 
        {
            para.qiduimenqing = false;
        }

        if (this.play_meixi.isSelected()) 
        {
            para.kaqiao = false;
        }

        var tuoguan;
        if (this._playNode_tuoguanType_0.isSelected()) {
            tuoguan = 0;
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            tuoguan = 1;
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            tuoguan = 2;
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            tuoguan = 3;
            para.trustTime = 180;
        }

        para.trustWay = 0;
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
            para.isTrustWhole   = para.trustWay != 0;
        }

        para.isOpenTingTip = this.tingTipList[0].isSelected();

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_zhuang, para.zhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_menqing, para.menqing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_mamahu, para.mamahu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_kaqiao, kaqiaoindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_qiduimenqing, para.qiduimenqing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_zhuaniao, zhuaniaoindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_guohuzimo, para.guohuzimo);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_yiziqiao, yiziqiaoindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_fanshu, fanshuindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_tuoguan, tuoguan)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yuanjiang_haidikeqianggang, para.haidikeqianggang);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_fanbeiscore, para.fanBeiScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yuanjiang_trustWay, para.trustWay);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});