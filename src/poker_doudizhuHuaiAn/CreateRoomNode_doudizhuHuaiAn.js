/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_doudizhuHuaiAn = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_DDZ_HuaiAn_playerNumber       = "_DOU_DI_ZHU_HUAIAN_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZ_HuaiAn_fengding           = "_DOU_DI_ZHU_HUAIAN_FENG_DING";         //封顶 0 12倍，1  24倍
        this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGWANG      = "_DOU_DI_ZHU_HUAIAN_BJ_SHUANGWANG";                //双王必叫
        this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGZHADAN           = "_DOU_DI_ZHU_HUAIAN_BJ_SHUANGZHADAN";
        this.localStorageKey.KEY_DDZ_HuaiAn_daiti              = "_DOU_DI_ZHU_HUAIAN_daiti";             //带踢翻倍
        this.localStorageKey.KEY_DDZ_HuaiAn_farmerCanTi         = "_DOU_DI_ZHU_HUAIAN_farmerCanTi";         //农民可踢
        this.localStorageKey.KEY_DDZ_HuaiAn_difen         = "_DOU_DI_ZHU_HUAIAN_difen";         //底分
    },
    setKeyByCardFriend:function()
    {
        this.localStorageKey.KEY_DDZ_HuaiAn_playerNumber       = "CF_DOU_DI_ZHU_HUAIAN_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZ_HuaiAn_fengding           = "CF_DOU_DI_ZHU_HUAIAN_FENG_DING";         //封顶 0 不封顶，1  3倍封顶 2 4倍封顶
        this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGWANG      = "CF_DOU_DI_ZHU_HUAIAN_BJ_SHUANGWANG";                //双王必叫
        this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGZHADAN           = "CF_DOU_DI_ZHU_HUAIAN_BJ_SHUANGZHADAN";
        this.localStorageKey.KEY_DDZ_HuaiAn_daiti              = "CF_DOU_DI_ZHU_HUAIAN_daiti";             //带踢翻倍
        this.localStorageKey.KEY_DDZ_HuaiAn_farmerCanTi         = "CF_DOU_DI_ZHU_HUAIAN_farmerCanTi";         //农民可踢
        this.localStorageKey.KEY_DDZ_HuaiAn_difen        = "CF_DOU_DI_ZHU_HUAIAN_difen";         //底分
    },
    initAll:function(IsFriendCard)
    {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();

        this.bg_node = ccs.load("bg_doudizhuHuaiAn.json").node;

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
        this._super(); //南通斗地主增加放作弊功能
        var _playWay = this._scroll_play;
        this._playNode_fengding_0 = _playWay.getChildByName("play_fengding_0");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding_1");
        var nodeListfeng = [];
        nodeListfeng.push( _playWay.getChildByName("play_fengding_0") );
        nodeListfeng.push( _playWay.getChildByName("play_fengding_1") );
        this.fengList = nodeListfeng;
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng,this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng,this._playNode_fengding_radio);

        ////////////底分
        this._playNode_difen_0 = _playWay.getChildByName("play_difen1");
        this._playNode_difen_1 = _playWay.getChildByName("play_difen2");
        this._playNode_difen_2 = _playWay.getChildByName("play_difen3");
        this._playNode_difen_3 = _playWay.getChildByName("play_difen5");
        var nodeListdifen = [];
        nodeListdifen.push( _playWay.getChildByName("play_difen1") );
        nodeListdifen.push( _playWay.getChildByName("play_difen2") );
        nodeListdifen.push( _playWay.getChildByName("play_difen3") );
        nodeListdifen.push( _playWay.getChildByName("play_difen5") );
        this.difenList = nodeListdifen;
        this._playNode_difen_radio = createRadioBoxForCheckBoxs(nodeListdifen,this.radioBoxSelectCB);
        this.addListenerText(nodeListdifen,this._playNode_difen_radio);
        ////////

        this._playNode_bj_shuangwang   = _playWay.getChildByName("play_bijiaoshuangwang");
        this.addListenerText(this._playNode_bj_shuangwang);
        this._playNode_bj_shuangwang.addEventListener(this.clickCB, this._playNode_bj_shuangwang);

        this._playNode_bj_Shuangzhadan       = _playWay.getChildByName("play_bijiaoShuangzhadan");
        this.addListenerText(this._playNode_bj_Shuangzhadan);
        this._playNode_bj_Shuangzhadan.addEventListener(this.clickCB, this._playNode_bj_Shuangzhadan);

        this._playNode_daitifanbei       = _playWay.getChildByName("play_daitifanbei");
        this.addListenerTextDaiTi(this._playNode_daitifanbei);
        this._playNode_daitifanbei.addEventListener(this.clickDaiTi, this._playNode_daitifanbei);

        this._playNode_farmerCanTi  = _playWay.getChildByName("play_daitifanbei").getChildByName("play_farmerCanTi");
        this.addListenerText(this._playNode_farmerCanTi);
        this._playNode_farmerCanTi.addEventListener(this.clickCB, this._playNode_farmerCanTi);

    },
    setPlayNodeCurrentSelect:function()
    {
        this._super();
        //设置上次创建房间时的默认选项
        var _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_HuaiAn_fengding, 0);
        var index = _fengDing == 12? 0:1;
        this._playNode_fengding_radio.selectItem(index);
        this["_playNode_fengding_" + index].setSelected(true);
        this.radioBoxSelectCB(index,this.fengList[index],this.fengList);

        //底分
        var _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_HuaiAn_difen, 1);
        var index=0;
        switch(_difen){
            case 5:
                index=3;
                break;
            case 3:
                index=2;
                break;
            case 2:
                index=1;
                break;
            case 1:
                index=0;
                break;

        }
        this._playNode_difen_radio.selectItem(index);
        this["_playNode_difen_" + index].setSelected(true);
        this.radioBoxSelectCB(index,this.difenList[index],this.difenList);
        //////////

        var _bi_shuangwang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGWANG, false);
        this._playNode_bj_shuangwang.setSelected(_bi_shuangwang);
        var text = this._playNode_bj_shuangwang.getChildByName("text");
        this.selectedCB(text,_bi_shuangwang)

        var _bi_zhadan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGZHADAN, false);
        this._playNode_bj_Shuangzhadan.setSelected(_bi_zhadan);
        var text = this._playNode_bj_Shuangzhadan.getChildByName("text");
        this.selectedCB(text,_bi_zhadan)


        var _bi_daiti = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_daiti, false);
        this._playNode_daitifanbei.setSelected(_bi_daiti);
        var text = this._playNode_daitifanbei.getChildByName("text");
        this.selectedDaiTi(text,_bi_daiti)

        var _farmerCanTi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_farmerCanTi, false);
        this._playNode_farmerCanTi.setSelected(_farmerCanTi);
        var text = this._playNode_farmerCanTi.getChildByName("text");
        this.selectedCB(text,_farmerCanTi)


    },
    getSelectedPara:function()
    {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.HUAI_AN_DOU_DI_ZHU;
        para.maxPlayer = 3;
        para.zhafengding  = 0;
        para.bijiaoShuangwang   = this._playNode_bj_shuangwang.isSelected();
        para.bijiaoShuangZhadan       = this._playNode_bj_Shuangzhadan.isSelected();
        para.daiti              = this._playNode_daitifanbei.isSelected();
        if(this._playNode_daitifanbei.isSelected())
        {
            para.farmerCanTi        = this._playNode_farmerCanTi.isSelected();
        }
        else
        {
            para.farmerCanTi        = false;
        }
        para.zhafengding = this._playNode_fengding_0.isSelected() == true? 12 :24;
        para.difen=0;
        if(this._playNode_difen_0.isSelected()==true){
            para.difen=1;
        }else if(this._playNode_difen_1.isSelected()==true){
            para.difen=2;
        }else if(this._playNode_difen_2.isSelected()==true){
            para.difen=3;
        }else{
            para.difen=5;
        }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_HuaiAn_difen, para.difen);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_HuaiAn_fengding, para.zhafengding);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGWANG, para.bijiaoShuangwang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_BJ_SHUANGZHADAN, para.bijiaoShuangZhadan);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_daiti, para.daiti);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_HuaiAn_farmerCanTi, para.farmerCanTi);

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
