/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_chenzhou = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_chenzhou_zhuaniao                  = "_chenzhou_NIAO_WAY";             //鸟的方式
        this.localStorageKey.KEY_chenzhou_dianpao                  = "_chenzhou_HU_TYPE";           //点炮胡
        this.localStorageKey.KEY_chenzhou_zhuang               = "_chenzhou_ZHUANG";        //坐庄方式
        this.localStorageKey.KEY_chenzhou_hongzhong              = "_chenzhou_HONG_ZHONG";          //8红中
        this.localStorageKey.KEY_chenzhou_piao                   = "_chenzhou_piao";                //飘分
        this.localStorageKey.KEY_chenzhou_is7dui                    = "_chenzhou_IS_7_DUI";             //七对可胡
        this.localStorageKey.KEY_chenzhou_count                     = "_chenzhou_COUNT";                //人数
        this.localStorageKey.KEY_chenzhou_isDuoHu                   = "_chenzhou_IS_DUO_HU";            //是否多胡
        this.localStorageKey.KEY_chenzhou_difen                     = "_chenzhou_difen";                //底分
        this.localStorageKey.KEY_chenzhou_dahu                = "_chenzhou_dahu";       // 大胡
        this.localStorageKey.KEY_chenzhou_jinniao                = "_chenzhou_jinniao";       // 金鸟
        this.localStorageKey.KEY_chenzhou_tuoguan                  = "_chenzhou_tuoguan";               //托管
        this.localStorageKey.KEY_chenzhou_isOpenTingTip             = "_chenzhou_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_chenzhou_fanbei                    = "_chenzhou_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_chenzhou_fanbeiscore               = "_chenzhou_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_chenzhou.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_chenzhou").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_chenzhou");
    },
    initPlayNode: function() {
        var _bgMLHZNode = this.bg_node;

        //鸟的类型
        var _play = _bgMLHZNode.getChildByName("play");
        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniao3");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniao4");
        this._playNode_niaoType_5 = _play.getChildByName("zhuaniao5");
        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("zhuaniao0"));
        nodeList1.push(_play.getChildByName("zhuaniao1"));
        nodeList1.push(_play.getChildByName("zhuaniao2"));
        nodeList1.push(_play.getChildByName("zhuaniao3"));
        nodeList1.push(_play.getChildByName("zhuaniao4"));
        nodeList1.push(_play.getChildByName("zhuaniao5"));
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_player_type_radio);
        this.niaoList = nodeList1;

         //坐庄
        this.play_FZzuozhuang = _play.getChildByName("play_FZzuozhuang");
        this.play_SJzuozhuang = _play.getChildByName("play_SJzuozhuang");
        var zhuangList = [];
        zhuangList.push(this.play_FZzuozhuang);
        zhuangList.push(this.play_SJzuozhuang);
        this._playNode_zhuang_radio = createRadioBoxForCheckBoxs(zhuangList,this.radioBoxSelectCB);
        this.addListenerText(zhuangList,this._playNode_zhuang_radio);
        this.zhuangList = zhuangList;

        //红中
        this.play_0hongzhong = _play.getChildByName("play_0hongzhong");
        this.play_4hongzhong = _play.getChildByName("play_4hongzhong");
        this.play_6hongzhong = _play.getChildByName("play_6hongzhong");
        this.play_8hongzhong = _play.getChildByName("play_8hongzhong");
        var hongzhongNodeList = [];
        hongzhongNodeList.push(_play.getChildByName("play_0hongzhong"));
        hongzhongNodeList.push(_play.getChildByName("play_4hongzhong"));
        hongzhongNodeList.push(_play.getChildByName("play_6hongzhong"));
        hongzhongNodeList.push(_play.getChildByName("play_8hongzhong"));
        this._playNode_hongzhong_radio = createRadioBoxForCheckBoxs(hongzhongNodeList, this.radioBoxSelectCB);
        this.addListenerText(hongzhongNodeList, this._playNode_hongzhong_radio);
        this.hongzhongNodeList = hongzhongNodeList;

        //飘分
        this.play_bupiao = _play.getChildByName("play_bupiao");
        this.play_piao3 = _play.getChildByName("play_piao3");
        this.play_piao5 = _play.getChildByName("play_piao5");
        var piaoNodeList = [];
        piaoNodeList.push(_play.getChildByName("play_bupiao"));
        piaoNodeList.push(_play.getChildByName("play_piao3"));
        piaoNodeList.push(_play.getChildByName("play_piao5"));
        this._playNode_player_piaoNode_radio = createRadioBoxForCheckBoxs(piaoNodeList, this.radioBoxSelectCB);
        this.addListenerText(piaoNodeList, this._playNode_player_piaoNode_radio);
        this.piaoNodeList = piaoNodeList;


        this._zhuIdx = 1;
        this._ZhuNum = _bgMLHZNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgMLHZNode.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bgMLHZNode.getParent().getChildByName("btn_add");
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

        //胡牌
        this.play_dianpao = _play.getChildByName("play_dianpao");
        this.play_zimo = _play.getChildByName("play_zimo");
        var dianpaoList = [];
        dianpaoList.push(this.play_dianpao);
        dianpaoList.push(this.play_zimo);
        this._playNode_dianpao_radio = createRadioBoxForCheckBoxs(dianpaoList,this.radioBoxSelectCB);
        this.addListenerText(dianpaoList,this._playNode_dianpao_radio);
        this.dianpaoList = dianpaoList;

        this._playNode_dahu = _play.getChildByName("play_dahu");
        this.addListenerText(this._playNode_dahu);
        this._playNode_dahu.addEventListener(this.clickCB, this._playNode_dahu);

        this._playNode_Duohu = _play.getChildByName("play_Duohu");
        this.addListenerText(this._playNode_Duohu);
        this._playNode_Duohu.addEventListener(this.clickCB, this._playNode_Duohu);

        this._playNode_jinniao = _play.getChildByName("play_jinniao");
        this.addListenerText(this._playNode_jinniao);
        this._playNode_jinniao.addEventListener(this.clickCB, this._playNode_jinniao);

        var that = this;
        this._playNode_niaoType_5.schedule(function() {
            if(that._playNode_niaoType_5.isSelected())
            {
                that._playNode_jinniao.visible = false;
            }
            else
            {
                that._playNode_jinniao.visible = true;
            }
        })

        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

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
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
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
    },
    setPlayNodeCurrentSelect: function(isClub) {

        var _zhuaniao;
        if (isClub)
            _zhuaniao = [0,1,2,4,8,10].indexOf(this.getNumberItem("zhuaniao", 1));
        else
            _zhuaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_zhuaniao, 1);
        this._playNode_player_type_radio.selectItem(_zhuaniao);
        this.radioBoxSelectCB(_zhuaniao,this.niaoList[_zhuaniao],this.niaoList);

        var _zhuang;
        if (isClub)
            _zhuang = this.getNumberItem("zhuang", 1);
        else
            _zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_zhuang, 1);
        this._playNode_zhuang_radio.selectItem(_zhuang);
        this.radioBoxSelectCB(_zhuang, this.zhuangList[_zhuang], this.zhuangList);

        var _hongzhong;
        if (isClub)
            _hongzhong = [0,4,6,8].indexOf(this.getNumberItem("hongzhong", 1));
        else
            _hongzhong = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_hongzhong, 1);
        this._playNode_hongzhong_radio.selectItem(_hongzhong);
        this.radioBoxSelectCB(_hongzhong, this.hongzhongNodeList[_hongzhong], this.hongzhongNodeList);

        var _piaofen;
        if (isClub)
            _piaofen = [0,1,2].indexOf(this.getNumberItem("piaofen", 1));
        else
            _piaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_piao, 1);
        this._playNode_player_piaoNode_radio.selectItem(_piaofen);
        this.radioBoxSelectCB(_piaofen, this.piaoNodeList[_piaofen], this.piaoNodeList);

        var _dianpao;
        if (isClub)
        {
            var isdianpao = this.getBoolItem("dianpao", true);
            if (isdianpao == true) _dianpao = 0;
            else _dianpao = 1;
        }
        else
            _dianpao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_dianpao, 0);
        this._playNode_dianpao_radio.selectItem(_dianpao);
        this.radioBoxSelectCB(_dianpao, this.dianpaoList[_dianpao], this.dianpaoList);

        var _is7dui;
        if (isClub)
            _is7dui = this.getBoolItem("qidui", true);
        else
            _is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chenzhou_is7dui, true);
        this._playNode_qidui.setSelected(_is7dui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text, _is7dui)

        var _dahu;
        if (isClub)
            _dahu = this.getBoolItem("dahu", false);
        else
            _dahu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chenzhou_dahu, false);
        this._playNode_dahu.setSelected(_dahu);
        var text = this._playNode_dahu.getChildByName("text");
        this.selectedCB(text, _dahu)

        var _Duohu;
        if (isClub)
            _Duohu = this.getBoolItem("duoHu", true);
        else
            _Duohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chenzhou_isDuoHu, true);
        this._playNode_Duohu.setSelected(_Duohu);
        var text = this._playNode_Duohu.getChildByName("text");
        this.selectedCB(text, _Duohu)

        var _jinniao;
        if (isClub)
            _jinniao = this.getBoolItem("buzhongsuanquanzhong", true);
        else
            _jinniao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chenzhou_jinniao, true);
        this._playNode_jinniao.setSelected(_jinniao);
        var text = this._playNode_jinniao.getChildByName("text");
        this.selectedCB(text, _jinniao);

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //托管
       var _trustTime;
        if (isClub)
        {
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        }
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_tuoguan, 0);
        this._playNode_player_tuoguan_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanNodeList[_trustTime],this.tuoguanNodeList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chenzhou_isOpenTingTip, true);
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chenzhou_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.CHEN_ZHOU;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 0; //抓鸟 0:不抓鸟 1:抓1鸟 2：抓2鸟 4：抓4鸟 8：抓8鸟
        para.zhuang = 0;//0:庄家 1:随机
        para.hongzhong = 0;// 红中 0:无红中 4:4红中 6：6红中  8：8红中
        para.piaofen = 0;// 飘分 0:不飘  3：飘1/2/3  5：飘2/3/5
        para.dianpao = false; //胡类型 
        para.dahu = false; //大胡
        para.qidui = false; //七对
        para.duohu = false;//一炮多响
        para.buzhongsuanquanzhong = false; //金鸟
        para.difen = this._zhuIdx;
        para.convertible = false;//是否自由人数
        para.trustTime = 0;//托管

        var zhuaniaoindex;
        if (this._playNode_niaoType_0.isSelected()) {
            zhuaniaoindex = 0;
            para.zhuaniao = 0;
        } else if (this._playNode_niaoType_1.isSelected()) {
            zhuaniaoindex = 1;
            para.zhuaniao = 2;
        } else if (this._playNode_niaoType_2.isSelected()) {
            zhuaniaoindex = 2;
            para.zhuaniao = 4;
        } else if (this._playNode_niaoType_3.isSelected()) {
            zhuaniaoindex = 3;
            para.zhuaniao = 6;
        } else if (this._playNode_niaoType_4.isSelected()) {
            zhuaniaoindex = 4;
            para.zhuaniao = 8;
        } else if (this._playNode_niaoType_5.isSelected()) {
            zhuaniaoindex = 5;
            para.zhuaniao = 10;
        }


        var hongzhongindex;
        if (this.play_0hongzhong.isSelected()) {
            hongzhongindex = 0;
            para.hongzhong = 0;
        } else if (this.play_4hongzhong.isSelected()) {
            hongzhongindex = 1;
            para.hongzhong = 4;
        } else if (this.play_6hongzhong.isSelected()) {
            hongzhongindex = 2;
            para.hongzhong = 6;
        } else if (this.play_8hongzhong.isSelected()) {
            hongzhongindex = 3;
            para.hongzhong = 8;
        }

        var piaofenindex;
        if (this.play_bupiao.isSelected()) {
            piaofenindex = 0;
            para.piaofen = 0;
        } else if (this.play_piao3.isSelected()) {
            piaofenindex = 1;
            para.piaofen = 1;
        } else if (this.play_piao5.isSelected()) {
            piaofenindex = 2;
            para.piaofen = 2;
        }

        if (this.play_FZzuozhuang.isSelected()) {
            para.zhuang = 0;
        } else if (this.play_SJzuozhuang.isSelected()) {
            para.zhuang = 1;
        }

        para.dianpao = this.play_dianpao.isSelected(); //点炮胡
        var hutype = para.dianpao ? 0 : 1;

        var tuoguan = 0;
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
        }

         //
        para.duoHu = this._playNode_Duohu.isSelected() ? true : false;
        para.dahu = this._playNode_dahu.isSelected();//庄闲分
        para.qidui = this._playNode_qidui.isSelected();
        para.buzhongsuanquanzhong = this._playNode_jinniao.isSelected();
        var jinniaoindex = para.buzhongsuanquanzhong;
        para.isOpenTingTip = this.tingTipList[0].isSelected();
        if (para.zhuaniao == 10) 
        {
            para.buzhongsuanquanzhong = false;
        }
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
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_zhuaniao, zhuaniaoindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_zhuang, para.zhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chenzhou_isDuoHu, para.duoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chenzhou_dahu, para.dahu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chenzhou_jinniao, jinniaoindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_piao, piaofenindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_dianpao, hutype);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chenzhou_is7dui, para.qidui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_hongzhong, hongzhongindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_tuoguan, tuoguan)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chenzhou_isOpenTingTip, para.isOpenTingTip);

            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chenzhou_fanbeiscore, para.fanBeiScore);
            }
        }
        cc.log("createara: " + JSON.stringify(para));
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