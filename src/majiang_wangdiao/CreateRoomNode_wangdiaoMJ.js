/**
 * Created by maoyu on 2017/7/21.
 */
var CustomScoreLayer_wangDiao = cc.Layer.extend({
    _textField: null,
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
        },
        back: {
            _layout: [[0.7, 0.7], [0.5, 0.5], [0, 0]],
            close: {
                _visible: false,
                _click: function () {
                    MjClient.customScoreLayer.node.removeFromParent();
                }
            },
            xiaotanchuang: {
                TextField_1: {
                    _run: function () {
                        this.setTouchEnabled(false);
                    }
                }
            }
        }
    },
    ctor: function(){
        this._super();
        var UINode = ccs.load("customBaseScoreLayer.json").node;
        MjClient.Scene.addChild(UINode);
        this.setName("CustomScoreLayer");
        this.node = UINode;
        MjClient.customScoreLayer = this;
        MjClient._customValue = "";
        BindUiAndLogic(UINode, this.jsBind);
        var self = this;

        var _back = UINode.getChildByName("back");
        this._textField = _back.getChildByName("xiaotanchuang").getChildByName("TextField_1");

        //数字按键
        var _num = _back.getChildByName("num");
        for (var i = 0; i <= 9; i++) {
            var _btnNum = _num.getChildByName("Button_" + i);
            _btnNum.setTag(i);
            _btnNum.addTouchEventListener(function (sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    var itag = sender.getTag();
                    self.InputPlaybackNumber(itag);
                }
            }, this);
        }

        //清除所有
        var _clear = _num.getChildByName("clear");
        _clear.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    self.InputPlaybackNumber(-2);
                    break;
                default :
                    break;
            }
        }, this);

        //删除
        var _del = _num.getChildByName("del");
        _del.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    self.InputPlaybackNumber(-1);
                    break;
                default :
                    break;
            }
        }, this);

        //确定
        var btnSure = _back.getChildByName("btnSure");
        btnSure.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    if(!(parseInt(MjClient._customValue) >= 100 && parseInt(MjClient._customValue) <= 1000 &&
                        MjClient._customValue.substr(0, 1) !== "0" ) ){
                        MjClient.showToast("请输入正确的封顶分");
                        MjClient._customValue = "100";
                        this._textField.setString(MjClient._customValue);
                    }else{
                        MjClient.diFenText.string = MjClient._customValue;
                        UINode.removeFromParent();
                    }
                    break;
                default:
                    break;
            }
        }, this);
        return true;
    },

    InputPlaybackNumber: function(n) {
        var change = true;
        if(n >= 0 && MjClient._customValue.length < 15)
            MjClient._customValue += n;
        else if(n === -1 && MjClient._customValue.length > 0)
            MjClient._customValue = MjClient._customValue.substring(0, MjClient._customValue.length - 1);
        else if(n === -2 && MjClient._customValue.length > 0)
            MjClient._customValue = "";
        else
            change = false;
        if(change) {
            this._textField.setString(MjClient._customValue);
        }

        if(MjClient._customValue.length >= 4 && parseInt(MjClient._customValue) > 1000){
            MjClient.showToast("封顶分输入超限");
            MjClient._customValue = "100";
            this._textField.setString(MjClient._customValue);
        }
    }
});
 
var CreateRoomNode_wangdiaoMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_wangdiaoMJ_maxPlayer       = "_wangdiaoMJ_maxPlayer";      //几人玩
            this.localStorageKey.KEY_wangdiaoMJ_isLiangpian     = "_wangdiaoMJ_isLiangPian";    //是否 两片
            this.localStorageKey.KEY_wangdiaoMJ_isQiangGangHu   = "_wangdiaoMJ_isQiangGangHu";  //是否 抢杠胡
            this.localStorageKey.KEY_wangdiaoMJ_maPai           = "_wangdiaoMJ_maPai";          //码牌
            this.localStorageKey.KEY_wangdiaoMJ_maFen           = "_wangdiaoMJ_maFen";          //码分
            this.localStorageKey.KEY_wangdiaoMJ_qidui           = "_wangdiaoMJ_qiDui";          //七对可胡
            this.localStorageKey.KEY_wangdiaoMJ_pengpenghu      = "_wangdiaoMJ_pengpenghu";     //碰碰胡
            this.localStorageKey.KEY_wangdiaoMJ_difen_two       = "_wangdiaoMJ_difen_two";       //底分2分
            this.localStorageKey.KEY_wangdiaoMJ_wu_tong         = "_wangdiaoMJ_wu_tong ";       //无筒
            this.localStorageKey.KEY_wangdiaoMJ_zhuangXian      = "_wangdiaoMJ_zhuangXian";     //庄闲分
            this.localStorageKey.KEY_wangdiaoMJ_tuoguan         = "_wangdiaoMJ_tuoguan";        //托管
            this.localStorageKey.KEY_wangdiaoMJ_fengDing        = "_wangdiaoMJ_fengDing";       //封顶
            this.localStorageKey.KEY_wangdiaoMJ_quanjufengding  = "_wangdiaoMJ_quanjufengding";//全局封顶
            this.localStorageKey.KEY_wangdiaoMJ_piaofen         = "_wangdiaoMJ_pianFen";    //飘分
            this.localStorageKey.KEY_wangdiaoMJ_quankaifang     = "_wangdiaoMJ_quanKaiFang";    //全开放
            this.localStorageKey.KEY_wangdiaoMJ_trustWay        = "_wangdiaoMJ_TRUST_WAY"; // 托管方式
        }

        this.roundNumObj = {roundNum1:6, roundNum2:8, roundNum3:16};
        this.localStorageKey.KEY_wangdiaoMJ_jieSuanDiFen= "_wangdiaoMJ_jieSuanDiFen";   //积分底分

        this.bg_node = ccs.load("bg_wangdiao.json").node;
        this.addChild(this.bg_node);

        this.bg_node = this.bg_node.getChildByName("bg_wangdiaoMJ");  
        this.jieSuanDiFen = this.bg_node.getChildByName("jieSuanDiFen");
        this.bg_node = this.bg_node.getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play"); 
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play"); 
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer_free"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio),maxPlayerList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,3,this.maxPlayerList_radio),maxPlayerList[3].getChildByName("text"));

  
        // 玩法
        this._playNode_liangPian = _play.getChildByName("play_liangpian");
        cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
            if(this._playNode_liangPian.isSelected()){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this)),this._playNode_liangPian.getChildByName("text")); ; 
        this._playNode_liangPian.addEventListener(function(sender, type){
            this._clickCB(sender, type);
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this), this._playNode_liangPian); 
        
        
        this._playNode_qiangGangHu = _play.getChildByName("play_qiangganghu");
        cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
            if(this._playNode_qiangGangHu.isSelected()){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this)),this._playNode_qiangGangHu.getChildByName("text")); 
        this._playNode_qiangGangHu.addEventListener(function(sender, type){
            this._clickCB(sender, type);
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this), this._playNode_qiangGangHu); 

        this._playNode_qiDui = _play.getChildByName("play_qidui");
        cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
            if(this._playNode_qiDui.isSelected()){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this)),this._playNode_qiDui.getChildByName("text")); 
        this._playNode_qiDui.addEventListener(function(sender, type){
            this._clickCB(sender, type);
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this), this._playNode_qiDui);

        this._play_pengpenghu = _play.getChildByName("play_pengpenghu");
        cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
            if(this._play_pengpenghu.isSelected()){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this)),this._play_pengpenghu.getChildByName("text")); 
        this._play_pengpenghu.addEventListener(function(sender, type){
            this._clickCB(sender, type);
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.upDateQuanKaiFang(false);
            }
        }.bind(this), this._play_pengpenghu);

        this._play_difen_two = _play.getChildByName("play_difen_two");
        cc.eventManager.addListener(this.setTextClick(),this._play_difen_two.getChildByName("text")); 
        this._play_difen_two.addEventListener(this._clickCB, this._play_difen_two);

        this._playNode_zhuangXian = _play.getChildByName("play_zhuangxian");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_zhuangXian.getChildByName("text")); 
        this._playNode_zhuangXian.addEventListener(this._clickCB, this._playNode_zhuangXian);

        this._play_wu_tong = _play.getChildByName("play_wutong");
        cc.eventManager.addListener(this.setTextClick(),this._play_wu_tong.getChildByName("text")); 
        this._play_wu_tong.addEventListener(this._clickCB, this._play_wu_tong);

        //飘分
        this._play_piaoFen = _play.getChildByName("play_piaofen");
        if(this._play_piaoFen){
            cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
                if(this._play_piaoFen.isSelected()){
                    this.upDateQuanKaiFang(false);
                }
            }.bind(this)),this._play_piaoFen.getChildByName("text")); 
            this._play_piaoFen.addEventListener(function(sender, type){
                this._clickCB(sender, type);
                if(type == ccui.CheckBox.EVENT_SELECTED){
                    this.upDateQuanKaiFang(false);
                }
            }.bind(this), this._play_piaoFen);
        }
        
        
        //全开放
        this._play_quanKaiFang = _play.getChildByName("play_quanKaiFang");
        if(this._play_quanKaiFang){
            cc.eventManager.addListener(this.setTextClick(null, null, null, function(){
                if(this._play_quanKaiFang.isSelected()){
                    this.updateOtherWanFaItem(false);
                }
            }.bind(this)),this._play_quanKaiFang.getChildByName("text")); 
            this._play_quanKaiFang.addEventListener(function(sender, type){
                this._clickCB(sender, type);
                if(type == ccui.CheckBox.EVENT_SELECTED){
                    this.updateOtherWanFaItem(false);
                }
            }.bind(this), this._play_quanKaiFang);
        }
 
        var mapaiTypeList = [];
        mapaiTypeList.push(_play.getChildByName("xiType1"));
        mapaiTypeList.push(_play.getChildByName("xiType2")); 
        mapaiTypeList.push(_play.getChildByName("xiType3"));
        mapaiTypeList.push(_play.getChildByName("xiType4"));
        this.mapaiTypeList_redio = createRadioBoxForCheckBoxs(mapaiTypeList,this.radioBoxSelectCB); 

        cc.eventManager.addListener(this.setTextClick(mapaiTypeList,0,this.mapaiTypeList_redio),mapaiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(mapaiTypeList,1,this.mapaiTypeList_redio),mapaiTypeList[1].getChildByName("text")); 
        cc.eventManager.addListener(this.setTextClick(mapaiTypeList,2,this.mapaiTypeList_redio),mapaiTypeList[2].getChildByName("text")); 
        cc.eventManager.addListener(this.setTextClick(mapaiTypeList,3,this.mapaiTypeList_redio),mapaiTypeList[3].getChildByName("text")); 
 

        // var maFenList = [];
        // maFenList.push(_play.getChildByName("maFen1"));
        // maFenList.push(_play.getChildByName("maFen2"));
        // this.maFenList_redio = createRadioBoxForCheckBoxs(maFenList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(maFenList,0,this.maFenList_redio),maFenList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(maFenList,1,this.maFenList_redio),maFenList[1].getChildByName("text")); 

        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex -= 1;
                if(fenIndex < 0){
                    fenIndex = diFenArr.length-1;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10]
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex += 1;
                if(fenIndex >= diFenArr.length){
                    fenIndex = 0;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
        }         

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            //封顶
            var fengDingNodeList = [];
            var fengDingNodeCount = 4;
            for(var i = 0; i < fengDingNodeCount; i++){
                fengDingNodeList.push(_play.getChildByName("fengding_"+ i));
            }
            this._playNode_player_fengDing_radio = createRadioBoxForCheckBoxs(fengDingNodeList, this.radioBoxSelectCB);
            this.addListenerText(fengDingNodeList, this._playNode_player_fengDing_radio);
            this.fengDingNodeList = fengDingNodeList;
            
            //托管
            var tuoguanNodeList = [];
            tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan4"));
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

            //托管方式
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

        //全局封顶
        if(_play.getChildByName("quanjubufengding")){
            var quanjufengdingList = [];
            quanjufengdingList.push(_play.getChildByName("quanjubufengding"));
            quanjufengdingList.push(_play.getChildByName("quanjufengding"));
            this.quanjufengdingList_radio = createRadioBoxForCheckBoxs(quanjufengdingList,this.radioBoxSelectCB);
            this.addListenerText(quanjufengdingList, this.quanjufengdingList_radio);

            var scorePanel = _play.getChildByName("quanjufengdingScore");
            var minScore = 100; var maxScore = 1000; var stepScore = 50;
            scorePanel.getChildByName("text_diFen").string = 100;
            var subBtn = scorePanel.getChildByName("btn_sub");
            subBtn.addTouchEventListener(function(sender, eventType){
                if(eventType == ccui.Widget.TOUCH_ENDED){
                    var score = parseInt(scorePanel.getChildByName("text_diFen").string);
                    score -= stepScore;
                    score = score < minScore ? maxScore : score;
                    scorePanel.getChildByName("text_diFen").string = score;
                }
            });
            var addBtn = scorePanel.getChildByName("btn_add");
            addBtn.addTouchEventListener(function(sender, eventType){
                if(eventType == ccui.Widget.TOUCH_ENDED){
                    var score = parseInt(scorePanel.getChildByName("text_diFen").string);
                    score += stepScore;
                    score = score > maxScore ? minScore : score;
                    scorePanel.getChildByName("text_diFen").string = score;
                }
            });

            var callback = function(){
                var layer = MjClient.Scene.getChildByName("CustomScoreLayer_wangDiao");
                if(layer) layer.removeFromParent();
                MjClient.Scene.addChild(new CustomScoreLayer_wangDiao());
            };

            MjClient.diFenText = scorePanel.getChildByName("text_diFen");
            MjClient.diFenText.ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick_wangDiao(null, null, null, callback), scorePanel.getChildByName("text_diFen"));

            descBtn = scorePanel.getChildByName("btn_desc");
            var descLabel = scorePanel.getChildByName("image_tip");
            descBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    descLabel.setVisible(true);
                }
            }, descBtn);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                status: null,
                onTouchBegan: function(touch, event) {
                    if (descLabel.isVisible()) {
                        descLabel.setVisible(false);
                        return true;
                    } else {
                        return false;
                    }
                },
            }, descLabel);
        }

        this.schedule(function(sender,type)
        {
            var index = this.maxPlayerList_radio.getSelectIndex();
            if (MjClient.MaxPlayerNum != 4 - index)
            {
                MjClient.MaxPlayerNum = 4 - index;
                this.changeAAPayForPlayerNum();
            }

            this._play_wu_tong.visible = index > 1;
        },0.1);
    },

    //更新全开放选项
    upDateQuanKaiFang: function(isSelected){
        if(this._play_quanKaiFang && this._play_quanKaiFang.isSelected()){
            this._play_quanKaiFang.setSelected(isSelected);
            var txt = this._play_quanKaiFang.getChildByName("text");
            this.radioTextColor(txt, isSelected);    
        }
    },

    //更新其他选项
    updateOtherWanFaItem: function(isSelected){
        this._playNode_liangPian.setSelected(isSelected); 
        var txt = this._playNode_liangPian.getChildByName("text");
        this.radioTextColor(txt, isSelected);

        if(this._play_piaoFen){
            this._play_piaoFen.setSelected(isSelected);
            var txt = this._play_piaoFen.getChildByName("text");
            this.radioTextColor(txt, isSelected);        
        }

        this._playNode_qiangGangHu.setSelected(isSelected); 
        var txt = this._playNode_qiangGangHu.getChildByName("text");
        this.radioTextColor(txt, isSelected);
        
        this._playNode_qiDui.setSelected(isSelected);
        var txt = this._playNode_qiDui.getChildByName("text");
        this.radioTextColor(txt, isSelected);

        this._play_pengpenghu.setSelected(isSelected);
        var txt = this._play_pengpenghu.getChildByName("text");
        this.radioTextColor(txt, isSelected); 
    },

    setTrustWayPanel: function(trustTimeIdx){
        if(!this.tuoguanWayNodeList) return;
        this.trustWatTitle.visible = trustTimeIdx != 0;
        for(var i = 0; i < this.tuoguanWayNodeList.length; i++){
            this.tuoguanWayNodeList[i].visible =  trustTimeIdx != 0;
        }
    },

    //创建房间 点击范围扩大 使得文字也能点击
    setTextClick_wangDiao: function(listnode, number, radio, callback) {
        var that = this;
        var _callback = callback || function(){};
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;

        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event) {
                if(radio) radio.childIsMove = false;
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
                if(radio) radio.childIsMove = true;
            },
            onTouchEnded: function(touch, event) {
                if(radio && radio.childIsMove) return;   // 如果复选框的子节点（文字或者图片）被滑动，则阻止事件触发
                _callback();
            }
        });
    },

    _clickEvent: function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            var tag = sender.tag;
            if(tag == 1){
                // this._mingZhuaDesc.visible = true;
            }else{
                // this._anZhuaDesc.visible = true;
            }
        }
        if(type == ccui.Widget.TOUCH_CANCELED || type == ccui.Widget.TOUCH_ENDED){
            // this._mingZhuaDesc.visible = false;
            // this._anZhuaDesc.visible = false;            
        }
    },

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play"); 
        var list = [];
        index = 0;

        var _maxPlayer;
        if(isClub){
            _maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
            if(this.getBoolItem("convertible", false)){
                _maxPlayer = 3;
            }
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        //fix by 千千
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        list.push(_play.getChildByName("maxPlayer_free"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 
 

 

        var _liangpian;
        if(isClub){
            _liangpian = this.getBoolItem("isLiangPian",false);
        }else{
            _liangpian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_isLiangpian, false);
        }
        this._playNode_liangPian.setSelected(_liangpian); 
        var txt = this._playNode_liangPian.getChildByName("text");
        this.radioTextColor(txt, _liangpian);
        // if(_liangpian){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _qiangganghu;
        if(isClub){
            _qiangganghu = this.getBoolItem("isQiangGangHu",false);
        }else{
            _qiangganghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_isQiangGangHu, false);
        }
        this._playNode_qiangGangHu.setSelected(_qiangganghu); 
        var txt = this._playNode_qiangGangHu.getChildByName("text");
        this.radioTextColor(txt, _qiangganghu);
        // if(_qiangganghu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }
        
 
        var _mapai;
        if(isClub){
            _mapai = [4,6,8,0].indexOf(this.getNumberItem("maPai",4));
        }else{
            _mapai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maPai, 0);
        }
        this.mapaiTypeList_redio.selectItem(_mapai);
        var mapaiList = []; 
        mapaiList.push(_play.getChildByName("xiType1"));
        mapaiList.push(_play.getChildByName("xiType2"));
        mapaiList.push(_play.getChildByName("xiType3"));
        mapaiList.push(_play.getChildByName("xiType4"));
        this.radioBoxSelectCB(_mapai,mapaiList[_mapai],mapaiList); 
        
        // var _maFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maFen, 0);
        // if(isClub){
        //     _maFen = [1,2].indexOf(this.getNumberItem("maFen",1));
        // }
        // this.maFenList_redio.selectItem(_mapai);
        // var maFenList = []; 
        // maFenList.push(_play.getChildByName("maFen1"));
        // maFenList.push(_play.getChildByName("maFen2"));
        // this.radioBoxSelectCB(_maFen,maFenList[_maFen],maFenList);        
        //庄闲分
        var _zhuangxianfen;
        if(isClub){
            _zhuangxianfen = this.getBoolItem("zhuangxianfen", false);
        }else{
            _zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_zhuangXian,false);
        }
        this._playNode_zhuangXian.setSelected(_zhuangxianfen);
        var txt = this._playNode_zhuangXian.getChildByName("text");
        this.radioTextColor(txt, _zhuangxianfen);
        //七对可胡
        var _qidui;
        if(isClub){
            _qidui = this.getBoolItem("qidui", false);
        }else{
            _qidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_qidui,false);
        }
        this._playNode_qiDui.setSelected(_qidui);
        var txt = this._playNode_qiDui.getChildByName("text");
        this.radioTextColor(txt, _qidui);        

        var _pengpenghu;
        if(isClub){
            _pengpenghu = this.getBoolItem("pengpenghu", false);
        }else{
            _pengpenghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_pengpenghu,false);
        }
        this._play_pengpenghu.setSelected(_pengpenghu);
        var txt = this._play_pengpenghu.getChildByName("text");
        this.radioTextColor(txt, _pengpenghu);  

        var _difen_two;
        if(isClub){
            _difen_two = this.getBoolItem("isErfen", false);
        }else{
            _difen_two = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_difen_two,false);
        }
        this._play_difen_two.setSelected(_difen_two);
        var txt = this._play_difen_two.getChildByName("text");
        this.radioTextColor(txt, _difen_two);

        var _wu_tong;
        if(isClub){
            _wu_tong = this.getBoolItem("wuTong", false);
        }else{
            _wu_tong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_wu_tong,false);
        }
        this._play_wu_tong.setSelected(_wu_tong);
        var txt = this._play_wu_tong.getChildByName("text");
        this.radioTextColor(txt, _wu_tong);

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            //封顶
            var fengDing;
            if(isClub)
                fengDing = this.getNumberItem("fengDing", 0);
            else
                fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_fengDing, 0);
            var selectedIndex = [0, 30, 60, 100].indexOf(fengDing);
            this._playNode_player_fengDing_radio.selectItem(selectedIndex);
            this.radioBoxSelectCB(selectedIndex, this.fengDingNodeList[index], this.fengDingNodeList);
            
            //托管
            var _trustTime;
            if (isClub)
                _trustTime = this.getNumberItem("trustTime", 0);
            else
                _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_tuoguan, 0);
            var index = [0,60,120,180,300].indexOf(_trustTime);
            this._playNode_player_tuoguan_radio.selectItem(index);
            this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

            var trustWay;
            if(isClub){
                trustWay = this.getNumberItem("trustWay", 0);
            }else{
                trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wangdiaoMJ_trustWay, 0);
            }
            this._playNode_player_tuoguanType_radio.selectItem(trustWay);
            this.radioBoxSelectCB(trustWay, this.tuoguanWayNodeList[trustWay], this.tuoguanWayNodeList);
            this.setTrustWayPanel(index);
        }

        //全局封顶
        if(this.quanjufengdingList_radio){
            var fengdingScore;
            if(isClub){
                fengdingScore = this.getNumberItem("quanjufengdingScore",0);
            }else{
                fengdingScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_quanjufengding, 0);
            }
            var index = fengdingScore > 0 ? 1 : 0;
            this.quanjufengdingList_radio.selectItem(index);
            var quanjufengdingList = [];
            quanjufengdingList.push(_play.getChildByName("quanjubufengding"));
            quanjufengdingList.push(_play.getChildByName("quanjufengding"));
            this.radioBoxSelectCB(index, quanjufengdingList[index], quanjufengdingList);
            if(fengdingScore > 0){
                _play.getChildByName("quanjufengdingScore").getChildByName("text_diFen").string = fengdingScore;
            }
        }

        if(this._play_piaoFen){
            var piaoFen;
            if(isClub){
                piaoFen = this.getBoolItem("piaoFen", false);
            }else{
                piaoFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_piaofen, false);
            }
            this._play_piaoFen.setSelected(piaoFen);
            var txt = this._play_piaoFen.getChildByName("text");
            this.radioTextColor(txt, piaoFen);        
        }

        if(this._play_quanKaiFang){
            var quanKaiFang;
            if(isClub){
                quanKaiFang = this.getBoolItem("quanKaiFang", false);
            }else{
                quanKaiFang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wangdiaoMJ_quankaifang, false);
            }
            this._play_quanKaiFang.setSelected(quanKaiFang);
            var txt = this._play_quanKaiFang.getChildByName("text");
            this.radioTextColor(txt, quanKaiFang);
            if(quanKaiFang){
                this.updateOtherWanFaItem(false);
            }
        }

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();  
        var isWuTong = this._play_wu_tong.isSelected();
        var para = {};
        para.gameType = MjClient.GAME_TYPE.WANG_DIAO_MA_JIANG;//MjClient.GAME_TYPE.WANG_DIAO_MA_JIANG;
        para.maxPlayer = [4,3,2,4][maxPlayerIndex]; 
        para.isQiangGangHu =  this._playNode_qiangGangHu.isSelected();
        para.isLiangPian = this._playNode_liangPian.isSelected(); //
        para.qidui = this._playNode_qiDui.isSelected();
        para.zhuangxianfen = this._playNode_zhuangXian.isSelected();
        para.pengpenghu = this._play_pengpenghu.isSelected();
        para.isErfen = this._play_difen_two.isSelected();
        para.wuTong = isWuTong && maxPlayerIndex > 1;
        if(this._playNode_player_tuoguan_radio){
            para.trustTime = [0,60,120,180,300][this._playNode_player_tuoguan_radio.getSelectIndex()];
            para.trustWay = 0;
            para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
            para.isTrustWhole   = para.trustWay != 0;
        }

        if(this._playNode_player_fengDing_radio){
            para.fengDing = [0, 30, 60, 100][this._playNode_player_fengDing_radio.getSelectIndex()]
        }
        
        if(this.quanjufengdingList_radio){
            para.quanjufengdingScore = 0;
            var selectIndex = this.quanjufengdingList_radio.getSelectIndex();
            if(selectIndex > 0){
                var _play = this.bg_node.getChildByName("play");
                if(!_play){
                    _play = this.bg_node.getChildByName("view").getChildByName("play");
                }
                var score = parseInt(_play.getChildByName("quanjufengdingScore").getChildByName("text_diFen").string);
                para.quanjufengdingScore = score;
            }
        }
        //
        var maPaiTable = [4,6,8,0];
        para.maPai = maPaiTable[this.mapaiTypeList_redio.getSelectIndex()]; // 0-4-6-8
        // para.maFen = [1,2][this.maFenList_redio.getSelectIndex()];

        if(maxPlayerIndex == 3) {
            para.convertible = true;
        }

        para.piaoFen = false;
        if(this._play_piaoFen){
            para.piaoFen = this._play_piaoFen.isSelected();
        }

        para.quanKaiFang = false;
        if(this._play_quanKaiFang){
            para.quanKaiFang = this._play_quanKaiFang.isSelected();
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_isLiangpian, this._playNode_liangPian.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_isQiangGangHu, this._playNode_qiangGangHu.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maPai, this.mapaiTypeList_redio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_zhuangXian, para.zhuangxianfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_qidui, para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_pengpenghu, para.pengpenghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_difen_two, para.isErfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_wu_tong, isWuTong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_tuoguan, para.trustTime);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_fengDing, para.fengDing);
            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wangdiaoMJ_jieSuanDiFen, para.jieSuanDiFen);
            }
            if(this.quanjufengdingList_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_quanjufengding, para.quanjufengdingScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wangdiaoMJ_trustWay, para.trustWay);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_piaofen, para.piaoFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wangdiaoMJ_quankaifang, para.quanKaiFang);
        }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wangdiaoMJ_maFen, this.maFenList_redio.getSelectIndex());

      
        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // if(4 > MjClient.MaxPlayerNum){
        //     this.fangzhuPay = {pay4:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ]};
        //     this.AAPay = {pay4:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaHiangAA' +  MjClient.MaxPlayerNum ]};
        // }else{
        //     this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
        //     this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        // }

        // this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
        // this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});