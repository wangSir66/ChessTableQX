/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_TYZZ = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_TYZZ_niaoTpye = "_TYZZ_NIAO_WAY"; //鸟的方式
        this.localStorageKey.KEY_TYZZ_zhuangxianfen = "_TYZZ_ZHUANG_XIAN_FEN"; //庄闲分
        this.localStorageKey.KEY_TYZZ_dianpaohu = "_TYZZ_DIAN_PAO_HU"; //点炮胡
        this.localStorageKey.KEY_TYZZ_hongzhong = "_TYZZ_HONG_ZHONG";
        this.localStorageKey.KEY_TYZZ_is7dui = "_TYZZ_IS_7_DUI"; //七对可胡
        this.localStorageKey.KEY_TYZZ_maxPlayer = "_TYZZ_MAX_PLAYER"; //玩家个数
        this.localStorageKey.KEY_TYZZ_laizi = "_TYZZ_LAI_ZI"; //癞子
        this.localStorageKey.KEY_TYZZ_qianggang = "_TYZZ_QIANG_GANG";
        this.localStorageKey.KEY_TYZZ_difen = "_TYZZ_difen"; //底分
        this.localStorageKey.KEY_TYZZ_niaofen = "_TYZZ_NIAO_FEN"; 			// 中鸟得分
        this.localStorageKey.KEY_TYZZ_biHu      = "_TYZZ_BI_HU";          // 有胡必胡
        this.localStorageKey.KEY_TYZZ_bzsqz      = "_TYZZ_BZSQZ";          // 不中算全中
        this.localStorageKey.KEY_TYZZ_kechi      = "_TYZZ_KECHI";          // 可吃
        this.localStorageKey.KEY_TYZZ_qzfb      = "_TYZZ_QZFB";          // 全中翻倍
        this.localStorageKey.KEY_TYZZ_ziyou     = "_TYZZ_ZIYOU";            //自由人数
        this.localStorageKey.KEY_TYZZ_isOpenTingTip = "_TYZZ_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_TYZZ_jiaPiao   = "_TYZZ_jiaPiao";          //是否加飘
        this.localStorageKey.KEY_TYZZ_piaoNiao   = "_TYZZ_piaoNiao";          //围一飘鸟
        this.localStorageKey.KEY_TYZZ_wuhongzhong     = "_TYZZ_WU_HONG_ZHONG";     //有红中可抢杠胡
        this.localStorageKey.KEY_TYZZ_anzhuang = "_TYZZ_AN_ZHUANG";         //按庄家抓鸟
        this.localStorageKey.KEY_TYZZ_tuoguan           =  "_TYZZ_TUO_GUAN";     //托管
        this.localStorageKey.KEY_TYZZ_zuoZhuang                   = "_TYZZ_ZUO_ZHUANG";     //0 随机， 1 先进来
        this.localStorageKey.KEY_TYZZ_bulunkong           =  "_TYZZ_BU_LUN_KONG";     //抓鸟不轮空
        this.localStorageKey.KEY_TYZZ_queYiMen      = "_TYZZ_queYiMen";         //缺一门
        this.localStorageKey.KEY_TYZZ_FAN_BEI   = "TYZZ_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_TYZZ_FAN_BEI_SCORE   = "TYZZ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_TYZZ_DIANPAO_SCORE              = "TYZZ_DIAN_PAO_SCORE"; // 点炮加分内容
        this.localStorageKey.KEY_TYZZ_ZIMO_SCORE                 = "TYZZ_ZI_MO_SCORE"; // 点炮加分内容

        this.localStorageKey.KEY_TYZZ_258ZuoJiang               = "TYZZ_258_ZUOJIANG;"   // 258做将
        this.localStorageKey.KEY_TYZZ_HuangZhuangGang                = "TYZZ_ZI_HUANG_ZHUANG_GANG"; // 荒庄荒杠
        this.localStorageKey.KEY_TYZZ_PiaoFen                = "TYZZ_ZI_PIAO_FEN"; // 飘分
        this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble               = "TYZZ_ZI_ZhuaNiaoDouble"; // 抓鸟
        this.localStorageKey.KEY_TYZZ_ZhuaPanel               = "TYZZ_ZI_ZhuaPanel"; // 抓鸟方式
        this.localStorageKey.KEY_TYZZ_trustWhole              = "TYZZ_ZI_trustWhole"; // 整局托管
        this.localStorageKey.KEY_TYZZ_trustWay              = "TYZZ_ZI_trustWay"; // 托管方式
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bgNode = ccs.load("bg_TYZZ.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_TYZZ").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_TYZZ");
    },
    initPlayNode: function() {

        cc.log("============21321313=============11======TYZZ=-------------");

        var _bgTYZZNode = this.bg_node;
        var _play = _bgTYZZNode.getChildByName("play");
        var _round = _bgTYZZNode.getChildByName("round");

        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao_0");
        this._playNode_zhongNiaoJiaBei = _play.getChildByName("playNode_zhongNiaoJIaBei");
        this._playNode_zhongNiaoJiaFen = _play.getChildByName("playNode_zhongNiaoJiaFen");

        var that = this;
        var nodeNiaoList = [];
        nodeNiaoList.push(this._playNode_niaoType_1);
        nodeNiaoList.push(this._playNode_zhongNiaoJiaFen);
        nodeNiaoList.push(this._playNode_zhongNiaoJiaBei);
        this.nodeNiaoList = nodeNiaoList;
        this.zhongNiaoJiaFenPanel = _play.getChildByName("zhongNiaoJiaFen");
        this.zhongNiaoJiaBeiPanel = _play.getChildByName("zhongNiaoJiaBei");
        var niaoPanelCallFunc = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, list);
            if(sender.getName() == "zhuaniao_0")
            {
                this.zhongNiaoJiaBeiPanel.setVisible(false);
                this.zhongNiaoJiaFenPanel.setVisible(false);
            }
            else if(sender.getName() == "playNode_zhongNiaoJIaBei")
            {
                this.zhongNiaoJiaBeiPanel.setVisible(true);
                this.zhongNiaoJiaFenPanel.setVisible(false);
            }
            else if(sender.getName() == "playNode_zhongNiaoJiaFen")
            {
                this.zhongNiaoJiaBeiPanel.setVisible(false);
                this.zhongNiaoJiaFenPanel.setVisible(true);
                var bool = !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").isSelected() &&
                    !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2").isSelected() &&
                    !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3").isSelected() &&
                    !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4").isSelected() &&
                    !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5").isSelected() &&
                    !this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9").isSelected();
                if(bool)//应急处理 
                {
                    this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").setSelected(true);
                }
                var text = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").getChildByName("text");
                this.selectedCB(text,this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").isSelected());
            }
        }.bind(this);
        this._playNode_NiaoPanel_radio = createRadioBoxForCheckBoxs(nodeNiaoList, niaoPanelCallFunc);
        var textNiaoPanelCallFunc = function(index){
            var sender = nodeNiaoList[index];
            if(sender.getName() == "zhuaniao_0")
            {
                that.zhongNiaoJiaBeiPanel.setVisible(false);
                that.zhongNiaoJiaFenPanel.setVisible(false);
            }
            else if(sender.getName() == "playNode_zhongNiaoJIaBei")
            {
                that.zhongNiaoJiaBeiPanel.setVisible(true);
                that.zhongNiaoJiaFenPanel.setVisible(false);
            }
            else if(sender.getName() == "playNode_zhongNiaoJiaFen")
            {
                that.zhongNiaoJiaBeiPanel.setVisible(false);
                that.zhongNiaoJiaFenPanel.setVisible(true);
                var bool = !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").isSelected() &&
                    !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2").isSelected() &&
                    !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3").isSelected() &&
                    !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4").isSelected() &&
                    !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5").isSelected() &&
                    !that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9").isSelected();
                if(bool)//应急处理
                {
                    that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").setSelected(true);
                }
                var text = that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").getChildByName("text");
                that.selectedCB(text,that.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1").isSelected());
            }
        };
        this.addListenerText(nodeNiaoList, this._playNode_NiaoPanel_radio, textNiaoPanelCallFunc);

        //莫的类型
        this._playNode_niaoType_2 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1");
        this._playNode_niaoType_3 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2");
        this._playNode_niaoType_4 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3");
        this._playNode_niaoType_5 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4");    // 上中下鸟
        this._playNode_niaoType_6 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5");    // 一鸟全中


        var nodeList1 = [];
        // nodeList1.push(_play.getChildByName("zhuaniao_0"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5"));
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9"));
            this._playNode_niaoType_9 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9");    // 一鸟全中
        }
        
        var niaoTypeCallFunc = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, list);
            if(sender.getName() == "zhuaniao_1" || sender.getName() == "zhuaniao_2" || sender.getName() == "zhuaniao_3")
            {
                if(this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong")){
                    this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong").setVisible(true);
                }
                if(this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei")){
                    this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei").setVisible(true);
                }
                if(this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang")){
                    this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang").setVisible(true);
                }
                if(this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong")){
                    this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong").setVisible(true);
                }             
            }else{
                if(this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong")){
                    this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong").setVisible(false);
                }
                if(this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei")){
                    this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei").setVisible(false);
                } 
                if(this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang")){
                    this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang").setVisible(false);
                }
                if(this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong")){
                    this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong").setVisible(false);
                }   
            }
        }.bind(this);
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, niaoTypeCallFunc);
        var textCallFunc = function(index){
            var sender = nodeList1[index];
            if(sender.getName() == "zhuaniao_1" || sender.getName() == "zhuaniao_2" || sender.getName() == "zhuaniao_3")
            {
                if(that.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong")){
                    that.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong").setVisible(true);
                }
                if(that.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei")){
                    that.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei").setVisible(true);
                }
                if(that.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang")){
                    that.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang").setVisible(true);
                }    
                if(that.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong")){
                    that.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong").setVisible(true);
                }          
            }else{
                if(that.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong")){
                    that.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong").setVisible(false);
                }
                if(that.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei")){
                    that.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei").setVisible(false);
                }
                if(that.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang")){
                    that.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang").setVisible(false);
                } 
                if(that.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong")){
                    that.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong").setVisible(false);
                } 
            }
        };
        this.addListenerText(nodeList1, this._playNode_player_type_radio, textCallFunc);
        var zhongniaoCallBack = function(sender, eventType){
            var name = sender.getName();
            if(name == "buzhongsuanquanzhong" || name == "quanzhongfanbei"){
                if(this._playNode_anzhuang && this._playNode_anzhuang.isSelected()){
                    var selectedOne = this._playNode_quanzhongType.isSelected();
                    var selectedTwo = this._playNode_quanZhongFanBei.isSelected();
                    this._playNode_anzhuang.setSelected(!selectedOne && !selectedTwo);
                    this.clickCB(this._playNode_anzhuang, eventType);
                }
            }
            if(name == "play_anzhuang"){
                if(this._playNode_quanzhongType && this._playNode_quanzhongType.isSelected()){
                    this._playNode_quanzhongType.setSelected(!sender.isSelected());
                    this.clickCB(this._playNode_quanzhongType, eventType);
                }
                if(this._playNode_quanZhongFanBei && this._playNode_quanZhongFanBei.isSelected()){
                    this._playNode_quanZhongFanBei.setSelected(!sender.isSelected());
                    this.clickCB(this._playNode_quanZhongFanBei, eventType);
                }                
            }
            this.clickCB(sender, eventType);
        }.bind(this);
        var zhongniaoTextCallBack = function(index, target){
            zhongniaoCallBack(target, ccui.CheckBox.EVENT_SELECTED);
        };
        if(this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong")){
            this._playNode_quanzhongType = this.zhongNiaoJiaFenPanel.getChildByName("buzhongsuanquanzhong");
            this.addListenerText(this._playNode_quanzhongType, null, zhongniaoTextCallBack);
            this._playNode_quanzhongType.addEventListener(zhongniaoCallBack, this._playNode_quanzhongType);            
        }

        if(this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei")){
            this._playNode_quanZhongFanBei = this.zhongNiaoJiaFenPanel.getChildByName("quanzhongfanbei");
            this.addListenerText(this._playNode_quanZhongFanBei, null, zhongniaoTextCallBack);
            this._playNode_quanZhongFanBei.addEventListener(zhongniaoCallBack, this._playNode_quanZhongFanBei);            
        }

        if(this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang")){
            this._playNode_anzhuang = this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang");
            this.addListenerText(this._playNode_anzhuang, null, zhongniaoTextCallBack);
            this._playNode_anzhuang.addEventListener(zhongniaoCallBack, this._playNode_anzhuang);            
        }
        // 抓鸟不轮空
        if (this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong")) {
            this._playNode_buLunKong = this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong");
            this.addListenerText(this._playNode_buLunKong, null, zhongniaoTextCallBack);
            this._playNode_buLunKong.addEventListener(zhongniaoCallBack, this._playNode_buLunKong);
        }

        this._playNode_anzhuangFromJiaBei = this.zhongNiaoJiaBeiPanel.getChildByName("play_anzhuang");
        this.addListenerText(this._playNode_anzhuangFromJiaBei);
        this._playNode_anzhuangFromJiaBei.addEventListener(this.clickCB, this._playNode_anzhuangFromJiaBei);

        this._playNode_buLunKongFromJiaBei = this.zhongNiaoJiaBeiPanel.getChildByName("play_buLunKong");
        this.addListenerText(this._playNode_buLunKongFromJiaBei);
        this._playNode_buLunKongFromJiaBei.addEventListener(this.clickCB, this._playNode_buLunKongFromJiaBei);

        var niaoFromJiaBeiList = [];
        niaoFromJiaBeiList.push(this.zhongNiaoJiaBeiPanel.getChildByName("play_niao1"));
        niaoFromJiaBeiList.push(this.zhongNiaoJiaBeiPanel.getChildByName("play_niao2"));
        this.niaoFromJiaBeiList = niaoFromJiaBeiList;
        this.niaoFromJiaBeiList_radio = createRadioBoxForCheckBoxs(niaoFromJiaBeiList, this.radioBoxSelectCB);
        this.addListenerText(niaoFromJiaBeiList, this.niaoFromJiaBeiList_radio);


        this._playNode_niaoFen_1 = this.zhongNiaoJiaFenPanel.getChildByName("play_niaofen1");
        this._playNode_niaoFen_2 = this.zhongNiaoJiaFenPanel.getChildByName("play_niaofen2");
        var niaoFenList = [];
        niaoFenList.push(this._playNode_niaoFen_1);
        niaoFenList.push(this._playNode_niaoFen_2);
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;
        this._playNode_niaoFen_1.schedule(function() {
            this._playNode_niaoFen_1.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());
            this._playNode_niaoFen_2.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());
        }.bind(this));

        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_zhuangxianfen.addEventListener(this.clickCB, this._playNode_zhuangxianfen);

        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        this.addListenerText(this._playNode_dianpao);
        this._playNode_dianpao.addEventListener(this.clickCB, this._playNode_dianpao);

        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

        this._playNode_laizi0 = _play.getChildByName("play_laizi_0");
        this._playNode_laizi1 = _play.getChildByName("play_laizi_1");
        this._playNode_laizi2 = _play.getChildByName("play_laizi_2");
        var nodeList2 = [];
        nodeList2.push(_play.getChildByName("play_laizi_0"));
        nodeList2.push(_play.getChildByName("play_laizi_1"));
        nodeList2.push(_play.getChildByName("play_laizi_2"));
        this._playNode_player_type_radio1 = createRadioBoxForCheckBoxs(nodeList2, this.radioBoxSelectCB);
        this.addListenerText(nodeList2, this._playNode_player_type_radio1);
        var nodeList3 = [];
        nodeList3.push(_play.getChildByName("play_maxPlayer_0"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_1"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_2"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_3"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_4"));
        var playerNumCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            if(_play.getChildByName("play_queYiMen")){
                this._playNode_queyimen.visible = (index == 2 || index == 3 || index == 4);
            }
        }.bind(this);
        this._playNode_player_type_radio2 = createRadioBoxForCheckBoxs(nodeList3, playerNumCallBack);
        var textPlayerNumCallBack = function(index){
            playerNumCallBack(index, nodeList3[index], nodeList3);
        };
        this.addListenerText(nodeList3, this._playNode_player_type_radio2, textPlayerNumCallBack);
		this.initPlayNumNode(nodeList3, [4, 3, 2, 4, 3]);
        this._nodeList3 = nodeList3;

        this._playNode_qianggang0 = _play.getChildByName("play_qianggang0");
        this._playNode_qianggang1 = _play.getChildByName("play_qianggang1");
        this._playNode_qianggang2 = _play.getChildByName("play_qianggang2");
        var nodeList4 = [];
        nodeList4.push(_play.getChildByName("play_qianggang0"));
        nodeList4.push(_play.getChildByName("play_qianggang1"));
        nodeList4.push(_play.getChildByName("play_qianggang2"));
        var qiangGangCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            this._playNode_wuHongZhong.visible = false;
            if(index != 2){
                this._playNode_wuHongZhong.visible = true;
            }
        }.bind(this);
        this._playNode_qianggang_radio1 = createRadioBoxForCheckBoxs(nodeList4, qiangGangCallBack);
        var textQiangGangCallBack = function(index){
            qiangGangCallBack(index, nodeList4[index], nodeList4);
        };
        this.addListenerText(nodeList4, this._playNode_qianggang_radio1, textQiangGangCallBack);

        //有红中可抢杠胡
        this._playNode_wuHongZhong = _play.getChildByName("play_wuhongzhong");
        this._playNode_wuHongZhong.getChildByName("text").setString("有红中可抢杠胡");
        this.addListenerText(this._playNode_wuHongZhong);
        this._playNode_wuHongZhong.addEventListener(this.clickCB, this._playNode_wuHongZhong);

        this._zhuIdx = 1;
        this._zhuNum = _bgTYZZNode.getChildByName("txt_fen");
        if(!this._zhuNum) this._zhuNum = _bgTYZZNode.getParent().getChildByName("txt_fen");
        if(this._zhuNum)
        {
            this._zhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgTYZZNode.getChildByName("btn_sub");
            if(!this._Button_sub) this._Button_sub = _bgTYZZNode.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function (sender, type) {
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
                        this._zhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = _bgTYZZNode.getChildByName("btn_add");
            if(!this._Button_add) this._Button_add = _bgTYZZNode.getParent().getChildByName("btn_add");
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
                        this._zhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        if(_play.getChildByName("play_bihuType")){
            this._playNode_biHuType = _play.getChildByName("play_bihuType");
            this.addListenerText(this._playNode_biHuType);
            this._playNode_biHuType.addEventListener(this.clickCB, this._playNode_biHuType);
        }
        if(_play.getChildByName("play_258ZuoJiang")){
            this.play_258ZuoJiang = _play.getChildByName("play_258ZuoJiang");
            this.addListenerText(this.play_258ZuoJiang);
            this.play_258ZuoJiang.addEventListener(this.clickCB, this.play_258ZuoJiang);
        }

        if(_play.getChildByName("play_huangZhuangGang")){
            this.play_huangZhuangGang = _play.getChildByName("play_huangZhuangGang");
            this.addListenerText(this.play_huangZhuangGang);
            this.play_huangZhuangGang.addEventListener(this.clickCB, this.play_huangZhuangGang);
        }

        if(_play.getChildByName("play_kechi")){
            this._playNode_keChi = _play.getChildByName("play_kechi");
            this.addListenerText(this._playNode_keChi);
            this._playNode_keChi.addEventListener(this.clickCB, this._playNode_keChi);
        }

        if(_play.getChildByName("play_queYiMen")){
            this._playNode_queyimen = _play.getChildByName("play_queYiMen");
            this.addListenerText(this._playNode_queyimen);
            this._playNode_queyimen.addEventListener(this.clickCB, this._playNode_queyimen);
        }

        if(_play.getChildByName("box_zimo_1")){
            // 算分选项 自摸选项
            var zimoList = [];
            zimoList.push(_play.getChildByName("box_zimo_1"));
            zimoList.push(_play.getChildByName("box_zimo_2"));
            this._playNode_zimoList = createRadioBoxForCheckBoxs(zimoList, this.radioBoxSelectCB);
            this.addListenerText(zimoList, this._playNode_zimoList);

            // 算分选项 点炮选项
            var dianpaoList = [];
            dianpaoList.push(_play.getChildByName("box_dianpao_1"));
            dianpaoList.push(_play.getChildByName("box_dianpao_2"));
            this.play_dianpaoList1 = _play.getChildByName("box_dianpao_1");
            this.play_dianpaoList2 = _play.getChildByName("box_dianpao_2");
            this._playNode_dianpaoList = createRadioBoxForCheckBoxs(dianpaoList, this.radioBoxSelectCB);
            this.addListenerText(dianpaoList, this._playNode_dianpaoList);

            this._playNode_dianpao.schedule(function() {
                this.play_dianpaoList1.setVisible(this._playNode_dianpao.isSelected());
                this.play_dianpaoList2.setVisible(this._playNode_dianpao.isSelected());
            }.bind(this));
        }



        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;
        this.text_tishi = _round.getChildByName("text_0_1_0");

        //坐庄
        this._zuozhuang_1 = _play.getChildByName("zuoZhuang_1");
        this._zuozhuang_2 = _play.getChildByName("zuoZhuang_2");
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var zuoZhuangList = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
            this.addListenerText(zuoZhuangList, this.zuoZhuang_radio);
        }


        // 飘分
        this._playNode_piaofen0 = _play.getChildByName("play_piaofen0");
        this._playNode_piaofen1 = _play.getChildByName("play_piaofen1");
        this._playNode_piaofen2 = _play.getChildByName("play_piaofen2");
        this._playNode_piaofen3 = _play.getChildByName("play_piaofen3");
        this._playNode_piaofen4 = _play.getChildByName("play_piaofen4");
        this._playNode_piaofen5 = _play.getChildByName("play_piaofen5");
        var nodePiaofenList = [];
        nodePiaofenList.push(this._playNode_piaofen1);
        nodePiaofenList.push(this._playNode_piaofen2);
        nodePiaofenList.push(this._playNode_piaofen3);
        nodePiaofenList.push(this._playNode_piaofen0);
        nodePiaofenList.push(this._playNode_piaofen4);
        nodePiaofenList.push(this._playNode_piaofen5);
        this.nodePiaofenList = nodePiaofenList;
        var piaoFenCallback = function(index){
            this._playNode_player_piaofen_radio.selectItem(index);
            this.radioBoxSelectCB(index, this.nodePiaofenList[index], this.nodePiaofenList);
            if (index != 3) {
                if(this._playNode_piaoNiao){
                    if(this._playNode_piaoNiao.isSelected()){
                        this._playNode_piaoNiao.setSelected(false);
                    }
                    this.clickCB(this._playNode_piaoNiao, ccui.CheckBox.EVENT_SELECTED);
                }
            }
        }.bind(this);
        this._playNode_player_piaofen_radio = createRadioBoxForCheckBoxs(nodePiaofenList, function(index) {
            piaoFenCallback(index);
        }.bind(this));
        this.addListenerText(nodePiaofenList, this._playNode_player_piaofen_radio, piaoFenCallback);
        this._nodePiaofenList = nodePiaofenList;

        //围一飘鸟
        if(_play.getChildByName("play_piaoniao")){
            this._playNode_piaoNiao = _play.getChildByName("play_piaoniao");
            var piaoNiaoTextCallback = function(index){
                if(this._playNode_jiaPiao){
                    if(this._playNode_piaoNiao.isSelected()){
                        this._playNode_jiaPiao.setSelected(false);
                    }
                    this.clickCB(this._playNode_jiaPiao, ccui.CheckBox.EVENT_SELECTED);
                }
                this._playNode_player_piaofen_radio.selectItem(3);
                this.radioBoxSelectCB(3, this.nodePiaofenList[3], this.nodePiaofenList);
                this.clickCB(this._playNode_piaoNiao, ccui.CheckBox.EVENT_SELECTED);
            }.bind(this);
            this.addListenerText(this._playNode_piaoNiao, null, piaoNiaoTextCallback);
            this._playNode_piaoNiao.addEventListener(piaoNiaoTextCallback, this._playNode_piaoNiao);
        }

        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        this._playNode_tuoguanType_4 = _play.getChildByName("tuoguan4");
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

        // 大结算翻倍
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
            this.text_fanbei = _round.getChildByName("text_0_1_0_0");
            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 5) {
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
                        curScore = 5;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            //托管方式
            if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() && _play.getChildByName("trustWay_1")){
                this.trustWatTitle = _play.getChildByName("img_tuoGuanFangShiTip");
                this._playNode_tuoguanWay0 = _play.getChildByName("trustWay_1");
                this._playNode_tuoguanWay1 = _play.getChildByName("trustWay_2");
                this._playNode_tuoguanWay2 = _play.getChildByName("trustWay_3");
                var tuoguanWayNodeList = [];
                tuoguanWayNodeList.push(_play.getChildByName("trustWay_1"));
                tuoguanWayNodeList.push(_play.getChildByName("trustWay_2"));
                tuoguanWayNodeList.push(_play.getChildByName("trustWay_3"));
                this._playNode_player_tuoguanType_radio = createRadioBoxForCheckBoxs(tuoguanWayNodeList, this.radioBoxSelectCB);
                this.addListenerText(tuoguanWayNodeList, this._playNode_player_tuoguanType_radio);
                this.tuoguanWayNodeList = tuoguanWayNodeList;
            }
        }

        this.schedule(function() {
            //隐藏的选项位置不留空，选项上移
            var offset = 0;
            if(this._playNode_zhongNiaoJiaBei.isSelected())
            {
                //offset = 120;
            }
            else if(this._playNode_niaoType_1.isSelected())
            {
                //offset = 240;
            }

            for(var i = 0;i < this.nodeListFanBei.length;i++)
            {
                this.nodeListFanBei[i].y = -815 + offset - 80;
            }
            this.text_fanbei.y = -676 + offset - 80;

            for(var i = 0;i < this.tingTipList.length;i++)
            {
                this.tingTipList[i].y = -875 + offset - 80;
            }
            this.text_tishi.y = -736 + offset - 80;
        }.bind(this));
    },

    setTrustWayPanel: function(trustTimeIdx){
        if(!this.tuoguanWayNodeList) return;
        this.trustWatTitle.visible = trustTimeIdx != 0;
        for(var i = 0; i < this.tuoguanWayNodeList.length; i++){
            this.tuoguanWayNodeList[i].visible =  trustTimeIdx != 0;
        }
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = MjClient.createRoomNode._selectColor;
            var unSelectColor = MjClient.createRoomNode._unSelectColor;
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
    },
    setPlayNodeCurrentSelect: function(isClub) {
        var _niaoType;
        if(isClub){
            _niaoType = this.getNumberItem("zhuaniao", 0);
        }else{
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_niaoTpye, 0);
        }
        this._playNode_niaoType_1.setSelected(false);
        this._playNode_niaoType_2.setSelected(false);
        this._playNode_niaoType_3.setSelected(false);
        this._playNode_niaoType_4.setSelected(false);
        this._playNode_niaoType_5.setSelected(false);    // 上中下鸟
        this._playNode_niaoType_6.setSelected(false);    // 一鸟全中
        if(this._playNode_niaoType_9){
            this._playNode_niaoType_9.setSelected(false);
        }
        if (_niaoType == 0) {
            this._playNode_niaoType_1.setSelected(true);
            this._playNode_niaoType_2.setSelected(true);
        } else if(_niaoType == 1) {
            this._playNode_niaoType_5.setSelected(true);
        } else if (_niaoType == 2) {
            this._playNode_niaoType_2.setSelected(true);
        } else if (_niaoType == 4) {
            this._playNode_niaoType_3.setSelected(true);
        } else if (_niaoType == 6) {
            this._playNode_niaoType_4.setSelected(true);
        }else if(_niaoType == 9){
            this._playNode_niaoType_9.setSelected(true);
        }
        else if (_niaoType == 10) {
            this._playNode_niaoType_6.setSelected(true);
        }

        var niaoPanel;
        if (isClub)
        {
            niaoPanel = this.getNumberItem("niaoType", 0);
            var oldData = _niaoType;
            if(oldData != 0 && niaoPanel != 2)
            {
                niaoPanel = 1;
            }
        }
        else
            niaoPanel = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaPanel, 0);
        this._playNode_NiaoPanel_radio.selectItem(niaoPanel);
        this.radioBoxSelectCB(niaoPanel, this.nodeNiaoList[niaoPanel], this.nodeNiaoList);
        if(niaoPanel == 0)
        {
            this.zhongNiaoJiaFenPanel.visible = false;
            this.zhongNiaoJiaBeiPanel.visible = false;
        }
        else if(niaoPanel == 1)
        {
            this.zhongNiaoJiaFenPanel.visible = true;
            this.zhongNiaoJiaBeiPanel.visible = false;
        }
        else if(niaoPanel == 2)
        {
            this.zhongNiaoJiaFenPanel.visible = false;
            this.zhongNiaoJiaBeiPanel.visible = true;

        }

        var zhuaNiaoDouble;
        if (isClub)
            zhuaNiaoDouble = this.getNumberItem("zhuaNiaoDouble", 0);
        else
            zhuaNiaoDouble = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble, 0);
        this.niaoFromJiaBeiList_radio.selectItem(zhuaNiaoDouble);
        this.radioBoxSelectCB(zhuaNiaoDouble, this.niaoFromJiaBeiList[zhuaNiaoDouble], this.niaoFromJiaBeiList);



        var niaofen;
        if (isClub)
            niaofen = this.getNumberItem("niaofen", 1);
        else
            niaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_niaofen, 1);
        var niaofenIndex = niaofen - 1;
        this._playNode_niaoFen_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenList[niaofenIndex], this.niaoFenList);

        var niaoType = false;
        var quanzhong = false;
        if(this._playNode_quanzhongType){
            if (isClub)
                niaoType = this.getBoolItem("buzhongsuanquanzhong", false);
            else
                niaoType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_bzsqz, false);

            this._playNode_quanzhongType.setSelected(niaoType);
            var text = this._playNode_quanzhongType.getChildByName("text");
            this.selectedCB(text,niaoType);

            var isShow = (this._playNode_niaoType_2.isVisible() || this._playNode_niaoType_4.isVisible() || this._playNode_niaoType_6.isVisible()) ? true : false;
            this._playNode_quanzhongType.setVisible(isShow);
        }   

        if(this._playNode_quanZhongFanBei){
            if (isClub)
                quanzhong = this.getBoolItem("quanzhongfanbei", false);
            else
                quanzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_qzfb, false);

            this._playNode_quanZhongFanBei.setSelected(quanzhong);
            var text = this._playNode_quanZhongFanBei.getChildByName("text");
            this.selectedCB(text,quanzhong);

            var isShow = (this._playNode_niaoType_2.isVisible() || this._playNode_niaoType_4.isVisible() || this._playNode_niaoType_6.isVisible()) ? true : false;
            this._playNode_quanZhongFanBei.setVisible(isShow);
        }

        if(this._playNode_anzhuang){
            var anzhuang;
            if (isClub)
                anzhuang = this.getBoolItem("anzhuang", false);
            else
                anzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, false);
            anzhuang = anzhuang && !niaoType && !quanzhong;
            this._playNode_anzhuang.setSelected(anzhuang);
            var text = this._playNode_anzhuang.getChildByName("text");
            this.selectedCB(text,anzhuang);

            var isShow = (this._playNode_niaoType_2.isVisible() || this._playNode_niaoType_4.isVisible() || this._playNode_niaoType_6.isVisible()) ? true : false;
            this._playNode_anzhuang.setVisible(isShow);            
        }



        if (this._playNode_buLunKong) {

            var buLunKong;
            if (isClub)
                buLunKong = this.getBoolItem("buLunKong", false);
            else
                buLunKong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_bulunkong, false);
            buLunKong = buLunKong && !niaoType && !quanzhong;
            this._playNode_buLunKong.setSelected(buLunKong);
            var text = this._playNode_buLunKong.getChildByName("text");
            this.selectedCB(text, buLunKong);

            var isShow = (this._playNode_niaoType_2.isVisible() || this._playNode_niaoType_4.isVisible() || this._playNode_niaoType_6.isVisible()) ? true : false;
            this._playNode_buLunKong.setVisible(isShow);
        }

        //莫的类型
        var _play = this.bg_node.getChildByName("play");
        if(this._playNode_zimoList){
            // 算分选项 自摸分数，记录的是index
            var _ziMoScore;
            if(isClub){
                _ziMoScore = this.getNumberItem("ziMoScore", 0);
            }else{
                _ziMoScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_ZIMO_SCORE ,0);
            }

            this._playNode_zimoList.selectItem(_ziMoScore);
            list = [];
            list.push(_play.getChildByName("box_zimo_1"));
            list.push(_play.getChildByName("box_zimo_2"));
            this.radioBoxSelectCB(_ziMoScore,list[_ziMoScore],list);     

            // 算分选项 点炮分数，记录的是index
            var _dianPaoScore;
            if(isClub){
                _dianPaoScore = this.getNumberItem("dianPaoScore", 0);
            }else{
                _dianPaoScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_DIANPAO_SCORE,0);
            }

            this._playNode_dianpaoList.selectItem(_dianPaoScore);
            list = [];
            list.push(_play.getChildByName("box_dianpao_1"));
            list.push(_play.getChildByName("box_dianpao_2"));
            this.radioBoxSelectCB(_dianPaoScore,list[_dianPaoScore],list); 
        }
        

        if(isClub){
            this._zhuangxianfen = this.getBoolItem("zhuangxianfen", true);
        }else{
            this._zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_zhuangxianfen, true);
        }
        this._playNode_zhuangxianfen.setSelected(this._zhuangxianfen);
        var text = this._playNode_zhuangxianfen.getChildByName("text");
        this.selectedCB(text,this._zhuangxianfen)

        var anZhuangFromJiaBei;
        if(isClub){
            anZhuangFromJiaBei = this.getBoolItem("anzhuang", false);
        }else{
            anZhuangFromJiaBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, false);
        }
        this._playNode_anzhuangFromJiaBei.setSelected(anZhuangFromJiaBei);
        var text = this._playNode_anzhuangFromJiaBei.getChildByName("text");
        this.selectedCB(text,anZhuangFromJiaBei)

        var buLunKongFromJiaBei;
        if(isClub){
            buLunKongFromJiaBei = this.getBoolItem("buLunKong", false);
        }else{
            buLunKongFromJiaBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_bulunkong, false);
        }
        this._playNode_buLunKongFromJiaBei.setSelected(buLunKongFromJiaBei);
        var text = this._playNode_buLunKongFromJiaBei.getChildByName("text");
        this.selectedCB(text,buLunKongFromJiaBei);

        if(isClub){
            this._dianpao = this.getBoolItem("dianpao", true);
        }else{
            this._dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_dianpaohu, true);
        }
        this._playNode_dianpao.setSelected(this._dianpao);
        var text = this._playNode_dianpao.getChildByName("text");
        this.selectedCB(text,this._dianpao)

        if(this.play_dianpaoList1 && this.play_dianpaoList2){
            this.play_dianpaoList1.visible = this._dianpao;
            this.play_dianpaoList2.visible = this._dianpao;
        }


        if(isClub){
            this._is7dui = this.getBoolItem("qidui", true);
        }else{
            this._is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_is7dui, true);
        }
        this._playNode_qidui.setSelected(this._is7dui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text,this._is7dui)

        

	    var _laizi;
        if(isClub){
            _laizi = this.getNumberItem("hongzhong", 0);
        }else{
            _laizi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_laizi, 0);
        }
        this._playNode_laizi0.setSelected(false);
        this.selectedCB(this._playNode_laizi0.getChildByName("text"),false);
        this._playNode_laizi1.setSelected(false);
        this.selectedCB(this._playNode_laizi1.getChildByName("text"),false);
        this._playNode_laizi2.setSelected(false);
        this.selectedCB(this._playNode_laizi2.getChildByName("text"),false);
        var index = _laizi == 0 ? 0 : (_laizi == 4 ? 1 : 2)
        this["_playNode_laizi" + index].setSelected(true);
        var text = this["_playNode_laizi" + index].getChildByName("text");
        this.selectedCB(text,true)

        var _maxPlayer;
        if(isClub){
            if (this.getBoolItem("convertible", true)){
                _maxPlayer = this.getNumberItem("maxPlayer");
                _maxPlayer = _maxPlayer == 4 ? 0 : 1;
            }
            else
                _maxPlayer = this.getNumberItem("maxPlayer", 3);
        }else{
            var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_ziyou,false);
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_maxPlayer, 3);
            if(ziyou){
                _maxPlayer = _maxPlayer == 4 ? 0 : 1;
            }
        }
		_maxPlayer = [4, 3, 2, 0, 1].indexOf(_maxPlayer);
        this._playNode_player_type_radio2.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, this._nodeList3[_maxPlayer], this._nodeList3);

        var _qianggang;
        if(isClub){
            var qianggangsuanzimo = this.getBoolItem("qianggangsuanzimo",false);
            var qianggangsuandianpao = this.getBoolItem("qianggangsuandianpao",false);
            _qianggang = qianggangsuanzimo ? 0 : qianggangsuandianpao ? 1: 2;
        }else{
            _qianggang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_qianggang, 2);
        }
        this._playNode_qianggang0.setSelected(false);
        this.selectedCB(this._playNode_qianggang0.getChildByName("text"),false);
        this._playNode_qianggang1.setSelected(false);
        this.selectedCB(this._playNode_qianggang1.getChildByName("text"),false);
        this._playNode_qianggang2.setSelected(false);
        this.selectedCB(this._playNode_qianggang2.getChildByName("text"),false);

        //有红中可抢杠胡
        var _wuhongzhong;
        if(isClub){
            _wuhongzhong = this.getBoolItem("wuhongzhong",true);
        }else{
            _wuhongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_wuhongzhong, true);
        }
        this._playNode_wuHongZhong.setSelected(_wuhongzhong);
        this._playNode_wuHongZhong.setVisible(_qianggang != 2);
        var text = this._playNode_wuHongZhong.getChildByName("text");
        this.selectedCB(text, _wuhongzhong); 

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_difen, 1);
        if (this._zhuNum)
            this._zhuNum.setString(this._zhuIdx + "");

        if(_qianggang == 0)
        {
            this._playNode_qianggang0.setSelected(true);
        }
        else if(_qianggang == 1)
        {
            this._playNode_qianggang1.setSelected(true);
        }
        else if(_qianggang == 2)
        {
            this._playNode_qianggang2.setSelected(true);
        }
        this.selectedCB(text,true);

        if(this._playNode_biHuType){
            if(isClub){
               this._biHuType = this.getBoolItem("bihuType", false);
            }else{
                this._biHuType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_biHu, false);
            }
            this._playNode_biHuType.setSelected(this._biHuType);
            var text = this._playNode_biHuType.getChildByName("text");
            this.selectedCB(text,this._biHuType);
        }

        if(this._playNode_keChi){
            if(isClub){
               this._canChi = this.getBoolItem("canChi", false);
            }else{
                this._canChi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_kechi, false);
            }
            this._playNode_keChi.setSelected(this._canChi);
            var text = this._playNode_keChi.getChildByName("text");
            this.selectedCB(text,this._canChi);
        }

        if(this.play_258ZuoJiang){
            var zuoJiang258;
            if(isClub){
                zuoJiang258 = this.getBoolItem("zuoJiang258", false);
            }else{
                zuoJiang258 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_258ZuoJiang, false);
            }
            this.play_258ZuoJiang.setSelected(zuoJiang258);
            var text = this.play_258ZuoJiang.getChildByName("text");
            this.selectedCB(text,zuoJiang258);
        }
        if(this.play_huangZhuangGang){
            var huangZhuangGang;
            if(isClub){
                huangZhuangGang = this.getBoolItem("huangZhuangGang", false);
            }else{
                huangZhuangGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_HuangZhuangGang, false);
            }
            this.play_huangZhuangGang.setSelected(huangZhuangGang);
            var text = this.play_huangZhuangGang.getChildByName("text");
            this.selectedCB(text,huangZhuangGang);
        }

        if(this._playNode_queyimen){
            if(isClub){
               this._queyimen = this.getBoolItem("queYiMen", false);
            }else{
                this._queyimen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_queYiMen, false);
            }
            this._playNode_queyimen.setSelected(this._queyimen);
            var text = this._playNode_queyimen.getChildByName("text");
            this.selectedCB(text,this._queyimen);
            this._playNode_queyimen.visible = (_maxPlayer == 2 || _maxPlayer == 3 || _maxPlayer == 4);
        }

        //新加飘分
        if (isClub)
            this._piaofen = this.getNumberItem("piaoType", 3);
        else
            this._piaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_PiaoFen, 3);
        var _oldData;
        if(isClub){
            _oldData = this.getBoolItem("jiapiao", false);
        }else{
            _oldData = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_jiaPiao, false);
        }
        if(_oldData)
        {
            this._piaofen = 4;
        }
        this._playNode_player_piaofen_radio.selectItem(this._piaofen);
        this.radioBoxSelectCB(this._piaofen, this.nodePiaofenList[this._piaofen], this.nodePiaofenList);

        if(this._playNode_piaoNiao){
            if(isClub){
                this._piaoNiao = this.getBoolItem("piaoniao", false);
            }else{
                this._piaoNiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_piaoNiao, false);
            }
            this._piaoNiao = this._piaoNiao && !this._jiaPiao; 
            this._playNode_piaoNiao.setSelected(this._piaoNiao);
            var text = this._playNode_piaoNiao.getChildByName("text");
            this.selectedCB(text,this._piaoNiao);
        }

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        var _zuoZhuang;
        if (isClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 0);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_zuoZhuang, 0);
        }
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            list = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio.selectItem(_zuoZhuang);
            this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);
        }

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        this._playNode_tuoguanType_4.setSelected(false);
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
        } else if (_trustTime == 300) {
            this._playNode_tuoguanType_4.setSelected(true);
            index = 4;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

        // //飘分、围一飘鸟状态刷新
        // this.schedule(function(){
        //     if(this._playNode_jiaPiao){
        //         var status = this._playNode_piaoNiao ? !this._playNode_piaoNiao.isSelected() : false;
        //         this._playNode_jiaPiao.setSelected(status);
        //     }
        //     if(this._playNode_piaoNiao){
        //         var status = this._playNode_jiaPiao ? !this._playNode_jiaPiao.isSelected() : false;           
        //         this._playNode_piaoNiao.setSelected(status);
        //     }
        // },0.1);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI_SCORE, 10);
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
                trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_trustWay, 0);
            }
            this._playNode_player_tuoguanType_radio.selectItem(trustWay);
            this.radioBoxSelectCB(trustWay, this.tuoguanWayNodeList[trustWay], this.tuoguanWayNodeList);
            this.setTrustWayPanel(index);
        }
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.TY_ZHUANZHUAN;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 0; //抓鸟
        para.zhuangxianfen = true; //闲庄分
        para.dianpao = true; //点炮胡
        para.qidui = true; //七对可胡
        para.hongzhong = 0; //红中
        para.qianggangsuanzimo = false;
        para.qianggangsuandianpao = false;
        para.difen = this._zhuIdx;
        para.wuhongzhong = this._playNode_wuHongZhong.isSelected(); //有红中可抢杠胡

        var niaoType = this._playNode_NiaoPanel_radio.getSelectIndex();
        para.niaoType = niaoType;//0，不抓鸟 1，中鸟加分 2，中鸟加倍


        var localZhuaNiao = 0;
        if (this._playNode_niaoType_1.isSelected()) {
            para.zhuaniao = 0;
            localZhuaNiao = 0;
        } else if (this._playNode_niaoType_2.isSelected()) {
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 2;
            }
            localZhuaNiao = 2;
        } else if (this._playNode_niaoType_3.isSelected()) {
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 4;
            }
            localZhuaNiao = 4;
        } else if (this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_niaoType_4.isSelected()) {
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 6;
            }
            localZhuaNiao = 6;
        } else if (this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_niaoType_5.isSelected()) {    //上中下鸟
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 1;
            }
            localZhuaNiao = 1;
        } else if(this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_niaoType_9 && this._playNode_niaoType_9.isSelected()){
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 9;
            }
            localZhuaNiao = 9;
        } else if (this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_niaoType_6.isSelected()) {    //一鸟全中
            if(this._playNode_zhongNiaoJiaFen.isSelected())
            {
                para.zhuaniao = 10;
            }
            localZhuaNiao = 10;
        } else
        {
            localZhuaNiao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_niaoTpye, 0);
        }
        var paraZhuaNiaoDouble = this.niaoFromJiaBeiList_radio.getSelectIndex();
        if(this._playNode_zhongNiaoJiaBei.isSelected())
        {
            para.zhuaniao = paraZhuaNiaoDouble + 20;
        }

        // 中鸟得分
        var niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
        if(this._playNode_zhongNiaoJiaFen.isSelected())
        {
            para.niaofen = niaofenIndex + 1;
            if(para.zhuaniao == 1) para.niaofen = 1;
            // 如果被隐藏了，应该默认为1分
            if(!this._playNode_niaoFen_1.visible){
                para.niaofen = 1;
            }
        }
        else {
            para.niaofen = 1;
        }

        if(this._playNode_quanzhongType){
            para.buzhongsuanquanzhong = this._playNode_quanzhongType.isSelected() && this._playNode_zhongNiaoJiaFen.isSelected();
        }

        if(this._playNode_quanZhongFanBei){
            para.quanzhongfanbei = this._playNode_quanZhongFanBei.isSelected() && this._playNode_zhongNiaoJiaFen.isSelected();
        }

        para.hongzhong = this._playNode_laizi0.isSelected() == true ? 0 : (this._playNode_laizi1.isSelected() == true ? 4 : 8);

        var maxPlayerIndex = this._playNode_player_type_radio2.getSelectIndex();
        para.convertible = maxPlayerIndex == 3 || maxPlayerIndex == 4; // 自由人数
        para.maxPlayer = [4, 3, 2, 4, 3][maxPlayerIndex];
        para.zhuangxianfen = this._playNode_zhuangxianfen.isSelected();
        para.dianpao = this._playNode_dianpao.isSelected(); //点炮胡
        para.qidui = this._playNode_qidui.isSelected(); //七对可胡
        para.isOpenTingTip = this.tingTipList[0].isSelected();

        if(this._playNode_dianpaoList){
            para.dianPaoScore = this._playNode_dianpaoList.getSelectIndex();
            para.ziMoScore = this._playNode_zimoList.getSelectIndex();  
        }

        if(this._playNode_biHuType){
            para.bihuType = this._playNode_biHuType.isSelected();
        }
        if(this._playNode_keChi){
            para.canChi = this._playNode_keChi.isSelected();//可吃
        }
        if(this._playNode_queyimen){
            if(maxPlayerIndex == 3 || maxPlayerIndex == 2 || maxPlayerIndex == 4){
                para.queYiMen = this._playNode_queyimen.isSelected();//缺一门
            }else{
                para.queYiMen = false;
            }
        }
        //飘分
        para.jiapiao = 0;
        para.piaoType = this._playNode_player_piaofen_radio.getSelectIndex();

        //围一飘鸟
        if(this._playNode_piaoNiao){
            para.piaoniao = this._playNode_piaoNiao.isSelected();
        }
        //258做将
        if(this.play_258ZuoJiang){
            para.zuoJiang258 = this.play_258ZuoJiang.isSelected();
        }
        //荒庄荒杠
        if(this.play_huangZhuangGang){
            para.huangZhuangGang = this.play_huangZhuangGang.isSelected();
        }
        //按庄抓鸟
        if(this._playNode_anzhuang){
            para.anzhuang = this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_anzhuang.isSelected()
                || this._playNode_zhongNiaoJiaBei.isSelected() && this._playNode_anzhuangFromJiaBei.isSelected();
        }
        // 抓鸟不轮空
        if (this._playNode_buLunKong) {
            para.buLunKong = this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_buLunKong.isSelected()
            || this._playNode_zhongNiaoJiaBei.isSelected() && this._playNode_buLunKongFromJiaBei.isSelected();
        }

        if (this.zuoZhuang_radio) {
            para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 先进来
        }

        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        } else if (this._playNode_tuoguanType_4.isSelected()) {
            para.trustTime = 300;
        }

        para.trustWay = 0;
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
            para.isTrustWhole   = para.trustWay != 0;
        }

        var _qianggangIdx = 0;
        if (this._playNode_qianggang0.isSelected()) {
            para.qianggangsuanzimo = true;
            _qianggangIdx = 0;
        } else if (this._playNode_qianggang1.isSelected()) {
            para.qianggangsuandianpao = true;
            _qianggangIdx = 1;
        } else if (this._playNode_qianggang2.isSelected()) {
            _qianggangIdx = 2;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (!this._isFriendCard) {
            var maxPlayerSave = para.convertible ? maxPlayerIndex == 3 ?  4 : 0 : para.maxPlayer;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaoTpye, localZhuaNiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble, paraZhuaNiaoDouble);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_laizi, para.hongzhong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaPanel, para.niaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_maxPlayer, maxPlayerSave);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_zhuangxianfen, para.zhuangxianfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_dianpaohu, para.dianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_is7dui, para.qidui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_qianggang, _qianggangIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_ziyou,para.convertible);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_PiaoFen, para.piaoType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_wuhongzhong,para.wuhongzhong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_tuoguan, para.trustTime);
            if(this._playNode_biHuType){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_biHu, para.bihuType);
            }

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_ZIMO_SCORE, para.ziMoScore); 
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_DIANPAO_SCORE, para.dianPaoScore); 

            if(this._playNode_keChi){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_kechi, para.canChi);
            }
            if(this._playNode_queyimen){
                var _isQueYiMen = this._playNode_queyimen.isSelected();
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_queYiMen, _isQueYiMen);
            }
            if(this._playNode_jiaPiao){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_jiaPiao, para.jiapiao);
            }
            if(this._playNode_piaoNiao){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_piaoNiao, para.piaoniao);
            }
            if(this._playNode_quanzhongType){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_bzsqz, para.buzhongsuanquanzhong);
            }
            if(this._playNode_quanZhongFanBei){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_qzfb, para.quanzhongfanbei);
            }
            if(this._playNode_anzhuang){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, para.anzhuang);
            }
            if(this._playNode_buLunKong){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_bulunkong, para.buLunKong);
            }
            if(this.play_258ZuoJiang){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_258ZuoJiang, para.zuoJiang258);
            }
            if(this.play_huangZhuangGang){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_HuangZhuangGang, para.huangZhuangGang);
            }
            if (this.zuoZhuang_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_zuoZhuang, para.zuoZhuang);
            }
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI_SCORE, para.fanBeiScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_trustWay, para.trustWay);
        }

        cc.log("TYZZ  createara: " + JSON.stringify(para));
        return para;
    }
});