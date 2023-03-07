//郴州字牌
var CreateRoomNode_anXiangWeiMaQue = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        //定义名堂索引 和后台统一使用策划给出的序列号
        this.mtXiaoZhuo = {"全球人":30, "上下五千年":35, "大龙摆尾":26};
        this.mtDaZhuo = {"2息满园花":8};
        this.mtQuanMingTang = {
            "自摸":62, "心连心":49, "对倒胡":38,
            "活捉小三":53, "两红两黑":54, "一条龙":51,
            "隔山打牛":52, "2息满园花":8
        };
        this.mtZuanShi = {"2息满园花":8};
        this.mtZhiZun = {"2息满园花":8};
        /*
        this.mingTangIdx = {
            //小卓版
            "全球人":30, "上下五千年":35, "大龙摆尾":26, 

            //大卓版，钻石版, 全名堂
            "2息满园花":8, 

            //全名堂
            "自摸":62, "心连心":49, "对倒胡":38,
            "活捉小三":53, "两红两黑":54, "一条龙":51,
            "隔山打牛":52
        }; 
        */

        //坐标动态调整
        this.posOffList = {
            "单行名堂":75,    //目前 大小卓版,钻石版单行
            "全名堂":180, 
            "逗溜子":190,    
            "2人":210         
        }

        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maxPlayer    = "_AnXiangWeiMaQue_maxPlayer";             //几人玩
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuang       = "_AnXiangWeiMaQue_zhuang";                //庄
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_wanFa        = "_AnXiangWeiMaQue_wanFa";                 //玩法
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_nengChi      = "_AnXiangWeiMaQue_nengChi";               //2人是否能吃
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maiPai       = "_AnXiangWeiMaQue_maiPai";                //2人是否埋牌
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_qiHu         = "_AnXiangWeiMaQue_qiHu";                  //2人起胡胡息
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_douLiuZi     = "_AnXiangWeiMaQue_douLiuZi";              //逗溜子开关
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuangXian   = "_AnXiangWeiMaQue_zhuangXian";            //逗溜子庄闲
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_yiDeng       = "_AnXiangWeiMaQue_yiDeng";                //逗溜子一登
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBei       = "_AnXiangWeiMaQue_fanBei";                //是否翻倍 0=不翻倍 1=翻倍
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBeiFen    = "_AnXiangWeiMaQue_fanBeiFen";             //是否翻倍 0=不翻倍 1=翻倍
        this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_mingTang     = "_AnXiangWeiMaQue_mingTang";              //玩法名堂 = 字符串拼接

        this.setExtraKey({
            jieSuanDiFen: "_AnXiangWeiMaQue_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:8, roundNum2:10, roundNum3:16};
        this.bg_node = ccs.load("bg_anXiangWeiMaQue.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_weiMaQue").getChildByName("scroll");
        //this.bg_node.getInnerContainer().setAnchorPoint(cc.p(0.5, 1));
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        _play.setVisible(true);
        var fangFei = _play.getChildByName('fangfei');
        if(cc.sys.isObjectValid(fangFei)) {
            fangFei.setVisible(false);
        }

        //上次索引选择
        this.lastMaxPlayerIdx = 0;
        this.lastWanFaIdx = 0;
        this.lastDouLiuZiIdx = 0;

        //4个名堂pnl
        this.pnlMt = [];

        //初始化人数UI
        this.initMaxPlayerUI(_play);

        //初始化玩法UI
        this.initWanFaUI(_play);

        //初始化逗溜子UI
        this.initDouLiuZiUI(_play);

        //初始化翻倍UI
        this.initFanBeiUI(_play);

        //庄
        this.zhuang = _play.getChildByName("rdZhuang");
        this.addListenerText(this.zhuang);
        this.zhuang.addEventListener(this.clickCB, this.zhuang);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : cc.color(211,38,14));
                    }else{
                        txt.setTextColor(this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : cc.color(68,51,51));
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        //设置人数
        this.setCurMaxPlayer(atClub);

        //设置玩法
        this.setCurWanFa(atClub);

        //设置逗溜子
        this.setCurDouLiuZi(atClub);

        //设置翻倍
        this.setCurFanBei(atClub);

        //庄
        var _zhuang;
        if (atClub)
            _zhuang = this.getBoolItem("isRandomZhuang", false);
        else
            _zhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuang, false);
        this.zhuang.setSelected(_zhuang);
        var text = this.zhuang.getChildByName("text");
        this.selectedCB(text, _zhuang);

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (atClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }
        
        this.setExtraPlayNodeCurrentSelect(atClub);
        
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var that = this;
        var para = {};

        //人数
        var maxPlayerIdx = this.maxPlayerList_radio.getSelectIndex();
        para.maxPlayer = [3, 2, 3][maxPlayerIdx]; 
        if(maxPlayerIdx != 0) {
            para.isCanChiDuiJiaChuPai = this.chuPaiList_radio.getSelectIndex() == 0;
            para.isMaiPai = this.diPaiList_radio.getSelectIndex() == 0;
            para.minHuXi = this.qiHuList_radio.getSelectIndex();     
        } else {
            para.isCanChiDuiJiaChuPai = false;
            para.isMaiPai = false;
            para.minHuXi = 0;
        }
        para.convertible = maxPlayerIdx == 2;                         // 自由人数

        //庄
        para.isRandomZhuang = this.zhuang.isSelected();     

        //玩法
        var wanFaIdx = this.wanFaList_radio.getSelectIndex()
        para.mingTangType = wanFaIdx;      
        //-----名堂列表----
        var getMt = function(list, obj) {
            var mtList = [];
            for (var i = 0; i < list.length; i++) {
                if(!list[i].isSelected()) {
                    continue;
                }
                var key = list[i].getChildByName("text").getString();
                mtList.push(obj[key]);
            }
            return mtList;
        }

        if(wanFaIdx == 1) {
            para.mingTangSelectList = getMt(this.xiaoZhuoBanList, this.mtXiaoZhuo);
        } else if (wanFaIdx == 2) {
            para.mingTangSelectList = getMt(this.daZhuoBanList, this.mtDaZhuo);
        } else if (wanFaIdx == 3) {
            para.mingTangSelectList = getMt(this.quanMingTangList, this.mtQuanMingTang);
        } else if (wanFaIdx == 4) {
            para.mingTangSelectList = getMt(this.zuanShiBanList, this.mtZuanShi);
        } else if (wanFaIdx == 5){
            para.mingTangSelectList = getMt(this.zhiZunBanList, this.mtZhiZun); 
        } else {
            para.mingTangSelectList = [];
        }
        
        //-----逗溜子
        var douLiuZiIdx = this.douLiuZiList_radio.getSelectIndex();
        para.isDouLiuZi = douLiuZiIdx == 1;
        if(para.isDouLiuZi) {
            para.douLiuZiScore = this.zhuangXianList_radio.getSelectIndex();
            para.yiDengScore = this.yiDengList_radio.getSelectIndex();
        } else {
            para.douLiuZiScore = 0;
            para.yiDengScore = 0;
        }
        
        //翻倍
        para.fanBei = this.fanBeiList_radio.getSelectIndex();
        if(para.fanBei) {
            para.fanBeiScore = parseInt(this.txtScore.getString());
        } else {
            para.fanBeiScore = 50;
        }

        this.getExtraSelectedPara(para); 

        para.gameType = MjClient.GAME_TYPE.AN_XIANG_WEI_MA_QUE;

        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara:function(para)
    {
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maxPlayer, this.maxPlayerList_radio.getSelectIndex()); 
        util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuang, para.isRandomZhuang);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_wanFa, para.mingTangType);
        util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_nengChi, para.isCanChiDuiJiaChuPai);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maiPai, para.isMaiPai ? 0 : 1);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_qiHu, para.minHuXi);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_douLiuZi, para.isDouLiuZi ? 1 : 0);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBei, para.fanBei);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuangXian, para.douLiuZiScore);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_yiDeng, para.yiDengScore);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBeiFen, para.fanBeiScore);
        util.localStorageEncrypt.setStringItem( this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_mingTang, para.mingTangSelectList.join('|'));
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node);
    },

    setDiaNumData:function(gameNode)
    { 
        this._super(gameNode);
    },

    //初始化人数UI
    initMaxPlayerUI:function(pNode) {
        var maxPlayerList = [];
        maxPlayerList.push(pNode.getChildByName("maxPlayer_3"));
        maxPlayerList.push(pNode.getChildByName("maxPlayer_2"));
        maxPlayerList.push(pNode.getChildByName("maxPlayer_0")); //自由人数
        this.initPlayNumNode(maxPlayerList, [3, 2, 3]);
        var maxPlayerSelectCb = function(index, sender, list) {
            if(index == this.lastMaxPlayerIdx) {
                return;
            }
            this.pnlEr.setVisible(index != 0);
            if(this.douLiuZiList_radio.getSelectIndex() == 1) {
                this.changeZhuangXianScore();
            }
            this.radioBoxSelectCB(index, sender, maxPlayerList);
            this.adjustLayout('maxPlayer', this.lastMaxPlayerIdx);
            this.lastMaxPlayerIdx = index;
        }.bind(this);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        for (var i = 0; i < maxPlayerList.length; i++) {
            maxPlayerList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(maxPlayerList, i, this.maxPlayerList_radio, maxPlayerSelectCb), maxPlayerList[i].getChildByName("text"));
        }
        this.playerList_node = maxPlayerList;

        //初始化2人下的选项
        var pnlEr = this.bg_node.getChildByName("pnl_erRen");
        pnlEr.setVisible(false);
        this.pnlEr = pnlEr;

        //对家出牌
        var chuPaiList = [];
        chuPaiList.push(pnlEr.getChildByName("chi_0"));
        chuPaiList.push(pnlEr.getChildByName("chi_1"));
        this.chuPaiList_radio = createRadioBoxForCheckBoxs(chuPaiList, this.radioBoxSelectCB);
        for (var i = 0; i < chuPaiList.length; i++) {
            chuPaiList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(chuPaiList, i, this.chuPaiList_radio), chuPaiList[i].getChildByName("text"));
        }
        this.chuPaiList_node = chuPaiList;

        //底牌
        var diPaiList = [];
        diPaiList.push(pnlEr.getChildByName("zhang_22"));
        diPaiList.push(pnlEr.getChildByName("zhang_41"));
        this.diPaiList_radio = createRadioBoxForCheckBoxs(diPaiList, this.radioBoxSelectCB);
        for (var i = 0; i < diPaiList.length; i++) {
            diPaiList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(diPaiList, i, this.diPaiList_radio), diPaiList[i].getChildByName("text"));
        }
        this.diPaiList_node = diPaiList;

        //起胡
        var qiHuList = [];
        qiHuList.push(pnlEr.getChildByName("xi_10"));
        qiHuList.push(pnlEr.getChildByName("xi_15"));
        this.qiHuList_radio = createRadioBoxForCheckBoxs(qiHuList, this.radioBoxSelectCB);
        for (var i = 0; i < qiHuList.length; i++) {
            qiHuList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(qiHuList, i, this.qiHuList_radio), qiHuList[i].getChildByName("text"));
        }
        this.qiHuList_node = qiHuList;
    },

    //初始化玩法UI
    initWanFaUI:function(pNode) {
        var wanFaList = [];
        wanFaList.push(pNode.getChildByName("laoMingTang"));
        wanFaList.push(pNode.getChildByName("xiaoZhuoBan"));
        wanFaList.push(pNode.getChildByName("daZhuoBan"));
        wanFaList.push(pNode.getChildByName("quanMingTang"));
        wanFaList.push(pNode.getChildByName("zuanShiBan"));
        wanFaList.push(pNode.getChildByName("zhiZunBan"));

        var wanFaSelectCb = function(index, sender, list){
            if(index == this.lastWanFaIdx) {
                return;
            }
            for(var i = 0; i < this.pnlMt.length; i++) {
                this.pnlMt[i].setVisible(false);
            }
            if(index != 0) {
                this.pnlMt[index-1].setVisible(true);
            }
            this.radioBoxSelectCB(index, sender, wanFaList);
            this.adjustLayout('wanFa', this.lastWanFaIdx);
            this.lastWanFaIdx = index;
        }.bind(this);

        this.wanFaList_radio = createRadioBoxForCheckBoxs(wanFaList, wanFaSelectCb);
        for (var i = 0; i < wanFaList.length; i++) {
            wanFaList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(wanFaList, i, this.wanFaList_radio, wanFaSelectCb), wanFaList[i].getChildByName("text"));
        }
        this.wanFaList_node = wanFaList;

        //玩法下的名堂面板
        var that = this;
        var initMtPnl = function(pNode, tab) {
            pNode.setVisible(false);
            var childCnt = pNode.getChildrenCount();
            for (var i = 0; i < childCnt; i++) {
                var child = pNode.getChildByName('mt_' + i);
                if(!cc.sys.isObjectValid(child)) {
                    break;
                }

                child.addEventListener(that.clickCB, child);
                that.addListenerText(child);
                //初始化文本颜色
                var txt = child.getChildByName('text');
                if (cc.sys.isObjectValid(txt)) {
                    txt.setTextColor(that.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : cc.color(68, 51, 51));
                }
                tab[i] = child;
            }
        }
        //小卓版
        var pnlMt1 = this.bg_node.getChildByName("pnl_xiaoZhuoBan");
        this.xiaoZhuoBanList = [];
        initMtPnl(pnlMt1, this.xiaoZhuoBanList);
        this.pnlMt.push(pnlMt1);

        //大卓版
        var pnlMt2 = this.bg_node.getChildByName("pnl_daZhuoBan");
        this.daZhuoBanList = [];
        initMtPnl(pnlMt2, this.daZhuoBanList);
        this.pnlMt.push(pnlMt2);

        //全名堂
        var pnlMt3 = this.bg_node.getChildByName("pnl_quanMingTang");
        this.quanMingTangList = [];
        initMtPnl(pnlMt3, this.quanMingTangList);
        this.pnlMt.push(pnlMt3);

        //钻石版
        var pnlMt4 = this.bg_node.getChildByName("pnl_zuanShiBan");
        this.zuanShiBanList = [];
        initMtPnl(pnlMt4, this.zuanShiBanList);
        this.pnlMt.push(pnlMt4);

        //至尊版
        var pnlMt5 = this.bg_node.getChildByName("pnl_zhiZunBan");
        this.zhiZunBanList = [];
        initMtPnl(pnlMt5, this.zhiZunBanList);
        this.pnlMt.push(pnlMt5);
    },

    //初始化逗溜子UI
    initDouLiuZiUI:function(pNode) {
        var pnl = this.bg_node.getChildByName("pnl_nextOpts");
        this.pnlNext = pnl;
        pnl.setVisible(true);

        var that = this;
        var liuZiList = [];
        liuZiList.push(pnl.getChildByName("guan"));
        liuZiList.push(pnl.getChildByName("kai"));

        var liuZiSelectCb = function(index, sender, list){
            if(index == this.lastDouLiuZiIdx) {
                return;
            }
            this.pnlDouLiuZi.setVisible(false);
            if(index == 1) {
                this.changeZhuangXianScore();
                this.pnlDouLiuZi.setVisible(true);
            }
            this.radioBoxSelectCB(index, sender, liuZiList);
            this.adjustLayout('douLiuZi', this.lastDouLiuZiIdx);
            this.lastDouLiuZiIdx = index;
        }.bind(this);

        this.douLiuZiList_radio = createRadioBoxForCheckBoxs(liuZiList, liuZiSelectCb);
        for (var i = 0; i < liuZiList.length; i++) {
            liuZiList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(liuZiList, i, this.douLiuZiList_radio, liuZiSelectCb), liuZiList[i].getChildByName("text"));
        }
        this.douLiuZiList_node = liuZiList;

        //初始化逗溜子打开后面板
        //庄闲
        var pnlDlz = pnl.getChildByName("pnl_douLiuZi");
        this.pnlDouLiuZi = pnlDlz;
        pnlDlz.setVisible(false);
        var zhuangXianList = [];
        zhuangXianList.push(pnlDlz.getChildByName("zhuang_1"));
        zhuangXianList.push(pnlDlz.getChildByName("zhuang_2"));
        zhuangXianList.push(pnlDlz.getChildByName("zhuang_3"));
        zhuangXianList.push(pnlDlz.getChildByName("zhuang_4"));

        this.zhuangXianList_radio = createRadioBoxForCheckBoxs(zhuangXianList, this.radioBoxSelectCB);
        for (var i = 0; i < zhuangXianList.length; i++) {
            zhuangXianList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(zhuangXianList, i, this.zhuangXianList_radio), zhuangXianList[i].getChildByName("text"));
        }
        this.zhuangXianList_node = zhuangXianList;

        //一登
        var yiDengList = [];
        yiDengList.push(pnlDlz.getChildByName("deng_1"));
        yiDengList.push(pnlDlz.getChildByName("deng_2"));
        yiDengList.push(pnlDlz.getChildByName("deng_3"));

        this.yiDengList_radio = createRadioBoxForCheckBoxs(yiDengList, this.radioBoxSelectCB);
        for (var i = 0; i < yiDengList.length; i++) {
            yiDengList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(yiDengList, i, this.yiDengList_radio), yiDengList[i].getChildByName("text"));
        }
        this.yiDengList_node = yiDengList;
    },

    //初始化翻倍UI
    initFanBeiUI:function(pNode) {
        var pnl = this.bg_node.getChildByName("pnl_nextOpts");
        var pnlBei = pnl.getChildByName("pnl_fanBei");
        pnlBei.setVisible(true);
        this.pnlFanBei = pnlBei;

        var fanBeiList = [];
        fanBeiList.push(pnlBei.getChildByName("buFanBei"));
        fanBeiList.push(pnlBei.getChildByName("cb_fanBei"));

        var that = this;
        var selectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : CREATEROOM_COLOR_1;
        var unSelectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : CREATEROOM_COLOR_3;
        var fanBeiCb = function(index, sender, list) {
            that.btnJia.setTouchEnabled(index == 1);
            that.btnJian.setTouchEnabled(index == 1);
            that.btnJia.setBright(index == 1);
            that.btnJian.setBright(index == 1);
            that.txtScore.setTextColor(index == 1 ? selectColor : unSelectColor);
            that.radioBoxSelectCB(index, sender, fanBeiList);
        }

        this.fanBeiList_radio = createRadioBoxForCheckBoxs(fanBeiList, fanBeiCb);
        for (var i = 0; i < fanBeiList.length; i++) {
            fanBeiList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(fanBeiList, i, this.fanBeiList_radio, fanBeiCb), fanBeiList[i].getChildByName("text"));
        }
        this.fanBeiList_node = fanBeiList;

        //加减分
        var txtScore = pnlBei.getChildByName("img_score").getChildByName("text");
        txtScore.setString("50分"); //初始化
        this.txtScore = txtScore;
        var ctrlScore = function(sender) {
            var num = parseInt(txtScore.getString());
            switch (sender.getName()) {
                case 'btn_jia':
                    num += 50;
                    num = num >= 150 ? 150 : num; 
                break;
                case 'btn_jian':
                    num -= 50;
                    num = num <= 50 ? 50 : num;
                break;

                default:
                break;
            }
            txtScore.setString(num + "分");
        }
        var btnJia = pnlBei.getChildByName("btn_jia");
        btnJia.addClickEventListener(ctrlScore);
        var btnJian = pnlBei.getChildByName("btn_jian");
        btnJian.addClickEventListener(ctrlScore);
        if (this.isUseUIV3) {
            fanBeiList[1].getChildByName('text').setString('少于                         翻倍');
        } else {
            btnJia.x += 14;
            btnJian.x += 14;
            pnlBei.getChildByName("img_score").x += 14;
        }

        this.btnJia = btnJia;
        this.btnJian = btnJian;
    },

    //设置人数
    setCurMaxPlayer:function(atClub) {
        var _maxPlayer;
        if (atClub){ 
            if (this.getBoolItem("convertible", false))
                _maxPlayer = 2;  //俱乐部默认最大人数
            else {
                var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
                _maxPlayer = [3, 2].indexOf(temp_maxPlayer);
            }
        }
        else {
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node);
        this.lastMaxPlayerIdx = _maxPlayer; 

        //对家出牌
        var _chi;  
        if (atClub){
            var _chi = this.getBoolItem("isCanChiDuiJiaChuPai", true) ? 0 : 1;
        }
        else{
            _chi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_nengChi, true) ? 0 : 1;
        }
        this.chuPaiList_radio.selectItem(_chi);
        this.radioBoxSelectCB(_chi, this.chuPaiList_node[_chi], this.chuPaiList_node);

        //底牌
        var _maiPai;  
        if (atClub){
            var _maiPai = this.getBoolItem("isMaiPai", true) ? 0 : 1;
        }
        else{
            _maiPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_maiPai, 0);
        }
        this.diPaiList_radio.selectItem(_maiPai);
        this.radioBoxSelectCB(_maiPai, this.diPaiList_node[_maiPai], this.diPaiList_node);

        //起胡
        var _huXi;  
        if (atClub){
            var _huXi = this.getNumberItem("minHuXi", 0);
        }
        else{
            _huXi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_qiHu, 0);
        }
        this.qiHuList_radio.selectItem(_huXi);
        this.radioBoxSelectCB(_huXi, this.qiHuList_node[_huXi], this.qiHuList_node);

        //2人/自由人选择
        if (_maxPlayer != 0) {
            this.pnlEr.setVisible(true);
            this.adjustLayout('maxPlayer', 0);
        } else {
            this.pnlEr.setVisible(false);
        }
    },

    //设置玩法
    setCurWanFa:function(atClub) {
        //玩法
        var _wanFa;  
        if (atClub){
            _wanFa = this.getNumberItem("mingTangType", 0);
        }
        else{
            _wanFa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_wanFa, 0);
        }
        this.wanFaList_radio.selectItem(_wanFa);
        this.radioBoxSelectCB(_wanFa, this.wanFaList_node[_wanFa], this.wanFaList_node);
        this.lastWanFaIdx = _wanFa;

        //名堂
        for (var i = 0; i < this.pnlMt.length; i++) {
            this.pnlMt[i].setVisible(false);
        }
        if (_wanFa != 0) {
            var _mtArr = [];
            if (atClub) {
                _mtArr = this.getItem("mingTangSelectList", []);
            }
            else {
                var str = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_mingTang, "");
                if (str != "") {
                    var temp = str.split('|');
                    for (var i = 0; i < temp.length; i++) {
                        _mtArr[i] = parseInt(temp[i]);
                    }
                }
            } 
            var that = this;
            var setCb = function(list, obj) {
                for (var i = 0; i < list.length; i++) {
                    var node = list[i];
                    node.setSelected(false);
                    that.selectedCB(node.getChildByName("text"), false);
                }
                for (var name in obj) {
                    if(_mtArr.indexOf(obj[name]) < 0) {
                        continue;
                    }
                    for (var j = 0; j < list.length; j++) {
                        var node = list[j];
                        if(node.getChildByName('text').getString() == name) {
                            node.setSelected(true);
                            that.selectedCB(node.getChildByName("text"), true);
                        }
                    }
                }
            }
            if(_wanFa == 1) {
                //小卓版
                setCb(this.xiaoZhuoBanList, this.mtXiaoZhuo);
            } else if (_wanFa == 2) {
                //大卓版
                setCb(this.daZhuoBanList, this.mtDaZhuo);
            } else if (_wanFa == 3) {
                //全名堂
                setCb(this.quanMingTangList, this.mtQuanMingTang);
            } else if (_wanFa == 4) {
                //钻石版
                setCb(this.zuanShiBanList, this.mtZuanShi);
            } else if (_wanFa == 5){
                //至尊版
                setCb(this.zhiZunBanList, this.mtZhiZun);
            }
            if(_wanFa != 0) {
                this.pnlMt[_wanFa-1].setVisible(true);
            }
            this.adjustLayout('wanFa', 0);
        } 
    },

    //设置逗溜子
    setCurDouLiuZi:function(atClub) {
        //逗溜子
        var _douLiuZi;  
        if (atClub){
            _douLiuZi = this.getBoolItem("isDouLiuZi", false) ? 1 : 0;
        }
        else{
            _douLiuZi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_douLiuZi, 0);
        }
        this.douLiuZiList_radio.selectItem(_douLiuZi);
        this.radioBoxSelectCB(_douLiuZi, this.douLiuZiList_node[_douLiuZi], this.douLiuZiList_node);
        this.lastDouLiuZiIdx = _douLiuZi;

        //庄闲
        var _zhuangXian;  
        if (atClub){
            _zhuangXian = this.getNumberItem("douLiuZiScore", 0);
        }
        else{
            _zhuangXian = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_zhuangXian, 0);
        }
        this.zhuangXianList_radio.selectItem(_zhuangXian);
        this.radioBoxSelectCB(_zhuangXian, this.zhuangXianList_node[_zhuangXian], this.zhuangXianList_node);
        this.changeZhuangXianScore();

        //一登
        var _yiDeng;  
        if (atClub){
            _yiDeng = this.getNumberItem("yiDengScore", 0);
        }
        else{
            _yiDeng = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_yiDeng, 0);
        }
        this.yiDengList_radio.selectItem(_yiDeng);
        this.radioBoxSelectCB(_yiDeng, this.yiDengList_node[_yiDeng], this.yiDengList_node);

        //开启逗溜子
        if (_douLiuZi) {
            this.pnlDouLiuZi.setVisible(true);
            this.adjustLayout('douLiuZi', 0);
        } else {
            this.pnlDouLiuZi.setVisible(false);
        }
    },

    //设置翻倍
    setCurFanBei:function(atClub) {
        //翻倍 0=不翻倍 1=翻倍
        var _fanBei;  
        if (atClub){
            _fanBei = this.getNumberItem("fanBei", 0);
        }
        else{
            _fanBei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBei, 0);
        }
        this.fanBeiList_radio.selectItem(_fanBei);
        this.radioBoxSelectCB(_fanBei, this.fanBeiList_node[_fanBei], this.fanBeiList_node);

        //翻倍分数
        var _score;
        if (atClub) {
            _score = this.getNumberItem("fanBeiScore", 50);
        }
        else {
            _score = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_AnXiangWeiMaQue_fanBeiFen , 50);
        }
        this.txtScore.setString(_score + "分");

        this.btnJia.setTouchEnabled(_fanBei == 1);
        this.btnJian.setTouchEnabled(_fanBei == 1);
        this.btnJia.setBright(_fanBei == 1);
        this.btnJian.setBright(_fanBei == 1);
        var selectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : CREATEROOM_COLOR_1;
        var unSelectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : CREATEROOM_COLOR_3;
        this.txtScore.setTextColor(_fanBei == 1 ? selectColor : unSelectColor);
    },

    //动态庄闲分
    changeZhuangXianScore:function() {
        var idx = this.maxPlayerList_radio.getSelectIndex();
        var str_3 = ['20/10/10', '30/20/20', '40/30/30', '50/50/50'];
        var str_2 = ['20/10', '30/20', '40/30', '50/50'];
        var str = idx == 1 ? str_2 : str_3;
        for(var i = 0; i < this.zhuangXianList_node.length; i++) {
            var txtNode = this.zhuangXianList_node[i].getChildByName("text");
            txtNode.setString(str[i]);
            txtNode.width = idx == 1 ? 90 : 134;
        }
    },

    //适配布局
    adjustLayout:function(opt, lastIdx) {
        var size = this.bg_node.getInnerContainerSize();
        var offY = 0;
        var that = this;
        var getScrollViewPercent = function(scrollView) {
            if (!scrollView) {
                return;
            }
            var size = scrollView.getInnerContainerSize(); //    --内容区大小
            var pos = scrollView.getInnerContainerPosition();//  --内容区当前位置
            var listSize = scrollView.getContentSize();
            var persent = 100;
            if (size.height - listSize.height > 0) {
                persent = 100 - Math.abs(pos.y / (size.height - listSize.height) * 100);
            }
            return persent;
        };
        var changeInnerSize = function() {
            var scroll = that.bg_node;
            var children = scroll.getChildren();
            if(children.length == 0)
                return;
            var oldRelativePos = scroll.getParent().convertToWorldSpace(children[0].getPosition());
            var p1 = getScrollViewPercent(scroll);
            scroll.setInnerContainerSize(cc.size(size.width, size.height - offY));
            for(var i=0; i < children.length; i++) {
                children[i].y -= offY;  
            }
            //重新适应滚动比例
            var newRelativePos = scroll.getParent().convertToWorldSpace(children[0].getPosition());
            scroll.jumpToPercentVertical(newRelativePos.y * p1 / oldRelativePos.y);
        }
        switch (opt) {
            case 'maxPlayer':
                var idx = this.maxPlayerList_radio.getSelectIndex();
                if(lastIdx == 0) {
                    offY -= this.posOffList['2人'];
                } else if(idx == 0) {
                    offY += this.posOffList['2人'];                
                }
                this.pnlNext.y += offY;
            break;

            case 'wanFa':
                var idx = this.wanFaList_radio.getSelectIndex();
                if(lastIdx == 0) {  //上次是老名堂
                    if(idx == 3) {  //全名堂
                        offY -= this.posOffList['全名堂'];
                    } else {
                        offY -= this.posOffList['单行名堂'];
                    }
                    this.pnlEr.y += offY;
                    this.pnlNext.y += offY;
                } else if (lastIdx == 3) {
                    if (idx == 0) {
                        offY += this.posOffList['全名堂'];
                    } else {
                        offY += this.posOffList['全名堂'] - this.posOffList['单行名堂'];
                    }
                    this.pnlEr.y += offY;
                    this.pnlNext.y += offY;
                } else {
                    if (idx == 0) {
                        offY += this.posOffList['单行名堂'];
                    } else if (idx == 3) {
                        offY += this.posOffList['单行名堂'] - this.posOffList['全名堂'];
                    }
                    this.pnlEr.y += offY;
                    this.pnlNext.y += offY;
                }
            break;

            case 'douLiuZi':
                var idx = this.fanBeiList_radio.getSelectIndex();
                if (lastIdx == 0) { //上次是关
                    offY -= this.posOffList['逗溜子'];
                } else {
                    offY += this.posOffList['逗溜子'];
                }
                this.pnlFanBei.y += offY;
            break;

            default:
            break;
        }

        changeInnerSize();
    },
});