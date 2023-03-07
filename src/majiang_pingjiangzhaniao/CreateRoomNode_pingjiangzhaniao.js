/**
 * Created by cyc on 2017/7/21.
 */


var CreateRoomNode_pingjiangzhaniao = CreateRoomNode.extend({
    // ctor: function(layer,IsFriendCard) { //构造函数在父类里面已经写了(子类没有多余的动作，最好就不要重写了),如果在子类里面继承就一定与父类保持一致(现在是已经修改好的，原来的是没有任何参数)，不然会出现不可预知的bug
    //     this._super(layer,IsFriendCard); 
    // },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    setKey:function()
    {
        this.localStorageKey.KEY_pingjiangzhaniao_maxPlayer     = "_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_pingjiangzhaniao_zhuaniao  = "_ZHUA_NIAO";   //抓鸟
        this.localStorageKey.KEY_pingjiangzhaniao_jiangJiangHu  = "_JIANG_JIANG_HU";   //将将胡
        this.localStorageKey.KEY_pingjiangzhaniao_minggangguogangbunengbu  = "_XYTDH_MING_GANG_GUO_GANG";   //明杠过杠
        this.localStorageKey.KEY_pingjiangzhaniao_eatqinyise   = "_EAT_QING_YI_SE";   //清一色可吃
        this.localStorageKey.KEY_pingjiangzhaniao_jiaPiao       = "_JIA_PIAO";         //加飘
        this.localStorageKey.KEY_pingjiangzhaniao_isOpenTingTip = "_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_pingjiangzhaniao_difen         = "_DI_FEN";           //底分
        this.localStorageKey.KEY_pingjiangzhaniao_zhuang               = "_chenzhou_ZHUANG";        //坐庄方式
        // this.localStorageKey.KEY_pingjiangzhaniao_tuoguan         = "_TUO_GUAN";           //托管
        this.localStorageKey.KEY_pingjiangzhaniao_quanqiuren         = "_quanqiuren";  
        this.localStorageKey.KEY_pingjiangzhaniao_zhaniaoRule         = "_ZHA_NIAO_RULE"; 
        this.localStorageKey.KEY_pingjiangzhaniao_fengding         = "_FENG_DING";
        // this.localStorageKey.KEY_pingjiangzhaniao_genzhangbudianpao         = "_GEN_ZHANG_BU_DIAN_PAO";  
        this.localStorageKey.KEY_pingjiangzhaniao_guding2zhang         = "_GUDING2ZHANG"; 
        this.localStorageKey.KEY_pingjiangzhaniao_fanbei                    = "_pingjiangzhaniao_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_pingjiangzhaniao_fanbeiscore               = "_pingjiangzhaniao_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },

    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_pingjiangzhaniao.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_pingjiangzhaniao").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_pingjiangzhaniao");
    },
    initPlayNode:function()
    {
        
        var _play = this.bg_node.getChildByName("play");
        var _view = this.bg_node;
        var _parent = this.bg_node.getParent();

        this._playNode_maxPlayer0 = _play.getChildByName("maxPlayer4");
        this._playNode_maxPlayer1 = _play.getChildByName("maxPlayer3");
        this._playNode_maxPlayer2 = _play.getChildByName("maxPlayer2");
        this._playNode_maxPlayer3 = _play.getChildByName("maxPlayer0"); // 自由人数
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer0"));
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4]);
		
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.changePayForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;
        //抓鸟
        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType4"));
        var self = this;
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,zhuaNiaoTypeList[index],zhuaNiaoTypeList);
        });
        this.addListenerText(zhuaNiaoTypeList,this.zhuaNiaoTypeList_radio);
        this.zhuaNiaoTypeList = zhuaNiaoTypeList;

        //扎鸟
        var zhaNiaoList = [];
        zhaNiaoList.push(_play.getChildByName("zhaniao1"));
        zhaNiaoList.push(_play.getChildByName("zhaniao2"));
        zhaNiaoList.push(_play.getChildByName("zhaniao3"));
        var self = this;
        this.zhaNiaoList_radio = createRadioBoxForCheckBoxs(zhaNiaoList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,zhaNiaoList[index],zhaNiaoList);
        });
        this.addListenerText(zhaNiaoList,this.zhaNiaoList_radio);
        this.zhaNiaoList = zhaNiaoList;
        var that = this;
        this._playNode_maxPlayer1.schedule(function() {
            if(that._playNode_maxPlayer1.isSelected())
            {
                _play.getChildByName("zhaniao1").visible = true;
                _play.getChildByName("zhaniao2").visible = true;
                _play.getChildByName("zhaniao3").visible = false;

            }
            else if(that._playNode_maxPlayer2.isSelected())
            {
                _play.getChildByName("zhaniao1").visible = true;
                _play.getChildByName("zhaniao2").visible = false;
                _play.getChildByName("zhaniao3").visible = true;
            }
            else{
                _play.getChildByName("zhaniao1").visible = false;
                _play.getChildByName("zhaniao2").visible = false;
                _play.getChildByName("zhaniao3").visible = false;
            }
        })

        var btn_tuoguanTip = _view.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _view.getChildByName("image_tuoguanTip");
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


        //

        this._playNode_guding2zhang = _play.getChildByName("guding2zhang");
        this.addListenerText(this._playNode_guding2zhang);
        this._playNode_guding2zhang.addEventListener(this.clickCB, this._playNode_guding2zhang);

         //坐庄
        this.play_FZzuozhuang = _play.getChildByName("play_FZzuozhuang");
        this.play_SJzuozhuang = _play.getChildByName("play_SJzuozhuang");
        var zhuangList = [];
        zhuangList.push(this.play_FZzuozhuang);
        zhuangList.push(this.play_SJzuozhuang);
        this._playNode_zhuang_radio = createRadioBoxForCheckBoxs(zhuangList,this.radioBoxSelectCB);
        this.addListenerText(zhuangList,this._playNode_zhuang_radio);
        this.zhuangList = zhuangList;

        //托管
/*        this._play_trustTime = _play.getChildByName("trustTime");
        this.addListenerText(this._play_trustTime);
        this._play_trustTime.addEventListener(this.clickCB, this._play_trustTime);*/
/*        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanList = [];
        tuoguanList.push(_play.getChildByName("tuoguan0"));
        tuoguanList.push(_play.getChildByName("tuoguan1"));
        tuoguanList.push(_play.getChildByName("tuoguan2"));
        tuoguanList.push(_play.getChildByName("tuoguan3"));
        var self = this;
        this.tuoguanTypeList_radio = createRadioBoxForCheckBoxs(tuoguanList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,tuoguanList[index],tuoguanList);
        });
        this.addListenerText(tuoguanList,this.tuoguanTypeList_radio);
        this.tuoguanList = tuoguanList;*/

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        //封顶
        var fengding = [];
        fengding.push(_play.getChildByName("fengding1"));
        fengding.push(_play.getChildByName("fengding2"));
        fengding.push(_play.getChildByName("fengding100"));
        fengding.push(_play.getChildByName("fengding200"));
        this.fengding_radio = createRadioBoxForCheckBoxs(fengding, this.radioBoxSelectCB);
        this.addListenerText(fengding, this.fengding_radio);
        this.fengding = fengding;


        this._zhuIdx = 1;
        this._ZhuNum = _parent.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _parent.getChildByName("btn_sub");
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
            this._Button_add = _parent.getChildByName("btn_add");
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
    },

    setPlayNodeCurrentSelect:function(isClub)
    {

        var maxPlayer;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                maxPlayer = 3;
            else
                maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer, this.maxPlayerList[maxPlayer], this.maxPlayerList);

        var zhuaNiaoType;
        if (isClub)
            zhuaNiaoType = [1,2,3,4].indexOf(this.getNumberItem("zhuaniao", 0));
        else
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhuaniao, 0);
        this.zhuaNiaoTypeList_radio.selectItem(zhuaNiaoType);
        this.radioBoxSelectCB(zhuaNiaoType,this.zhuaNiaoTypeList[zhuaNiaoType],this.zhuaNiaoTypeList);

        var zhaniao;
        if (isClub){
            if(maxPlayer == 1){
                zhaniao = this.getNumberItem("zhaniaoRule", 0);
            }
            else if(maxPlayer == 2){
                zhaniao = this.getNumberItem("zhaniaoRule", 2);
            }  
        }
        else{
            if(maxPlayer == 1){
                zhaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhaniaoRule, 0);
            }
            else if(maxPlayer == 2){
                zhaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhaniaoRule, 2);
            }  
        }
        this.zhaNiaoList_radio.selectItem(zhaniao);
        this.radioBoxSelectCB(zhaniao,this.zhaNiaoList[zhaniao],this.zhaNiaoList);

/*        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);*/

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        var _zhuang;
        if (isClub)
            _zhuang = this.getNumberItem("zhuang", 0);
        else
            _zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhuang, 0);
        this._playNode_zhuang_radio.selectItem(_zhuang);
        this.radioBoxSelectCB(_zhuang, this.zhuangList[_zhuang], this.zhuangList);

        // 轮庄
        var _guding2zhang;
        if (isClub)
            _guding2zhang = this.getBoolItem("guding2zhang", false);
        else
            _guding2zhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_guding2zhang, false);
        this._playNode_guding2zhang.setSelected(_guding2zhang);
        var text = this._playNode_guding2zhang.getChildByName("text");
        this.selectedCB(text, _guding2zhang);

        var fengdingNum;
        if (isClub)
            fengdingNum = [2,0,100,200].indexOf(this.getNumberItem("fengding", 0));
        else
            fengdingNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_fengding, 0);
        this.fengding_radio.selectItem(fengdingNum);
        this.radioBoxSelectCB(fengdingNum, this.fengding[fengdingNum], this.fengding);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //this.refreshZhuaNiao();

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {   
        var _play = this.bg_node.getChildByName("play");
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PING_JIANG_ZHA_NIAO;
        para.maxPlayer = 4;
        para.zhuaniao = 0;   // 抓鸟类型 0:单鸟 1:不抓鸟
        para.isOpenTingTip = this.tingTipList[0].isSelected();
        para.difen = this._zhuIdx; //底分
        //para.difen = 1;
        para.fengding = 2;
        //var tuoguan = this._play_trustTime.isSelected();
        para.trustTime = 0;
        para.zhaniaoRule = 0;
        para.guding2zhang = false;
        para.zhuang = 1;

        var zhaniao
        if (_play.getChildByName("zhaniao1").isSelected()) {
            para.zhaniaoRule = 4;
            zhaniao = 0;
        }
        else if (_play.getChildByName("zhaniao2").isSelected()) {
            para.zhaniaoRule = 3;
            zhaniao = 1;
        }
        else if (_play.getChildByName("zhaniao3").isSelected()) {
            para.zhaniaoRule = 2;
            zhaniao = 2;
        }

        if (this.play_FZzuozhuang.isSelected()) {
            para.zhuang = 0;
        } else if (this.play_SJzuozhuang.isSelected()) {
            para.zhuang = 1;
        }

         //人数
         para.convertible = false;  // 自由人数
         var _countIdx = 0;
         if (this._playNode_maxPlayer0.isSelected()) {
             para.maxPlayer = 4;
             _countIdx = 0;
         }
         else if (this._playNode_maxPlayer1.isSelected()) {
             para.maxPlayer = 3;
             _countIdx = 1;
         }
         else if (this._playNode_maxPlayer2.isSelected()) {
             para.maxPlayer = 2;
             _countIdx = 2;
         }
         else if (this._playNode_maxPlayer3.isSelected()) {
             para.maxPlayer = 4;
             para.convertible = true;
             para.zhaniaoRule = -1;
             _countIdx = 3;
         }

        var zhuaniaoindex;
        if (_play.getChildByName("zhuaniaoType1").isSelected()) {
            zhuaniaoindex = 0;
            para.zhuaniao = 1;
        } else if (_play.getChildByName("zhuaniaoType2").isSelected()) {
            zhuaniaoindex = 1;
            para.zhuaniao = 2;
        } else if (_play.getChildByName("zhuaniaoType3").isSelected()) {
            zhuaniaoindex = 2;
            para.zhuaniao = 3;
        } else if (_play.getChildByName("zhuaniaoType4").isSelected()) {
            zhuaniaoindex = 3;
            para.zhuaniao = 4;
        } 


        var fengdingindex;
        if (_play.getChildByName("fengding1").isSelected()) {
            fengdingindex = 0;
            para.fengding = 2;//双番封顶
        } else if (_play.getChildByName("fengding2").isSelected()) {
            fengdingindex = 1;
            para.fengding = 0;//不封顶
        }
        else if (_play.getChildByName("fengding100").isSelected()) 
        {
            fengdingindex = 2;
            para.fengding = 100;
        }
        else if (_play.getChildByName("fengding200").isSelected()) 
        {
            fengdingindex = 3;
            para.fengding = 200;
        }

        para.guding2zhang = this._playNode_guding2zhang.isSelected();
/*        var tuoguan = 0;
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
            tuoguan = 0;
        }
        else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
            tuoguan = 1;
        }
        else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
            tuoguan = 2;
        }
        else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
            tuoguan = 3;
        }*/
        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_maxPlayer, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhuaniao, zhuaniaoindex);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_tuoguan, tuoguan);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_zhuang, para.zhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_difen, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_zhaniaoRule, zhaniao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_fengding, fengdingindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingjiangzhaniao_guding2zhang, para.guding2zhang);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingjiangzhaniao_fanbeiscore, para.fanBeiScore);
            }
        }

        return para;
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            var len = list.length;
            for(var i = 0; i < len; i++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());

                if (i == 0) {
                    var txt = radioBox.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    txt.setTextColor(bSelected ? selectColor : unSelectColor);
                } else {
                    var textNames = ["text","score"];
                    for (var j = 0; j < textNames.length; j++) {
                        var txt = radioBox.getChildByName(textNames[j]);
                        txt.ignoreContentAdaptWithSize(true);
                        txt.setTextColor(bSelected ? selectColor : unSelectColor);
                    }

                    var buttonNames = ["btn_add","btn_sub"];
                    for (var j = 0; j < buttonNames.length; j++) {
                        var button = radioBox.getChildByName(buttonNames[j]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    }

});