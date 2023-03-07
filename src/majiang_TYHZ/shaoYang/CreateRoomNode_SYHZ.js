/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_TYHZ = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_TYHZ_niaoTpye                  = "_TYHZ_NIAO_WAY";       //鸟的方式
        this.localStorageKey.KEY_TYHZ_zhuangxianfen             = "_TYHZ_ZHUANG_XIAN_FEN";       //庄闲分
        this.localStorageKey.KEY_TYHZ_dianpaohu                 = "_TYHZ_DIAN_PAO_HU";       //点炮胡
        this.localStorageKey.KEY_TYHZ_qiangganghu               = "_TYHZ_QIANG_GANG_HU";       //抢杠胡
        this.localStorageKey.KEY_TYHZ_qianggangquanbao          = "_TYHZ_QIANG_GANG_QUAN_BAO";       //抢杠全包
        this.localStorageKey.KEY_TYHZ_8hongzhong                = "_TYHZ_8_HONG_ZHONG";       //8红中
        this.localStorageKey.KEY_TYHZ_is7dui                    = "_TYHZ_IS_7_DUI";       //七对可胡
        this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao      = "_TYHZ_HONG_ZHONG_BU_JIE_PAO";       //有红中不接炮
        this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei         = "_TYHZ_WU_HONG_ZHONG_JIA_BEI";       //无红中加倍
        this.localStorageKey.KEY_TYHZ_Count                     = "_TYHZ_COUNT_WAY";
        this.localStorageKey.KEY_TYHZ_niaofen 					= "_TYHZ_NIAO_FEN"; 			// 中鸟得分
        this.localStorageKey.KEY_TYHZ_bihu 					    = "_TYHZ_BI_HU"; 			// 有胡必胡
        this.localStorageKey.KEY_TYHZ_jiapiao                   = "_TYHZ_JIA_PIAO";            // 飘风
        this.localStorageKey.KEY_TYHZ_ziyou                     = "_TYHZ_ZIYOU";            //自由人数
        this.localStorageKey.KEY_TYHZ_wuhongzhong               = "_TYHZ_WU_HONG_ZHONG";     //有红中可抢杠胡
        this.localStorageKey.KEY_TYHZ_tuoguan                   = "_TYHZ_TUO_GUAN";          //托管
        this.localStorageKey.KEY_TYHZ_zuoZhuang                 = "_TYHZ_ZUO_ZHUANG";     //0 随机， 1 先进来
        this.localStorageKey.KEY_TYHZ_piaoType                  = "_TYHZ_PIAO_TYPE";     //飘分类型
        this.localStorageKey.KEY_TYHZ_buzhongsuanquanzhong      = "_TYHZ_BUZHONG_SUANQUANZHONG_TYPE";//不中算全中
        this.localStorageKey.KEY_TYHZ_quanzhongfanbei           = "_TYHZ_QUANZHONG_FANBEI_TYPE"; // 全中翻倍
        this.localStorageKey.KEY_TYHZ_wuhongzhongjia2niao       = "_TYHZ_WUHONGZHONG_JIA2NIAO_TYPE"; // 无红中加2鸟
        this.localStorageKey.KEY_TYHZ_diFen_score               = "_TYHZ_DI_FEN_SCORE"; // 底分翻倍
        this.localStorageKey.KEY_TYHZ_duoHu                     = "_TYHZ_DUO_HU"; // 一炮多向
        this.localStorageKey.KEY_TYHZ_hongzhongkehu             = "_TYHZ_HONG_ZHONG_KE_HU"; // 起手四红中
        this.localStorageKey.KEY_TYHZ_huTypeJia1Fen             = "_TYHZ_HU_TYPE_JIA1FEN"; // 胡指定牌型加1分
        this.localStorageKey.KEY_TYHZ_jieSuanDiFen              = "_TYHZ_JIE_SUAN_DI_FEN"; // 积分底分
        this.localStorageKey.KEY_TYHZ_suiShiKeGang              = "_TYHZ_SUI_SHI_KE_GANG"; // 随时可杠
        this.localStorageKey.KEY_TYHZ_dianPaoScore              = "_TYHZ_DIAN_PAO_SCORE"; // 点炮加分内容
        this.localStorageKey.KEY_TYHZ_ziMoScore                 = "_TYHZ_ZI_MO_SCORE"; // 点炮加分内容

        this.localStorageKey.KEY_TYHZ_zhua1zhong10              = "_TYHZ_zhua_1_zhong_10";  //抓1中十鸟
        this.localStorageKey.KEY_TYHZ_huangZhuangGang               = "_TYHZ_HUANG_ZHUANG_GANG";          //荒庄杠
        this.localStorageKey.KEY_TYHZ_buKePeng                   = "_TYHZ_BU_KE_PENG";          //不可碰
        this.localStorageKey.KEY_TYHZ_huQingYiSeQiDuiJia2Niao                    = "_TYHZ_HU_QING_YI_SE_QI_DUI_JIA_2_NIAO";  //胡清一色或七对加2鸟
        this.localStorageKey.KEY_TYHZ_zhongHongZhongSuan12               = "_TYHZ_ZHONG_HONG_ZHONG_SUAN_12";  //中红中算12

        this.localStorageKey.KEY_TYHZ_queYiMen                 = "_TYHZ_QUE_YI_MEN"; // 缺一门
        this.localStorageKey.KEY_TYHZ_sihongzhongkehu             = "_TYHZ_SI_HONG_ZHONG_KE_HU"; // 四红中可胡
        this.localStorageKey.KEY_TYHZ_trustWhole             = "_TYHZ_TRUST_WHOLE"; // 全局托管
        this.localStorageKey.KEY_TYHZ_trustWay               = "_TYHZ_TRUST_WAY"; // 托管方式

    },
    initAll:function(IsFriendCard)
    {   
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (!IsFriendCard)
            this.setKey();

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundTYHZ4,  pay8:majiang.roundTYHZ8,  pay16:majiang.roundTYHZ16};
        // this.AAPay      = {pay4:majiang.roundTYHZAA4,pay8:majiang.roundTYHZAA8,pay16:majiang.roundTYHZAA16};
        // this.clubPay    = {pay4:majiang.roundTYHZCL4,pay8:majiang.roundTYHZCL8,pay16:majiang.roundTYHZCL16};

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
            this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_TYHZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_TYHZ");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP)
        {
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode: function (listener)
    {
        var _bgTYHZNode = this.bg_node;

        //抓鸟类型
        var _play = _bgTYHZNode.getChildByName("play");
        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao1");
        this._playNode_niaoType_5 = _play.getChildByName("zhuaniao5");

        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("zhuaniao0"));
        nodeList1.push(_play.getChildByName("zhuaniao1"));
        nodeList1.push(_play.getChildByName("zhuaniao5"));

        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_player_type_radio);
        this.niaoList = nodeList1;

        //莫的类型
        var _play = _bgTYHZNode.getChildByName("play");
        this._playNode_niaoType_2 = _play.getChildByName("zhongNiao159").getChildByName("zhuaniao2");
        this._playNode_niaoType_3 = _play.getChildByName("zhongNiao159").getChildByName("zhuaniao3");
        this._playNode_niaoType_4 = _play.getChildByName("zhongNiao159").getChildByName("zhuaniao4");
        this._playNode_niaoType_6 = _play.getChildByName("zhongNiao159").getChildByName("zhuaniao6");
        var nodeList234 = [];
        nodeList234.push( _play.getChildByName("zhongNiao159").getChildByName("zhuaniao2") );
        nodeList234.push( _play.getChildByName("zhongNiao159").getChildByName("zhuaniao3") );
        nodeList234.push( _play.getChildByName("zhongNiao159").getChildByName("zhuaniao4") );
        if(this._playNode_niaoType_6){
            nodeList234.push( _play.getChildByName("zhongNiao159").getChildByName("zhuaniao6") );
        }
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList234, this.radioBoxSelectCB);
        this.addListenerText(nodeList234, this._playNode_player_type_radio);

        this.zhuaNiao159 = _play.getChildByName("zhongNiao159");         //抓鸟159层
        this.quanZhong1Niao = _play.getChildByName("quanZhong1Niao");     //一鸟全中层
        this.quanZhong1Niao.setSwallowTouches(false);

        this._playNode_niaoFen_1 = _play.getChildByName("zhongNiao159").getChildByName("play_niaofen1");
        this._playNode_niaoFen_2 = _play.getChildByName("zhongNiao159").getChildByName("play_niaofen2");
        var niaoFenList = [];
        niaoFenList.push(this._playNode_niaoFen_1);
        niaoFenList.push(this._playNode_niaoFen_2);
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;

        this._playNode_niaoFen_1NiaoQuanZhong_1 = _play.getChildByName("quanZhong1Niao").getChildByName("play_niaofen1");
        this._playNode_niaoFen_1NiaoQuanZhong_2 = _play.getChildByName("quanZhong1Niao").getChildByName("play_niaofen2");
        var niaoFenQuanZhongList = [];
        niaoFenQuanZhongList.push(this._playNode_niaoFen_1NiaoQuanZhong_1);
        niaoFenQuanZhongList.push(this._playNode_niaoFen_1NiaoQuanZhong_2);
        this._playNode_niaoFenQuanZhong_radio = createRadioBoxForCheckBoxs(niaoFenQuanZhongList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenQuanZhongList, this._playNode_niaoFenQuanZhong_radio);
        this.niaoFenQuanZhongList = niaoFenQuanZhongList;

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            // 不中算全中
            this._playNode_zhongNiao = _play.getChildByName("zhongNiao159").getChildByName("buZhongNiao");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_zhongNiao.getChildByName("text"));
            this._playNode_zhongNiao.addEventListener(this._clickCB, this._playNode_zhongNiao);
            // 全中翻倍
            this._playNode_quanZhongFanBei = _play.getChildByName("zhongNiao159").getChildByName("quanZhongFanBei");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_quanZhongFanBei.getChildByName("text"));
            this._playNode_quanZhongFanBei.addEventListener(this._clickCB, this._playNode_quanZhongFanBei);
            // 无红中加2鸟
            this._playNode_wuHongZhongNiao = _play.getChildByName("zhongNiao159").getChildByName("wuHongZhongNiao");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_wuHongZhongNiao.getChildByName("text"));
            this._playNode_wuHongZhongNiao.addEventListener(this._clickCB, this._playNode_wuHongZhongNiao);

            this.huQingYiSeQiDuiJia2Niao = _play.getChildByName("zhongNiao159").getChildByName("huQingYiSeQiDuiJia2Niao");
            cc.eventManager.addListener(this.setTextClick(),this.huQingYiSeQiDuiJia2Niao.getChildByName("text"));
            this.huQingYiSeQiDuiJia2Niao.addEventListener(this._clickCB, this.huQingYiSeQiDuiJia2Niao);
        }

        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_zhuangxianfen.getChildByName("text"));
        this._playNode_zhuangxianfen.addEventListener(this._clickCB, this._playNode_zhuangxianfen);

        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_dianpao.getChildByName("text"));
        this._playNode_dianpao.addEventListener(this._clickCB, this._playNode_dianpao);
        var list = [];
        list.push(_play.getChildByName("play_qiangganghuWu"));
        list.push(_play.getChildByName("play_qiangganghu"));
        list.push(_play.getChildByName("play_qianggangdianpao"));
        var qiangGangCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            this._playNode_qianggangquanbao.setVisible(false);
            this._playNode_wuHongZhong.setVisible(false);
            if(index == 1){
                this._playNode_qianggangquanbao.setVisible(true);
            }
            if(index != 0){
                this._playNode_wuHongZhong.setVisible(true);
            }
        }.bind(this);
        this._playNode_qiangganghu = createRadioBoxForCheckBoxs(list,qiangGangCallBack);
        var textCallBack = function(index){
            qiangGangCallBack(index, list[index], list);
        };
        this.addListenerText(list, this._playNode_qiangganghu,textCallBack.bind(this));

        //有红中可抢杠胡
        this._playNode_wuHongZhong = _play.getChildByName("play_wuhongzhong");
        this._playNode_wuHongZhong.getChildByName("text").setString("有红中可抢杠胡");
        this.addListenerText(this._playNode_wuHongZhong);    
        this._playNode_wuHongZhong.addEventListener(this._clickCB, this._playNode_wuHongZhong);   

        this._playNode_qianggangquanbao = _play.getChildByName("play_qianggangquanbao");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_qianggangquanbao.getChildByName("text"));
        this._playNode_qianggangquanbao.addEventListener(this._clickCB, this._playNode_qianggangquanbao);
        
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var nodeList = [];
            nodeList.push(_play.getChildByName("play_hongzhong4"));
            nodeList.push(_play.getChildByName("play_hongzhong8"));
            nodeList.push(_play.getChildByName("play_hongzhong1"));
            nodeList.push(_play.getChildByName("play_hongzhong2"));
            this._playNode_hongzhong8 = createRadioBoxForCheckBoxs(nodeList, this.radioBoxSelectCB);
            this.addListenerText(nodeList, this._playNode_hongzhong8);
            // 飘分选项只有邵阳有
            var piaoList = [];
            piaoList.push(_play.getChildByName("box_piao1"));
            piaoList.push(_play.getChildByName("box_piao2"));
            piaoList.push(_play.getChildByName("box_piao3"));
            piaoList.push(_play.getChildByName("box_piao4"));
            piaoList.push(_play.getChildByName("box_piao5"));
            piaoList.push(_play.getChildByName("box_piao6"));
            this._playNode_piaoList = createRadioBoxForCheckBoxs(piaoList, this.radioBoxSelectCB);
            this.addListenerText(piaoList, this._playNode_piaoList);

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


            var diFenList = [];
            diFenList.push(_play.getChildByName("fanBei0"));
            diFenList.push(_play.getChildByName("fanBei1"));
            this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
            this.addListenerText(diFenList, this.diFenList_radio);
            this._initDiFenUI(diFenList[1]);

            // 一炮多响
            this._playNode_duoHu = _play.getChildByName("play_duohu");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_duoHu.getChildByName("text"));
            this._playNode_duoHu.addEventListener(this._clickCB, this._playNode_duoHu);
            // 起手四红中
            this._playNode_qiShouHongZhong = _play.getChildByName("play_qiShouHongZhong");
            var qiShouHongZhongTextCallBack = function(index, sender){
                if(sender.isSelected()){
                    this._playNode_siHongZhongKeHu.setSelected(false);
                    this._clickCB(this._playNode_siHongZhongKeHu, ccui.CheckBox.EVENT_UNSELECTED);
                }                
            }.bind(this);
            cc.eventManager.addListener(this.setTextClick(null, null, null, qiShouHongZhongTextCallBack),this._playNode_qiShouHongZhong.getChildByName("text"));
            var qiShouHongZhongCallBack = function(sender, type){
                this._clickCB(sender, type);
                if(sender.isSelected()){
                    this._playNode_siHongZhongKeHu.setSelected(false);
                    this._clickCB(this._playNode_siHongZhongKeHu, ccui.CheckBox.EVENT_UNSELECTED);
                }
            }.bind(this);            
            this._playNode_qiShouHongZhong.addEventListener(qiShouHongZhongCallBack, this._playNode_qiShouHongZhong);
            // 四红中可胡
            this._playNode_siHongZhongKeHu = _play.getChildByName("play_siHongZhongKeHu");
            var siHongZhongTextCallBack = function(index, sender){
                if(sender.isSelected()){
                    this._playNode_qiShouHongZhong.setSelected(false);
                    this._clickCB(this._playNode_qiShouHongZhong, ccui.CheckBox.EVENT_UNSELECTED);
                }                
            }.bind(this);
            cc.eventManager.addListener(this.setTextClick(null, null, null, siHongZhongTextCallBack),this._playNode_siHongZhongKeHu.getChildByName("text"));
            var siHongZhongCallBack = function(sender, type){
                this._clickCB(sender, type);
                if(sender.isSelected()){
                    this._playNode_qiShouHongZhong.setSelected(false);
                    this._clickCB(this._playNode_qiShouHongZhong, ccui.CheckBox.EVENT_UNSELECTED);
                }
            }.bind(this);
            this._playNode_siHongZhongKeHu.addEventListener(siHongZhongCallBack, this._playNode_siHongZhongKeHu);
            // 一炮多响
            this._playNode_huTypeJia1fen = _play.getChildByName("play_huTypeJia1fen");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_huTypeJia1fen.getChildByName("text"));
            this._playNode_huTypeJia1fen.addEventListener(this._clickCB, this._playNode_huTypeJia1fen);

        }else{
            this._playNode_hongzhong8 = _play.getChildByName("play_hongzhong8");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_hongzhong8.getChildByName("text"));
            this._playNode_hongzhong8.addEventListener(this._clickCB, this._playNode_hongzhong8);
        }

        this._playNode_qidui = _play.getChildByName("play_qidui");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_qidui.getChildByName("text"));
        this._playNode_qidui.addEventListener(this._clickCB, this._playNode_qidui);

        this._playNode_youhongzhongbujiepao = _play.getChildByName("play_youhongzhongbujiepao");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_youhongzhongbujiepao.getChildByName("text"));
        this._playNode_youhongzhongbujiepao.addEventListener(this._clickCB, this._playNode_youhongzhongbujiepao);

        this._playNode_zhua1zhong10 = _play.getChildByName("quanZhong1Niao").getChildByName("zhua1Zhong10");
        this.addListenerText(this._playNode_zhua1zhong10);
        this._playNode_zhua1zhong10.addEventListener(this.clickCB, this._playNode_zhua1zhong10);

        this.zhongHongZhongSuan12 = _play.getChildByName("quanZhong1Niao").getChildByName("zhongHongZhongSuan12");
        this.addListenerText(this.zhongHongZhongSuan12);
        this.zhongHongZhongSuan12.addEventListener(this.clickCB, this.zhongHongZhongSuan12);


        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            this._playNode_suiShiKeGang = _play.getChildByName("play_suiShiKeGang");
            cc.eventManager.addListener(this.setTextClick(),this._playNode_suiShiKeGang.getChildByName("text"));
            this._playNode_suiShiKeGang.addEventListener(this._clickCB, this._playNode_suiShiKeGang);
        }
        
        this._playNode_wuhongzhongjiabei = _play.getChildByName("play_wuhongzhongjiabei");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_wuhongzhongjiabei.getChildByName("text"));
        this._playNode_wuhongzhongjiabei.addEventListener(this._clickCB, this._playNode_wuhongzhongjiabei);

        this._playNode_biHuType = _play.getChildByName("play_bihu");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_biHuType.getChildByName("text"));
        this._playNode_biHuType.addEventListener(this._clickCB, this._playNode_biHuType);

        this._playNode_jiapiao = _play.getChildByName("play_jiapiao");
        if (this._playNode_jiapiao) {
            cc.eventManager.addListener(this.setTextClick(),this._playNode_jiapiao.getChildByName("text"));
            this._playNode_jiapiao.addEventListener(this._clickCB, this._playNode_jiapiao);
        }

        this.play_huangZhuangGang = _play.getChildByName("play_huangZhuangGang");
        this.addListenerText(this.play_huangZhuangGang);
        this.play_huangZhuangGang.addEventListener(this.clickCB, this.play_huangZhuangGang);

        this.play_buKePeng = _play.getChildByName("play_buKePeng");
        this.addListenerText(this.play_buKePeng);
        this.play_buKePeng.addEventListener(this.clickCB, this.play_buKePeng);

        this._playNode_Count_0 = _play.getChildByName("playerCount_0");
        this._playNode_Count_1 = _play.getChildByName("playerCount_1");
        this._playNode_Count_2 = _play.getChildByName("playerCount_2");
        this._playNode_Count_3 = _play.getChildByName("playerCount_3");

        var nodeListCount = [];
        nodeListCount.push( _play.getChildByName("playerCount_0"));
        nodeListCount.push( _play.getChildByName("playerCount_1"));
        nodeListCount.push( _play.getChildByName("playerCount_2"));
        if(this._playNode_Count_3){
            nodeListCount.push( _play.getChildByName("playerCount_3"));
        }
        this._playNode_playerCount_radio = createRadioBoxForCheckBoxs(nodeListCount, this._radioBoxSelectCB.bind(this));
        this.addListenerText(nodeListCount, this._playNode_playerCount_radio,this.changeAAPayForPlayerNum.bind(this));

        //坐庄
        this._zuozhuang_1 = _play.getChildByName("zuoZhuang_1");
        this._zuozhuang_2 = _play.getChildByName("zuoZhuang_2");
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var zuoZhuangList = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
            this.addListenerText(zuoZhuangList, this.zuoZhuang_radio);
        }

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||  MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var score = _bgTYHZNode.getParent().getChildByName("score");
            var addBtn = _bgTYHZNode.getParent().getChildByName("btn_add");
            var subBtn = _bgTYHZNode.getParent().getChildByName("btn_sub");
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

         if(_play.getChildByName("play_queYiMen")){
            this._playNode_queyimen = _play.getChildByName("play_queYiMen");
            this.addListenerText(this._playNode_queyimen);
            this._playNode_queyimen.addEventListener(this.clickCB, this._playNode_queyimen); 
        }
        this.text_fanbei = _play.getChildByName("qianggang_0_0");
        this.schedule(function() {
            this.zhuaNiao159.visible = this._playNode_niaoType_5.isSelected();
            this.quanZhong1Niao.visible = this._playNode_niaoType_1.isSelected();

            this._playNode_zhongNiao.setVisible(!this._playNode_niaoType_6.isSelected());
            this._playNode_quanZhongFanBei.setVisible(!this._playNode_niaoType_6.isSelected());
            this._playNode_wuHongZhongNiao.setVisible(!this._playNode_niaoType_6.isSelected());
            this.huQingYiSeQiDuiJia2Niao.setVisible(!this._playNode_niaoType_6.isSelected());

            //隐藏的选项位置不留空，选项上移
            var offset = 0;
            if(this.quanZhong1Niao.isVisible())
            {
                offset = 110;
            }
            else if(!this.zhuaNiao159.isVisible() && !this.quanZhong1Niao.isVisible())
            {
                offset = 220;
            }

            for(var i = 0;i < diFenList.length;i++)
            {
                diFenList[i].y = -1155 + offset;
            }
            this.text_fanbei.y = -1155 + offset;

        }.bind(this));

        //托管
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
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
            var tuoGuanCallBack = function(index, sender, list){
                this.radioBoxSelectCB(index, sender, list);
                if(index == 0){
                    this.hideNode(this.trustWayAllList, false);
                }else{
                    this.hideNode(this.trustWayAllList, true);
                }
            }.bind(this);
            this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, tuoGuanCallBack);
            var tuoGuanTextCallBack = function(index, sender){
                if(index == 0){
                    this.hideNode(this.trustWayAllList, false);
                }else{
                    this.hideNode(this.trustWayAllList, true);
                }                
            }.bind(this);
            this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio, tuoGuanTextCallBack);
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

            // 托管方式
            this.trustWayList = [];
            this.trustWayList.push(_play.getChildByName("trustWay_1"));
            this.trustWayList.push(_play.getChildByName("trustWay_2"));
            this.trustWayList.push(_play.getChildByName("trustWay_3"));
            this.trustWayAllList = this.trustWayList.concat([_play.getChildByName("tuoGuanFangShi")])
            this._playNode_trustWay = createRadioBoxForCheckBoxs(this.trustWayList, this.radioBoxSelectCB);
            this.addListenerText(this.trustWayList, this._playNode_trustWay);        
        }
        
    },

    hideNode: function(nodeArr, isShow) {
        for (var node of nodeArr) {
            node.visible = isShow;
        }
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color(237,101,1);
                    var unSelectColor = cc.color(158,118,78);
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                        selectColor = cc.color(208,88,60);
                        unSelectColor = cc.color(72,94,112);
                    }
                    if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                        selectColor = cc.color(211,38,14);
                        unSelectColor = cc.color(68,51,51);
                    }
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                    {
                        selectColor = cc.color(76,126,0);
                        unSelectColor = cc.color(149,69,0);
                    }
                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");

        var _niaoType;
        if (isClub)
            _niaoType = this.getNumberItem("zhuaniao", 1);
        else
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_niaoTpye, 1);
        this._playNode_niaoType_0.setSelected(false);
        this.selectedCB(this._playNode_niaoType_0.getChildByName("text"), false);
        this._playNode_niaoType_1.setSelected(false);
        this.selectedCB(this._playNode_niaoType_1.getChildByName("text"), false);
        this._playNode_niaoType_2.setSelected(true);
        this.selectedCB(this._playNode_niaoType_2.getChildByName("text"), true);
        this._playNode_niaoType_3.setSelected(false);
        this.selectedCB(this._playNode_niaoType_3.getChildByName("text"), false);
        this._playNode_niaoType_4.setSelected(false);
        this.selectedCB(this._playNode_niaoType_4.getChildByName("text"), false);
        this._playNode_niaoType_5.setSelected(false);
        this.selectedCB(this._playNode_niaoType_5.getChildByName("text"), false);
        if(this._playNode_niaoType_6){
            this._playNode_niaoType_6.setSelected(false);
            this.selectedCB(this._playNode_niaoType_6.getChildByName("text"), false);
        }

        var index = 0;
        var btn_zhuaniao;
        var is159niao = false;
        if (_niaoType == 0) {
            btn_zhuaniao=this._playNode_niaoType_0;

        } else if (_niaoType == 1) {
            btn_zhuaniao=this._playNode_niaoType_1;

        } else if (_niaoType == 2) {
            btn_zhuaniao=this._playNode_niaoType_2;
            is159niao = true;
        } else if (_niaoType == 4) {
            btn_zhuaniao=this._playNode_niaoType_3;
            is159niao = true;
        } else if (_niaoType == 6) {
            btn_zhuaniao=this._playNode_niaoType_4;
            is159niao = true;
        } else if(_niaoType == 8){
            btn_zhuaniao = this._playNode_niaoType_1;
        } else if(_niaoType == 9 && this._playNode_niaoType_6){
            btn_zhuaniao = this._playNode_niaoType_6;
            is159niao = true;
        }
        this._playNode_niaoType_5.setSelected(is159niao);
        if (is159niao) {
            var text = this._playNode_niaoType_5.getChildByName("text");
            this.selectedCB(text, this._playNode_niaoType_5);
            this._playNode_niaoType_2.setSelected(false);
        }
        btn_zhuaniao.setSelected(true);
        var text = btn_zhuaniao.getChildByName("text");
        this.selectedCB(text, btn_zhuaniao);

        var niaofen;
        if (isClub)
            niaofen = this.getNumberItem("niaofen", 1);
        else
            niaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_niaofen, 1);
        var niaofenIndex = niaofen - 1;
        this._playNode_niaoFen_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenList[niaofenIndex], this.niaoFenList);

        this._playNode_niaoFenQuanZhong_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenQuanZhongList[niaofenIndex], this.niaoFenQuanZhongList);


        var listCount = [];
        listCount.push(this._playNode_Count_0);
        listCount.push(this._playNode_Count_1);
        listCount.push(this._playNode_Count_2);
        if(this._playNode_Count_3){
            listCount.push(this._playNode_Count_3);
        }
        var indexCount = 0;
        var _Count;
        if(isClub){
            var count = this.getNumberItem("maxPlayer", 4);
            _Count = count == 4 ? 0 : count == 3 ? 1 : 2;
            if (this.getBoolItem("convertible", false)){
                _Count = 3;
            }
        }else{
            var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_ziyou,false);
            if(ziyou){
                _Count = 3;
            }else{
                _Count = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_Count,0);
            }
        }

        this._playNode_Count_0.setSelected(false);
        this._playNode_Count_1.setSelected(false);
        this._playNode_Count_2.setSelected(false);
        if(this._playNode_Count_3){
            this._playNode_Count_3.setSelected(false);
        }
        cc.log("==============_Count HZMJ= " + _Count);
        if(_Count == 3 && this._playNode_Count_3){
            this._playNode_Count_3.setSelected(true);
            indexCount = 3;    
            this.payWayNodeArray[0].setSelected(true);      
        }
        else if(_Count == 0)
        {
            this._playNode_Count_0.setSelected(true);
            indexCount = 0;
        }
        else if(_Count == 1)
        {
            this._playNode_Count_1.setSelected(true);
            indexCount = 1;
        }
        else if(_Count == 2)
        {
            this._playNode_Count_2.setSelected(true);
            indexCount = 2;
        }
        this.radioBoxSelectCB(indexCount,listCount[indexCount],listCount);

        if(this._playNode_queyimen){
            if(isClub){
               this._queyimen = this.getBoolItem("queYiMen", false);
            }else{
                this._queyimen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_queYiMen, false);
            }
            this._playNode_queyimen.setSelected(this._queyimen);
            var text = this._playNode_queyimen.getChildByName("text");
            this.selectedCB(text,this._queyimen);
            this._playNode_queyimen.visible = (_Count == 2 || _Count == 3);
        }

        var _zhuangxianfen;
        if(isClub){
            _zhuangxianfen = this.getBoolItem("zhuangxianfen", false);
        }else{
            _zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_zhuangxianfen,true);
        }
        this._playNode_zhuangxianfen.setSelected(_zhuangxianfen);
        this._setItemTextColor(this._playNode_zhuangxianfen, _zhuangxianfen);

        var _zhua1Zhong10;
        if (isClub)
            _zhua1Zhong10 = this.getBoolItem("zhua1Zhong10", false);
        else
            _zhua1Zhong10 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_zhua1zhong10, false);
        if(_niaoType == 8)
        {
            _zhua1Zhong10 = true;
        }
        this._playNode_zhua1zhong10.setSelected(_zhua1Zhong10);
        var text = this._playNode_zhua1zhong10.getChildByName("text");
        this.selectedCB(text, _zhua1Zhong10);

        var zhongHongZhongSuan12;
        if (isClub)
            zhongHongZhongSuan12 = this.getBoolItem("zhongHongZhongSuan12", false);
        else
            zhongHongZhongSuan12 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_zhongHongZhongSuan12, false);
        this.zhongHongZhongSuan12.setSelected(zhongHongZhongSuan12);
        var text = this.zhongHongZhongSuan12.getChildByName("text");
        this.selectedCB(text, zhongHongZhongSuan12);

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            // 不中算全中
            var _buzhongsuanquanzhong;
            if(isClub){
                _buzhongsuanquanzhong = this.getBoolItem("buzhongsuanquanzhong", false);
            }else{
                _buzhongsuanquanzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_buzhongsuanquanzhong,false);
            }
            this._playNode_zhongNiao.setSelected(_buzhongsuanquanzhong);
            this._setItemTextColor(this._playNode_zhongNiao, _buzhongsuanquanzhong);

            // 全中翻倍
            var _quanzhongfanbei;
            if(isClub){
                _quanzhongfanbei = this.getBoolItem("quanzhongfanbei", false);
            }else{
                _quanzhongfanbei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_quanzhongfanbei,false);
            }
            this._playNode_quanZhongFanBei.setSelected(_quanzhongfanbei);
            this._setItemTextColor(this._playNode_quanZhongFanBei, _quanzhongfanbei);

            // 不中红中
            var _wuhongzhongjia2niao;
            if(isClub){
                _wuhongzhongjia2niao = this.getBoolItem("wuhongzhongjia2niao", false);
            }else{
                _wuhongzhongjia2niao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjia2niao,false);
            }
            this._playNode_wuHongZhongNiao.setSelected(_wuhongzhongjia2niao);
            this._setItemTextColor(this._playNode_wuHongZhongNiao, _wuhongzhongjia2niao);

            var _diFen = 0;
            if (isClub){
                if(this.getNumberItem("diFen", -1) > -1){
                    _diFen = 1;
                    _play.getChildByName("fanBei1").getChildByName("score").setString(this.getNumberItem("diFen", -1) + "分");
                }
            }else{
                var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_diFen_score, -1);
                if(index > -1){
                    _diFen = 1;
                    _play.getChildByName("fanBei1").getChildByName("score").setString(index + "分");
                }
            }
            this.diFenList_radio.selectItem(_diFen);
            fanBeiList = [];
            fanBeiList.push(_play.getChildByName("fanBei0"));
            fanBeiList.push(_play.getChildByName("fanBei1"));
            this.radioBoxSelectCB(_diFen,fanBeiList[_diFen],fanBeiList);

        } 

        var _dianpao;
        if(isClub){
            _dianpao = this.getBoolItem("dianpao", true);
        }else{
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_dianpaohu,true);
        }
        this._playNode_dianpao.setSelected(_dianpao);
        this._setItemTextColor(this._playNode_dianpao, _dianpao);

        var _qiangganghu;
        if (isClub) {
            qianggang = this.getNumberItem("qianggang", 1);
        }else{
            qianggang = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_TYHZ_qiangganghu, "1");
            if (qianggang == "true")
                qianggang = 1;
            else if (qianggang == "false")
                qianggang = 0;
            else if (cc.isNumber(Number(qianggang)))
                qianggang = Number(qianggang);
            else
                qianggang = 1;
        }
        this._playNode_qiangganghu.selectItem(qianggang);
        
        list = [];
        list.push(_play.getChildByName("play_qiangganghuWu"));
        list.push(_play.getChildByName("play_qiangganghu"));
        list.push(_play.getChildByName("play_qianggangdianpao"));
        this.radioBoxSelectCB(this._playNode_qiangganghu,list[qianggang],list);  

        //有红中可抢杠胡
        var _wuhongzhong;
        if(isClub){
            _wuhongzhong = this.getBoolItem("wuhongzhong",true);
        }else{
            _wuhongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhong, true);
        }
        this._playNode_wuHongZhong.setSelected(_wuhongzhong);
        var text = this._playNode_wuHongZhong.getChildByName("text");
        this._setItemTextColor(this._playNode_wuHongZhong, _wuhongzhong);
        this._playNode_wuHongZhong.setVisible(qianggang != 0);

        var _qianggangquanbao;
        if(isClub){
            _qianggangquanbao = this.getBoolItem("qianggangquanbao", true);
        }else{
            _qianggangquanbao= util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_qianggangquanbao,true);
        }
        this._playNode_qianggangquanbao.setSelected(_qianggangquanbao);
        this._setItemTextColor(this._playNode_qianggangquanbao, _qianggangquanbao);
        this._playNode_qianggangquanbao.setVisible(qianggang == 1);



        // 飘分
        var jiapiao = false;
        if (this._playNode_jiapiao) {
            if(isClub){
                jiapiao = this.getBoolItem("jiapiao", false);
            }else{
                jiapiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_jiapiao,false);
            }
            this._playNode_jiapiao.setSelected(jiapiao);
            this._setItemTextColor(this._playNode_jiapiao, jiapiao);
        }


        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _hongzhong = cc.sys.localStorage.getItem(this.localStorageKey.KEY_TYHZ_8hongzhong);
            if(!_hongzhong || _hongzhong == 'true' || _hongzhong == 'false' || typeof(_hongzhong) == 'undefined'){
                _hongzhong = _hongzhong ? 8 : 4;
            }else{
                _hongzhong = Number(_hongzhong);
            }
            if(isClub){
                var oldValue = this.getItem("hongzhong8");
                if(!oldValue || oldValue == 'true' || oldValue == 'false' || typeof(oldValue) == "undefined"){
                    _hongzhong = oldValue ? 8 : 4;
                }else{
                    _hongzhong = Number(oldValue);
                }
            }
            index = [4,8,1,2].indexOf(_hongzhong);
            this._playNode_hongzhong8.selectItem(index);
            list = [];
            list.push(_play.getChildByName("play_hongzhong4"));
            list.push(_play.getChildByName("play_hongzhong8"));
            list.push(_play.getChildByName("play_hongzhong1"));
            list.push(_play.getChildByName("play_hongzhong2"));
            this.radioBoxSelectCB(_hongzhong,list[index],list);  


            var _piaoFenIndex;
            if(isClub){
                _piaoFenIndex = this.getNumberItem("piaoType", 3);
            }else{
                _piaoFenIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_piaoType,3);
            }
            // 久选项选择了加飘，新版本设置为自由下飘
            if(jiapiao){
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

            // 算分选项 自摸分数，记录的是index
            var _ziMoScore;
            if(isClub){
                _ziMoScore = this.getNumberItem("ziMoScore", 0);
            }else{
                _ziMoScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_ziMoScore ,0);
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
                _dianPaoScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_dianPaoScore,0);
            }
 
            this._playNode_dianpaoList.selectItem(_dianPaoScore);
            list = [];
            list.push(_play.getChildByName("box_dianpao_1"));
            list.push(_play.getChildByName("box_dianpao_2"));
            this.radioBoxSelectCB(_dianPaoScore,list[_dianPaoScore],list);     
            // 一炮多响
            var _duoHu;
            if(isClub){
                _duoHu = this.getBoolItem("duoHu", true);
            }else {
                _duoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_duoHu,true);
            }
            this._playNode_duoHu.setSelected(_duoHu);
            this._setItemTextColor(this._playNode_duoHu, _duoHu);

            // 起手四红中
            var _hongzhongkehu;
            if(isClub){
                _hongzhongkehu = this.getBoolItem("hongZhongKeHu", true);
            }else {
                _hongzhongkehu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_hongzhongkehu,true);
            }
            this._playNode_qiShouHongZhong.setSelected(_hongzhongkehu);
            this._setItemTextColor(this._playNode_qiShouHongZhong, _hongzhongkehu);

            // 四红中可胡
            var _sihongzhongkehu;
            if(isClub){
                _sihongzhongkehu = this.getBoolItem("siHongZhongKeHu", false);
            }else {
                _sihongzhongkehu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_sihongzhongkehu,false);
            }
            if(_hongzhongkehu){
                _sihongzhongkehu = false;
            }
            this._playNode_siHongZhongKeHu.setSelected(_sihongzhongkehu);
            this._setItemTextColor(this._playNode_siHongZhongKeHu, _sihongzhongkehu);

            // 指定牌型多加1分（胡7对、碰碰胡、天胡、清一色+1份）
            var _huTypeJia1Fen;
            if(isClub){
                _huTypeJia1Fen = this.getBoolItem("huTypeJia1Fen", false);
            }else {
                _huTypeJia1Fen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_huTypeJia1Fen,false);
            }
            this._playNode_huTypeJia1fen.setSelected(_huTypeJia1Fen);
            this._setItemTextColor(this._playNode_huTypeJia1fen, _huTypeJia1Fen);


            // 积分底分
            var _jieSuanDiFen;
            if(isClub){
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_jieSuanDiFen,1);
            }

            var score = this.bg_node.getParent().getChildByName("score");
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);

        }else{
            var _8hongzhong;
            if(isClub){
                _8hongzhong = this.getBoolItem("hongzhong8", true);
            }else{
                _8hongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_8hongzhong,true);
            }
            this._playNode_hongzhong8.setSelected(_8hongzhong);
            this._setItemTextColor(this._playNode_hongzhong8, _8hongzhong);
        }

        var _is7dui;
        if(isClub){
            _is7dui = this.getBoolItem("qidui", true);
        }else {
            _is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_is7dui,true);
        }
        this._playNode_qidui.setSelected(_is7dui);
        this._setItemTextColor(this._playNode_qidui, _is7dui);

        var huQingYiSeQiDuiJia2Niao;
        if (isClub)
            huQingYiSeQiDuiJia2Niao = this.getBoolItem("huQingYiSeQiDuiJia2Niao", false);
        else
            huQingYiSeQiDuiJia2Niao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_huQingYiSeQiDuiJia2Niao, false);
        this.huQingYiSeQiDuiJia2Niao.setSelected(huQingYiSeQiDuiJia2Niao);
        var text = this.huQingYiSeQiDuiJia2Niao.getChildByName("text");
        this.selectedCB(text, huQingYiSeQiDuiJia2Niao)

        var _hongzhongbujiepao;
        if(isClub){
            _hongzhongbujiepao = this.getBoolItem("youhongzhongbujiepao", true);
        }else{
            _hongzhongbujiepao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao,true);
        }
        this._playNode_youhongzhongbujiepao.setSelected(_hongzhongbujiepao);
        this._setItemTextColor(this._playNode_youhongzhongbujiepao, _hongzhongbujiepao);

        var huangZhuangGang;
        if (isClub)
            huangZhuangGang = this.getBoolItem("huangZhuangGang", false);
        else
            huangZhuangGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_huangZhuangGang, false);
        this.play_huangZhuangGang.setSelected(huangZhuangGang);
        var text = this.play_huangZhuangGang.getChildByName("text");
        this.selectedCB(text, huangZhuangGang);

        var buKePeng;
        if (isClub)
            buKePeng = this.getBoolItem("buKePeng", false);
        else
            buKePeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_buKePeng, false);
        this.play_buKePeng.setSelected(buKePeng);
        var text = this.play_buKePeng.getChildByName("text");
        this.selectedCB(text, buKePeng);

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _suiShiKeGang;
            if(isClub){
                _suiShiKeGang = this.getBoolItem("suiShiKeGang", false);
            }else{
                _suiShiKeGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_suiShiKeGang,false);
            }
            this._playNode_suiShiKeGang.setSelected(_suiShiKeGang);
            this._setItemTextColor(this._playNode_suiShiKeGang, _suiShiKeGang);
        }

        var _wuhongzhongjiabei;
        if(isClub){
            _wuhongzhongjiabei = this.getBoolItem("wuhongzhongjiabei", true);
        }else{
            _wuhongzhongjiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei,true);
        }
        this._playNode_wuhongzhongjiabei.setSelected(_wuhongzhongjiabei);
        this._setItemTextColor(this._playNode_wuhongzhongjiabei, _wuhongzhongjiabei);

        // 有胡必胡
        var _youhubihu;
        if(isClub){
            _youhubihu = this.getBoolItem("bihuType", true);
        }else{
            _youhubihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_bihu,false);
        }
        this._playNode_biHuType.setSelected(_youhubihu);
        this._setItemTextColor(this._playNode_biHuType, _youhubihu);

        var _zuoZhuang;
        if (isClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 0);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_zuoZhuang, 0);
        }
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            list = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio.selectItem(_zuoZhuang);
            this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);
        }

        if(this._playNode_Count_3 && !this._isRoomCardMode ){//亲友圈房卡模式 使用动态创建节点
            this.schedule(function(){
                this._playNode_Count_3.visible = this.payWayNodeArray[0].isSelected();
                this.payWayNodeArray[1].visible = !this._playNode_Count_3.isSelected() || !this._playNode_Count_3.visible;
            },0.1);
        }

         //托管
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _trustTime;
            if (isClub)
                _trustTime = this.getNumberItem("trustTime", 0);
            else
                _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_tuoguan, 0);
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

            var fangShi;
            if (isClub) {
                //兼容旧俱乐部
                fangShi = this.getNumberItem("trustWay", -1);
                if (fangShi == -1) {
                    var isTrustWhole = this.getBoolItem("isTrustWhole", false);
                    fangShi = isTrustWhole ? 2 : 0;
                }
            } else {
                fangShi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_trustWay, 0);
            }

            this._playNode_trustWay.selectItem(fangShi);
            this.radioBoxSelectCB(fangShi, this.trustWayList[fangShi], this.trustWayList);
            this.hideNode(this.trustWayAllList, index != 0);
        }
    },

    _initDiFenUI : function(fanBei1){
        var subButton = fanBei1.getChildByName("btn_sub");
        var addButton = fanBei1.getChildByName("btn_add");
        var scoreLabel = fanBei1.getChildByName("score");
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
    },

    _setItemTextColor : function(item,flg){
        if(item){
            var txt = item.getChildByName("text");
            var selectColor = cc.color(237,101,1);
            var unSelectColor = cc.color(158,118,78);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                selectColor = cc.color(208,88,60);
                unSelectColor = cc.color(72,94,112);
            }
            if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                selectColor = cc.color(211,38,14);
                unSelectColor = cc.color(68,51,51);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
            {
                selectColor = cc.color(76,126,0);
                unSelectColor = cc.color(149,69,0);
            }
            if(flg){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        } 
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.TY_HONGZHONG;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 1;//抓鸟
        para.zhuangxianfen = true;//闲庄分
        para.dianpao = true;//点炮胡
        para.qianggang = 0;//抢杠胡
        para.qianggangquanbao = true;//抢杠全包
        para.hongzhong8 = true;//8红中
        para.qidui = true;//七对可胡
        para.youhongzhongbujiepao = true;//有红中不接炮
        para.wuhongzhongjiabei = true;//无红中加倍
        para.bihuType = false;//有胡必胡
        para.wuhongzhong = this._playNode_wuHongZhong.isSelected(); //有红中可抢杠胡

        if (this._playNode_niaoType_0.isSelected())
        {
            para.zhuaniao = 0;
        }
        else if (this._playNode_niaoType_1.isSelected())
        {
            para.zhuaniao = 1;
        }
        else if (this._playNode_niaoType_2.isSelected())
        {
            para.zhuaniao = 2;
        }
        else if (this._playNode_niaoType_3.isSelected())
        {
            para.zhuaniao = 4;
        }
        else if (this._playNode_niaoType_4.isSelected())
        {
            para.zhuaniao = 6;
        }else if(this._playNode_niaoType_6 && this._playNode_niaoType_6.isSelected()){
            para.zhuaniao = 9;
        }


        // 中鸟得分
        var niaofenIndex = 0;
        if(this.zhuaNiao159.isVisible())
        {
            niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
        }
        else if(this.quanZhong1Niao.isVisible())
        {
            niaofenIndex = this._playNode_niaoFenQuanZhong_radio.getSelectIndex();
        }
        para.niaofen = niaofenIndex + 1;
        if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG &&
            MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ &&
            (para.zhuaniao == 1 || para.zhuaniao == 8)) para.niaofen = 1;


        var _index = 0;
        if(this._playNode_Count_3 && this._playNode_Count_3.isSelected()){
            para.maxPlayer = 4;
            _index = 3;
        }
        else if (this._playNode_Count_0.isSelected())
        {
            para.maxPlayer = 4;
            _index = 0;
        }
        else if (this._playNode_Count_1.isSelected())
        {
            para.maxPlayer = 3;
            _index = 1;
        }
        else if (this._playNode_Count_2.isSelected())
        {
            para.maxPlayer = 2;
            _index = 2;
        }

        if(this._playNode_Count_3){
            para.convertible = this._playNode_Count_3.isSelected(); // 自由人数
        }

        para.zhuangxianfen = this._playNode_zhuangxianfen.isSelected();
        para.dianpao = this._playNode_dianpao.isSelected();//点炮胡
        para.qianggang = this._playNode_qiangganghu.getSelectIndex();//抢杠胡
        para.qianggangquanbao = this._playNode_qianggangquanbao.isSelected();//抢杠全包
        para.qidui = this._playNode_qidui.isSelected();//七对可胡
        para.youhongzhongbujiepao = this._playNode_youhongzhongbujiepao.isSelected();//有红中不接炮
        para.wuhongzhongjiabei = this._playNode_wuhongzhongjiabei.isSelected();//无红中加倍
        para.bihuType = this._playNode_biHuType.isSelected();//有胡必胡

        para.huangZhuangGang = this.play_huangZhuangGang.isSelected();
        para.buKePeng = this.play_buKePeng.isSelected();
        para.zhua1Zhong10 = this._playNode_zhua1zhong10.isSelected() && this._playNode_niaoType_1.isSelected();
        para.zhongHongZhongSuan12 = this._playNode_niaoType_1.isSelected() && this.zhongHongZhongSuan12.isSelected();

        if (this.zuoZhuang_radio) {
            para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 先进来
        }


        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            para.appType = 11;
            para.hongzhong8 = [4,8,1,2][this._playNode_hongzhong8.getSelectIndex()];

            para.buzhongsuanquanzhong = this._playNode_zhongNiao.isSelected();
            para.quanzhongfanbei = this._playNode_quanZhongFanBei.isSelected();
            para.wuhongzhongjia2niao = this._playNode_wuHongZhongNiao.isSelected();

            para.diFen = [-1,5][this.diFenList_radio.getSelectIndex()];
            if(para.diFen > -1){
                para.diFen = parseInt(this.diFenList_radio.getSelectItem().getChildByName("score").getString());
            }
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_diFen_score, para.diFen);

            
            para.suiShiKeGang = this._playNode_suiShiKeGang.isSelected();//有红中不接炮
        }else{
            para.hongzhong8 = this._playNode_hongzhong8.isSelected();//8红中
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            
            para.piaoType = this._playNode_piaoList.getSelectIndex();
            para.jiapiao = (para.piaoType == 4); // 邵阳用另外一种方式记录飘分选项
        }else if (this._playNode_jiapiao) {// 飘分
            para.jiapiao = this._playNode_jiapiao.isSelected();//飘分
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var isShow = this._playNode_niaoType_5.isSelected();
            para.buzhongsuanquanzhong = this._playNode_zhongNiao.isSelected() && isShow;
            para.quanzhongfanbei = this._playNode_quanZhongFanBei.isSelected() && isShow;
            para.wuhongzhongjia2niao = this._playNode_wuHongZhongNiao.isSelected() && isShow;
            para.huQingYiSeQiDuiJia2Niao = isShow && this.huQingYiSeQiDuiJia2Niao.isSelected();
        } 

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
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

            para.duoHu = this._playNode_duoHu.isSelected();
            para.hongZhongKeHu = this._playNode_qiShouHongZhong.isSelected();
            para.siHongZhongKeHu = this._playNode_siHongZhongKeHu.isSelected();
            para.huTypeJia1Fen = this._playNode_huTypeJia1fen.isSelected();

            para.dianPaoScore = this._playNode_dianpaoList.getSelectIndex();
            para.ziMoScore = this._playNode_zimoList.getSelectIndex();
            para.trustWay = para.trustTime == -1 ? 0 : this._playNode_trustWay.getSelectIndex();
            para.isTrustWhole = para.trustWay != 0;

            var score = this.bg_node.getParent().getChildByName("score"); 
            para.jieSuanDiFen = Number(score.getString());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_jieSuanDiFen,para.jieSuanDiFen);
        }

        para.queYiMen = false;
        if(this._playNode_queyimen && (_index == 2 || para.convertible)){
            // 二人玩法，缺一门 条子
            para.queYiMen = this._playNode_queyimen.isSelected();//缺一门 
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_queYiMen, para.queYiMen); 
        }
        
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaoTpye,para.zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_Count,_index);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_tuoguan,para.trustTime || 0);
            
        }
        cc.log("-----------------------para.bihuType = " + para.bihuType);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_zhuangxianfen,para.zhuangxianfen);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_dianpaohu,para.dianpao);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_qiangganghu,para.qianggang);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_qianggangquanbao,para.qianggangquanbao);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_8hongzhong,para.hongzhong8);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_is7dui,para.qidui);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao,para.youhongzhongbujiepao);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei,para.wuhongzhongjiabei);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaofen, para.niaofen);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
     _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list); 

        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_tyzz();

        if(this._playNode_queyimen){
            var isVisible = this._playNode_Count_2.isSelected() || (this._playNode_Count_3 && this._playNode_Count_3.isSelected());
            this._playNode_queyimen.visible = isVisible 
        } 
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
         
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_zhuangxianfen,para.zhuangxianfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_dianpaohu,para.dianpao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_qiangganghu,para.qianggang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_qianggangquanbao,para.qianggangquanbao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_is7dui,para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao,para.youhongzhongbujiepao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei,para.wuhongzhongjiabei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_bihu, para.bihuType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhong,para.wuhongzhong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_ziyou,para.convertible);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_zhongHongZhongSuan12, para.zhongHongZhongSuan12);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_zhua1zhong10, para.zhua1Zhong10);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_huQingYiSeQiDuiJia2Niao, para.huQingYiSeQiDuiJia2Niao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_trustWhole,para.isTrustWhole);
            if (this.zuoZhuang_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_zuoZhuang, para.zuoZhuang);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_8hongzhong,para.hongzhong8);
                     
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_duoHu,para.duoHu);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_hongzhongkehu,para.hongZhongKeHu);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_sihongzhongkehu,para.siHongZhongKeHu);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_huTypeJia1Fen,para.huTypeJia1Fen);

                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_jieSuanDiFen,para.jieSuanDiFen);

                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_buzhongsuanquanzhong,para.buzhongsuanquanzhong);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_quanzhongfanbei,para.quanzhongfanbei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjia2niao,para.wuhongzhongjia2niao);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_suiShiKeGang, para.suiShiKeGang);

                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_buKePeng, para.buKePeng);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_huangZhuangGang, para.huangZhuangGang);

                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_ziMoScore, para.ziMoScore); 
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_dianPaoScore, para.dianPaoScore);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_trustWay, para.trustWay); 
            }else{
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_8hongzhong,para.hongzhong8);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_piaoType, para.piaoType);

            if (this._playNode_jiapiao)
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_jiapiao, para.jiapiao);
        }
    },
});