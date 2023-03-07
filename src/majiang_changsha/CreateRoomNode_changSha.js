/**
 * Created by cyc on 2017/7/21.
 * 长沙麻将：配置地区有 永州、湘乡 by cyc 20191023
 */

var CreateRoomNode_changSha = CreateRoomNode.extend({
    // ctor: function(layer,IsFriendCard) { //构造函数在父类里面已经写了(子类没有多余的动作，最好就不要重写了),如果在子类里面继承就一定与父类保持一致(现在是已经修改好的，原来的是没有任何参数)，不然会出现不可预知的bug
    //     this._super(layer,IsFriendCard); 
    // },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },

    setKey:function()
    {
        this.localStorageKey.KEY_CSMJ_maxPlayer                     = "_CSMJ_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_CSMJ_zhuaNiaoType                  = "_CSMJ_ZHUA_NIAO_TYPE";   //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuanNiaoNum                  = "_CSMJ_ZHUA_NIAO_NUM";    //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuaNiaoBuLunKong             = "_CSMJ_ZHUA_NIAO_BULUNKONG";    //抓鸟不轮空
        this.localStorageKey.KEY_CSMJ_zhuangXianFeng                = "_CSMJ_ZHUANG_XIAN_FENG"; //庄闲分
        this.localStorageKey.KEY_CSMJ_buBuGao                       = "_CSMJ_BU_BU_GAO";        //步步高
        this.localStorageKey.KEY_CSMJ_jinTongYuNv                   = "_CSMJ_JIN_TONG_YU_NV";   //金童玉女
        this.localStorageKey.KEY_CSMJ_sanTong                       = "_CSMJ_SAN_TONG";         //三同
        this.localStorageKey.KEY_CSMJ_yiZhiHua                      = "_CSMJ_YI_ZHI_HUA";       //一枝花
        this.localStorageKey.KEY_CSMJ_queYiSe                       = "_CSMJ_queYiSe";          //缺一色
        this.localStorageKey.KEY_CSMJ_banBanHu                      = "_CSMJ_banBanHu";         //板板胡
        this.localStorageKey.KEY_CSMJ_liuLiuShun                    = "_CSMJ_liuLiuShun";       //六六顺
        this.localStorageKey.KEY_CSMJ_daSiXi                        = "_CSMJ_daSiXi";           //大四喜
        this.localStorageKey.KEY_CSMJ_huPaiNiao                     = "_CSMJ_huPaiNiao";        //胡牌鸟（一只鸟)
        this.localStorageKey.KEY_CSMJ_zhongTuCanAgain               = "_CSMJ_zhongTuCanAgain";      //起手胡可胡多次（含中途）
        this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun             = "_CSMJ_ZHONG_TU_LIU_LIU_SHUN";    //中途六六顺
        this.localStorageKey.KEY_CSMJ_zhongTuSiXi                   = "_CSMJ_ZHONG_TU_SI_XI";   //中途四喜
        this.localStorageKey.KEY_CSMJ_jiaJiangHu                    = "_CSMJ_JIA_JIANG_HU";     //假将胡
        this.localStorageKey.KEY_CSMJ_xianPiao                      = "_CSMJ_XIAN_PIAO";        //选飘
        this.localStorageKey.KEY_CSMJ_piaoFen                       = "_CSMJ_piaoFen";                //飘分
        this.localStorageKey.KEY_CSMJ_menQingZiMo                   = "_CSMJ_menQingZiMo";      //门清自摸
        this.localStorageKey.KEY_CSMJ_fengDing                      = "_CSMJ_fengDing";         //封顶（21分、42分）
        this.localStorageKey.KEY_CSMJ_menQing                       = "_CSMJ_menQing";          //门清
        this.localStorageKey.KEY_CSMJ_menQing_no258                 = "_CSMJ_menQing_no258";          //门清不要258
        this.localStorageKey.KEY_CSMJ_queYiMen                      = "_CSMJ_queYiMen";         //缺一门
        this.localStorageKey.KEY_CSMJ_kai4Gang                      = "_CSMJ_kai4Gang";         //开4杠
        this.localStorageKey.KEY_CSMJ_isOpenTingTip                 = "_CSMJ_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_CSMJ_difen                         = "_CSMJ_difen";            //底分
        this.localStorageKey.KEY_CSMJ_tuoguan                       = "_CSMJ_tuoguan";          //托管
        this.localStorageKey.KEY_CSMJ_chahu                         = "_CSMJ_chahu";          //可查看起手胡
        this.localStorageKey.KEY_CSMJ_anzhuang                      = "_CSMJ_anzhuang";          //按庄抓鸟
        this.localStorageKey.KEY_CSMJ_keqiangzhigang                = "_CSMJ_keqiangzhigang";   //可抢直杠
        this.localStorageKey.KEY_CSMJ_genzhangbudianpao             = "_CSMJ_genzhangbudianpao";   //跟张不点炮
        this.localStorageKey.KEY_CSMJ_fanbei                        = "_CSMJ_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_CSMJ_fanbeiscore                   = "_CSMJ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_CSMJ_xiaohubudianpao               = "_CSMJ_FAN_BEI_xiaohubudianpao";  //小胡不接炮

        this.localStorageKey.KEY_CSMJ_youhongzhong                  = "_CSMJ_youhongzhong";  //是否有红中癞子
        this.localStorageKey.KEY_CSMJ_wuhongzhongJiaFen             = "_CSMJ_wuhongzhongJiaFen";    //无红中加分
        this.localStorageKey.KEY_CSMJ_zuoZhuang                     = "_CSMJ_ZUO_ZHUANG";     //0 随机， 1 先进来
    },

    setKey_ER:function()
    {
        this.localStorageKey.KEY_CSMJ_maxPlayer                     = "_CSMJ_ER_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_CSMJ_zhuaNiaoType                  = "_CSMJ_ER_ZHUA_NIAO_TYPE";   //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuanNiaoNum                  = "_CSMJ_ER_ZHUA_NIAO_NUM";    //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuaNiaoBuLunKong             = "_CSMJ_ER_ZHUA_NIAO_BULUNKONG";    //抓鸟不轮空
        this.localStorageKey.KEY_CSMJ_zhuangXianFeng                = "_CSMJ_ER_ZHUANG_XIAN_FENG"; //庄闲分
        this.localStorageKey.KEY_CSMJ_buBuGao                       = "_CSMJ_ER_BU_BU_GAO";        //步步高
        this.localStorageKey.KEY_CSMJ_jinTongYuNv                   = "_CSMJ_ER_JIN_TONG_YU_NV";   //金童玉女
        this.localStorageKey.KEY_CSMJ_sanTong                       = "_CSMJ_ER_SAN_TONG";         //三同
        this.localStorageKey.KEY_CSMJ_yiZhiHua                      = "_CSMJ_ER_YI_ZHI_HUA";       //一枝花
        this.localStorageKey.KEY_CSMJ_queYiSe                       = "_CSMJ_ER_queYiSe";          //缺一色
        this.localStorageKey.KEY_CSMJ_banBanHu                      = "_CSMJ_ER_banBanHu";         //板板胡
        this.localStorageKey.KEY_CSMJ_liuLiuShun                    = "_CSMJ_ER_liuLiuShun";       //六六顺
        this.localStorageKey.KEY_CSMJ_daSiXi                        = "_CSMJ_ER_daSiXi";           //大四喜
        this.localStorageKey.KEY_CSMJ_huPaiNiao                     = "_CSMJ_ER_huPaiNiao";        //胡牌鸟（一只鸟)
        this.localStorageKey.KEY_CSMJ_zhongTuCanAgain               = "_CSMJ_ER_zhongTuCanAgain";      //起手胡可胡多次（含中途）
        this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun             = "_CSMJ_ER_ZHONG_TU_LIU_LIU_SHUN";    //中途六六顺
        this.localStorageKey.KEY_CSMJ_zhongTuSiXi                   = "_CSMJ_ER_ZHONG_TU_SI_XI";   //中途四喜
        this.localStorageKey.KEY_CSMJ_jiaJiangHu                    = "_CSMJ_ER_JIA_JIANG_HU";     //假将胡
        this.localStorageKey.KEY_CSMJ_xianPiao                      = "_CSMJ_ER_XIAN_PIAO";        //选飘
        this.localStorageKey.KEY_CSMJ_piaoFen                       = "_CSMJ_ER_piaoFen";                //飘分
        this.localStorageKey.KEY_CSMJ_menQingZiMo                   = "_CSMJ_ER_menQingZiMo";      //门清自摸
        this.localStorageKey.KEY_CSMJ_fengDing                      = "_CSMJ_ER_fengDing";         //封顶（21分、42分）
        this.localStorageKey.KEY_CSMJ_menQing                       = "_CSMJ_ER_menQing";          //门清
        this.localStorageKey.KEY_CSMJ_menQing_no258                 = "_CSMJ_ER_menQing_no258";          //门清不要258
        this.localStorageKey.KEY_CSMJ_queYiMen                      = "_CSMJ_ER_queYiMen";         //缺一门
        this.localStorageKey.KEY_CSMJ_kai4Gang                      = "_CSMJ_ER_kai4Gang";         //开4杠
        this.localStorageKey.KEY_CSMJ_isOpenTingTip                 = "_CSMJ_ER_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_CSMJ_difen                         = "_CSMJ_ER_difen";            //底分
        this.localStorageKey.KEY_CSMJ_tuoguan                       = "_CSMJ_ER_tuoguan";          //托管
        this.localStorageKey.KEY_CSMJ_chahu                         = "_CSMJ_ER_chahu";          //可查看起手胡
        this.localStorageKey.KEY_CSMJ_anzhuang                      = "_CSMJ_ER_anzhuang";          //按庄抓鸟
        this.localStorageKey.KEY_CSMJ_keqiangzhigang                = "_CSMJ_ER_keqiangzhigang";   //可抢直杠
        this.localStorageKey.KEY_CSMJ_genzhangbudianpao             = "_CSMJ_ER_genzhangbudianpao";   //跟张不点炮
        this.localStorageKey.KEY_CSMJ_fanbei                        = "_CSMJ_ER_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_CSMJ_fanbeiscore                   = "_CSMJ_ER_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_CSMJ_xiaohubudianpao               = "_CSMJ_ER_FAN_BEI_xiaohubudianpao";  //小胡不接炮

        this.localStorageKey.KEY_CSMJ_youhongzhong                  = "_CSMJ_ER_youhongzhong";  //是否有红中癞子
        this.localStorageKey.KEY_CSMJ_wuhongzhongJiaFen             = "_CSMJ_ER_wuhongzhongJiaFen";    //无红中加分
        this.localStorageKey.KEY_CSMJ_zuoZhuang                     = "_CSMJ_ER_ZUO_ZHUANG";     //0 随机， 1 先进来
    },
    initAll:function(IsFriendCard)
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (!IsFriendCard){
            if(this._data.isErRen){
                this.setKey_ER();
            }else{
                this.setKey();
            }
            
        }
            

        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        if(this._data.isErRen){
            this.bgNode = ccs.load("bg_changShaErRen.json").node;
        }else{
            this.bgNode = ccs.load("bg_changSha.json").node;
        }
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_changSha").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_changSha");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer0"));// 自由人数
        maxPlayerList.push(_play.getChildByName("maxPlayer5"));// 自由人数
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4, 3]);
		
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.changePayForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;
        //中鸟加分/加倍
        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        if (_play.getChildByName("zhuaniaoType4")) {
            zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType4"));
        }
        var self = this;
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList, function(index){
            self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,zhuaNiaoTypeList[index],zhuaNiaoTypeList);
        });
        this.addListenerText(zhuaNiaoTypeList,this.zhuaNiaoTypeList_radio,this.refreshZhuaNiao.bind(this));
        this.zhuaNiaoTypeList = zhuaNiaoTypeList;
        //抓几鸟
        var zhuaNiaoNumList = [];
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum1"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum2"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum4"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum6"));
        this.zhuaNiaoNumList_radio = createRadioBoxForCheckBoxs(zhuaNiaoNumList,this.radioBoxSelectCB);
        this.addListenerText(zhuaNiaoNumList,this.zhuaNiaoNumList_radio);
        this.zhuaNiaoNumList = zhuaNiaoNumList;

        this.zhuaNiaoBuLunKong = _play.getChildByName("zhuaNiaoBuLunKong");
        this.addListenerText(this.zhuaNiaoBuLunKong);
        this.zhuaNiaoBuLunKong.addEventListener(this.clickCB, this.zhuaNiaoBuLunKong);
        this.play_anzhuang = _play.getChildByName("play_anzhuang");
        this.addListenerText(this.play_anzhuang);
        this.play_anzhuang.addEventListener(this.clickCB, this.play_anzhuang);

        //胡法
        this.zhuangXianFeng = _play.getChildByName("zhuangXianFeng");
        this.zhuangXianFeng_1 = _play.getChildByName("zhuangXianFeng_0");
        this.zhuangXianFeng_2 = _play.getChildByName("zhuangXianFeng_1");
        var zhuangXianFengList = [];
        zhuangXianFengList.push(_play.getChildByName("zhuangXianFeng_1"));
        zhuangXianFengList.push(_play.getChildByName("zhuangXianFeng"));
        zhuangXianFengList.push(_play.getChildByName("zhuangXianFeng_0"));
        this.zhuangXianFengList_radio = createRadioBoxForCheckBoxs(zhuangXianFengList,this.radioBoxSelectCB);
        this.addListenerText(zhuangXianFengList,this.zhuangXianFengList_radio);
        this.zhuangXianFengList = zhuangXianFengList;

        this.buBuGao        = _play.getChildByName("buBuGao");
        this.addListenerText(this.buBuGao);
        this.buBuGao.addEventListener(this.clickCB, this.buBuGao);

        this.jinTongYuNv    = _play.getChildByName("jinTongYuNv");
        this.addListenerText(this.jinTongYuNv);
        this.jinTongYuNv.addEventListener(this.clickCB, this.jinTongYuNv);

        this.sanTong        = _play.getChildByName("sanTong");
        this.addListenerText(this.sanTong);
        this.sanTong.addEventListener(this.clickCB, this.sanTong);

        this.yiZhiHua       = _play.getChildByName("yiZhiHua");
        this.addListenerText(this.yiZhiHua);
        this.yiZhiHua.addEventListener(this.clickCB, this.yiZhiHua);

        this.banBanHu       = _play.getChildByName("banBanHu");
        this.addListenerText(this.banBanHu);
        this.banBanHu.addEventListener(this.clickCB, this.banBanHu);

        this.liuLiuShun       = _play.getChildByName("liuLiuShun");
        this.addListenerText(this.liuLiuShun);
        this.liuLiuShun.addEventListener(this.clickCB, this.liuLiuShun);

        this.daSiXi       = _play.getChildByName("daSiXi");
        this.addListenerText(this.daSiXi);
        this.daSiXi.addEventListener(this.clickCB, this.daSiXi);

        this.huPaiNiao   = _play.getChildByName("huPaiNiao");
        if (this.huPaiNiao) {
            this.huPaiNiao.getChildByName("text").setString("一只鸟");
            this.addListenerText(this.huPaiNiao);
            this.huPaiNiao.addEventListener(this.clickCB, this.huPaiNiao);
        }

        this.zhongTuCanAgain       = _play.getChildByName("zhongTuCanAgain");
        this.addListenerText(this.zhongTuCanAgain);
        this.zhongTuCanAgain.addEventListener(this.clickCB, this.zhongTuCanAgain);

        this.zhongTuLiuLiuShun  = _play.getChildByName("zhongTuLiuLiuShun");
        this.addListenerText(this.zhongTuLiuLiuShun);
        this.zhongTuLiuLiuShun.addEventListener(this.clickCB, this.zhongTuLiuLiuShun);

        this.zhongTuSiXi    = _play.getChildByName("zhongTuSiXi");
        this.addListenerText(this.zhongTuSiXi);
        this.zhongTuSiXi.addEventListener(this.clickCB, this.zhongTuSiXi);

        this.xiaohubudianpao    = _play.getChildByName("xiaoHuBuDianPao");
        this.addListenerText(this.xiaohubudianpao);
        this.xiaohubudianpao.addEventListener(this.clickCB, this.xiaohubudianpao);

        this.jiaJiangHu     = _play.getChildByName("jiaJiangHu");
        this.addListenerText(this.jiaJiangHu);
        this.jiaJiangHu.addEventListener(this.clickCB, this.jiaJiangHu);

        //坐庄
        this._zuozhuang_1 = _play.getChildByName("zuoZhuang_1");
        this._zuozhuang_2 = _play.getChildByName("zuoZhuang_2");
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var zuoZhuangList = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
            this.addListenerText(zuoZhuangList, this.zuoZhuang_radio);
        }


        // 红中癞子
        this.youhongzhong = _play.getChildByName("youhongzhong");
        if (this.youhongzhong) {
            this.wuhongzhong = _play.getChildByName("wuhongzhong");
            var youhongzhongList = [];
            youhongzhongList.push(this.wuhongzhong);
            youhongzhongList.push(this.youhongzhong);
            this.youhongzhongList_radio = createRadioBoxForCheckBoxs(youhongzhongList,this.radioBoxSelectCB);
            this.addListenerText(youhongzhongList,this.youhongzhongList_radio);
            this.youhongzhongList = youhongzhongList;

            this.wuhongzhongJia2Fen = _play.getChildByName("wuhongzhongJia2Fen");
            this.wuhongzhongJia4Fen = _play.getChildByName("wuhongzhongJia4Fen");
            var wuhongzhongJiaFenList = [];
            wuhongzhongJiaFenList.push(this.wuhongzhongJia2Fen);
            wuhongzhongJiaFenList.push(this.wuhongzhongJia4Fen);
            this.wuhongzhongJiaFenList_radio = createRadioBoxForCheckBoxs(wuhongzhongJiaFenList,this.radioBoxSelectCB);
            this.addListenerText(wuhongzhongJiaFenList,this.wuhongzhongJiaFenList_radio);
            this.wuhongzhongJiaFenList = wuhongzhongJiaFenList;

            var jia2FenText = this.wuhongzhongJia2Fen.getChildByName("text");
            var jia4FenText = this.wuhongzhongJia4Fen.getChildByName("text");
            this.wuhongzhongJia2Fen.schedule(function() {
                var isSelectYouHongZhong = this.youhongzhong.isSelected();
                if (this.wuhongzhongJia2Fen.isEnabled() && !isSelectYouHongZhong) { 
                    jia2FenText.srcTextColor = jia2FenText.getTextColor();
                    jia4FenText.srcTextColor = jia4FenText.getTextColor();
                    var clr = cc.color(128, 128, 128);
                    jia2FenText.setTextColor(clr);
                    jia4FenText.setTextColor(clr);
                }
                else if (!this.wuhongzhongJia2Fen.isEnabled() && isSelectYouHongZhong) {
                    jia2FenText.setTextColor(jia2FenText.srcTextColor);
                    jia4FenText.setTextColor(jia4FenText.srcTextColor);
                }
                this.wuhongzhongJia2Fen.setEnabled(isSelectYouHongZhong);
                this.wuhongzhongJia4Fen.setEnabled(isSelectYouHongZhong);

            }.bind(this));
        }

        // 飘分 改版
        this._playNode_piaoFen0 = _play.getChildByName("play_piaofen0");  
        this._playNode_piaoFen1 = _play.getChildByName("play_piaofen1");
        this._playNode_piaoFen2 = _play.getChildByName("play_piaofen2");
        this._playNode_piaoFen3 = _play.getChildByName("play_piaofen3");
        this._playNode_piaoFen4 = _play.getChildByName("play_piaofen4"); 
        var nodePiaofenList = [];
        nodePiaofenList.push(this._playNode_piaoFen0);
        nodePiaofenList.push(this._playNode_piaoFen1);
        nodePiaofenList.push(this._playNode_piaoFen2);
        nodePiaofenList.push(this._playNode_piaoFen3);
        nodePiaofenList.push(this._playNode_piaoFen4);
        this.nodePiaofenList = nodePiaofenList;
        var piaoFenCallback = function(index){
            this._playNode_player_piaoFen_radio.selectItem(index);
            this.radioBoxSelectCB(index, this.nodePiaofenList[index], this.nodePiaofenList);
        }.bind(this);
        this._playNode_player_piaoFen_radio = createRadioBoxForCheckBoxs(nodePiaofenList, function(index) {
            
            piaoFenCallback(index);
        }.bind(this));
        this.addListenerText(nodePiaofenList, this._playNode_player_piaoFen_radio, piaoFenCallback);
        this._nodePiaofenList = nodePiaofenList;   


        this.kai4Gang       = _play.getChildByName("kai4Gang");
        this.addListenerText(this.kai4Gang);
        this.kai4Gang.addEventListener(this.clickCB, this.kai4Gang);

        this.chaHu       = _play.getChildByName("chaHu");
        this.addListenerText(this.chaHu);
        this.chaHu.addEventListener(this.clickCB, this.chaHu);

        this.keqiangzhigang = _play.getChildByName("keqiangzhigang");
        this.addListenerText(this.keqiangzhigang);
        this.keqiangzhigang.addEventListener(this.clickCB, this.keqiangzhigang);

        this.genzhangbudianpao = _play.getChildByName("genzhangbudianpao");
        this.addListenerText(this.genzhangbudianpao);
        this.genzhangbudianpao.addEventListener(this.clickCB, this.genzhangbudianpao);

        var huChiCheckBoxs = function(list) {
            var list_radio = createRadioBoxForCheckBoxsHuChi(list, function(index) {
            for (var i = 0; i < list.length; i++) {
                this.clickCB(list[i], list[i].isSelected() ? ccui.CheckBox.EVENT_SELECTED : ccui.CheckBox.EVENT_UNSELECTED);
            }
            }.bind(this));
            for (var i = 0; i < list.length; i++) {
                var func = function(index) {
                    this.addListenerText(list[index], null, function() {
                        list_radio.selectItem(list[index].isSelected() ? index : -1);
                        for (var i = 0; i < list.length; i++) {
                            this.selectedCBForYZ(list[i].getChildByName("text"), list[i].isSelected());
                        }
                    }.bind(this));
                }.bind(this);
                func(i);
            }
            return list_radio;
        }.bind(this);

        var queYiList = [];
        this.queYiSe     = _play.getChildByName("queYiSe");
        this.queYiMen    = _play.getChildByName("queYiMen");
        queYiList.push(this.queYiSe);
        queYiList.push(this.queYiMen);
        this.queYiList_radio = huChiCheckBoxs(queYiList);
        this.queYiList = queYiList;

        var menQingList = [];
        this.menQingZiMo    = _play.getChildByName("menQingZiMo");
        this.menQing        = _play.getChildByName("menQing");
        menQingList.push(this.menQingZiMo);
        menQingList.push(this.menQing);
        this.menQingList_radio = huChiCheckBoxs(menQingList);
        this.menQingList = menQingList;

        var fengDingList = [];
        fengDingList.push(_play.getChildByName("fengDing21"));
        fengDingList.push(_play.getChildByName("fengDing42"));
        fengDingList.push(_play.getChildByName("fengDing15"));
        this.fengDingList_radio = huChiCheckBoxs(fengDingList);
        this.fengDingList = fengDingList;

        this.menQing_no258    = _play.getChildByName("menQing_no258");
        this.addListenerText(this.menQing_no258);
        this.menQing_no258.addEventListener(this.clickCB, this.menQing_no258);

        this.queYiMen.schedule(function() {
            var isPlayer2 = _play.getChildByName("maxPlayer2").isSelected();
            this.menQing.setVisible(isPlayer2);
            this.queYiMen.setVisible(isPlayer2);
            if(this.menQing.isSelected()){
                this.menQing_no258.visible = true;
            }else{
                this.menQing_no258.visible = false;
                this.menQing_no258.setSelected(false);
                this.selectedCBForYZ(this.menQing_no258.getChildByName("text"), false)
            }
        }.bind(this));


        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        this.zhuaNiaoNumPoints = [];
        this.zhuaNiaoNumPoints[0] = zhuaNiaoNumList[0].getPosition();
        this.zhuaNiaoNumPoints[1] = zhuaNiaoNumList[1].getPosition();
        this.zhuaNiaoNumPoints[2] = zhuaNiaoNumList[2].getPosition();
        this.zhuaNiaoNumPoints[3] = zhuaNiaoNumList[3].getPosition();
        this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 1) {
                        this._zhuIdx--;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx++;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }
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
    },
    refreshZhuaNiao:function()
    {
        cc.log(" ========== refreshZhuaNiao ======")
        var zhuaNiaoNumList = this.zhuaNiaoNumList;
        var points = this.zhuaNiaoNumPoints;
        if (this.zhuaNiaoTypeList_radio.getSelectIndex() == 0)
        {
            zhuaNiaoNumList[0].setVisible(false);
            zhuaNiaoNumList[1].setVisible(true);
            zhuaNiaoNumList[2].setVisible(true);
            zhuaNiaoNumList[3].setVisible(true);
            this.zhuaNiaoBuLunKong.setVisible(true);
            this.play_anzhuang.setVisible(true);
            zhuaNiaoNumList[1].x = this.zhuaNiaoTypeList[0].x;
            zhuaNiaoNumList[2].x = this.zhuaNiaoTypeList[1].x;
            /*zhuaNiaoNumList[3].x = this.zhuaNiaoTypeList[2].x;*/

            if (this.zhuaNiaoNumList_radio.getSelectIndex() == 0){
                this.zhuaNiaoNumList_radio.selectItem(1);
                this.radioBoxSelectCB(1,this.zhuaNiaoNumList[1],this.zhuaNiaoNumList);
            }
        }
        else if (this.zhuaNiaoTypeList_radio.getSelectIndex() == 1 || this.zhuaNiaoTypeList_radio.getSelectIndex() == 3)
        {
            zhuaNiaoNumList[0].setVisible(true);
            zhuaNiaoNumList[1].setVisible(true);
            zhuaNiaoNumList[2].setVisible(true);
            zhuaNiaoNumList[3].setVisible(true);
            this.zhuaNiaoBuLunKong.setVisible(true);
            this.play_anzhuang.setVisible(true);
            zhuaNiaoNumList[0].setPosition(points[0]);
            zhuaNiaoNumList[1].setPosition(points[1]);
            zhuaNiaoNumList[2].setPosition(points[2]);
            /*zhuaNiaoNumList[3].setPosition(points[3]);*/

            // if (this.zhuaNiaoNumList_radio.getSelectIndex() != 0 && this.zhuaNiaoNumList_radio.getSelectIndex() != 1){
            //     this.zhuaNiaoNumList_radio.selectItem(0);
            //     this.radioBoxSelectCB(0,this.zhuaNiaoNumList[0],this.zhuaNiaoNumList);
            // }
        }
        else {
            zhuaNiaoNumList[0].setVisible(false);
            zhuaNiaoNumList[1].setVisible(false);
            zhuaNiaoNumList[2].setVisible(false);
            zhuaNiaoNumList[3].setVisible(false);
            this.zhuaNiaoBuLunKong.setVisible(false);
            this.play_anzhuang.setVisible(false);
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var maxPlayer;
        if (isClub) {
            if (this.getBoolItem("convertible", false)){
                maxPlayer = this.getNumberItem("maxPlayer")  == 3 ? 4 : 3;
            }    
            else
                maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, 0);
        }
        if(this._data.isErRen){
            maxPlayer = 2;
        }
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer,this.maxPlayerList[maxPlayer],this.maxPlayerList);

        var zhuaNiaoType;
        if (isClub)
            zhuaNiaoType = this.getNumberItem("zhuaNiaoType", 0);
        else
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoType, 0);
        this.zhuaNiaoTypeList_radio.selectItem(zhuaNiaoType);
        this.radioBoxSelectCB(zhuaNiaoType,this.zhuaNiaoTypeList[zhuaNiaoType],this.zhuaNiaoTypeList);

        var zhuanNiaoNum;
        if (isClub)
            zhuanNiaoNum = this.getNumberItem("zhuaNiaoNum", 0);
        else
            zhuanNiaoNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zhuanNiaoNum, 0);
        this.zhuaNiaoNumList_radio.selectItem(zhuanNiaoNum);
        this.radioBoxSelectCB(zhuanNiaoNum,this.zhuaNiaoNumList[zhuanNiaoNum],this.zhuaNiaoNumList);

        var zhuaNiaoBuLunKong;
        if (isClub)
            zhuaNiaoBuLunKong = this.getBoolItem("zhuaNiaoBuLunKong", false);
        else
            zhuaNiaoBuLunKong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoBuLunKong, false);
        this.zhuaNiaoBuLunKong.setSelected(zhuaNiaoBuLunKong);
        var text = this.zhuaNiaoBuLunKong.getChildByName("text");
        this.selectedCBForYZ(text,zhuaNiaoBuLunKong);

        var anzhuang;
        if (isClub) {
            anzhuang = this.getBoolItem("anzhuang", false);
        } else {
            anzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_anzhuang, false);
        }
        this.play_anzhuang.setSelected(anzhuang);
        var text = this.play_anzhuang.getChildByName("text");
        this.selectedCBForYZ(text, anzhuang);

        var _zuoZhuang;
        if (isClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 1);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zuoZhuang, 1);
        }
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            list = [this._zuozhuang_1, this._zuozhuang_2];
            this.zuoZhuang_radio.selectItem(_zuoZhuang);
            this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);
        }

        if (this.youhongzhongList) {
            var youhongzhong;
            if (isClub) {
                youhongzhong = this.getBoolItem("youhongzhong", false);
            } else {
                youhongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_youhongzhong, false);
            }
            var hongzhongIndex = youhongzhong ? 1 : 0;
            this.youhongzhongList_radio.selectItem(hongzhongIndex);
            this.radioBoxSelectCB(hongzhongIndex, this.youhongzhongList[hongzhongIndex], this.youhongzhongList);

            var wuhongzhongJiaFen;
            if (isClub) {
                wuhongzhongJiaFen = this.getNumberItem("wuhongzhongJiaFen", 2);
            } else {
                wuhongzhongJiaFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_wuhongzhongJiaFen, 2);
            }
            var wuhongzhongJiaFenIndex = wuhongzhongJiaFen == 2 ? 0 : 1;
            this.wuhongzhongJiaFenList_radio.selectItem(wuhongzhongJiaFenIndex);
            this.radioBoxSelectCB(wuhongzhongJiaFenIndex, this.wuhongzhongJiaFenList[wuhongzhongJiaFenIndex], this.wuhongzhongJiaFenList);
        }

        var zhuangXianFeng;
        if (isClub)
            zhuangXianFeng = this.getNumberItem("zhuangXianFeng", 0);
        else
            zhuangXianFeng = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zhuangXianFeng, 0);
        this.zhuangXianFengList_radio.selectItem(zhuangXianFeng);
        this.radioBoxSelectCB(zhuangXianFeng, this.zhuangXianFengList_radio[zhuangXianFeng], this.zhuangXianFengList);
        for (var i = 0; i < this.zhuangXianFengList.length; i ++) {
            var text = this.zhuangXianFengList[i].getChildByName("text");
            this.selectedCBForYZ(text, i == zhuangXianFeng);
        }

        var xiaohubudianpao;
        if (isClub)
            xiaohubudianpao = this.getBoolItem("xiaohubudianpao", false);
        else
            xiaohubudianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_xiaohubudianpao, false);
        this.xiaohubudianpao.setSelected(xiaohubudianpao);
        var text = this.xiaohubudianpao.getChildByName("text");
        this.selectedCBForYZ(text,xiaohubudianpao);



        var chaHu;
        if (isClub)
            chaHu = this.getBoolItem("chaHu", true);
        else
            chaHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_chahu, true);
        this.chaHu.setSelected(chaHu);
        var text = this.chaHu.getChildByName("text");
        this.selectedCBForYZ(text,chaHu);

        var buBuGao;
        if (isClub)
            buBuGao = this.getBoolItem("buBuGao", false);
        else 
            buBuGao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_buBuGao, false);
        this.buBuGao.setSelected(buBuGao);
        var text = this.buBuGao.getChildByName("text");
        this.selectedCBForYZ(text,buBuGao);

        var jinTongYuNv;
        if (isClub)
            jinTongYuNv = this.getBoolItem("jinTongYuNv", false);
        else
            jinTongYuNv = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_jinTongYuNv, false);
        this.jinTongYuNv.setSelected(jinTongYuNv);
        var text = this.jinTongYuNv.getChildByName("text");
        this.selectedCBForYZ(text,jinTongYuNv);

        var sanTong;
        if (isClub)
            sanTong = this.getBoolItem("sanTong", false);
        else 
            sanTong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_sanTong, false);
        this.sanTong.setSelected(sanTong);
        var text = this.sanTong.getChildByName("text");
        this.selectedCBForYZ(text,sanTong);
        
        var yiZhiHua;
        if (isClub)
            yiZhiHua = this.getBoolItem("yiZhiHua", false);
        else 
            yiZhiHua = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_yiZhiHua, false);
        this.yiZhiHua.setSelected(yiZhiHua);
        var text = this.yiZhiHua.getChildByName("text");
        this.selectedCBForYZ(text,yiZhiHua);

        var banBanHu;
        if (isClub)
            banBanHu = this.getBoolItem("banBanHu", true);
        else
            banBanHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_banBanHu, true);
        this.banBanHu.setSelected(banBanHu);
        var text = this.banBanHu.getChildByName("text");
        this.selectedCBForYZ(text,banBanHu);

        var liuLiuShun;
        if (isClub)
            liuLiuShun = this.getBoolItem("liuLiuShun", true);
        else
            liuLiuShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_liuLiuShun, true);
        this.liuLiuShun.setSelected(liuLiuShun);
        var text = this.liuLiuShun.getChildByName("text");
        this.selectedCBForYZ(text,liuLiuShun);

        var daSiXi;
        if (isClub)
            daSiXi = this.getBoolItem("daSiXi", true);
        else
            daSiXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_daSiXi, true);
        this.daSiXi.setSelected(daSiXi);
        var text = this.daSiXi.getChildByName("text");
        this.selectedCBForYZ(text,daSiXi);

        if (this.huPaiNiao) {
            var huPaiNiao;
            if (isClub)
                huPaiNiao = this.getBoolItem("huPaiNiao", false);
            else
                huPaiNiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_huPaiNiao, false);
            this.huPaiNiao.setSelected(huPaiNiao);
            var text = this.huPaiNiao.getChildByName("text");
            this.selectedCBForYZ(text, huPaiNiao);
        }

        var zhongTuCanAgain;
        if (isClub)
            zhongTuCanAgain = this.getBoolItem("zhongTuCanAgain", false);
        else
            zhongTuCanAgain = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuCanAgain, false);
        this.zhongTuCanAgain.setSelected(zhongTuCanAgain);
        var text = this.zhongTuCanAgain.getChildByName("text");
        this.selectedCBForYZ(text,zhongTuCanAgain);
        
        var zhongTuLiuLiuShun;
        if (isClub)
            zhongTuLiuLiuShun = this.getBoolItem("zhongTuLiuLiuShun", false);
        else
            zhongTuLiuLiuShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun, false);
        this.zhongTuLiuLiuShun.setSelected(zhongTuLiuLiuShun);
        var text = this.zhongTuLiuLiuShun.getChildByName("text");
        this.selectedCBForYZ(text,zhongTuLiuLiuShun);
        
        var zhongTuSiXi;
        if (isClub)
            zhongTuSiXi = this.getBoolItem("zhongTuSiXi", false);
        else
            zhongTuSiXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuSiXi, false);
        this.zhongTuSiXi.setSelected(zhongTuSiXi);
        var text = this.zhongTuSiXi.getChildByName("text");
        this.selectedCBForYZ(text,zhongTuSiXi);

        var jiaJiangHu;
        if (isClub)
            jiaJiangHu = this.getBoolItem("jiaJiangHu", false);
        else
            jiaJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_jiaJiangHu, false);
        this.jiaJiangHu.setSelected(jiaJiangHu);
        var text = this.jiaJiangHu.getChildByName("text");
        this.selectedCBForYZ(text,jiaJiangHu);


        //新加飘分
        if (isClub){
            this._piaoFen = this.getNumberItem("piaoFen", 0);
            var _oldData = this.getBoolItem("xianPiao", false);
            if (_oldData) {
                this._piaoFen = 4 ;
            }
        }
        else
            this._piaoFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_piaoFen, 0);
        this._playNode_player_piaoFen_radio.selectItem(this._piaoFen);
        this.radioBoxSelectCB(this._piaoFen, this.nodePiaofenList[this._piaoFen], this.nodePiaofenList);

        var kai4Gang;
        if (isClub)
            kai4Gang = this.getBoolItem("kai4Gang", false);
        else
            kai4Gang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_kai4Gang, false);
        this.kai4Gang.setSelected(kai4Gang);
        var text = this.kai4Gang.getChildByName("text");
        this.selectedCBForYZ(text,kai4Gang);

        var menQingZiMo;
        if (isClub)
            menQingZiMo = this.getBoolItem("menQingZiMo", false);
        else
            menQingZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_menQingZiMo, false);
        var menQing;
        if (isClub)
            menQing = this.getBoolItem("menQing", false);
        else
            menQing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_menQing, false);
        var menQingIndex = menQingZiMo ? 0 : (menQing ? 1 : -1);
        this.menQingList_radio.selectItem(menQingIndex);
        for (var i = 0; i < this.menQingList.length; i ++) {
            var text = this.menQingList[i].getChildByName("text");
            this.selectedCBForYZ(text, i == menQingIndex);
        }
        var menQing_no258;
        if (isClub)
            menQing_no258 = this.getBoolItem("menQing_no258", false);
        else
            menQing_no258 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_menQing_no258, false);
        this.menQing_no258.setSelected(menQing_no258);
        var text = this.menQing_no258.getChildByName("text");
        this.selectedCBForYZ(text, menQing_no258)

        var fengDing;
        if (isClub)
            fengDing = this.getNumberItem("fengDing", -1);
        else
            fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fengDing, -1);
        this.fengDingList_radio.selectItem(fengDing);
        for (var i = 0; i < this.fengDingList.length; i ++) {
            var text = this.fengDingList[i].getChildByName("text");
            this.selectedCBForYZ(text, i == fengDing);
        }

        var queYiSe;
        if (isClub)
            queYiSe = this.getBoolItem("queYiSe", true);
        else
            queYiSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_queYiSe, true);
        var queYiMen;
        if (isClub)
            queYiMen = this.getBoolItem("queYiMen", false);
        else
            queYiMen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_queYiMen, false);
        if(this._data.isErRen){
            queYiMen = true;
            queYiSe = false;
        }
        var queYiIndex = queYiSe ? 0 : (queYiMen ? 1 : -1);
        this.queYiList_radio.selectItem(queYiIndex);
        for (var i = 0; i < this.queYiList.length; i ++) {
            var text = this.queYiList[i].getChildByName("text");
            this.selectedCBForYZ(text, i == queYiIndex);
        }

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        var keqiangzhigang;
        if (isClub)
            keqiangzhigang = this.getBoolItem("keqiangzhigang", false);
        else
            keqiangzhigang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_keqiangzhigang, false);
        this.keqiangzhigang.setSelected(keqiangzhigang);
        var text = this.keqiangzhigang.getChildByName("text");
        this.selectedCBForYZ(text, keqiangzhigang)

        var genzhangbudianpao;
        if (isClub)
            genzhangbudianpao = this.getBoolItem("genzhangbudianpao", false);
        else
            genzhangbudianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_genzhangbudianpao, false);
        this.genzhangbudianpao.setSelected(genzhangbudianpao);
        var text = this.genzhangbudianpao.getChildByName("text");
        this.selectedCBForYZ(text,genzhangbudianpao)

        if (isClub)
            this._zhuIdx = this.getNumberItem("changsha_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_difen, 1);
        this._zhuIdx = parseInt(this._zhuIdx);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
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
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

        this.refreshZhuaNiao();

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.isErRen = this._data.isErRen;
        para.gameType = MjClient.GAME_TYPE.CHANG_SHA;
        para.maxPlayer = [4, 3, 2, 4, 3][this.maxPlayerList_radio.getSelectIndex()];     // 人数
        if(this._data.isErRen){
            para.maxPlayer = 2;
        }
        para.convertible = this.maxPlayerList_radio.getSelectIndex() == 3 || this.maxPlayerList_radio.getSelectIndex() == 4;	// 自由人数
        para.zhuaNiaoType = this.zhuaNiaoTypeList_radio.getSelectIndex();   // 抓鸟类型 0:抓鸟加分 1:抓鸟加倍 2:不抓鸟
        para.zhuaNiaoNum = this.zhuaNiaoNumList_radio.getSelectIndex(); // 抓鸟数量 int
        para.zhuaNiaoBuLunKong = para.zhuaNiaoType != 2 ?this.zhuaNiaoBuLunKong.isSelected():false; // 抓鸟不轮空
        para.zhuangXianFeng = this.zhuangXianFengList_radio.getSelectIndex(); // 是否有庄闲分
        para.buBuGao        = this.buBuGao.isSelected();    // 是否有步步高
        para.jinTongYuNv    = this.jinTongYuNv.isSelected();    // 是否有金童玉女
        para.sanTong        = this.sanTong.isSelected();    // 是否有三同
        para.yiZhiHua       = this.yiZhiHua.isSelected();   // 是否有一枝花
        para.queYiSe        = this.queYiSe.isSelected(); // 是否有缺一色
        para.banBanHu       = this.banBanHu.isSelected(); // 是否有板板胡
        para.liuLiuShun     = this.liuLiuShun.isSelected(); // 是否有六六顺
        para.daSiXi         = this.daSiXi.isSelected(); // 是否有大四喜

        
        
        if (this.huPaiNiao) {
            para.huPaiNiao      = this.huPaiNiao.isSelected(); // 是否有胡牌鸟(一只鸟)
        }

        para.zhongTuLiuLiuShun = this.zhongTuLiuLiuShun.isSelected();   // 是否有中途六六顺
        para.zhongTuSiXi    = this.zhongTuSiXi.isSelected();    // 是否有中途四喜
        para.jiaJiangHu     = this.jiaJiangHu.isSelected(); // 是否有假将胡
        para.zhongTuCanAgain= this.zhongTuCanAgain.isSelected(); // 起手胡可胡多次（含中途）

        
        para.menQingZiMo    = this.menQingZiMo.isSelected();// 门清自摸
        para.fengDing       = this.fengDingList_radio.getSelectIndex();// 封顶（15分、 21分、42分)
        para.menQing        = para.maxPlayer == 2 && this.menQing.isSelected();
        para.queYiMen       = para.maxPlayer == 2 && this.queYiMen.isSelected();
        para.menQing_no258  = false;
        if(para.menQing)    para.menQing_no258  = this.menQing_no258.isSelected();


        para.kai4Gang       = this.kai4Gang.isSelected();
        para.isOpenTingTip  = this.tingTipList[0].isSelected();
        para.changsha_difen = this._zhuIdx; //底分
        para.chaHu          = this.chaHu.isSelected(); //查看起手胡
        para.anzhuang       = para.zhuaNiaoType != 2 ?this.play_anzhuang.isSelected():false; // 按庄抓鸟
        para.keqiangzhigang = this.keqiangzhigang.isSelected();     // 可抢直杠
        para.genzhangbudianpao = this.genzhangbudianpao.isSelected();   // 跟张不点炮
        para.xiaohubudianpao = this.xiaohubudianpao.isSelected();   // 小胡不接炮

        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        }
        
        if (this.zuoZhuang_radio) {
            para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 先进来
        }
        if (this.youhongzhongList_radio) {
            para.youhongzhong = this.youhongzhongList_radio.getSelectIndex() == 1;
            para.wuhongzhongJiaFen = this.wuhongzhongJiaFenList_radio.getSelectIndex() == 0 ? 2 : 4;
        }

        //飘分
        para.piaoFen = this._playNode_player_piaoFen_radio.getSelectIndex();
        para.xianPiao       = false;   // 老数据 舍弃不要 一定要设置false
        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }
        if(this._data.isErRen){
            para.queYiMen = true;
            para.queYiSe = false;
        }
        cc.log("createara: " + JSON.stringify(para));

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoType, para.zhuaNiaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zhuanNiaoNum, para.zhuaNiaoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_difen, para.changsha_difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoBuLunKong, para.zhuaNiaoBuLunKong);
            if (this.zuoZhuang_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zuoZhuang, para.zuoZhuang);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zhuangXianFeng, para.zhuangXianFeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_buBuGao, para.buBuGao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_jinTongYuNv, para.jinTongYuNv);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_sanTong, para.sanTong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_yiZhiHua, para.yiZhiHua);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_queYiSe, para.queYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_banBanHu, para.banBanHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_liuLiuShun, para.liuLiuShun);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_daSiXi, para.daSiXi);
            if (this.huPaiNiao) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_huPaiNiao, para.huPaiNiao);
            }
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun, para.zhongTuLiuLiuShun);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuSiXi, para.zhongTuSiXi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuCanAgain, para.zhongTuCanAgain);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_jiaJiangHu, para.jiaJiangHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_xianPiao, para.xianPiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_piaoFen, para.piaoFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_menQingZiMo, para.menQingZiMo);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fengDing, para.fengDing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_queYiMen, para.queYiMen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_menQing, para.menQing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_menQing_no258, para.menQing_no258);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_kai4Gang, para.kai4Gang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_tuoguan, para.trustTime);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_chahu, para.chaHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_anzhuang, para.anzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_keqiangzhigang, para.keqiangzhigang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_genzhangbudianpao, para.genzhangbudianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_xiaohubudianpao, para.xiaohubudianpao);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fanbeiscore, para.fanBeiScore);
            }

            if (this.youhongzhongList_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_youhongzhong, para.youhongzhong);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_wuhongzhongJiaFen, para.wuhongzhongJiaFen);
            }
        }

        return para;
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                selectColor = cc.color(0xed, 0x65, 0x01);
                unSelectColor = cc.color(0x9E, 0x76, 0x4E);
            }
            if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
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

    selectedCBForYZ: function(text, isSelected) {
        var selectColor = CREATEROOM_COLOR_1;
        var unSelectColor = CREATEROOM_COLOR_3;
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
            MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            selectColor = CREATEROOM_COLOR_YZ_SELECT;
            unSelectColor = CREATEROOM_COLOR_YZ_UNSELECT;
        }
        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if (isSelected) {
            text.setTextColor(selectColor);
        } else {
            text.setTextColor(unSelectColor);
        }
    }

});