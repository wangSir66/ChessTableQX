var CreateRoomNode_sanDaHaXiangTan = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_XIANGTAN_SDH_maxPlayer     = "XIANG_TAN_SAN_DA_HA_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_XIANGTAN_SDH_doubleInSingleOut      = "XIANG_TAN_SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_XIANGTAN_SDH_allowCheckCard         = "XIANG_TAN_SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_XIANGTAN_SDH_touXiangXuXunWen       = "XIANG_TAN_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_XIANGTAN_SDH_buKeZaiJiao        = "XIANG_TAN_SAN_DA_HA_buKeZaiJiao";        //60分不可再叫
        this.localStorageKey.KEY_XIANGTAN_SDH_baoFuLiuShou       = "XIANG_TAN_SAN_DA_HA_baoFuLiuShou";         //报富留守
        this.localStorageKey.KEY_XIANGTAN_SDH_60fenQiJiao       = "XIANG_TAN_SAN_DA_HA_60fenQiJiao";       //60分起叫
        this.localStorageKey.KEY_XIANGTAN_SDH_quDiaoLiu        = "XIANG_TAN_SAN_DA_HA_quDiaoLiu";        //去掉6
        this.localStorageKey.KEY_XIANGTAN_SDH_biChangZhu        = "XIANG_TAN_SAN_DA_HA_biChangZhu";        //比常主
        this.localStorageKey.KEY_XIANGTAN_SDH_xiaoGuang      = "XIANG_TAN_SAN_DA_HA_xiaoGuang";        //小光

        this.setExtraKey({
            jieSuanDiFen: "XIANG_TAN_SAN_DA_HA_jieSuanDiFen"
        });
    },
    initAll:function(IsFriendCard)
    {
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        if (!IsFriendCard)
            this.setKey();
        this.roundNumObj = {roundNum1:8, roundNum2:16};
        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bg_node = ccs.load("bg_sanDaHaXiangTan.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_sanDaHaXiangTan").getChildByName("view");

    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play");
        var maxPlayerList = [];
        this.playNum4=_bg_Node.getChildByName("play_num4");
        this.playNum3=_bg_Node.getChildByName("play_num3");
        maxPlayerList.push(this.playNum3);
        maxPlayerList.push(this.playNum4);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function (index) {
            this.showPlayTypeForPlayNum(index);
            this.radioBoxSelectCB(0, maxPlayerList[index], maxPlayerList);
        }.bind(this));
        this.addListenerText(maxPlayerList, this.maxPlayerList_radio,this.showPlayTypeForPlayNum.bind(this));
        this.maxPlayerList = maxPlayerList;

        MjClient.createRoomUI = this;
        //双进单出
        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        cc.eventManager.addListener(this.setTextClick(),this.doubleInSingleOut.getChildByName("text"));
        this.doubleInSingleOut.addEventListener(this._clickCB, this.doubleInSingleOut);
        //允许查牌
        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        cc.eventManager.addListener(this.setTextClick(),this.allowCheckCard.getChildByName("text"));
        this.allowCheckCard.addEventListener(this._clickCB, this.allowCheckCard);
        //投降询问所有人
        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        cc.eventManager.addListener(this.setTextClick(),this.touXiangXuXunWen.getChildByName("text"));
        this.touXiangXuXunWen.addEventListener(this._clickCB, this.touXiangXuXunWen);
        //报富留守
        this.baoFuLiuShou = _playWay.getChildByName("play_baoFuLiuShou");
        cc.eventManager.addListener(this.setTextClick(),this.baoFuLiuShou.getChildByName("text"));
        this.baoFuLiuShou.addEventListener(this._clickCB, this.baoFuLiuShou);
        //60分起叫
        this.qiJiaofen60= _playWay.getChildByName("play_60fenQiJiao");
        this.quDiaoLiu = _playWay.getChildByName("play_quDiaoLiu");      //去掉6
        this.biChangZhu = _playWay.getChildByName("play_biChangZhu");     //比常主
        this.buKeZaiJiao = _playWay.getChildByName("buKeZaiJiao");    //60分不可再叫
        cc.eventManager.addListener(this.setTextClickXTSDH(0),this.qiJiaofen60.getChildByName("text"));
        this.qiJiaofen60.addEventListener(this._clickCB, this.qiJiaofen60);

        cc.eventManager.addListener(this.setTextClickXTSDH(0),this.quDiaoLiu.getChildByName("text"));
        this.quDiaoLiu.addEventListener(this._clickCB, this.quDiaoLiu);

        cc.eventManager.addListener(this.setTextClick(),this.biChangZhu.getChildByName("text"));
        this.biChangZhu.addEventListener(this._clickCB, this.biChangZhu);

        cc.eventManager.addListener(this.setTextClick(),this.buKeZaiJiao.getChildByName("text"));
        this.buKeZaiJiao.addEventListener(this._clickCB, this.buKeZaiJiao);

        //小光
        var nodeListXiaoGuang = [];
        this.xiaoGuangFen25=_bg_Node.getChildByName("play_25fenxiaoguang");
        this.xiaoGuangFen30=_bg_Node.getChildByName("play_30fenxiaoguang");
        nodeListXiaoGuang.push(this.xiaoGuangFen25);
        nodeListXiaoGuang.push(this.xiaoGuangFen30);
        this.xiaoGuang_radio = createRadioBoxForCheckBoxs(nodeListXiaoGuang, function (index) {
            this.radioBoxSelectCB(0, nodeListXiaoGuang[index], nodeListXiaoGuang);
        }.bind(this));
        this.addListenerText(nodeListXiaoGuang, this.xiaoGuang_radio);
        this.xiaoGuangList = nodeListXiaoGuang;

        this.playNum4.schedule(function() {
            if(this.playNum4.isSelected())
            {
                this.buKeZaiJiao.setVisible(_playWay.getChildByName("play_60fenQiJiao").isSelected());
                this.biChangZhu.setVisible(_playWay.getChildByName("play_60fenQiJiao").isSelected());
            }
            else {
                this.buKeZaiJiao.setVisible(true);
                this.biChangZhu.setVisible(true);
            }
        }.bind(this));


        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //设置上次创建房间时的默认选项
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub) {
            isTrue = [3, 4].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGTAN_SDH_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue,this.maxPlayerList[isTrue],this.maxPlayerList);
        this.showPlayTypeForPlayNum(isTrue);


        if (isClub)
            isTrue = [25,30].indexOf(this.getNumberItem("xiaoGuangFen", 30));
        else
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGTAN_SDH_xiaoGuang, 1);
        this.xiaoGuang_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue, this.xiaoGuangList[isTrue], this.xiaoGuangList);

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("buKeZaiJiao", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_buKeZaiJiao, false);
        this.buKeZaiJiao.setSelected(isTrue);
        var text = this.buKeZaiJiao.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_doubleInSingleOut, false);
        this.doubleInSingleOut.setSelected(isTrue);
        var text = this.doubleInSingleOut.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("baoFuLiuShou", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_baoFuLiuShou, false);
        this.baoFuLiuShou.setSelected(isTrue);
        var text = this.baoFuLiuShou.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("qiJiao60", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_60fenQiJiao, false);
        this.qiJiaofen60.setSelected(isTrue);
        var text = this.qiJiaofen60.getChildByName("text");
        this.selectedCB(text,isTrue);

        if (isClub)
            isTrue = this.getBoolItem("chou6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_quDiaoLiu, false);
        this.quDiaoLiu.setSelected(isTrue);
        var text = this.quDiaoLiu.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("biChangZhu", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_biChangZhu, false);
        this.biChangZhu.setSelected(isTrue);
        var text = this.biChangZhu.getChildByName("text");
        this.selectedCB(text,isTrue)

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_TAN_SAN_DA_HA;

        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问


        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.baoFuLiuShou = this.baoFuLiuShou.isSelected();   // 报富留守

        para.biChangZhu = this.biChangZhu.isSelected();     //比常主
        para.qiJiao60 = this.qiJiaofen60.isSelected();   // 60分起叫
        para.chou6 = this.quDiaoLiu.isSelected();   // 去掉6
        para.buKeZaiJiao = this.buKeZaiJiao.isSelected();   // 60分不可再叫

        var _numIdx = 0;
        if (this.playNum3.isSelected()) {
            para.maxPlayer  = 3;
            _numIdx = 0;
            para.biChangZhu  = this.biChangZhu.isSelected();       // 比常主
            para.buKeZaiJiao = this.buKeZaiJiao.isSelected();        // 60分不可再叫
            para.qiJiao60 = true;    // 60分起叫
            para.chou6 = true;     // 去掉6
        }
        else if (this.playNum4.isSelected()) {
            para.maxPlayer  = 4;
            _numIdx = 1;
            if(!this.qiJiaofen60.isSelected())
            {
                para.biChangZhu  = false;       // 比常主
                para.buKeZaiJiao = false;   // 60分不可再叫
            }
            else {
                para.biChangZhu  = this.biChangZhu.isSelected();       // 比常主
                para.buKeZaiJiao = this.buKeZaiJiao.isSelected();        // 60分不可再叫
            }

            para.qiJiao60 = this.qiJiaofen60.isSelected();   // 60分起叫
            para.chou6 = this.quDiaoLiu.isSelected();   // 去掉6
        }

        var _xiaoguangIdx = 0;
        if (this.xiaoGuangFen25.isSelected()) {
            para.xiaoGuangFen  = 25;
            _xiaoguangIdx = 0;
        }
        else if (this.xiaoGuangFen30.isSelected()) {
            para.xiaoGuangFen  = 30;
            _xiaoguangIdx = 1;
        }


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGTAN_SDH_maxPlayer, _numIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGTAN_SDH_xiaoGuang, _xiaoguangIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_buKeZaiJiao, para.buKeZaiJiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_biChangZhu, para.biChangZhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_baoFuLiuShou, para.baoFuLiuShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_60fenQiJiao, para.qiJiao60);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGTAN_SDH_quDiaoLiu, para.chou6);
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayTypeForPlayNum:function(select_number)
    {
        this.selectSpecial(select_number == 0)//选择3人玩法时自动勾选60起叫和去掉6且不可取消，4人玩法禁选60不可再叫和比常住
        this.banNum = select_number;
    },
    selectSpecial:function(bool)
    {
        var color = bool ? MjClient.createRoomNode._selectColor : MjClient.createRoomNode._unSelectColor;
        this.qiJiaofen60.setSelected(bool);
        this.qiJiaofen60.setTouchEnabled(!bool);
        this.qiJiaofen60.setBright(!bool);
        this.qiJiaofen60.getChildByName("text").setTextColor(color);
        this.quDiaoLiu.setSelected(bool);
        this.quDiaoLiu.setTouchEnabled(!bool);
        this.quDiaoLiu.setBright(!bool);
        this.quDiaoLiu.getChildByName("text").setTextColor(color);

        // this.setQiJiaoOption();
    },
    setQiJiaoOption:function(){
        this.canClickQiJiao = true;
        if(this.playNum4.isSelected() && !this.qiJiaofen60.isSelected())
        {
            this.canClickQiJiao = false;
            this.buKeZaiJiao.setSelected(false);
            this.buKeZaiJiao.setTouchEnabled(false);
            this.buKeZaiJiao.setBright(false);
            this.biChangZhu.setSelected(false);
            this.biChangZhu.setTouchEnabled(false);
            this.biChangZhu.setBright(false);
            this.buKeZaiJiao.getChildByName("text").setTextColor(MjClient.createRoomNode._unSelectColor);
            this.biChangZhu.getChildByName("text").setTextColor(MjClient.createRoomNode._unSelectColor);
        }
        else{
            this.buKeZaiJiao.setTouchEnabled(true);
            this.buKeZaiJiao.setBright(true);
            this.biChangZhu.setTouchEnabled(true);
            this.biChangZhu.setBright(true);
        }
    },
    //创建房间 点击范围扩大 使得文字也能点击
    setTextClickXTSDH: function(num) {
        var that = this;
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;

        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event) {
                var back = false;
                if(that.banNum == num) back = true;
                if(back)
                {
                    return false;
                }
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
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)
                // 如果触碰起始地点在本区域中
                if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                    return;

                target.parent.setSelected(!target.parent.isSelected());
                var txt = target.parent.getChildByName("text");
                txt.ignoreContentAdaptWithSize(true);
                if (txt && target.parent.isSelected()) {
                    txt.setTextColor(selectColor);
                } else {
                    txt.setTextColor(unSelectColor);
                }
            }
        });
    },
});