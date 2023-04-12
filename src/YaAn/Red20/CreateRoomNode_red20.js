//选项选中时的颜色处理  统一处理
const BTNCOLOR1 = cc.color('#D96334');//选中
const BTNCOLOR2 = cc.color('#8E8178');//禁用
const BTNCOLOR3 = cc.color("#935C23");//未选中

function cpp_callback(a, b) {
    cc.log("cpp return two integer: " + a + " " + b);
}

var CreateRoomNode_red20 = CreateRoomNodeYaAn.extend({
    ctor: function (layer, data) {
        this._super(layer, data);
    },
    //创建ui 以及变量保存
    initAll: function (IsFriendCard) {
        let bg_node = ccs.load("bg_red20.json").node;
        this.addChild(bg_node);
        bg_node.setScale(0.9, 0.9)
        bg_node.setPosition(-200, 10);
        this.bg_node = bg_node.getChildByName("bg_shuyang");
        this._view = this.bg_node.getChildByName("view");
        // this.bg_node.setContentSize(cc.size(893.00, 565.00));
        // this.bg_node.setAnchorPoint(0.0, 0.0);
        // this.payWayNodeArray[2].setEnabled(false);
    },

    initPlayNode: function () {
        this._super();
    },

    getSelectedPara: function () {
        const gameType = this._data.gameType,
            pPriceCfg = MjClient.data.gamePrice[gameType];
        cc.log('服务器配置----', gameType, JSON.stringify(pPriceCfg));
        const maxP = Number(Object.keys(pPriceCfg)[this.getRedioSelectByName('renshu')]),
            score = this._view.getChildByName('difen').getChildByName('BaseScore').getString();
        const Rule = {
            gameType: gameType,
            maxPlayer: maxP,
            trustTime: 0, //托管时间

            MaxPlayerCount: maxP,
            MaxGameCount: Number(Object.keys(pPriceCfg[maxP])[this.getRedioSelectByName('jushu')]),
            MaxFan: [4, 5, 6][this.getRedioSelectByName('fengding')],//最大番数 
            MaxKingCount: [3, 6, 9, 12, 15, 18][this.getRedioSelectByName('wangpai')],//最大大王数量
            EnableChi: [true, false][this.getRedioSelectByName('chipai')], //是否开启吃牌（这里的吃牌是指吃上家的牌）
            EnableZiMo: this.getCheckboxSelectedByName('btnCheckZiMo'),//true: 自摸加番
            Enable4Pairs: this.getCheckboxSelectedByName('btnCheck4Pairs'), //是否开启小四对（汉源叫对子胡）
            EnableDragon4Pairs: this.getCheckboxSelectedByName('btnCheckD4Pairs'), //是否开启龙四队
            EnableDoubleDragon4Pairs: this.getCheckboxSelectedByName('btnCheckDD4Pairs'), //是否开启双龙四队
            EnableJinGouDiao: this.getCheckboxSelectedByName('btnCheckJGG'),//是否开启金钩钓
            EnableGolden20: this.getCheckboxSelectedByName('btnCheckjin20'),//是否开启金20
            Golden20Fan: 1,//金20番薯 默认1 
            IsCheckTing: [true, false][this.getRedioSelectByName('liuju')],//是否查叫
            IsCheckFan: [true, false][this.getRedioSelectByName('pinghu')],//是否1番起胡(true：1番起胡 false：平胡可胡)
            Allow7AsKing: [true, false][this.getRedioSelectByName('7dianjiawang')],//是否允许7当王
            AllowBaoTing: true,//是否允许报听 默认true
            IsPoint7AsKing: [true, false][this.getRedioSelectByName('7dianwangdian')],//是否允许7当王算点
            EnableRed20Ting: [true, false][this.getRedioSelectByName('baotinghongdian')],//是否必需满足红点>=20听牌(false：补一张够20可听牌)
            EnableRed20Hu: true,//是否必须满足红点>=20才能胡牌 默认true
            Red50: this.getCheckboxSelectedByName('btnCheck50'),  //红50
            Black50: this.getCheckboxSelectedByName('btnCheck50'),//黑50
            EnableTTF: [true, false][this.getRedioSelectByName('suanfan')],//是否开启梯梯番模式否则为跟斗番
            EnableGSH: this.getCheckboxSelectedByName('btnCheckGangHua'),//是否开启杠上花
            MustOpenGPS: this._nodeGPS.isSelected(),//GPS
            BaseScore: Number(score),
            AllowSameIP: false,
        };
        cc.log("createara: " + JSON.stringify(Rule));
        return Rule;
    }
});