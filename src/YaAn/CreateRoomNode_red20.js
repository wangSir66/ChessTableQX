/**
 * Created by maoyu on 2017/7/21.
 */
//选项选中时的颜色处理  统一处理
var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(47, 79, 79);
var CREATEROOM_COLOR_3 = cc.color(158, 118, 78);

function cpp_callback(a, b) {
    cc.log("cpp return two integer: " + a + " " + b);
}

var CreateRoomNode_red20 = CreateRoomNode.extend({
    _view: null,
    
    setKey: function() {
        this.localStorageKey.KEY_LYG2_AutoZhuang    = "_LIAN_YUN_GANG2_AUTOZHUANG";     //随机坐庄
        this.localStorageKey.KEY_LYG2_IsTing        = "_LIAN_YUN_GANG2_TING";           //是否可听
        this.localStorageKey.KEY_LYG2_ThreeKou      = "_LIAN_YUN_GANG2_THRESS";         //三口是否翻4倍
        this.localStorageKey.KEY_LYG2_GangKai       = "_LIAN_YUN_GANG2_KAI";            //开杠
        this.localStorageKey.KEY_LYG2_count         = "_LIAN_YUN_GANG_COUNT";           //人数
        this.localStorageKey.KEY_LYG2_WuWanFeng     = "_LIAN_YUN_GANG2_WUWANFENG";      //无万风
        this.localStorageKey.KEY_LYG2_tuoguan       = "_LIAN_YUN2_GANG_tuoguan";
    },

    initAll: function (IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        let bg_node = ccs.load("bg_lianyungang.json").node;//bg_red20.json
        this.addChild(bg_node);
        bg_node.setScale(0.9, 0.9)
        bg_node.setPosition(-200, 10);
        this.bg_node = bg_node.getChildByName("bg_lianyungang");//bg_shuyang
        this._view = this.bg_node.getChildByName("view");
    },

    initPlayNode: function () {
        this._super();
        // this.initLister();
    },
    
    setPlayNodeCurrentSelect: function () {
        this._super();
    },

    //事件监听
    initLister: function () {
        if (!this._view) return;
        //底分加減（1-20）
        let df = this._view.getChildByName('difen');
        if (df) {
            let baseScoreT = df.getChildByName('BaseScore');
            baseScoreT.setString(1);
            df.getChildByName('BtnPlusBaseScore').addTouchEventListener((sender, Type) => {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        let num = Number(baseScoreT.getString());
                        if (num >= 20) {
                            baseScoreT.setString(1);
                        } else {
                            baseScoreT.setString(num + 1);
                        }
                        break;
                    default:
                        break;
                }
            }, this);

            df.getChildByName('BtnMinusBaseScore').addTouchEventListener((sender, Type) => {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        let num = Number(baseScoreT.getString());
                        if (num === 1) {
                            baseScoreT.setString(20);
                        } else {
                            baseScoreT.setString(num - 1);
                        }
                        break;
                    default:
                        break;
                }
            }, this);
        }
        for (let _i = 0; _i < this._view.children.length; _i++) {
            const child = this._view.children[_i];
            let btns = [];
            for (let _j = 0; _j < child.children.length; _j++) {
                const btn = child.children[_j];
                if (btn.name.indexOf('btnRadio') > -1) btns.push(btn);
                else if (btn.name.indexOf('btnCheck') > -1) {
                    btn.addEventListener(this.callSelectBack.bind(this), btn);
                    this.addListenerText(btn, null, this.callSelectBack.bind(this));
                }
            }
            if (btns.length > 0) {
                const fanbei_radio = createRadioBoxForCheckBoxs(btns, this.callSelectBack.bind(this));
                this.addListenerText(btns, fanbei_radio, this.callSelectBack.bind(this));
            }
        }
    },
    //按钮回调
    callSelectBack: function (index, sender, list) {
        cc.log('----callSelectBack---', index, sender.name, list)
    },

    
    getSelectedPara: function () {
        let Rule = {
            maxPlayer: 2,
            MaxPlayerCount: 2,
            MaxGameCount: 12,
            MaxFan: 6,
            MaxKingCount: 3,
            EnableChi: false,
            EnableZiMo: true,
            Enable4Pairs: true,
            EnableDragon4Pairs: true,
            EnableDoubleDragon4Pairs: true,
            EnableJinGouDiao: true,
            EnableGolden20: 3,
            IsCheckTing: 1,
            //是否1番起胡(true：1番起胡 false：平胡可胡)
            IsCheckFan: false,
            Allow7AsKing: 1,
            AllowBaoTing: true,
            IsPoint7AsKing: 1,
            EnableRed20Ting: 1,
            EnableRed20Hu: true,
            Red50:true,
            Black50: true,
            EnableTTF: true,
            AllowSameIP: false,
            EnableGSH: false,
            MustOpenGPS: false,
            BaseScore: 0.1,//+(this._view.getChild('BaseScore').asTextField.text),
            //托管类型
            TrusteeshipType: 4,//this.getRuleNumByType('TrusteeshipType'),
            //取消次数
            TrusteeshipCount: 2, //this.getRuleNumByType('TrusteeshipCount'),
            gameType:MjClient.GAME_TYPE.RED_20_POKER
        };
        cc.log("createara: " + JSON.stringify(Rule));
        return Rule;
    }
});