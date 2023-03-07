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
        this.localStorageKey.KEY_TYZZ_liuniaowanfa = "_TYZZ_LIUNIAO_WANFA";  //不中算全中，全中算翻倍(只加湘乡转转麻将)
        this.localStorageKey.KEY_TYZZ_niaofen 	   = "_TYZZ_NIAO_FEN"; 			// 中鸟得分
        this.localStorageKey.KEY_TYZZ_biHu      = "_TYZZ_BI_HU";          // 有胡必胡
        this.localStorageKey.KEY_TYZZ_anzhuang = "_TYZZ_AN_ZHUANG";         //按莊家扎鳥
        this.localStorageKey.KEY_TYZZ_jiaPiao   = "_TYZZ_jiaPiao";          //是否加飘
        this.localStorageKey.KEY_TYZZ_ziyou     = "_TYZZ_ZIYOU";            //自由人数
        this.localStorageKey.KEY_TYZZ_wuhongzhong     = "_TYZZ_WU_HONG_ZHONG";     //有红中可抢杠胡
        this.localStorageKey.KEY_TYZZ_tuoguan      =  "_TYZZ_TUO_GUAN";              //托管
        this.localStorageKey.KEY_TYZZ_zuoZhuang                   = "_TYZZ_ZUO_ZHUANG";     //0 随机， 1 先进来
        this.localStorageKey.KEY_TYZZ_genzhangbudianpao           =  "_TYZZ_genzhangbudianpao";     //
        this.localStorageKey.KEY_TYZZ_FAN_BEI   = "TYZZ_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_TYZZ_FAN_BEI_SCORE   = "TYZZ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_TYZZ_JIESUAN_DIFEN             = "TYZZ_JIE_SUAN_DI_FEN"; // 积分底分
        this.localStorageKey.KEY_TYZZ_BUZHONG_SUAN_QUANZHONG      = "TYZZ_BUZHONG_SUANQUANZHONG_TYPE";//不中算全中
        this.localStorageKey.KEY_TYZZ_QUANZHONG_SUAN_FANBEI          = "TYZZ_QUANZHONG_FANBEI_TYPE"; // 全中翻倍

        this.localStorageKey.KEY_TYZZ_DIANPAO_SCORE              = "TYZZ_DIAN_PAO_SCORE"; // 点炮加分内容
        this.localStorageKey.KEY_TYZZ_ZIMO_SCORE                 = "TYZZ_ZI_MO_SCORE"; // 点炮加分内容
        this.localStorageKey.KEY_TYZZ_PIAO_TYPE                = "TYZZ_PIAO_TYPE"; // 点炮加分内容
        this.localStorageKey.KEY_TYZZ_bulunkong           =  "_TYZZ_BU_LUN_KONG";     //抓鸟不轮空
        this.localStorageKey.KEY_TYZZ_kechi      = "_TYZZ_KECHI";          // 可吃
        this.localStorageKey.KEY_TYZZ_queYiMen      = "_TYZZ_queYiMen";         //缺一门

        this.localStorageKey.KEY_TYZZ_258ZuoJiang               = "TYZZ_258_ZUOJIANG;"   // 258做将
        this.localStorageKey.KEY_TYZZ_HuangZhuangGang                = "TYZZ_ZI_HUANG_ZHUANG_GANG"; // 荒庄荒杠
        this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble               = "TYZZ_ZI_ZhuaNiaoDouble"; // 抓鸟
        this.localStorageKey.KEY_TYZZ_ZhuaPanel               = "TYZZ_ZI_ZhuaPanel"; // 抓鸟方式
        this.localStorageKey.KEY_TYZZ_piaoNiao   = "_TYZZ_piaoNiao";          //围一飘鸟
        this.localStorageKey.KEY_TYZZ_trustWay                      = "_TYZZ_TRUST_WAY"; // 托管方式
    },
    initAll: function(IsFriendCard) {
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ
            || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16, roundNum4:10};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
            this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16, roundNum4:10};
        }

        this.bg_node = ccs.load("bg_TYZZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_TYZZ");
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() ||
            MjClient.APP_TYPE.HUNANWANGWANG == MjClient.getAppType() ||
            MjClient.APP_TYPE.QXYZQP == MjClient.getAppType() ||
            MjClient.APP_TYPE.BDHYZP == MjClient.getAppType() ||
            MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType())
        {
            this.bg_node = this.bg_node.getChildByName("view");
        }

    },
    initPlayNode: function() {
        var _bgTYZZNode = this.bg_node;
        var _play = _bgTYZZNode.getChildByName("play");

        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao_0");
        this._playNode_zhongNiaoJiaBei = _play.getChildByName("zhongNiaoJiaBei");
        this._playNode_zhongNiaoJiaFen = _play.getChildByName("zhongNiaoJiaFen");

        var nodeNiaoList = [];
        nodeNiaoList.push(this._playNode_niaoType_1);
        nodeNiaoList.push(this._playNode_zhongNiaoJiaFen);
        nodeNiaoList.push(this._playNode_zhongNiaoJiaBei);
        this.nodeNiaoList = nodeNiaoList;
        this._playNode_NiaoPanel_radio = createRadioBoxForCheckBoxs(nodeNiaoList, this.radioBoxSelectCB);
        this.addListenerText(nodeNiaoList, this._playNode_NiaoPanel_radio);
        this.zhongNiaoJiaFenPanel = _play.getChildByName("jiaFenLayer");
        this.zhongNiaoJiaBeiPanel = _play.getChildByName("jiaBeiLayer");
        this.schedule(function() {
            this.zhongNiaoJiaFenPanel.setVisible(this._playNode_zhongNiaoJiaFen.isSelected());
            this.zhongNiaoJiaBeiPanel.setVisible(this._playNode_zhongNiaoJiaBei.isSelected());
        }.bind(this));

        //莫的类型
        // this._playNode_niaoType_1 = _play.getChildByName("zhuaniao_0");
        this._playNode_niaoType_2 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1");
        this._playNode_niaoType_3 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2");
        this._playNode_niaoType_4 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3");
        this._playNode_niaoType_5 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4");    // 上中下鸟
        this._playNode_niaoType_6 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5");    // 一鸟全中
        //邵阳、湘乡 转转加抓8鸟
        this._playNode_niaoType_7 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_6");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            this._playNode_niaoType_9 = this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9");
        }
        var nodeList1 = [];
        // nodeList1.push(_play.getChildByName("zhuaniao_0"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_1"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_2"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_3"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_4"));
        nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_5"));
        if(this._playNode_niaoType_7){
            nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_6"));
        }
        if(this._playNode_niaoType_9){
            nodeList1.push(this.zhongNiaoJiaFenPanel.getChildByName("zhuaniao_9"));
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            var niaoCallBack = function(index, sender, list){
                this.radioBoxSelectCB(index, sender, list);
                if(sender.getName() == "zhuaniao_3" ||sender.getName() == "zhuaniao_6" || sender.getName() == "zhuaniao_9"){
                    if(this._playNode_6niaowanfa){
                        this._playNode_6niaowanfa.visible = true;
                        this._playNode_6niaowanfa.setSelected(false);
                        this.clickCB(this._playNode_6niaowanfa, ccui.CheckBox.EVENT_UNSELECTED);
                    }
                    if(this._playNode_anZhuang && MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ ){
                        this._playNode_anZhuang.visible = true;
                        this._playNode_anZhuang.setSelected(false);
                        this.clickCB(this._playNode_anZhuang, ccui.CheckBox.EVENT_UNSELECTED);
                    }
                }else {
                    if(this._playNode_6niaowanfa){
                        this._playNode_6niaowanfa.visible = false;
                    }
                    if(this._playNode_anZhuang){
                        this._playNode_anZhuang.visible = false;
                    }
                    if(this._playNode_buLunKong){
                        this._playNode_buLunKong.visible = false;
                    }
                    if(sender.getName() == "zhuaniao_1" || sender.getName() == "zhuaniao_2"){
                        if(this._playNode_anZhuang){
                            this._playNode_anZhuang.visible = true;
                        }
                        if(this._playNode_buLunKong){
                            this._playNode_buLunKong.visible = true;
                        }
                    }
                }
            }.bind(this);
            this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, niaoCallBack);
            var textCallBack = function(index){
                var sender = nodeList1[index];
                niaoCallBack(index, sender, nodeList1);
            };
            this.addListenerText(nodeList1, this._playNode_player_type_radio, textCallBack);            
        }else{
            this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
            this.addListenerText(nodeList1, this._playNode_player_type_radio);
        }
        this._playNode_niaoFen_1 = this.zhongNiaoJiaFenPanel.getChildByName("play_niaofen1");
        this._playNode_niaoFen_2 = this.zhongNiaoJiaFenPanel.getChildByName("play_niaofen2");
        var niaoFenList = [];
        niaoFenList.push(this._playNode_niaoFen_1);
        niaoFenList.push(this._playNode_niaoFen_2);
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) //【special】邵阳 转转  抓2，4，6，8鸟
        {
            this._playNode_niaoFen_1.schedule(function() {
                this._playNode_niaoFen_1.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
                this._playNode_niaoFen_2.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
            }.bind(this));
        }else{
            this._playNode_niaoFen_1.schedule(function() {
                this._playNode_niaoFen_1.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());
                this._playNode_niaoFen_2.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());
            }.bind(this));
        }
        var niaoFromJiaBeiList = [];
        niaoFromJiaBeiList.push(this.zhongNiaoJiaBeiPanel.getChildByName("play_niao1"));
        niaoFromJiaBeiList.push(this.zhongNiaoJiaBeiPanel.getChildByName("play_niao2"));
        this.niaoFromJiaBeiList = niaoFromJiaBeiList;
        this.niaoFromJiaBeiList_radio = createRadioBoxForCheckBoxs(niaoFromJiaBeiList, this.radioBoxSelectCB);
        this.addListenerText(niaoFromJiaBeiList, this.niaoFromJiaBeiList_radio);

        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_zhuangxianfen.addEventListener(this.clickCB, this._playNode_zhuangxianfen);

        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        this.addListenerText(this._playNode_dianpao);
        this._playNode_dianpao.addEventListener(this.clickCB, this._playNode_dianpao);

        this.play_258ZuoJiang = _play.getChildByName("play_258ZuoJiang");
        this.addListenerText(this.play_258ZuoJiang);
        this.play_258ZuoJiang.addEventListener(this.clickCB, this.play_258ZuoJiang);

        this.play_huangZhuangGang = _play.getChildByName("play_huangZhuangGang");
        this.addListenerText(this.play_huangZhuangGang);
        this.play_huangZhuangGang.addEventListener(this.clickCB, this.play_huangZhuangGang);

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            // 不中算全中
            this._playNode_zhongNiao = this.zhongNiaoJiaFenPanel.getChildByName("buZhongNiao");
            this.addListenerText(this._playNode_zhongNiao);
            this._playNode_zhongNiao.addEventListener(this.clickCB, this._playNode_zhongNiao);

           

            // 全中翻倍
            this._playNode_quanZhongFanBei = this.zhongNiaoJiaFenPanel.getChildByName("quanZhongFanBei");
            this.addListenerText(this._playNode_quanZhongFanBei);
            this._playNode_quanZhongFanBei.addEventListener(this.clickCB, this._playNode_quanZhongFanBei); 
            this._playNode_zhongNiao.schedule(function() {
                this._playNode_zhongNiao.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
                this._playNode_quanZhongFanBei.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
            }.bind(this));

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
            this._playNode_dianpaoList = createRadioBoxForCheckBoxs(dianpaoList, this.radioBoxSelectCB);
            this.addListenerText(dianpaoList, this._playNode_dianpaoList);

            this.play_dianpaoList1 = _play.getChildByName("box_dianpao_1");
            this.play_dianpaoList2 = _play.getChildByName("box_dianpao_2");

            this._playNode_dianpao.schedule(function() {
                this.play_dianpaoList1.setVisible(this._playNode_dianpao.isSelected());
                this.play_dianpaoList2.setVisible(this._playNode_dianpao.isSelected());
            }.bind(this));


            if(_play.getChildByName("play_kechi")){
                this._playNode_keChi = _play.getChildByName("play_kechi");
                this.addListenerText(this._playNode_keChi);
                this._playNode_keChi.addEventListener(this.clickCB, this._playNode_keChi);
            }

               // 飘分选项只有邵阳有
            var piaoList = [];
            piaoList.push(_play.getChildByName("box_piao1"));
            piaoList.push(_play.getChildByName("box_piao2"));
            piaoList.push(_play.getChildByName("box_piao3"));
            piaoList.push(_play.getChildByName("box_piao4"));
            piaoList.push(_play.getChildByName("box_piao5"));
            piaoList.push(_play.getChildByName("box_piao6"));
            var piaoFenCallback = function(index){
                this._playNode_piaoList.selectItem(index);
                this.radioBoxSelectCB(index, piaoList[index], piaoList);
                if (index != 3) {
                    if(this._playNode_piaoNiao){
                        if(this._playNode_piaoNiao.isSelected()){
                            this._playNode_piaoNiao.setSelected(false);
                        }
                        this.clickCB(this._playNode_piaoNiao, ccui.CheckBox.EVENT_SELECTED);
                    }
                }
            }.bind(this);
            this._playNode_piaoList = createRadioBoxForCheckBoxs(piaoList, function(index) {
                piaoFenCallback(index);
            }.bind(this));
            this.addListenerText(piaoList, this._playNode_piaoList,piaoFenCallback);
        }


        this._playNode_piaoNiao = _play.getChildByName("play_piaoniao");
        var piaoNiaoTextCallback = function(index){
            this._playNode_piaoList.selectItem(3);
            this.radioBoxSelectCB(3, piaoList[3], piaoList);
            this.clickCB(this._playNode_piaoNiao, ccui.CheckBox.EVENT_SELECTED);
        }.bind(this);
        this.addListenerText(this._playNode_piaoNiao, null, piaoNiaoTextCallback);
        this._playNode_piaoNiao.addEventListener(piaoNiaoTextCallback, this._playNode_piaoNiao);


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
        this._playNode_player_type_radio1 = createRadioBoxForCheckBoxs(nodeList2, this._radioBoxSelectCB.bind(this));
        this.addListenerText(nodeList2, this._playNode_player_type_radio1);
        this._playNode_maxPlayer0 = _play.getChildByName("play_maxPlayer_0");//3人
        this._playNode_maxPlayer1 = _play.getChildByName("play_maxPlayer_1");//4人
        this._playNode_maxPlayer2 = _play.getChildByName("play_maxPlayer_2");//自由人数
        this._playNode_maxPlayer3 = _play.getChildByName("play_maxPlayer");//2人
        var nodeList3 = [];
        nodeList3.push(_play.getChildByName("play_maxPlayer_0"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_1"));
        if(this._playNode_maxPlayer2){
            nodeList3.push(_play.getChildByName("play_maxPlayer_2"));
        }
        nodeList3.push(_play.getChildByName("play_maxPlayer"));
        this._playNode_player_type_radio2 = createRadioBoxForCheckBoxs(nodeList3, this._radioBoxSelectCB.bind(this));
        this.addListenerText(nodeList3, this._playNode_player_type_radio2,this.changeAAPayForPlayerNum.bind(this));
        //抢杠类型
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

        if(_play.getChildByName("play_genzhangbudianpao")){
        this._playNode_genzhangbudianpao = _play.getChildByName("play_genzhangbudianpao");
        this.addListenerText(this._playNode_genzhangbudianpao);
        this._playNode_genzhangbudianpao.addEventListener(this.clickCB, this._playNode_genzhangbudianpao); 
        }  

        if(_play.getChildByName("play_bihuType")){
            this._playNode_biHuType = _play.getChildByName("play_bihuType");
            this.addListenerText(this._playNode_biHuType);
            this._playNode_biHuType.addEventListener(this.clickCB, this._playNode_biHuType);
        }

        if(_play.getChildByName("play_queYiMen")){
            this._playNode_queyimen = _play.getChildByName("play_queYiMen");
            this.addListenerText(this._playNode_queyimen);
            this._playNode_queyimen.addEventListener(this.clickCB, this._playNode_queyimen);
            // this._playNode_queyimen.schedule(function() {
            //     var index = this._playNode_player_type_radio2.getSelectIndex();
            //     this._playNode_queyimen.setVisible(index == 2||index == 3); 
            // }.bind(this));
        }


        this._playNode_6niaowanfa = _play.getChildByName("play_6niaowanfa");
        this._playNode_anZhuang = this.zhongNiaoJiaFenPanel.getChildByName("play_anzhuang");
        this._playNode_buLunKong = this.zhongNiaoJiaFenPanel.getChildByName("play_buLunKong");
        if(this._playNode_6niaowanfa){
            var niaoCallFunc = function(sender, type){
                this.clickCB(sender, type);
                if(this._playNode_anZhuang){
                    this._playNode_anZhuang.visible = !sender.isSelected();
                    if(sender.isSelected()){
                        this._playNode_anZhuang.setSelected(false);
                    }
                }

                if(this._playNode_buLunKong){
                    this._playNode_buLunKong.visible = !sender.isSelected();
                    if(sender.isSelected()){
                        this._playNode_buLunKong.setSelected(false);
                    }
                }


            }.bind(this);
            var textNiaoCallFunc = function(index){
                niaoCallFunc(this._playNode_6niaowanfa, ccui.CheckBox.EVENT_SELECTED);
            }.bind(this);
            this.addListenerText(this._playNode_6niaowanfa, null, textNiaoCallFunc);
            this._playNode_6niaowanfa.addEventListener(niaoCallFunc, this._playNode_6niaowanfa);
        }

        if(this._playNode_anZhuang){
            var callFunc = function(sender, type){
                this.clickCB(sender, type);
                if(this._playNode_6niaowanfa){
                    this._playNode_6niaowanfa.visible = (this._playNode_niaoType_7.isSelected() || this._playNode_niaoType_4.isSelected()) && !sender.isSelected();
                    if(sender.isSelected()){
                        this._playNode_6niaowanfa.setSelected(false);
                    }
                }
            }.bind(this);
            var textCallFunc = function(index){
                callFunc(this._playNode_anZhuang, ccui.CheckBox.EVENT_SELECTED);
            }.bind(this);
            this.addListenerText(this._playNode_anZhuang, null, textCallFunc);
            this._playNode_anZhuang.addEventListener(callFunc, this._playNode_anZhuang); 
        }

        if(this._playNode_buLunKong){
            var callFunc = function(sender, type){
                this.clickCB(sender, type);
                if(this._playNode_6niaowanfa){
                    this._playNode_6niaowanfa.visible = (this._playNode_niaoType_7.isSelected() || this._playNode_niaoType_4.isSelected()) && !sender.isSelected();
                    if(sender.isSelected()){
                        this._playNode_6niaowanfa.setSelected(false);
                    }
                }
            }.bind(this);
            var textCallFunc = function(index){
                callFunc(this._playNode_buLunKong, ccui.CheckBox.EVENT_SELECTED);
            }.bind(this);
            this.addListenerText(this._playNode_buLunKong, null, textCallFunc);
            this._playNode_buLunKong.addEventListener(callFunc, this._playNode_buLunKong); 

            this._playNode_buLunKong.schedule(function() {
                this._playNode_buLunKong.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
                this._playNode_anZhuang.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected());
            }.bind(this));

        }

        this._playNode_anzhuangFromJiaBei = this.zhongNiaoJiaBeiPanel.getChildByName("play_anzhuang");
        this.addListenerText(this._playNode_anzhuangFromJiaBei);
        this._playNode_anzhuangFromJiaBei.addEventListener(this.clickCB, this._playNode_anzhuangFromJiaBei);

        this._playNode_buLunKongFromJiaBei = this.zhongNiaoJiaBeiPanel.getChildByName("play_buLunKong");
        this.addListenerText(this._playNode_buLunKongFromJiaBei);
        this._playNode_buLunKongFromJiaBei.addEventListener(this.clickCB, this._playNode_buLunKongFromJiaBei);


        //加飘
        if(_play.getChildByName("play_piaofen")){
            this._playNode_jiaPiao = _play.getChildByName("play_piaofen");
            this.addListenerText(this._playNode_jiaPiao);
            this._playNode_jiaPiao.addEventListener(this.clickCB, this._playNode_jiaPiao);            
        }

        //坐庄
        this._zuozhuang_1 = _play.getChildByName("zuoZhuang_1");
        this._zuozhuang_2 = _play.getChildByName("zuoZhuang_2");
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var zuoZhuangList = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
            this.addListenerText(zuoZhuangList, this.zuoZhuang_radio);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
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
        }

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ){
            var jieSuan_node = MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ  ? _bgTYZZNode.getParent() : _bgTYZZNode;


            var score = jieSuan_node.getChildByName("score");
            var addBtn = jieSuan_node.getChildByName("btn_add");
            var subBtn = jieSuan_node.getChildByName("btn_sub");
            addBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);

            subBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);
        }

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
            this.text_fanbei = _play.getChildByName("text_0_4");
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
        }

        this.schedule(function() {
            //隐藏的选项位置不留空，选项上移
            var offset = 0;
            if(this.zhongNiaoJiaBeiPanel.isVisible())
            {
                offset = 105;
            }
            else if(!this.zhongNiaoJiaFenPanel.isVisible() && !this.zhongNiaoJiaBeiPanel.isVisible())
            {
                offset = 210;
            }

            for(var i = 0;i < nodeListFanBei.length;i++)
            {
                nodeListFanBei[i].y = -593.05 + offset;
            }
            this.text_fanbei.y = -593.05 + offset;

        }.bind(this));
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ && _play.getChildByName("tuoguanType_0")){
            this.trustWatTitle = _play.getParent().getChildByName("img_tuoGuanFangShiTip");
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
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ){
            this._playNode_niaoType_9.setSelected(false); // 摸几奖几
        }
        this._playNode_niaoType_7 && this._playNode_niaoType_7.setSelected(false);    // 抓8鸟


        var niaofen;
        if (isClub)
            niaofen = this.getNumberItem("niaofen", 1);
        else
            niaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_niaofen, 1);
        var niaofenIndex = niaofen - 1;
        this._playNode_niaoFen_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenList[niaofenIndex], this.niaoFenList);


        if (_niaoType == 0) {
            this._playNode_niaoType_1.setSelected(true);
            var text = this._playNode_niaoType_1.getChildByName("text");
            this.selectedCB(text,true)
        } else if(_niaoType == 1) {
            this._playNode_niaoType_5.setSelected(true);
            var text = this._playNode_niaoType_5.getChildByName("text");
            this.selectedCB(text,true)
        } else if (_niaoType == 2) {
            this._playNode_niaoType_2.setSelected(true);
            var text = this._playNode_niaoType_2.getChildByName("text");
            this.selectedCB(text,true)
        } else if (_niaoType == 4) {
            this._playNode_niaoType_3.setSelected(true);
            var text = this._playNode_niaoType_3.getChildByName("text");
            this.selectedCB(text,true)
        } else if (_niaoType == 6) {
            this._playNode_niaoType_4.setSelected(true);
            var text = this._playNode_niaoType_4.getChildByName("text");
            this.selectedCB(text,true)
        } else if (_niaoType == 10) {
            this._playNode_niaoType_6.setSelected(true);
            var text = this._playNode_niaoType_6.getChildByName("text");
            this.selectedCB(text,true)

        }else if(_niaoType == 9){  
            this._playNode_niaoType_9.setSelected(true);
            var text = this._playNode_niaoType_9.getChildByName("text");
            this.selectedCB(text,true)
        }else if (_niaoType == 8) {
            if(this._playNode_niaoType_7)  //抓8鸟
            {
                this._playNode_niaoType_7.setSelected(true);
                var text = this._playNode_niaoType_7.getChildByName("text");
                this.selectedCB(text,true)
            }
        }
        if(!this._playNode_niaoType_7.isSelected() && !this._playNode_niaoType_9.isSelected() && !this._playNode_niaoType_6.isSelected()
            && !this._playNode_niaoType_4.isSelected() && !this._playNode_niaoType_3.isSelected() && !this._playNode_niaoType_2.isSelected()
            && !this._playNode_niaoType_5.isSelected())
        {
            this._playNode_niaoType_2.setSelected(true);
            var text = this._playNode_niaoType_2.getChildByName("text");
            this.selectedCB(text,true)
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


        if(isClub){
           this._zhuangxianfen = this.getBoolItem("zhuangxianfen", true);
        }else{
            this._zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_zhuangxianfen, true);
        }
        this._playNode_zhuangxianfen.setSelected(this._zhuangxianfen);
        var text = this._playNode_zhuangxianfen.getChildByName("text");
        this.selectedCB(text,this._zhuangxianfen)

        if(isClub){
           this._dianpao = this.getBoolItem("dianpao", true);
        }else{
            this._dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_dianpaohu, true);
        }
        this._playNode_dianpao.setSelected(this._dianpao);
        var text = this._playNode_dianpao.getChildByName("text");
        this.selectedCB(text,this._dianpao);

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
        this._playNode_laizi1.setSelected(false);
        this._playNode_laizi2.setSelected(false);
        var index = _laizi == 0 ? 0 : (_laizi == 4 ? 1 : 2)
        this["_playNode_laizi" + index].setSelected(true);
        var text = this["_playNode_laizi" + index].getChildByName("text");
        this.selectedCB(text,true)

        var _maxPlayer;
        if(isClub){
            _maxPlayer = this.getNumberItem("maxPlayer", 3);
            if (this.getBoolItem("convertible", false)){
                _maxPlayer = 0;
            }
        }else{
            var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_ziyou,false);
            if(ziyou){
                _maxPlayer = 0;
            }else{
                _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_maxPlayer, 3);
            }
        }
        this._playNode_maxPlayer0.setSelected(_maxPlayer == 3);
        var text = this._playNode_maxPlayer0.getChildByName("text");
        this.selectedCB(text,_maxPlayer == 3);
        this._playNode_maxPlayer1.setSelected(_maxPlayer == 4);
        var text = this._playNode_maxPlayer1.getChildByName("text");
        this.selectedCB(text,_maxPlayer == 4);
        this._playNode_maxPlayer3.setSelected(_maxPlayer == 2);
        var text = this._playNode_maxPlayer3.getChildByName("text");
        this.selectedCB(text,_maxPlayer == 2);
        if(this._playNode_maxPlayer2){
            this._playNode_maxPlayer2.setSelected(_maxPlayer == 0);
            var text = this._playNode_maxPlayer2.getChildByName("text");
            this.selectedCB(text,_maxPlayer == 0);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            // 不中算全中
            var _buzhongsuanquanzhong;
            if(isClub){
                _buzhongsuanquanzhong = this.getBoolItem("buzhongsuanquanzhong", false);
            }else{
                _buzhongsuanquanzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_BUZHONG_SUAN_QUANZHONG,false);
            }
            this._playNode_zhongNiao.setSelected(_buzhongsuanquanzhong);
            this.selectedCB(this._playNode_zhongNiao.getChildByName("text"), _buzhongsuanquanzhong);

            // 全中翻倍
            var _quanzhongfanbei;
            if(isClub){
                _quanzhongfanbei = this.getBoolItem("quanzhongfanbei", false);
            }else{
                _quanzhongfanbei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_QUANZHONG_SUAN_FANBEI,false);
            }
            this._playNode_quanZhongFanBei.setSelected(_quanzhongfanbei);
            this.selectedCB(this._playNode_quanZhongFanBei.getChildByName("text"), _quanzhongfanbei);

            var _bgTYZZNode = this.bg_node;

            //莫的类型
            var _play = _bgTYZZNode.getChildByName("play");

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

        }

        var zuoJiang258;
        if(isClub){
            zuoJiang258 = this.getBoolItem("zuoJiang258", false);
        }else{
            zuoJiang258 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_258ZuoJiang, false);
        }
        this.play_258ZuoJiang.setSelected(zuoJiang258);
        var text = this.play_258ZuoJiang.getChildByName("text");
        this.selectedCB(text,zuoJiang258);

        var zhuaNiaoDouble;
        if (isClub)
            zhuaNiaoDouble = this.getNumberItem("zhuaNiaoDouble", 0);
        else
            zhuaNiaoDouble = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble, 0);
        this.niaoFromJiaBeiList_radio.selectItem(zhuaNiaoDouble);
        this.radioBoxSelectCB(zhuaNiaoDouble, this.niaoFromJiaBeiList[zhuaNiaoDouble], this.niaoFromJiaBeiList);

        var huangZhuangGang;
        if(isClub){
            huangZhuangGang = this.getBoolItem("huangZhuangGang", false);
        }else{
            huangZhuangGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_HuangZhuangGang, false);
        }
        this.play_huangZhuangGang.setSelected(huangZhuangGang);
        var text = this.play_huangZhuangGang.getChildByName("text");
        this.selectedCB(text,huangZhuangGang);

        var piaoNiao;
        if(isClub){
            piaoNiao = this.getBoolItem("piaoniao", false);
        }else{
            piaoNiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_piaoNiao, false);
        }
        this._playNode_piaoNiao.setSelected(piaoNiao);
        var text = this._playNode_piaoNiao.getChildByName("text");
        this.selectedCB(text,piaoNiao);

        if(this._playNode_queyimen){
            if(isClub){
               this._queyimen = this.getBoolItem("queYiMen", false);
            }else{
                this._queyimen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_queYiMen, false);
            }
            this._playNode_queyimen.setSelected(this._queyimen);
            var text = this._playNode_queyimen.getChildByName("text");
            this.selectedCB(text,this._queyimen);
            this._playNode_queyimen.visible = (_maxPlayer == 2 || _maxPlayer == 3);
        }

        var _qianggang;
        if(isClub){
            var qianggangsuanzimo = this.getBoolItem("qianggangsuanzimo",false);
            var qianggangsuandianpao = this.getBoolItem("qianggangsuandianpao",false);
            _qianggang = qianggangsuanzimo ? 0 : qianggangsuandianpao ? 1: 2;
        }else{
            _qianggang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_qianggang, 2);
        }
        this._playNode_qianggang0.setSelected(false);
        this._playNode_qianggang1.setSelected(false);
        this._playNode_qianggang2.setSelected(false);

        var text = this._playNode_qianggang0.getChildByName("text");
        if(_qianggang == 0)
        {
            this._playNode_qianggang0.setSelected(true);
        }
        else if(_qianggang == 1)
        {
            this._playNode_qianggang1.setSelected(true);
            text = this._playNode_qianggang1.getChildByName("text");
        }
        else if(_qianggang == 2)
        {
            this._playNode_qianggang2.setSelected(true);
            text = this._playNode_qianggang2.getChildByName("text");
        }
        this.selectedCB(text,true);
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
        //有胡必胡
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

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _jieSuanDiFen;
            if(isClub){
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_JIESUAN_DIFEN,1);
            }
            var score = this.bg_node.getParent().getChildByName("score");
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);
        }

        //【special】湘乡转转麻将，6鸟玩法，不中算全中, 全中算翻倍
        if(this._playNode_6niaowanfa)
        {
            if(isClub){
                this._liuniaowanfa = this.getBoolItem("liuniaowanfa", false);
            }else{
                this._liuniaowanfa = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_liuniaowanfa, false);
            }
            this._playNode_6niaowanfa.setSelected(this._liuniaowanfa);
            var text = this._playNode_6niaowanfa.getChildByName("text");
            this.selectedCB(text, this._liuniaowanfa);

            this._playNode_6niaowanfa.visible = this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected();
            var anzhuang;
            if(isClub){
               anzhuang = this.getBoolItem("anzhuang", false);
            }else{
               anzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, false);
            }
            if(this._playNode_niaoType_4.isSelected() && this._playNode_anZhuang.visible && anzhuang){
                this._playNode_6niaowanfa.visible = false;
            }
        }

        if(this._playNode_genzhangbudianpao)
        {
            if (isClub)
                this.genzhangbudianpao = this.getBoolItem("genzhangbudianpao", false);
            else
                this.genzhangbudianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_genzhangbudianpao, false);
            this._playNode_genzhangbudianpao.setSelected(this.genzhangbudianpao);
            var text = this._playNode_genzhangbudianpao.getChildByName("text");
            this.selectedCB(text, this.genzhangbudianpao)
        }



        if(this._playNode_anZhuang){
            var anzhuang;
            if(isClub){
               anzhuang = this.getBoolItem("anzhuang", false);
            }else{
               anzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, false);
            }
            this._playNode_anZhuang.setSelected(anzhuang);
            var text = this._playNode_anZhuang.getChildByName("text");
            this.selectedCB(text,this._anzhuang);

            this._playNode_anZhuang.visible = this._playNode_niaoType_7.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_2.isSelected();

            if(this._playNode_6niaowanfa && (this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected()) && this._playNode_6niaowanfa.visible && this._playNode_6niaowanfa.isSelected()){
                this._playNode_anZhuang.visible = false;
            }
        }
        //
        if(this._playNode_buLunKong){
            var anzhuang;
            if(isClub){
               anzhuang = this.getBoolItem("buLunKong", false);
            }else{
               anzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_bulunkong, false);
            }
            this._playNode_buLunKong.setSelected(anzhuang);
            var text = this._playNode_buLunKong.getChildByName("text");
            this.selectedCB(text,this._anzhuang);

            this._playNode_buLunKong.visible = this._playNode_niaoType_7.isSelected() || this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_2.isSelected();

            if(this._playNode_6niaowanfa && (this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected()) && this._playNode_6niaowanfa.visible && this._playNode_6niaowanfa.isSelected()){
                this._playNode_buLunKong.visible = false;
            }
        }



        if(this._playNode_jiaPiao){
            if(isClub){
               this._jiaPiao = this.getBoolItem("jiapiao", false);
            }else{
                this._jiaPiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_jiaPiao, false);
            }
            this._playNode_jiaPiao.setSelected(this._jiaPiao);
            var text = this._playNode_jiaPiao.getChildByName("text");
            this.selectedCB(text,this._jiaPiao);
        }

        // 票分选项
        if(this._playNode_piaoList){
            var _piaoFenIndex;
            if(isClub){
                _piaoFenIndex = this.getNumberItem("piaoType", 3);
            }else{
                _piaoFenIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYZZ_PIAO_TYPE,3);
            }
            var _jiaPiao = false;
            if(isClub){
               _jiaPiao = this.getBoolItem("jiapiao", false);
            }else{
                _jiaPiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYZZ_jiaPiao, false);
            }

            // 久选项选择了加飘，新版本设置为自由下飘
            if(_jiaPiao){
                _piaoFenIndex = 4;
            }

            this._playNode_piaoList.selectItem(_piaoFenIndex);
            list = [];
            list.push(_play.getChildByName("box_piao1"));
            list.push(_play.getChildByName("box_piao2"));
            list.push(_play.getChildByName("box_piao3"));
            list.push(_play.getChildByName("box_piao4"));
            list.push(_play.getChildByName("box_piao5"));
            list.push(_play.getChildByName("box_piao6"));
            this.radioBoxSelectCB(_piaoFenIndex,list[_piaoFenIndex],list);  
        }
          



        if(this._playNode_maxPlayer2){
            this.schedule(function(){
                if(this.payWayNodeArray.length > 1 && !this._isRoomCardMode){ //亲友圈房卡模式 使用动态创建节点
                    this._playNode_maxPlayer2.visible = this.payWayNodeArray[0].isSelected();
                    this.payWayNodeArray[1].visible = !this._playNode_maxPlayer2.isSelected();
                }
            },0.1);
        }

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

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
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
        }

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
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() &&  this.tuoguanWayNodeList){
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
        para.liuniaowanfa = false;    //【special】湘乡转转麻将，6鸟玩法，不中算全中, 全中算翻倍
        para.anzhuang = false;//湘乡转转麻将“按庄加抓鸟”选项
        para.wuhongzhong = this._playNode_wuHongZhong.isSelected(); //有红中可抢杠胡
        para.genzhangbudianpao = false; //跟张不点炮

        var niaoType = this._playNode_NiaoPanel_radio.getSelectIndex();
        para.niaoType = niaoType;//0，不抓鸟 1，中鸟加分 2，中鸟加倍

        if (this._playNode_niaoType_1.isSelected()) {
            para.zhuaniao = 0;
        } else if (this._playNode_niaoType_2.isSelected()) {
            para.zhuaniao = 2;
        } else if (this._playNode_niaoType_3.isSelected()) {
            para.zhuaniao = 4;
        } else if (this._playNode_niaoType_4.isSelected()) {
            para.zhuaniao = 6;
        } else if (this._playNode_niaoType_5.isSelected()) {    //上中下鸟
            para.zhuaniao = 1;
        } else if (this._playNode_niaoType_6.isSelected()) {    //一鸟全中
            para.zhuaniao = 10;
        }else if(this._playNode_niaoType_9 && this._playNode_niaoType_9.isSelected()){
            para.zhuaniao = 9; // 摸几奖几
        }
         else if (this._playNode_niaoType_7 && this._playNode_niaoType_7.isSelected()) {    //抓8鸟
            para.zhuaniao = 8;
        }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaoTpye, para.zhuaniao);

        // 中鸟得分
        var niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
        para.niaofen = niaofenIndex + 1;
        if(para.zhuaniao == 1) para.niaofen = 1;
        // 如果被隐藏了，应该默认为1分
        if(!this._playNode_niaoFen_1.visible){
            para.niaofen = 1;
        }

        var paraZhuaNiaoDouble = this.niaoFromJiaBeiList_radio.getSelectIndex();
        if(this._playNode_zhongNiaoJiaBei.isSelected())
        {
            para.zhuaniao = paraZhuaNiaoDouble + 20;
        }

        para.piaoniao = this._playNode_piaoNiao.isSelected();
        para.zuoJiang258 = this.play_258ZuoJiang.isSelected();
        para.huangZhuangGang = this.play_huangZhuangGang.isSelected();
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaofen, para.niaofen);
        if(this._playNode_genzhangbudianpao)
        {
            para.genzhangbudianpao = this._playNode_genzhangbudianpao.isSelected(); //
        }
        para.hongzhong = this._playNode_laizi0.isSelected() == true ? 0 : (this._playNode_laizi1.isSelected() == true ? 4 : 8);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_laizi, para.hongzhong);

        para.maxPlayer = this._playNode_maxPlayer3.isSelected() ? 2 : this._playNode_maxPlayer0.isSelected() == true ? 3 : 4;
        if(this._playNode_maxPlayer2){
            para.convertible = this._playNode_maxPlayer2.isSelected(); // 自由人数
        }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_maxPlayer, para.maxPlayer);

        para.zhuangxianfen = this._playNode_zhuangxianfen.isSelected();
        para.dianpao = this._playNode_dianpao.isSelected(); //点炮胡
        para.qidui = this._playNode_qidui.isSelected(); //七对可胡
       
        if(this._playNode_biHuType){
            para.bihuType = this._playNode_biHuType.isSelected();
        } 
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            
            para.piaoType = this._playNode_piaoList.getSelectIndex();
            para.jiapiao = (para.piaoType == 4); // 邵阳用另外一种方式记录飘分选项
        }else if (this._playNode_jiaPiao) {// 飘分
            para.jiapiao = this._playNode_jiaPiao.isSelected();//飘分
        }

        para.queYiMen = false;
        if(this._playNode_queyimen){
            // 二人玩法，缺一门 条子
            if(this._playNode_player_type_radio2.getSelectIndex() == 0 || this._playNode_player_type_radio2.getSelectIndex() == 2){
                para.queYiMen = this._playNode_queyimen.isSelected();//缺一门
            } 
        }


        if(this._playNode_anZhuang){
            para.anzhuang =this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_anZhuang.isSelected()
                || this._playNode_zhongNiaoJiaBei.isSelected() && this._playNode_anzhuangFromJiaBei.isSelected();
            // if(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected()){
            //     para.anzhuang = this._playNode_anZhuang.isSelected();
            // }else if(this._playNode_niaoType_4.isSelected()){
            //     para.anzhuang = 
            // }
            // para.anzhuang = this._playNode_anZhuang.visible && this._playNode_anZhuang.isSelected() && (
            //         this._playNode_niaoType_2.isSelected() ||
            //         this._playNode_niaoType_3.isSelected() ||
            //         (this._playNode_niaoType_4.isSelected() && (
            //             !this._playNode_6niaowanfa.visible || 
            //             (this._playNode_6niaowanfa.visible && !this._playNode_6niaowanfa.isSelected())
            //             ))
            //     );        
        }
        if(this._playNode_buLunKong){
            para.buLunKong = this._playNode_zhongNiaoJiaFen.isSelected() && this._playNode_buLunKong.isSelected()
                || this._playNode_zhongNiaoJiaBei.isSelected() && this._playNode_buLunKongFromJiaBei.isSelected();
        }


        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_zhuangxianfen, para.zhuangxianfen);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_dianpaohu, para.dianpao);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_is7dui, para.qidui);


        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) //【special】湘乡转转麻将，6鸟玩法，不中算全中, 全中算翻倍
        {
            if(this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected())    // 6鸟选中
            {
                para.liuniaowanfa = this._playNode_6niaowanfa.visible && this._playNode_6niaowanfa.isSelected();
                // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_liuniaowanfa, para.liuniaowanfa);
            }
            para.bihuType = this._playNode_biHuType.isSelected();//有胡必胡
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

        if (this.zuoZhuang_radio) {
            para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 先进来
        }

        if(this._playNode_keChi){
            para.canChi = this._playNode_keChi.isSelected();//可吃
        }
           
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            //托管
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

            para.buzhongsuanquanzhong = this._playNode_zhongNiao.isSelected() && this._playNode_zhongNiao.isVisible();
            para.quanzhongfanbei = this._playNode_quanZhongFanBei.isSelected() && this._playNode_quanZhongFanBei.isVisible();


            para.dianPaoScore = this._playNode_dianpaoList.getSelectIndex();
            para.ziMoScore = this._playNode_zimoList.getSelectIndex();

        }

        // 积分底分
        var score = null;
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            score = this.bg_node.getParent().getChildByName("score"); 
        }else if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            score = this.bg_node.getChildByName("score"); 
        }
        if(score){
            para.jieSuanDiFen = Number(score.getString());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_JIESUAN_DIFEN,para.jieSuanDiFen);
        }
        
        para.trustWay = 0;
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() && this.tuoguanWayNodeList){
            para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
            para.isTrustWhole   = para.trustWay != 0;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_qianggang, _qianggangIdx);
        cc.log("TYZZ createara: " + JSON.stringify(para));
        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard){
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) //【special】湘乡转转麻将，6鸟玩法，不中算全中, 全中算翻倍
            {
                if(this._playNode_niaoType_4.isSelected() || this._playNode_niaoType_7.isSelected())    // 6鸟选中
                {
                    util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_liuniaowanfa, para.liuniaowanfa);
                }
            }

            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) //邵阳托管
            {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_tuoguan, para.trustTime);

                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_BUZHONG_SUAN_QUANZHONG,para.buzhongsuanquanzhong);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_QUANZHONG_SUAN_FANBEI,para.quanzhongfanbei);
            
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_ZIMO_SCORE, para.ziMoScore); 
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_DIANPAO_SCORE, para.dianPaoScore); 
                
            }
            if(this._playNode_keChi){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_kechi, para.canChi);
            }
            if(this._playNode_buLunKong){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_bulunkong, para.buLunKong);
            }
             if(this._playNode_queyimen){
                var _isQueYiMen = this._playNode_queyimen.isSelected();
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_queYiMen, _isQueYiMen);
            }

            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_PIAO_TYPE, para.piaoType);

            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_FAN_BEI_SCORE, para.fanBeiScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_laizi, para.hongzhong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_niaoTpye, para.zhuaniao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_zhuangxianfen, para.zhuangxianfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_dianpaohu, para.dianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_is7dui, para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_ziyou,para.convertible);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_wuhongzhong,para.wuhongzhong);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_258ZuoJiang, para.zuoJiang258);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_HuangZhuangGang, para.huangZhuangGang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_piaoNiao, para.piaoniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaPanel, para.niaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_ZhuaNiaoDouble, this.niaoFromJiaBeiList_radio.getSelectIndex());
            if(this._playNode_biHuType){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_biHu, para.bihuType);
            }
            if(this._playNode_anZhuang){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_anzhuang, para.anzhuang);
            }
            if(this._playNode_genzhangbudianpao)
            {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_genzhangbudianpao, para.genzhangbudianpao);
            }

            if(this._playNode_jiaPiao){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYZZ_jiaPiao, para.jiapiao);
            }
            
            if (this.zuoZhuang_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_zuoZhuang, para.zuoZhuang);
            }

            var _qianggangIdx = 0;
            if (this._playNode_qianggang0.isSelected()) {
                _qianggangIdx = 0;
            } else if (this._playNode_qianggang1.isSelected()) {
                _qianggangIdx = 1;
            } else if (this._playNode_qianggang2.isSelected()) {
                _qianggangIdx = 2;
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_qianggang, _qianggangIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYZZ_trustWay, para.trustWay);
        }
    },

     _radioBoxSelectCB : function(index,sender, list){ 

        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        var maxPlayerIndex = this._playNode_player_type_radio2.getSelectIndex();
        if(this._playNode_queyimen){
            this._playNode_queyimen.setVisible(maxPlayerIndex ==2 || maxPlayerIndex == 3); 
        }
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_tyzz();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_tyzz();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_tyzz();
    },

    setDiaNumData_tyzz : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
         
    }

});