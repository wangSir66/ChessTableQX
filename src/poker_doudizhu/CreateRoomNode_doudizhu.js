/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_doudizhu = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_DDZ_playerNumber       = "_DOU_DI_ZHU_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZ_fengding           = "_DOU_DI_ZHU_FENG_DING";         //封顶 0 不封顶，1  3倍封顶 2 4倍封顶
        this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG      = "_DOU_DI_ZHU_BJ_SHUANGWANG";                //必叫
        this.localStorageKey.KEY_DDZ_BJ_SIGEER           = "_DOU_DI_ZHU_BJ_SIGEER";
        this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER     = "_DOU_DI_ZHU_BJ_WANGSHUANGER";
        this.localStorageKey.KEY_DDZ_BJ_ZHADAN           = "_DOU_DI_ZHU_BJ_ZHADAN";

        this.localStorageKey.KEY_DDZ_daiti              = "_DOU_DI_ZHU_daiti";             //带踢翻倍
        this.localStorageKey.KEY_DDZ_sidaier            = "_DOU_DI_ZHU_sidaier";           //四带二
        this.localStorageKey.KEY_DDZ_yingjiachu         = "_DOU_DI_ZHU_yingjiachu";         //赢家出
        this.localStorageKey.KEY_DDZ_farmerCanTi         = "_DOU_DI_ZHU_farmerCanTi";         //农民可踢

    },
    setKeyByCardFriend:function()
    {
        this.localStorageKey.KEY_DDZ_playerNumber       = "CF_DOU_DI_ZHU_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZ_fengding           = "CF_DOU_DI_ZHU_FENG_DING";         //封顶 0 不封顶，1  3倍封顶 2 4倍封顶
        this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG      = "CF_DOU_DI_ZHU_BJ_SHUANGWANG";                //必叫
        this.localStorageKey.KEY_DDZ_BJ_SIGEER           = "CF_DOU_DI_ZHU_BJ_SIGEER";
        this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER     = "CF_DOU_DI_ZHU_BJ_WANGSHUANGER";
        this.localStorageKey.KEY_DDZ_BJ_ZHADAN           = "CF_DOU_DI_ZHU_BJ_ZHADAN";

        this.localStorageKey.KEY_DDZ_daiti              = "CF_DOU_DI_ZHU_daiti";             //带踢翻倍
        this.localStorageKey.KEY_DDZ_sidaier            = "CF_DOU_DI_ZHU_sidaier";           //四带二
        this.localStorageKey.KEY_DDZ_yingjiachu         = "CF_DOU_DI_ZHU_yingjiachu";         //赢家出
        this.localStorageKey.KEY_DDZ_farmerCanTi         = "CF_DOU_DI_ZHU_farmerCanTi";         //农民可踢
    },
    initAll:function(IsFriendCard)
    {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();

        this.bg_node = ccs.load("bg_doudizhu.json").node;

        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_doudizhu");

        //为适配拖动，先把节点获取到
        this._scrollview = this.bg_node.getChildByName("scrollview");
        this._scroll_play = this._scrollview.getChildByName("play");
        this._scroll_round = this._scrollview.getChildByName("round");
    },
    initRoundNode:function()
    {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode:function()
    {
        if(MjClient.APP_TYPE.QXNTQP == MjClient.getAppType()) this._super(); //南通斗地主增加放作弊功能
        var _playWay = this._scroll_play;
        this._playNode_fengding_0 = _playWay.getChildByName("play_bufengding");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding3");
        this._playNode_fengding_2 = _playWay.getChildByName("play_fengding4");
        var nodeListfeng = [];
        nodeListfeng.push( _playWay.getChildByName("play_bufengding") );
        nodeListfeng.push( _playWay.getChildByName("play_fengding3") );
        nodeListfeng.push( _playWay.getChildByName("play_fengding4") );
        this.fengList = nodeListfeng;
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng,this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng,this._playNode_fengding_radio);

        this._playNode_bj_shuangwang   = _playWay.getChildByName("play_bijiaoshuangwang");
        this.addListenerText(this._playNode_bj_shuangwang);
        this._playNode_bj_shuangwang.addEventListener(this.clickCB, this._playNode_bj_shuangwang);

        this._playNode_bj_sigeer       = _playWay.getChildByName("play_bijiaosigeer");
        this.addListenerText(this._playNode_bj_sigeer);
        this._playNode_bj_sigeer.addEventListener(this.clickCB, this._playNode_bj_sigeer);

        this._playNode_bj_wangshuanger = _playWay.getChildByName("play_bijiaowangshuanger");
        this.addListenerText(this._playNode_bj_wangshuanger);
        this._playNode_bj_wangshuanger.addEventListener(this.clickCB, this._playNode_bj_wangshuanger);

        this._playNode_bj_zhadan       = _playWay.getChildByName("play_bijiaozhadan");
        this.addListenerText(this._playNode_bj_zhadan);
        this._playNode_bj_zhadan.addEventListener(this.clickCB, this._playNode_bj_zhadan);

        this._playNode_daitifanbei       = _playWay.getChildByName("play_daitifanbei");
        this.addListenerTextDaiTi(this._playNode_daitifanbei);
        this._playNode_daitifanbei.addEventListener(this.clickDaiTi, this._playNode_daitifanbei);

        this._playNode_sidaier           = _playWay.getChildByName("play_sidaier");
        this.addListenerText(this._playNode_sidaier);
        this._playNode_sidaier.addEventListener(this.clickCB, this._playNode_sidaier);

        this._playNode_yingjiaxiaochu    = _playWay.getChildByName("play_yingjiaxianchu");
        this.addListenerText(this._playNode_yingjiaxiaochu);
        this._playNode_yingjiaxiaochu.addEventListener(this.clickCB, this._playNode_yingjiaxiaochu);

        this._playNode_farmerCanTi  = _playWay.getChildByName("play_daitifanbei").getChildByName("play_farmerCanTi");
        this.addListenerText(this._playNode_farmerCanTi);
        this._playNode_farmerCanTi.addEventListener(this.clickCB, this._playNode_farmerCanTi);



    },
    setPlayNodeCurrentSelect:function()
    {
        this._super();
        //设置上次创建房间时的默认选项
        var _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_fengding, 0);
        var index = _fengDing == 3? 1:(_fengDing == 4? 2:0);
        this._playNode_fengding_radio.selectItem(index)
        this["_playNode_fengding_" + index].setSelected(true);
        this.radioBoxSelectCB(index,this.fengList[index],this.fengList);

        var _bi_shuangwang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG, false);
        this._playNode_bj_shuangwang.setSelected(_bi_shuangwang);
        var text = this._playNode_bj_shuangwang.getChildByName("text");
        this.selectedCB(text,_bi_shuangwang)

        var _bi_sigeer = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_SIGEER, false);
        this._playNode_bj_sigeer.setSelected(_bi_sigeer);
        var text = this._playNode_bj_sigeer.getChildByName("text");
        this.selectedCB(text,_bi_sigeer)

        var _bi_wangshuanger = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER, false);
        this._playNode_bj_wangshuanger.setSelected(_bi_wangshuanger);
        var text = this._playNode_bj_wangshuanger.getChildByName("text");
        this.selectedCB(text,_bi_wangshuanger)

        var _bi_zhadan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_ZHADAN, false);
        this._playNode_bj_zhadan.setSelected(_bi_zhadan);
        var text = this._playNode_bj_zhadan.getChildByName("text");
        this.selectedCB(text,_bi_zhadan)

        var _bi_sidaier = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_sidaier, false);
        this._playNode_sidaier.setSelected(_bi_sidaier);
        var text = this._playNode_sidaier.getChildByName("text");
        this.selectedCB(text,_bi_sidaier)

        var _bi_yingjiachu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_yingjiachu, false);
        this._playNode_yingjiaxiaochu.setSelected(_bi_yingjiachu);
        var text = this._playNode_yingjiaxiaochu.getChildByName("text");
        this.selectedCB(text,_bi_yingjiachu)

        var _farmerCanTi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_farmerCanTi, false);
        this._playNode_farmerCanTi.setSelected(_farmerCanTi);
        var text = this._playNode_farmerCanTi.getChildByName("text");
        this.selectedCB(text,_farmerCanTi)

        var _bi_daiti = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_daiti, false);
        this._playNode_daitifanbei.setSelected(_bi_daiti);
        var text = this._playNode_daitifanbei.getChildByName("text");
        this.selectedDaiTi(text,_bi_daiti)


    },
    getSelectedPara:function()
    {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.DOU_DI_ZHU_NT;
        para.maxPlayer = 3;
        para.zhafengding  = 0;
        para.bijiaoShuangwang   = this._playNode_bj_shuangwang.isSelected();
        para.bijiaoSigeer       = this._playNode_bj_sigeer.isSelected();
        para.bijiaoWangshuanger = this._playNode_bj_wangshuanger.isSelected();
        para.bijiaoZhadan       = this._playNode_bj_zhadan.isSelected();
        para.daiti              = this._playNode_daitifanbei.isSelected();
        para.sidaier            = this._playNode_sidaier.isSelected();
        para.yingjiaxianchu     = this._playNode_yingjiaxiaochu.isSelected();
        if(this._playNode_daitifanbei.isSelected())
        {
            para.farmerCanTi        = this._playNode_farmerCanTi.isSelected();
        }
        else
        {
            para.farmerCanTi        = false;
        }
        para.zhafengding = this._playNode_fengding_0.isSelected() == true? 0 :(this._playNode_fengding_1.isSelected() == true? 3:4);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_fengding, para.zhafengding);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG, para.bijiaoShuangwang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_SIGEER, para.bijiaoSigeer);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER, para.bijiaoWangshuanger);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_ZHADAN, para.bijiaoZhadan);

        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_daiti, para.daiti);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_sidaier, para.sidaier);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_yingjiachu, para.yingjiaxianchu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_farmerCanTi, para.farmerCanTi);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    addListenerTextDaiTi: function(node, radio, callback) {//callback 是回调函数
        if (node && radio) {
            //cc.log(">>>>>>>>>>>>>>", JSON.stringify(node), JSON.stringify(radio), callback);
            for (var i = 0; i < node.length; i++) {
                node[i].getChildByName("text").ignoreContentAdaptWithSize(true);
                cc.eventManager.addListener(this.setTextClickDaiTi(node, i, radio, callback), node[i].getChildByName("text"));
            }
        } else if (callback) {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClickDaiTi(null, null, null, callback), node.getChildByName("text"));
        }else {
            cc.log('-----------------------------')
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClickDaiTi(), node.getChildByName("text"));
        }
    },
    setTextClickDaiTi: function(listnode, number, radio, callback) {
        var that = this;
        var _callback = callback || function(){};
        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var parent = target;
                for (; parent; parent = parent.parent) {
                    if (!parent.visible)
                        return false;
                }

                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)

                // 如果触碰起始地点在本区域中
                var box = target.getBoundingBox();
                box.width += 10;
                box.height += 10;
                box.x -= 10;
                box.y -= 10;
                if (!cc.rectContainsPoint(box, pos)) {
                    return false;
                }
                return true;
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)
                if (listnode) {
                    for (var i = 0; i < listnode.length; i++) {
                        if (i == number) {
                            listnode[i].setSelected(true);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(CREATEROOM_COLOR_1);
                            txt.ignoreContentAdaptWithSize(true);
                            radio.selectItem(i);
                        } else {
                            listnode[i].setSelected(false);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(CREATEROOM_COLOR_3);
                            txt.ignoreContentAdaptWithSize(true);
                        }
                    }
                    //this._playNode_round_radio  this._playNode_payway_radio
                    if ((radio == that._playNode_round_radio) || (radio == that._playNode_payway_radio)) {
                        cc.log(" ====== that.bg_node,", that.bg_node)
                        that.setDiaNumData(that.bg_node);
                    }


                } else {
                    // 如果触碰起始地点在本区域中
                    if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                        return;

                    target.parent.setSelected(!target.parent.isSelected());

                    var txt = target.parent.getChildByName("text");
                    var farmer=target.parent.getChildByName('play_farmerCanTi')
                    txt.ignoreContentAdaptWithSize(true);
                    if (txt && target.parent.isSelected()) {
                        txt.setTextColor(CREATEROOM_COLOR_1);
                        farmer.visible=true;
                    } else {
                        txt.setTextColor(CREATEROOM_COLOR_3);
                        farmer.visible=false;
                    }
                }
                _callback(number);
            }
        });
    },

    clickDaiTi:function(sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                var farmer=sender.getChildByName('play_farmerCanTi')
                if (sender.isSelected()) {
                    txt.setTextColor(CREATEROOM_COLOR_1);
                    farmer.visible=true;
                } else {
                    txt.setTextColor(CREATEROOM_COLOR_3);
                    farmer.visible=false;
                }
                break;
        }
    },
    selectedDaiTi:function(text, isSelected) {
        if (isSelected) {
            text.setTextColor(CREATEROOM_COLOR_1);
            this._playNode_farmerCanTi.visible=true;
        } else {
            text.setTextColor(CREATEROOM_COLOR_3);
            this._playNode_farmerCanTi.visible=false;
        }
    }
});
