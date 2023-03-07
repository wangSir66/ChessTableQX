/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_rugaoER = CreateRoomNode.extend({
    setKeyByCardFriend:function(){
        this.localStorageKey.KEY_rugaoER_147_xiJiang = "CF_RU_GAO_ER_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugaoER_mengzigun = "CF_RU_GAO_ER_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugaoER_shuanglonghui = "CF_RU_GAO_ER_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugaoER_huimianchuhan = "CF_RU_GAO_ER_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugaoER_haidilaoyue = "CF_RU_GAO_ER_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugaoER_fengdingNum = "CF_RU_GAO_ER_FENG_DING_NUM"; //封顶数
        this.localStorageKey.KEY_rugaoER_daixi = "CF_RU_GAO_ER_DAI_XI"; //带喜
        this.localStorageKey.KEY_rugaoER_shengyihu = "CF_RU_GAO_ER_SHENG_YI_HU"; //剩一胡

        this.localStorageKey.KEY_rugaoER_maizhuang = "CF_RU_GAO_ER_MAI_ZHUANG"; //买装
        this.localStorageKey.KEY_rugaoER_jizi = "CF_RU_GAO_ER_JI_ZI"; //机子
        this.localStorageKey.KEY_rugaoER_qinghu = "CF_RU_GAO_ER_QING_HU"; //清胡
        this.localStorageKey.KEY_rugaoER_piaohu = "CF_RU_GAO_ER_PIAO_HU"; //飘胡
        this.localStorageKey.KEY_rugaoER_tahu = "CF_RU_GAO_ER_TA_HU"; //塔胡100起胡
        this.localStorageKey.KEY_rugaoER_tahu80 = "CF_RU_GAO_ER_TA_HU80"; //塔胡800起胡
        this.localStorageKey.KEY_rugaoER_tahuUnlimited = "CF_RU_GAO_ER_TA_HUUNLIMITED"; //塔胡不限分数

        this.localStorageKey.fanBei = "CF_RU_GAO_ER_FAN_BEI"; //翻倍
        this.localStorageKey.fanBeiScore = "CF_RU_GAO_ER_FAN_BEI_SCORE"; //翻倍分数
    },
    setKey:function(){
        this.localStorageKey.KEY_rugaoER_147_xiJiang = "_RU_GAO_ER_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugaoER_mengzigun = "_RU_GAO_ER_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugaoER_shuanglonghui = "_RU_GAO_ER_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugaoER_huimianchuhan = "_RU_GAO_ER_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugaoER_haidilaoyue = "_RU_GAO_ER_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugaoER_fengdingNum = "_RU_GAO_ER_FENG_DING_NUM"; //封顶数
        this.localStorageKey.KEY_rugaoER_daixi = "_RU_GAO_ER_DAI_XI"; //带喜
        this.localStorageKey.KEY_rugaoER_shengyihu = "_RU_GAO_ER_SHENG_YI_HU"; //剩一胡

        this.localStorageKey.KEY_rugaoER_maizhuang = "_RU_GAO_ER_MAI_ZHUANG"; //买装
        this.localStorageKey.KEY_rugaoER_jizi = "_RU_GAO_ER_JI_ZI"; //机子
        this.localStorageKey.KEY_rugaoER_qinghu = "_RU_GAO_ER_QING_HU"; //清胡
        this.localStorageKey.KEY_rugaoER_piaohu = "_RU_GAO_ER_PIAO_HU"; //飘胡
        this.localStorageKey.KEY_rugaoER_tahu = "_RU_GAO_ER_TA_HU"; //塔胡100起胡
        this.localStorageKey.KEY_rugaoER_tahu80 = "_RU_GAO_ER_TA_HU80"; //塔胡80起胡

        this.localStorageKey.fanBei = "_RU_GAO_ER_FAN_BEI"; //翻倍
        this.localStorageKey.fanBeiScore = "_RU_GAO_ER_FAN_BEI_SCORE"; //翻倍分数
    },

    initAll: function(IsFriendCard) {
        if (!IsFriendCard){
            this.setKey();
        }
        this.bg_node = ccs.load("bg_rugaoER.json").node;

        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_rugaoER");

        //为适配拖动，先把节点获取到
        this._scrollview = this.bg_node.getChildByName("scrollview");
        this._scroll_play = this._scrollview.getChildByName("play");
        this._scroll_round = this._scrollview.getChildByName("round");
    },
    initRoundNode: function() {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode: function() {
        this._super();
        //花
        var _play = this._scroll_play;
        this._playNode_xiJiang_1 = _play.getChildByName("xiJiang147");
        this._playNode_xiJiang_2 = _play.getChildByName("xiJiangquan");
        var nodeList = [];
        nodeList.push(_play.getChildByName("xiJiang147"));
        nodeList.push(_play.getChildByName("xiJiangquan"));
        this._playNode_jiang_radio = createRadioBoxForCheckBoxs(nodeList, this.radioBoxSelectCB);
        this.addListenerText(nodeList, this._playNode_jiang_radio);
        //封顶
        this._playNode_fengding_0 = _play.getChildByName("fengding_0");
        this._playNode_fengding_1 = _play.getChildByName("fengding_1");
        this._playNode_fengding_2 = _play.getChildByName("fengding_2");
        var nodeListfeng = [];
        nodeListfeng.push(_play.getChildByName("fengding_0"));
        nodeListfeng.push(_play.getChildByName("fengding_1"));
        nodeListfeng.push(_play.getChildByName("fengding_2"));
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng, this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng, this._playNode_fengding_radio);
        //增分
        this._playNode_huanglonghui = _play.getChildByName("shuanglonghui");
        this.addListenerText(this._playNode_huanglonghui);
        this._playNode_huanglonghui.addEventListener(this.clickCB, this._playNode_huanglonghui);
        //上限
        this._playNode_mengzigun = _play.getChildByName("mengzigun");
        this.addListenerText(this._playNode_mengzigun);
        this._playNode_mengzigun.addEventListener(this.clickCB, this._playNode_mengzigun);
        //带喜
        this._playNode_daixi = _play.getChildByName("daixi");
        this._playNode_daixi.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.is_daiXi();
                    break;
            }
        },this);
        this.addListenerText(this._playNode_daixi,null,this.is_daiXi.bind(this));
        //剩一胡
        this._playNode_shengyihu = _play.getChildByName("shengyihu");
        this.addListenerText(this._playNode_shengyihu);
        this._playNode_shengyihu.addEventListener(this.clickCB, this._playNode_shengyihu);
        //吃碰杠
        this._playNode_laodilaoyue = _play.getChildByName("laodilaoyue");
        this.addListenerText(this._playNode_laodilaoyue);
        this._playNode_laodilaoyue.addEventListener(this.clickCB, this._playNode_laodilaoyue);
        //麦庄
        this._playNode_maizhuang_0 = _play.getChildByName("maizhuang0");
        this._playNode_maizhuang_1 = _play.getChildByName("maizhuang1");
        this._playNode_maizhuang_2 = _play.getChildByName("maizhuang2");
        this._playNode_maizhuang_3 = _play.getChildByName("maizhuang3");
        this._playNode_maizhuang_4 = _play.getChildByName("maizhuang4");
        var nodeListmai = [];
        nodeListmai.push(_play.getChildByName("maizhuang0"));
        nodeListmai.push(_play.getChildByName("maizhuang1"));
        nodeListmai.push(_play.getChildByName("maizhuang2"));
        nodeListmai.push(_play.getChildByName("maizhuang3"));
        nodeListmai.push(_play.getChildByName("maizhuang4"));
        this._playNode_maizhuang_radio = createRadioBoxForCheckBoxs(nodeListmai,this.radioBoxSelectCB);
        this.addListenerText(nodeListmai, this._playNode_maizhuang_radio);
        this._playNode_jizi = _play.getChildByName("jizi");
        this.addListenerText(this._playNode_jizi);
        this._playNode_jizi.addEventListener(this.clickCB, this._playNode_jizi);



        //qing hu
        var that = this;
        this._playNode_qinghu = _play.getChildByName("qinghu");
        this._playNode_piaohu = _play.getChildByName("piaohu");
        this._playNode_tahu = _play.getChildByName("tahu");
        this._playNode_tahu80 = _play.getChildByName("tahu_80");
        this._playNode_tahuUnlimited = _play.getChildByName("tahu_unlimited");


        this.addListenerText(this._playNode_qinghu,null,function(){
                if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected() && !that._playNode_tahu80.isSelected() && !that._playNode_tahuUnlimited.isSelected())
                {
                    that._playNode_qinghu.setSelected(true);
                    that._playNode_qinghu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                }
                cc.log("====================text isSelected = " + that._playNode_qinghu.isSelected());
        });
        this._playNode_qinghu.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected() && !that._playNode_tahu80.isSelected() && !that._playNode_tahuUnlimited.isSelected())
                    {
                        that._playNode_qinghu.setSelected(true);
                        that._playNode_qinghu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                    }
                    break;
            }
            that.clickCB(sender,type)
        }, this._playNode_qinghu);


        //piao hu
        this.addListenerText(this._playNode_piaohu,null,function(){
            if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected() && !that._playNode_tahu80.isSelected() && !that._playNode_tahuUnlimited.isSelected())
            {
                that._playNode_piaohu.setSelected(true);
                that._playNode_piaohu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
            }
        });
        this._playNode_piaohu.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected() && !that._playNode_tahu80.isSelected() && !that._playNode_tahuUnlimited.isSelected())
                    {
                        that._playNode_piaohu.setSelected(true);
                        that._playNode_piaohu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                    }
                    break;
            }
            that.clickCB(sender,type)
        }, this._playNode_piaohu);

        //ta hu
        this.addListenerText(this._playNode_tahu,null,function(){
            if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected())
            {
                that._playNode_tahu.setSelected(true);
                that._playNode_tahu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
            }
            if(that._playNode_tahu.isSelected() && that._playNode_tahu80.isSelected() || that._playNode_tahu.isSelected() && that._playNode_tahuUnlimited.isSelected())
            {
                that._playNode_tahu80.setSelected(false);
                that._playNode_tahu80.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                that._playNode_tahuUnlimited.setSelected(false);
                that._playNode_tahuUnlimited.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
            }
        });
        this._playNode_tahu.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu.isSelected())
                    {
                        that._playNode_tahu.setSelected(true);
                        that._playNode_tahu.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                    }
                    if(that._playNode_tahu.isSelected() && that._playNode_tahu80.isSelected() || that._playNode_tahu.isSelected() && that._playNode_tahuUnlimited.isSelected())
                    {
                        that._playNode_tahu80.setSelected(false);
                        that._playNode_tahu80.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                        that._playNode_tahuUnlimited.setSelected(false);
                        that._playNode_tahuUnlimited.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                    }
                    break;
            }
            that.clickCB(sender,type)
        }, this._playNode_tahu);

        //ta hu 80
        this.addListenerText(this._playNode_tahu80,null,function(){
            if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu80.isSelected())
            {
                that._playNode_tahu80.setSelected(true);
                that._playNode_tahu80.getChildByName("text").setTextColor(cc.color(237, 101, 1));
            }

            if(that._playNode_tahu.isSelected() && that._playNode_tahu80.isSelected() || that._playNode_tahuUnlimited.isSelected() && that._playNode_tahu80.isSelected())
            {
                that._playNode_tahu.setSelected(false);
                that._playNode_tahu.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                that._playNode_tahuUnlimited.setSelected(false);
                that._playNode_tahuUnlimited.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
            }
        });
        this._playNode_tahu80.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahu80.isSelected())
                    {
                        that._playNode_tahu80.setSelected(true);
                        that._playNode_tahu80.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                    }

                    if(that._playNode_tahu.isSelected() && that._playNode_tahu80.isSelected() || that._playNode_tahuUnlimited.isSelected() && that._playNode_tahu80.isSelected())
                    {
                        that._playNode_tahu.setSelected(false);
                        that._playNode_tahu.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                        that._playNode_tahuUnlimited.setSelected(false);
                        that._playNode_tahuUnlimited.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                    }
                    break;
            }
            that.clickCB(sender,type)
        }, this._playNode_tahu80);

        //ta hu unlimited
        this.addListenerText(this._playNode_tahuUnlimited,null,function(){
            if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahuUnlimited.isSelected())
            {
                that._playNode_tahuUnlimited.setSelected(true);
                that._playNode_tahuUnlimited.getChildByName("text").setTextColor(cc.color(237, 101, 1));
            }
            if(that._playNode_tahu.isSelected() && that._playNode_tahuUnlimited.isSelected() || that._playNode_tahu80.isSelected() && that._playNode_tahuUnlimited.isSelected())
            {
                that._playNode_tahu.setSelected(false);
                that._playNode_tahu.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                that._playNode_tahu80.setSelected(false);
                that._playNode_tahu80.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
            }
        });
        this._playNode_tahuUnlimited.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    if(!that._playNode_qinghu.isSelected() && !that._playNode_piaohu.isSelected() && !that._playNode_tahuUnlimited.isSelected())
                    {
                        that._playNode_tahuUnlimited.setSelected(true);
                        that._playNode_tahuUnlimited.getChildByName("text").setTextColor(cc.color(237, 101, 1));
                    }
                    if(that._playNode_tahu.isSelected() && that._playNode_tahuUnlimited.isSelected() || that._playNode_tahu80.isSelected() && that._playNode_tahuUnlimited.isSelected())
                    {
                        that._playNode_tahu.setSelected(false);
                        that._playNode_tahu.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                        that._playNode_tahu80.setSelected(false);
                        that._playNode_tahu80.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                    }
                    break;
            }
            that.clickCB(sender,type)
        }, this._playNode_tahuUnlimited);

        var that = this;
        this._playNode_shengyihu.schedule(function() {
            if(that._playNode_tahu80.isSelected() || that._playNode_tahu.isSelected() || that._playNode_tahuUnlimited.isSelected())
            {
                that._playNode_shengyihu.visible = true;
            }
            else
            {
                that._playNode_shengyihu.visible = false;
            }
        });

        this.initExtraPlayNode(_play);
    },
    initExtraPlayNode: function(_playWay) {
        // 大结算翻倍
        if (_playWay.getChildByName("bufanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_playWay.getChildByName("bufanbei"));
            nodeListFanBei.push(_playWay.getChildByName("fan2bei"));
            nodeListFanBei.push(_playWay.getChildByName("fan3bei"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB.bind(this));
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index, sender) {
                that.fanBeiRadioBoxSelectCB(index, sender, nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            // 少于score翻2倍
            var subButton1 = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton1 = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel1 = nodeListFanBei[1].getChildByName("score");
            subButton1.addTouchEventListener(function(sender, type) {
                if (type === 2) {
                    var curScore = parseInt(scoreLabel1.getString());
                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }
                    scoreLabel1.setString(curScore + "分");
                }
            }, this);

            addButton1.addTouchEventListener(function(sender, type) {
                if (type === 2) {
                    var curScore = parseInt(scoreLabel1.getString());
                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }
                    scoreLabel1.setString(curScore + "分");
                }
            }, this);


            // 少于score翻3倍
            var subButton2 = nodeListFanBei[2].getChildByName("btn_sub");
            var addButton2 = nodeListFanBei[2].getChildByName("btn_add");
            var scoreLabel2 = nodeListFanBei[2].getChildByName("score");
            subButton2.addTouchEventListener(function(sender, type) {
                if (type === 2) {
                    var curScore = parseInt(scoreLabel2.getString());
                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }
                    scoreLabel2.setString(curScore + "分");
                }
            }, this);

            addButton2.addTouchEventListener(function(sender, type) {
                if (type === 2) {
                    var curScore = parseInt(scoreLabel2.getString());
                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }
                    scoreLabel2.setString(curScore + "分");
                }
            }, this);
        }
    },
    setPlayNodeCurrentSelect: function(isClub) {
        this._super();
        var __isxijiang147;
        if (isClub) {
            _isxijiang147 = this.getBoolItem("xijiang", false);
        }else{
            _isxijiang147 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_147_xiJiang, false);
        }
        var list = [];
        list.push(this._playNode_xiJiang_1);
        list.push(this._playNode_xiJiang_2);
        var index = _isxijiang147 == true ? 0 : 1;
        this._playNode_xiJiang_1.setSelected(_isxijiang147);
        this._playNode_xiJiang_2.setSelected(!_isxijiang147);
        this.radioBoxSelectCB(index, list[index], list);

        var _fengxiangNum;
        if (isClub) {
            _fengxiangNum = this.getNumberItem("fengding",0);
        }else{
            _fengxiangNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugaoER_fengdingNum, 0);
        }
        this._playNode_fengding_0.setSelected(false);
        this._playNode_fengding_1.setSelected(false);
        this._playNode_fengding_2.setSelected(false);
        var list = [];
        list.push(this._playNode_fengding_0);
        list.push(this._playNode_fengding_1);
        list.push(this._playNode_fengding_2);
        var index = _fengxiangNum == 0 ? 0 : (_fengxiangNum == 600 ? 1 : 2);
        this["_playNode_fengding_" + index].setSelected(true);
        this.radioBoxSelectCB(index, list[index], list);

        var _mengziguan;
        if (isClub) {
            _mengziguan = this.getBoolItem("menzigun",false);
        }else{
            _mengziguan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_mengzigun, false);
        } 
        this._playNode_mengzigun.setSelected(_mengziguan);
        var text = this._playNode_mengzigun.getChildByName("text");
        this.selectedCB(text, _mengziguan)

        var _huanglonghui;
        if (isClub) {
            _huanglonghui = this.getBoolItem("shuanglonghui",true);
        }else{
            _huanglonghui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_shuanglonghui, true);
        } 
        this._playNode_huanglonghui.setSelected(_huanglonghui);
        var text = this._playNode_huanglonghui.getChildByName("text");
        this.selectedCB(text, _huanglonghui)

        var _daixi;
        if (isClub) {
            _daixi = this.getBoolItem("daixi",true);
        }else{
            _daixi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_daixi, true);
        } 
        this._playNode_daixi.setSelected(_daixi);
        var text = this._playNode_daixi.getChildByName("text");
        this.selectedCB(text, _daixi)
        this.is_daiXi();

        var _shengyihu;
        if (isClub) {
            _shengyihu = this.getBoolItem("shengyihu",false);
        }else{
            _shengyihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_shengyihu, false);
        } 
        this._playNode_shengyihu.setSelected(_shengyihu);
        var text = this._playNode_shengyihu.getChildByName("text");
        this.selectedCB(text, _shengyihu)

        var _haidilaoyue;
        if (isClub) {
            _haidilaoyue = this.getBoolItem("haidilaoyue",false);
        }else{
            _haidilaoyue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_haidilaoyue, false);
        } 
        this._playNode_laodilaoyue.setSelected(_haidilaoyue);
        var text = this._playNode_laodilaoyue.getChildByName("text");
        this.selectedCB(text, _haidilaoyue)

        var _maiNum;
        if (isClub) {
            _maiNum = this.getNumberItem("maizhuang",0);
        }else{
            _maiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugaoER_maizhuang, 0);
        } 
        this._playNode_maizhuang_0.setSelected(false);
        this._playNode_maizhuang_1.setSelected(false);
        this._playNode_maizhuang_2.setSelected(false);
        this._playNode_maizhuang_3.setSelected(false);
        this._playNode_maizhuang_4.setSelected(false);
        var list = [];
        list.push(this._playNode_maizhuang_0);
        list.push(this._playNode_maizhuang_1);
        list.push(this._playNode_maizhuang_2);
        list.push(this._playNode_maizhuang_3);
        list.push(this._playNode_maizhuang_4);
        var index = 0;
        if (_maiNum == 0) {
            this._playNode_maizhuang_0.setSelected(true);
        } else if (_maiNum == 123) {
            this._playNode_maizhuang_1.setSelected(true);
        } else if (_maiNum == 234) {
            this._playNode_maizhuang_2.setSelected(true);
        } else if (_maiNum == 345) {
            this._playNode_maizhuang_3.setSelected(true);
        } else if (_maiNum == 5710) {
            this._playNode_maizhuang_4.setSelected(true);
        }
        this.radioBoxSelectCB(index, list[index], list);

        var _jizi;
        if (isClub) {
            _jizi = this.getBoolItem("jizi",true);
        }else{
            _jizi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_jizi, true);
        } 
        this._playNode_jizi.setSelected(_jizi);
        var text = this._playNode_jizi.getChildByName("text");
        this.selectedCB(text, _jizi);

        var _qinghu;
        if (isClub) {
            _qinghu = this.getBoolItem("qinghu",true);
        }else{
            _qinghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_qinghu, true);
        } 
        this._playNode_qinghu.setSelected(_qinghu);
        var text = this._playNode_qinghu.getChildByName("text");
        this.selectedCB(text, _qinghu);

        var _piaohu;
        if (isClub) {
            _piaohu = this.getBoolItem("piaohu",true);
        }else{
            _piaohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_piaohu, true);
        } 
        this._playNode_piaohu.setSelected(_piaohu);
        var text = this._playNode_piaohu.getChildByName("text");
        this.selectedCB(text, _piaohu);

        var _tahu;
        if (isClub) {
            _tahu = this.getBoolItem("tahu",true);
        }else{
            _tahu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_tahu, true);
        } 
        this._playNode_tahu.setSelected(_tahu);
        var text = this._playNode_tahu.getChildByName("text");
        this.selectedCB(text, _tahu);

        var _tahu80;
        if (isClub) {
            _tahu80 = this.getBoolItem("tahu80",false);
        }else{
            _tahu80 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_tahu80, false);
        } 
        this._playNode_tahu80.setSelected(_tahu80);
        var text = this._playNode_tahu80.getChildByName("text");
        this.selectedCB(text, _tahu80);

        var _tahuUnlimited;
        if (isClub) {
            _tahuUnlimited = this.getBoolItem("tahuUnlimited",false);
        }else{
            _tahuUnlimited = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugaoER_tahuUnlimited, false);
        } 
        this._playNode_tahuUnlimited.setSelected(_tahuUnlimited);
        var text = this._playNode_tahuUnlimited.getChildByName("text");
        this.selectedCB(text, _tahuUnlimited);

        if (!this._playNode_tahu.isSelected() && !this._playNode_tahu80.isSelected() && !this._playNode_tahuUnlimited.isSelected()) {
            this._playNode_shengyihu.setSelected(false);//兼容已保存规则俱乐部；
        }


        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiOption = this.getNumberItem("fanBei", 0);
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption);
            this.nodeListFanBei[1].getChildByName("score").setString("10分");
            this.nodeListFanBei[2].getChildByName("score").setString("10分");
            if(fanBeiOption === 1 || fanBeiOption === 2) {
                this.nodeListFanBei[fanBeiOption].getChildByName("score").setString(fanBeiScore + "分");
            }
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }
    },

    is_daiXi:function(){
        if (this._playNode_daixi.isSelected()) {
            this._playNode_xiJiang_1.setVisible(true);
            this._playNode_xiJiang_2.setVisible(true);
        }else{
            this._playNode_xiJiang_1.setVisible(false);
            this._playNode_xiJiang_2.setVisible(false);
        }
        var text = this._playNode_daixi.getChildByName("text");
        this.selectedCB(text, this._playNode_daixi.isSelected() == true);
    },
    getSelectedPara: function() {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.RU_GAO_ER;
        para.maxPlayer = 2;
        //para.flowerType = WithFlowerType.noFlower;
        para.menzigun = false;
        para.shuanglonghui = false;
        para.huimianchuhan = false;
        para.haidilaoyue = false;
        para.fengding = 0;
        para.daixi = true;
        para.shengyihu = true;
        para.maizhuang = 0;
        para.jizi = true;
        para.qinghu = true;
        para.piaohu = true;
        para.tahu = true;
        para.tahu80 = false;
        para.tahuUnlimited = false;
        para.fanBei = this.fanbei_radio.getSelectIndex();
        var labelString = 0;
        if(para.fanBei) {
            labelString = this.nodeListFanBei[para.fanBei].getChildByName("score").getString();
        }
        para.fanBeiScore = parseInt(labelString);

        var isxiJiang147 = false;
        para.daixi = this._playNode_daixi.isSelected();
        
        //喜将
        if (para.daixi) {
            if (this._playNode_xiJiang_1.isSelected()) {
                para.xijiang = "xijiang147";
                isxiJiang147 = true;
            } else if (this._playNode_xiJiang_2.isSelected()) {
                para.xijiang = "xijiangQuan";
                isxiJiang147 = false;
            } 
        }

        //封顶
        para.fengding = this._playNode_fengding_0.isSelected() == true ? 0 : (this._playNode_fengding_1.isSelected() == true ? 600 : 800);
        
        //闷子棍
        para.menzigun = this._playNode_mengzigun.isSelected() == true ? true : false;
        
        //双龙会
        if (this._playNode_huanglonghui.isSelected()) {
            para.shuanglonghui = true;
        } else {
            para.shuanglonghui = false;
        }
        
        //海底捞月
        para.haidilaoyue = this._playNode_laodilaoyue.isSelected() == true ? true : false;
        

        if (this._playNode_maizhuang_0.isSelected()) {
            para.maizhuang = 0;
        } else if (this._playNode_maizhuang_1.isSelected()) {
            para.maizhuang = 123;
        } else if (this._playNode_maizhuang_2.isSelected()) {
            para.maizhuang = 234;
        } else if (this._playNode_maizhuang_3.isSelected()) {
            para.maizhuang = 345;
        } else if (this._playNode_maizhuang_4.isSelected()) {
            para.maizhuang = 5710;
        }
       

        para.jizi = this._playNode_jizi.isSelected();
        
        para.qinghu = this._playNode_qinghu.isSelected();
        
        para.piaohu = this._playNode_piaohu.isSelected();
        
        para.tahu = this._playNode_tahu.isSelected();
        
        para.tahu80 = this._playNode_tahu80.isSelected();

        para.tahuUnlimited = this._playNode_tahuUnlimited.isSelected();
        
        para.shengyihu = this._playNode_shengyihu.isSelected();
        if (!para.tahu && !para.tahu80 && !para.tahuUnlimited) {
            para.shengyihu = false;
        }
        

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_daixi, para.daixi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_147_xiJiang, isxiJiang147);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugaoER_fengdingNum, para.fengding);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_mengzigun, para.menzigun);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_shuanglonghui, para.shuanglonghui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_haidilaoyue, para.haidilaoyue);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugaoER_maizhuang, para.maizhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_jizi, para.jizi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_qinghu, para.qinghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_piaohu, para.piaohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_tahu, para.tahu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_tahu80, para.tahu80);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_tahuUnlimited, para.tahuUnlimited);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugaoER_shengyihu, para.shengyihu);

            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBeiScore, para.fanBeiScore);
            }
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});