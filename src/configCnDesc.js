
GameCnDescDefault = {
    maxPlayer: function (v, areaSelectMode) {
        if (areaSelectMode.convertible)
            return "自由人数";
        else
            return v ? v + "人场" : "";
    },
    jieSuanDiFen: function (v) { return v > 0 ? "积分底分" + v : ""; },
    difen: function (v) { return v > 0 ? "积分底分" + v : ""; },
    baseScore: function (v) { return v + "分"; },
    deckNum: function (v) { return v + "副牌"; },
    scoreLine: function (v) { return v + "分结算"; },
    isShowLeft: function (v) { return v ? "显示手牌张数" : ""; },
    isDivideTeam: function (v, areaSelectMode) {
        if (areaSelectMode.isRandomTeam) {
            return "随机分组";
        } else if (areaSelectMode.isDivideTeam) {
            return "分组";
        }
        return "";
    },
    hasJoker: function (v) { return v ? "带双王" : ""; },
    addJoker: function (v) { return v ? "加双王" : ""; },
    noJoker: function (v) { return v ? "不要王" : ""; },
    hasWings: function (v) { return v ? "可带牌" : ""; },
    lastRoundScore: function (v) { return v > 0 ? "终局奖励" + v + "分" : "无终局奖励"; },
    isReCall: function (v) { return v ? "显示记牌器" : ""; },
    isRandom: function (v) { return v ? "随机出头" : ""; },
    haveKingTz: function (v) { return v ? "有王筒子" : ""; },
    isBiChu: function (v) { return v ? "有牌必打" : ""; },
    isHongheidian: function (v) { return v ? "红黑点" : ""; },
    isTianDiHu: function (v) { return v ? "天地胡" : ""; },
    flowerCount: function (v) { return v + "花"; },
    isLianZhuang: function (v) { return v ? "可连庄" : ""; },
    isTrust: function (v) { return v ? "自动托管" : ""; },
    isSpringDouble: function (v) { return v ? "春天翻倍" : ""; },
    isDismissDouble: function (v) { return v ? "春天解散翻倍" : ""; },
    tianDiHuType: function (v) { return v == 0 ? "天地胡加十胡" : v == 1 ? "天地胡翻倍" : "无天地胡"; },
    isJiaChui: function (v) { return v ? "加锤" : ""; },
    huxiType: function (v) {
        return v == 0 ? "21胡息" : "卡20张";
    },
    isDaiFeng: function (v) { return v ? "带风" : ""; },
    zhiTouZi: function (v) { return v ? "开杠听掷骰子" : ""; },
    isCanChi: function (v) { return v ? "可吃牌" : ""; },
    isQingYiSeChi: function (v) { return v ? "清一色可吃牌" : ""; },
    fangGangType: function (v) { return v == 0 ? "每家都出" : "放杠者出"; },
    // duoHu: function(v) {return v ? "一炮多响" : "截胡"}, // 如果需要 在自己游戏添加
    dianpao: function (v) { return v ? "点炮胡" : ""; },
    tingType: function (v) { return v ? "可听牌" : "不可听牌"; },
    lazi: function (v) { return v ? "封顶" : "不封顶"; },
    zhafengding: function (v) { return v ? v + "炸封顶" : "不封顶"; },
    beishufengding: function (v) { return v ? v + "倍封顶" : ""; },
    bijiaoSigeer: function (v) { return v ? "4个2必叫" : ""; },
    bijiaoWangshuanger: function (v) { return v ? "王+双2必叫" : ""; },
    bijiaoZhadan: function (v) { return v ? "炸弹必叫" : ""; },
    daiti: function (v) { return v ? "带踢翻倍" : ""; },
    sidaier: function (v) { return v ? "四带二" : ""; },
    can4dai2: function (v) { return v ? "四带二" : ""; },
    can4dai3: function (v) { return v ? "四带三" : ""; },
    zhaDanBuChai: function (v) { return v ? "炸弹不可拆" : ""; },
    isAutoTip: function (v) { return v ? "自动提示" : ""; },
    hongTao10Niao: function (v) { return v ? "红桃10扎鸟" : ""; },
    upLimmit: function (v) { return v > 0 ? "上限" + v : "无上限"; },
    multi: function (v) { return v ? v + "倍" : ""; },
    maizhuang: function (v) { return v ? "买庄" : "不买庄"; },
    zhuangxianfen: function (v) { return v ? "庄闲分" : ""; },
    mustTing: function (v) { return v ? "必须叫听" : ""; },
    qianggang: function (v) { return v ? "抢杠胡" : ""; },
    qianggangquanbao: function (v) { return v ? "抢杠全包" : ""; },
    canChi: function (v) { return v ? "可吃" : "不可吃"; },
    qidui: function (v) { return v ? "七对可胡" : ""; },
    zhongfabai: function (v) { return v ? "带中发白" : ""; },
    hongzhong8: function (v, areaSelectMode) {
        if (areaSelectMode.appType && areaSelectMode.appType == 11) {
            if (v == 'true' || v == 'false') {
                v = v ? 8 : 4;
            } else {
                v = Number(v);
            }
            var str = "";
            var cfg = { "4": "4红中", "8": "8红中", "1": "翻癞子", "2": "双癞子", };
            return cfg[v];
        } else {
            return v ? "8红中" : "";
        }
    },
    daihongzhong: function (v) { return v ? "带红中" : "不带红中"; },
    qiangganghu: function (v) { return v ? "抢杠胡" : ""; },
    guipaiType: function (v) { return v == 0 ? "翻鬼" : v == 1 ? "红中鬼" : "上下鬼"; },
    isQishouhu: function (v) { return v ? "四鬼起手胡" : ""; },
    youhongzhongbujiepao: function (v, areaSelectMode) {
        if (areaSelectMode.appType && areaSelectMode.appType == 11) {
            return v ? "有癞子不接炮" : "";
        } else {
            return v ? "有红中不接炮" : "";
        }
    },
    faPai: function (v) {
        return ["普通", "畅爽", "极速"][v] || "";
    },
    isQiangganghu: function (v, areaSelectMode) {
        if (areaSelectMode.isQiangganghu) {
            return areaSelectMode.isQianggangquanbao ? "抢杠全包," : "抢杠胡,";
        }
        return "";
    },
    niaofen: function (v, areaSelectMode) { return areaSelectMode.zhuaniao != 0 && areaSelectMode.zhuaniao != 1 ? "中鸟" + v + "分" : ""; },
    wuhongzhongjiabei: function (v, areaSelectMode) {
        if (areaSelectMode.appType && areaSelectMode.appType == 11) {
            return v ? "无癞子加倍" : "";
        } else {
            return v ? "无红中加倍" : "";
        }
    },
    qianggangsuanzimo: function (v) { return v ? "抢杠胡算自摸" : ""; },
    qianggangsuandianpao: function (v) { return v ? "抢杠胡算点炮" : ""; },
    canHuCount: function (v) { return v ? "胡可胡" : ""; },
    zFlower4: function (v) { return v ? v : ""; },
    dnxbzFlower20: function (v) { return v ? v : ""; },
    dnxbzfbFlower28: function (v) { return v ? v : ""; },
    baozi: function (v) { return v ? "带豹子" : "不带豹子"; },
    liuduo: function (v) { return v ? "留垛" : "不留垛"; },
    gangBao: function (v) { return v ? "杠爆" : "不杠爆"; },
    zuizi: function (v) { return v ? "带嘴" : "不带嘴"; },
    isJiaZhu: function (v) { return v ? "下嘴" : "不下嘴"; },
    yingjiaxianchu: function (v) { return v ? "赢家先出" : ""; },
    showHandCount: function (v) { return v ? "显示牌数" : ""; },
    canGangScore: function (v, areaSelectMode) { return typeof areaSelectMode.getGangScore !== undefined && areaSelectMode.getGangScore ? "一炮多响" : "截胡"; },
    mustzimo: function (v) { return v ? "只能自摸" : ""; },
    IsThreeKouDouble: function (v) { return v ? "三口翻2倍" : "三口不翻倍"; },
    zimohu: function (v) { return v ? "自摸胡" : ""; },
    zengfen: function (v) { return v ? "增分" : "无增分"; },
    canGangPeng: function (v) { return v ? "可明杠可碰" : "不可明杠不可碰"; },
    zhuangDouble: function (v) { return v ? "庄翻倍" : "庄不翻倍"; },
    lazhuangFen: function (v) { return v ? "拉庄" + v + "封顶" : "不拉庄"; },
    lazhuang: function (v) { return v ? "拉庄" : "不拉庄"; },
    mustPut: function (v) { return v ? "能管必管" : ""; },
    baoDanMustPut: function (v) { return v ? "报单必顶" : ""; },
    dapie: function (v) { return v ? "大撇" : "不带撇"; },
    menzigun: function (v) { return v ? "闷飘" : ""; },
    haidilaoyue: function (v) { return v ? "海底捞月" : ""; },
    shuanglonghui: function (v) { return v ? "双龙会" : ""; },
    daixi: function (v) { return v ? "带喜" : ""; },
    huimianchuhan: function (v) { return v ? "会面出汗" : ""; },
    shengyihu: function (v) { return v ? "剩一胡" : ""; },
    pigu: function (v) { return v ? "屁股" : ""; },
    jizi: function (v) { return v ? "基子" : ""; },
    piaohu: function (v) { return v ? "飘胡" : ""; },
    dahu: function (v) { return v ? "有大胡" : ""; },
    fangZuoBi: function (v) { return v ? "防作弊" : ""; },
    can3aZhaDan: function (v) { return v ? "3个A算炸弹" : ""; },
    isZhaDanFanBei: function (v) { return v ? "炸弹翻倍" : ""; },
    zhuaMaNum: function (v) { return v > 0 ? "抓" + v + "张" : "不抓码"; },
    canPutAnyFeiji: function (v) { return v ? "飞机可少带接完" : ""; },
    canPutAnySanZhang: function (v) { return v ? "三张可少带接完" : ""; },
    can3ge3ZhaDan: function (v) { return v ? "3个3算炸弹" : ""; },
    tianHu: function (v) { return v ? "天胡" : ""; },
    diHu: function (v) { return v ? "地胡" : ""; },
    payWay: ["房主付", "AA付", "大赢家付"],
    WithFlowerType: ["无花", "有花", "中发白作花", "4花", "20花", "28花", "4花", "8花"],
    tingHuType: { 0: "不听可胡", 1: "不听不可胡" },
    zhuaniao: { 0: "不抓鸟", 1: "一鸟全中", 2: "2鸟", 3: "3鸟", 4: "4鸟", 6: "6鸟", 8: "8鸟" },
    zhuaniaoNum: { 0: "抓飞鸟", 1: "一鸟全中", 2: "2鸟", 4: "4鸟", 6: "6鸟", 8: "8鸟" },
    liu8zhang: { 0: "摸1/2张", 1: "摸2/4张", 2: "摸4/6张" },
    songma: { 0: "不送码", 2: "2码", 4: "4码", 6: "6码" },
    isFanXing: { 1: "单醒", 2: "双醒" },
    hongzhong: { 0: "无癞子", 4: "4红中", 8: "8红中" },
    type: { jingdian: "经典斗地主", huanle: "欢乐斗地主" },
    xijiang: { xijiang147: "喜将147", "xijiangQuan": "喜将全" },
    fengding: { 0: "不封顶", 600: "600胡封顶", 800: "800胡封顶" },
    baodi: { 100: "醒家保底100分", 200: "醒家保底200分" },
    payType: { onePay: "一包一", allPay: "一包三" },
    piaofen: { 0: "不飘分", 1: "飘2分", 2: "飘5分" },
    shaguiType: { 0: "不杀鬼", 1: "杀鬼翻番", 2: "杀鬼加5分" },
    wuguiType: { 0: "", 1: "无鬼翻2倍", 2: "无鬼翻3倍" },
    xiNum: { 6: "6息", 9: "9息", 15: "15息" },
    xingType: { 0: "不带醒", 1: "随醒", 2: "翻醒" },
    suanfenType: { 0: "", 1: "积分底分2分", 2: "1息1囤" },
    bihuType: { 0: "有胡必胡", 1: "点炮必胡" },
    fangpaoType: { 0: "3倍", 1: "2倍", 2: "1倍" },
    cardNumIndex: { 0: "16张", 1: "15张" },
    redguaiwanOne: { 1: "红拐弯(234)", 2: "红拐弯(468)" },
    shunType: { 0: "顺子到2", 1: "顺子到小王" },
    minHu: function (v) { return v && v == 21 ? "21胡起胡" : ""; },
    lunzhuang: function (v) { return v ? "轮庄" : ""; },
    minRedNum: function (v) { return v + "红起胡"; },
    kingNum: function (v) { return v ? ["无", "一", "二", "三", "四"][v] + "王" : "无王"; },
    isShuangHe: function (v) { return v ? "双合翻倍" : ""; },
    isDaHu: function (v) { return v ? "大胡10分" : ""; },
    isPengPengHu: function (v) { return v ? "碰碰胡" : ""; },
    pengpenghu: function (v) { return v ? "碰碰胡" : ""; },
    isNo34: function (v) { return v ? "去掉3、4" : ""; },
    isYiGuaBian: function (v) { return v ? "一挂匾" : ""; },
    isHuDieFei: function (v) { return v ? "蝴蝶飞" : ""; },
    isSiPeng: function (v) { return v ? "四碰单吊" : ""; },
    isManTangHong: function (v) { return v ? "满堂红" : ""; },
    isBanBanHu: function (v) { return v ? "板板胡" : ""; },
    isJuJuHong: function (v) { return v ? "句句红" : ""; },
    isShiErHong: function (v) { return v ? "十二红" : ""; },

    isShiYiHong: function (v) { return v ? "十一红" : ""; },
    isFengDing: function (v) { return v ? "80分封顶" : ""; },
    playSpeed: function (v) { return v == 0 ? "快" : "慢"; },
    isPlayerShuffle: function (v) { return v == 1 ? "手动切牌" : "系统切牌"; },
    // banBanHuType: function(v,areaSelectMode){
    //     if(areaSelectMode["isBanBanHu"]){
    //         return v ? ["闲家胡桌面第一张牌","闲家胡自己摸的第一张牌"][v];
    //     }
    //     return "";
    // },
    isAnCards: function (v, areaSelectMode) {
        var cfg = {
            "3": {
                "2": [33, 66],
                "3": [41, 9],
                "4": [33, 0]
            },
            "4": {
                "2": [44, 96],
                "3": [44, 52],
                "4": [46, 0]
            }
        };
        if (areaSelectMode.isAnCards) { // 4人暗8张牌
            cfg["3"]["4"] = [31, 8];
            cfg["4"]["4"] = [44, 8];
        }
        if (areaSelectMode.haveKingTz) { // 2 3人 3副牌
            cfg["3"]["2"] = [33, 72];
            cfg["3"]["3"] = [41, 15];
        }
        if (areaSelectMode.isSiXi) {
            cfg["4"]["2"] = [44, 88];
            cfg["4"]["3"] = [44, 44];
            cfg["4"]["4"] = [44, 0];
        }
        return "暗" + cfg[areaSelectMode.deckNum][areaSelectMode.maxPlayer][1] + "张";
    },
    isPapo: function (v) { return v ? "爬坡" : ""; },
    syDuoHu: function (v) { return v ? "一炮多响" : "一炮一响"; },
    isTikan: function (v) { return v ? "三提、五坎" : ""; },
    isZiMoFanBei: function (v) { return v ? "自摸翻倍" : ""; },
    isZiMoJiaYiTun: function (v) { return v ? "自摸加一囤" : ""; },

    isMaiPai: function (v) { return v ? "埋20张" : ""; },
    maipai: function (v) { return v ? "埋牌" : ""; },
    fullperson: function (v) { return v ? "满人开始" : ""; },
    trustTime: { 0: "", 60: "1分钟后托管", 120: "2分钟后托管", 180: "3分钟后托管", 300: "5分钟后托管" },
    ht10zhaniaohanzhadan: function (v) { return v ? "扎鸟含炸弹" : ""; },
    zhaniao: { 0: "", 1: "红桃9翻倍", 2: "红桃10翻倍", 3: "红桃10飘5分", 4: "红桃10飘10分" },
    isYiHongSanBei: function (v) { return v ? "一点红3倍" : ""; },
    isHuLiangZhang: function (v) { return v ? "可胡示众牌" : ""; },
    isManualCutCard: function (v) { return v ? "手动切牌" : "系统切牌"; },
    jushou: function (v) { return v ? "举手做声" : ""; },
    budaihu: function (v) { return v ? "不带无胡" : "带无胡"; },
    budaiyihong: function (v) { return v ? "不带一点红" : "带一点红"; },
    isPutLimit: function (v) { return v ? "吃边打边" : ""; },
    jieFengType: function (v, areaSelectMode) {
        if (areaSelectMode.isDivideTeam) {
            if (v == 0) {
                return "队友接风";
            } else if (v == 1) {
                return "下家接风";
            }
        }
        return "";
    },
    youtao: function (v) { return v ? "有套" : ""; },
    daxiaodao: function (v) { return v ? "大小道" : ""; },
    caneat: function (v) { return v ? "可以吃" : ""; },
    gangsuihu: function (v) { return v ? "杠随胡" : ""; },
    mustPutHongTaoSan: function (v) { return v ? "先出红桃三" : ""; },
    firstHeiTao3: function (v) { return v ? "首局先出黑桃3" : ""; },
    mustPut: function (v) { return v ? "能管必管" : ""; },
    showCardNumber: function (v) { return v ? "显示牌数" : ""; },
    gangkai4bei: function (v) { return v ? "杠开翻倍" : "杠开不翻倍"; },
    isLianChui: function (v) { return v ? "连锤" : ""; },
    isAlldemit: function (v) { return v ? "解散需全部人同意" : ""; },
    isZiMoRate: function (v) { return v == 0 ? "自摸翻倍" : ""; },
    isfending: function (v) { return v == 0 ? "四百封顶" : "两百封顶"; },
    openType: function (v) { return v == 1 ? "全开放" : v == 2 ? "半开放" : "不开放"; },
    huType: function (v) { return v ? "自摸胡" : "点炮胡"; },
    isPiaoHu: function (v) { return v ? "飘胡" : ""; },
    is21Zhang: function (v) { return v ? "21张" : ""; },
    maPai: function (v) { return v > 0 ? v + "码" : "数字码"; },
    isLiangPian: function (v) { return v ? "两片" : ""; },
    wangzhua: function (v) { return v ? "明抓" : "暗抓"; },
    zuopiao: function (v) { return v == 0 ? "不飘" : "飘" + v; },
    hunyise: function (v) { return v ? "混一色" : ""; },
    kepiao: function (v) { return v ? "下飘" : ""; },
    isTianhu: function (v) { return v ? "天胡" : ""; },
    isDihu: function (v) { return v ? "地胡" : ""; },
    isHaidihu: function (v) { return v ? "海底胡" : ""; },
    isErfen: function (v) { return v ? "积分底分2分" : ""; },
    isMingwei: function (v) { return v ? "明偎" : ""; },
    isYiwushi: function (v) { return v ? "一五十" : ""; },
    hongziType: function (v, areaSelectMode) { return areaSelectMode.isHongheidian ? (v == 0 ? "10红3倍13红5倍" : "10红3倍多一红+3胡") : ""; },
    hongZhuan: function (v) { return v ? "红转朱黑" : ""; },
    isGenXing: function (v) { return v ? "跟醒" : "翻醒"; },
    isKing: function (v) { return v == 0 ? "按王限胡" : v == 1 ? "按番限胡" : "不限胡"; },
    fanBei: function (v, areaSelectMode) {
        if (v == 1 && areaSelectMode.fanBeiScore) {
            return "小于" + areaSelectMode.fanBeiScore + "分翻倍";
        }
        return "不翻倍";
    },
    fengDing: { 0: "不封顶", 1: "30/32分", 2: "60/64分", 3: "120/128分" },
    zhuangJia: { 0: "首局房主庄", 1: "首局随机庄" },
    qihuTun: function (v) {
        return "起胡" + v + "囤";
    },
    isTrustWhole: function (v, areaSelectMode) {
        if (areaSelectMode.trustTime > 0 && v && areaSelectMode.trustWay == undefined) {
            return "整场托管";
        }
        return "";
    },
    trustWay: function (v, areaSelectMode) {
        if (areaSelectMode.trustTime <= 0) {
            return "";
        } else {
            return ["托管当局", "托管当局+下一局", "整场托管"][v];
        }

    },
    matchLimitScore: function (v, areaSelectMode) {
        if (areaSelectMode.isMatchLimit) {
            return "低于" + v + "分禁止进房";
        }
        return "";
    },
    matchDissolveLimitScore: function (v, areaSelectMode) {
        if (areaSelectMode.isMatchDissolveLimit) {
            return "低于" + v + "分自动解散";
        }
        return "";
    },
    scoreNeedEnough: function (v, areaSelectMode) {
        if (v) {
            return "积分不为负";
        }
        return "";
    },
}
// 不同名但是描述一样、设计问题尽量避免，目前这么处理
GameCnDescDefault.flowerType = GameCnDescDefault.WithFlowerType;
GameCnDescDefault.qiangganghu = GameCnDescDefault.qianggang;
GameCnDescDefault.showCardNumber = GameCnDescDefault.showHandCount;
GameCnDescDefault.nohongzhongdouble = GameCnDescDefault.wuhongzhongjiabei;

GameCnDesc = {};
//新跑得快
const newRunFasterDes = {
    mustPutHongTaoSan: v => ['每局黑桃五先出', '每局赢家先出'][v],
    HandCutRule: v => {
        let p = Number(rule.maxPlayer);
        if (p === 4) return 0;
        else if (v == 0) return '去掉所有梅花牌';
        else return '去掉' + (p == 3 ? '一' : '两') + '方玩家的牌';
    },
    Sisters: v => v ? '姊妹对' : null,
    IsAnonymous: v => v ? '游戏内匿名' : null,
    AllBlack: v => v ? '全黑' : null,
    AllRed: v => v ? '全红' : null,
    AllBig: v => v ? '全大' : null,
    AllSmall: v => v ? '全小' : null,
    AllSingly: v => v ? '全单' : null,
    AllDouble: v => v ? '全双' : null,
    Four5OrA: v => v ? '5555，AAAA' : null,
    FourOther: v => v ? '4个6-4个K' : null,
    can3geZha: v => v ? '3张算炸' : null,
    can4geZha: v => v ? '4张算炸' : null,
    XiScore: v => v ? ('名堂分:' + v + '分') : null,
    BombScore: v => v ? ('炸弹分:' + v + '分') : null,
    isZhaDanJiaFen: v => v ? '带炸弹' : '不带炸弹',
    AutoReady: v => v ? '结算自动准备' : '结算手动准备',
    payWay: v => v === 0 ? '圈主付' : (v === 1 ? 'AA' : '赢家付'),
    trustTime: v => v === 0 ? '不托管' : '超时' + v + 's托管',
    //默认规则
    cardNumIndex: v => null,
    isPlayerShuffle: v => null,
    hongTao10Niao: v => null,
    zhaDanBuChai: v => null,
    showCardNumber: v => null,
    mustPut: v => null,
    can4dai2: v => null,
    can4dai3: v => null,
    can3aZhaDan: v => null,
    jieSuanDiFen: v => null,
};
GameCnDesc[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER] = newRunFasterDes;
GameCnDesc[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER1] = newRunFasterDes;
//雅安跑得快
GameCnDesc[MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN] = {
    mustPutHongTaoSan: v => ['每局黑桃五先出', '每局赢家先出'][v],
    HandCutRule: v => {
        let p = Number(rule.maxPlayer);
        if (p === 4) return 0;
        else if (v == 0) return '去掉所有梅花牌';
        else return '去掉' + (p == 3 ? '一' : '两') + '方玩家的牌';
    },
    Sisters: v => v ? '姊妹对' : null,
    IsAnonymous: v => v ? '游戏内匿名' : null,
    AllBlack: v => v ? '全黑' : null,
    AllRed: v => v ? '全红' : null,
    AllBig: v => v ? '全大' : null,
    AllSmall: v => v ? '全小' : null,
    AllSingly: v => v ? '全单' : null,
    AllDouble: v => v ? '全双' : null,
    Four5OrA: v => v ? '5555，AAAA' : null,
    FourOther: v => v ? '4个6-4个K' : null,
    can3geZha: v => v ? '3张算炸' : null,
    can4geZha: v => v ? '4张算炸' : null,
    XiScore: v => v ? ('名堂分:' + v + '分') : null,
    BombScore: v => v ? ('炸弹分:' + v + '分') : null,
    isZhaDanJiaFen: v => v ? '带炸弹' : '不带炸弹',
    AutoReady: v => v ? '结算自动准备' : '结算手动准备',
    payWay: v => v === 0 ? '圈主付' : (v === 1 ? 'AA' : '赢家付'),
    trustTime: v => v === 0 ? '不托管' : '超时' + v + 's托管',
    //默认规则
    cardNumIndex: v => null,
    isPlayerShuffle: v => null,
    hongTao10Niao: v => null,
    zhaDanBuChai: v => null,
    showCardNumber: v => null,
    mustPut: v => null,
    can4dai2: v => null,
    can4dai3: v => null,
    can3aZhaDan: v => null,
    jieSuanDiFen: v => null,
};
//雅安红20
GameCnDesc[MjClient.GAME_TYPE.RED_20_POKER] = {
    EnableTTF: v => v ? '梯梯番' : '跟斗番',
    MaxKingCount: v => v + '张王牌',
    EnableChi: v => v ? '能吃上家' : '自摸自吃',
    EnableZiMo: v => v ? '自摸加1番' : null,
    Enable4Pairs: v => v ? '小四对3番' : null,
    EnableDragon4Pairs: v => v ? '龙四对6番' : null,
    EnableDoubleDragon4Pairs: v => v ? '双龙四对12番' : null,
    EnableJinGouDiao: v => v ? '金钩钓3番' : null,
    EnableGolden20: v => v ? '金二十' : null,
    IsCheckTing: v => v ? '流局cha叫' : '流局不cha叫',
    IsCheckFan: v => v ? '不可以平胡' : '可以平胡',
    Allow7AsKing: v => v ? '把7当王用' : '7不当王',
    IsPoint7AsKing: v => v ? '7当王算点' : '7当王不算点',
    EnableRed20Ting: v => v ? '够20点才能报听' : '补1张够20点才能报听',
    Black50: v => v ? '红五十、黑五十、红黑五十' : null,
    EnableGSH: v => v ? '杠上花' : null,
    payWay: v => v === 0 ? '圈主付' : (v === 1 ? 'AA' : '赢家付'),
    MaxPlayerCount: v => v + '人房',
    MaxGameCount: v => v + '局',
    BaseScore: v => '底分：' + v + '分',
    jieSuanDiFen: v => null,
};

//雅安血战
const xuezhanRuleDes = {
    subRule: v => ['血战到底', '三人三房', '三人两房', '二人两房', '二人一房'][v],
    PointsLimit: v => v + '番封顶',
    DianGangHua: v => '点杠花：' + (v === 1 ? '自摸' : '点炮'),
    Forming: v => v + '张',
    SwappingType: v => ['同花色换', '任意换', '不换'][v],
    PointOfWinning: v => ['自摸不加', '自摸加番', '自摸加底'][v],
    CallForwardingEnabled: v => v ? '呼叫转移' : null,
    DuiDuiHuPoints: v => '对对胡' + v + '番',
    MenQingEnabled: v => v ? '门清' : null,
    ZhongZhangEnabled: v => v ? '中张' : null,
    WinningFanEnabled: v => v ? '天地胡' : null,
    WinningLastEnabled: v => v ? '海底捞' : null,
    YaoJiuJiangDuiEnabled: v => v ? '幺九将对' : null,
    KaxingwuEnabled: v => v ? '卡星五' : null,
    DgwMultipleEnabled: v => v ? '巴倒烫' : null,
    PingHuCanWinningByOther: v => v ? '平胡点炮可胡' : '1番起胡',
    payWay: v => v === 0 ? '圈主付' : (v === 1 ? 'AA' : '赢家付'),
    MaxPlayerCount: v => v + '人房',
    MaxGameCount: v => v + '局',
    BaseScore: v => '底分：' + v + '分',
    jieSuanDiFen: v => null,
    difen: v => null
}
GameCnDesc[MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG] = xuezhanRuleDes;
GameCnDesc[MjClient.GAME_TYPE.XUE_ZHAN_3to3] = xuezhanRuleDes;
GameCnDesc[MjClient.GAME_TYPE.XUE_ZHAN_3to2] = xuezhanRuleDes;
GameCnDesc[MjClient.GAME_TYPE.XUE_ZHAN_2to2] = xuezhanRuleDes;
GameCnDesc[MjClient.GAME_TYPE.XUE_ZHAN_2to1] = xuezhanRuleDes;