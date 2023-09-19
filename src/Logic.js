//App类型
MjClient.APP_TYPE = {
    YAAN: 25, //雅安麻将
};

var PackageName2AppType = {};
PackageName2AppType["uni.UNI9711555"] = MjClient.APP_TYPE.YAAN;

var AppCnName = {};
AppCnName[MjClient.APP_TYPE.YAAN] = "天涯互娱";

var AppEnv = {};
AppEnv[MjClient.APP_TYPE.YAAN] = "chengdu-dev";

//活动类型
//0文字，1图片，2认证有礼，3投诉建议，4开房奖元宝，5对战奖元宝,6月充值回馈,7元宝兑换钻石额度,8双11狂欢活动
MjClient.ACTIVITY_TYPE = {
    WEN_ZI: 0,
    TU_PIAN: 1,
    REN_ZHENG: 2,
    JIAN_YI: 3,
    KAI_FANG: 4,
    DUI_ZHAN: 5,
    MONTH_RECHARGE: 6,
    YUANBAO_DUIHUAN_ZUANSHI: 7,
    DOUBLE_11: 8,
    SCREEN_TIME: 9,//防沉迷公告
};

//活动里的跳转类型
//0无，1跳转商城，2跳转网页外部浏览器，3分享, 4内部浏览器, 5比赛场，6请求后台后再打开网页
MjClient.ACTIVITY_ACTION_TYPE = {
    NONE: 0,
    SHANG_CHENG: 1,
    WEB_VIEW: 2,
    FEN_XIANG: 3,
    WEB_VIEW_INSIDE: 4,
    BI_SAI: 5,
    OPEN_BROWSER: 6,
    OPEN_ZHIFUBAO_HONGBAO: 7
};



//运营功能活动
MjClient.FUNCTION_CONFIG_TYPE = {
    JIA_YOU_HONG_BAO: "JIA_YOU_HONG_BAO", //加油红包
    JI_FEN_SHANG_CHENG: "JI_FEN_SHANG_CHENG", //积分商城
    ZHUA_ZHUA_LE: "ZHUA_ZHUA_LE", //全民抓抓乐
    QIAN_DAO_YOU_LI: "QIAN_DAO_YOU_LI", //签到有礼
    DA_ZHUAN_PAN: "DA_ZHUAN_PAN", //幸运大转盘
    ZA_JIN_DAN: "ZA_JIN_DAN", //欢乐砸金蛋
    ZHONG_JIN_ZHAO_MU: "ZHONG_JIN_ZHAO_MU", //重金招募
    CAI_SHEN: "CAI_SHEN", //财神活动
    CHONG_ZHI_YOU_LI: "CHONG_ZHI_YOU_LI", //充值有礼
    JU_LE_BU_FU_LI: "JU_LE_BU_FU_LI", //亲友圈福利
    XIN_REN_FU_LI: "XIN_REN_FU_LI", //新人福利
    XIN_SHOU_LI_BAO: "XIN_SHOU_LI_BAO", //新手礼包
    SAI_LONG_ZHOU: "SAI_LONG_ZHOU", //赛龙舟
    BANG_DING_SHOU_JI: "BANG_DING_SHOU_JI", //绑定手机
    YAO_QING_HONG_BAO: "YAO_QING_HONG_BAO", //邀请红包
    DA_TING_FEN_XIANG: "DA_TING_FEN_XIANG", //大厅分享
    FRIENDS_PK: "FRIENDS_PK", //朋友圈对战
    SHI_MING_REN_ZHENG: "SHI_MING_REN_ZHENG", //实名认证
    ACTIVE_RANK: "ACTIVE_RANK", //排行榜活动
    MIAN_FEI_LI_QUAN: "MIAN_FEI_LI_QUAN", //免费礼券
    QIAN_DAO_CHOU_JIANG: "QIAN_DAO_CHOU_JIANG", //签到抽奖
    ZHONG_QIU_JIE_YONGZHOU: "ZHONG_QIU_JIE_YONGZHOU",//永州中秋节策划方案
    ZHONG_QIU_JIE_88_YUAN: "ZHONG_QIU_JIE_88_YUAN", //中秋节88元红包
    ZHONG_QIU_JIE_RANK: "ZHONG_QIU_JIE_RANK",// 中秋排行榜
    JIN_BI_CHANG_HUO_DONG: "JIN_BI_CHANG_HUO_DONG",//金币场活动
    JIN_BI_CHANG_HUO_DONG_2: "JIN_BI_CHANG_HUO_DONG_2", //金币场活动2 连胜7局
    MEI_RI_REN_WU: "MEI_RI_REN_WU",//每日任务（红包）
    GOLD_YAO_QING_HONG_BAO: "GOLD_YAO_QING_HONG_BAO",//金币场邀请红包
    LI_CAI_BAO_XIANG: "LI_CAI_BAO_XIANG", //理财宝箱
    CHUAN_QI_LAI_LE: "CHUAN_QI_LAI_LE", //传奇来了弹窗
    JIN_BI_CHANG_HONG_BAO_2019: "JIN_BI_CHANG_HONG_BAO_2019",//2019新年金币场红包
    CHUN_JIE_CHOU_QIAN: "CHUN_JIE_CHOU_QIAN",//春节抽签活动
    FRIENDS_PK_NEW: "FRIENDS_PK_NEW", //新朋友圈对战
    FLY_A_KITE: "FLY_A_KITE", //清明放风筝
    COLLECT_SPRING_BEAN: "COLLECT_SPRING_BEAN",//五一集春豆
    ACTIVITY_CLUB_MONTH: "ACTIVITY_CLUB_MONTH",//场次增长
    ER_REN_RANK: "ER_REN_RANK",//二人排行榜
    CLUB_COST_ACTIVITY: "CLUB_COST_ACTIVITY",//亲友圈元宝消耗活动(新版)
    ACTIVITY_DOUBLE_11: "ACTIVITY_DOUBLE_11",//双11活动
    LI_CAI_BAO_XIANG_ZS: "LI_CAI_BAO_XIANG_ZS", //钻石宝箱
};

MjClient.isOpentFunctionType = function (funcType) {
    var openFuncs = MjClient.systemConfig.functionConfig;
    if (!openFuncs || typeof (openFuncs) == 'undefined' || openFuncs.length == 0) {
        // cc.log('warn 没有配置 MjClient.systemConfig.functionConfig');
        return false;
    }

    var allFuncs = MjClient.FUNCTION_CONFIG_TYPE;
    for (var i in allFuncs) {
        if (allFuncs[i] == funcType && openFuncs && openFuncs.indexOf(funcType) >= 0) {
            return true;
        }
    }

    return false;
}


//游戏大类型
MjClient.GAME_CLASS = {
    MA_JIANG: 0, //麻将
    NIU_NIU: 1, //牛牛
    GUAN_DAN: 2, //掼蛋
    PAO_HU_ZI: 3, //跑胡子
    CHANG_PAI: 4, //长牌
    PAO_DE_KUAI: 5, //跑得快
    DOU_DI_ZHU: 6, //斗地主
    SAN_DA_HA: 7, // 三打哈
    DA_QI: 8, //打七
    BAN_BIAN_TIAN_ZHA: 9,   //半边天炸
    NIU_SHI_BIE: 11,  // 牛十别
    DA_ZHA_DAN: 12,    //打炸弹
    QIAN_FEN: 13,  //沅江千分
    DA_MA_ZI: 14,  //打码子
    DA_TONG_ZI: 15,   //打筒子
    BA_ZHA_DAN: 16,   //霸炸弹
    GAN_DENG_YAN: 17,  //干瞪眼
    POKER: 18   //扑克
};

//资源分类类型（需要添加类型请找毛羽）
MjClient.RESOURCE_CLASS = {
    MA_JIANG: 1, //麻将
    ZI_PAI: 2, //字牌
    POKER: 3,//扑克
    PAO_DE_KUAI: 4, //跑得快和斗地主
    CHANG_PAI: 5, //长牌

    GOLD_FIELD: 1001 //金币场
};

MjClient.windowUpdate = false;
MjClient.RESOURCE_DIR = [];
if (cc.sys.OS_WINDOWS != cc.sys.os || MjClient.windowUpdate) {
    MjClient.RESOURCE_DIR[0] = "update/res";
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.MA_JIANG] = "update/res_majiang"; //麻将
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.ZI_PAI] = "update/res_zipai"; //字牌
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.POKER] = "update/res_poker"; //扑克
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.PAO_DE_KUAI] = "update/res_paodekuai"; //跑得快
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.GOLD_FIELD] = "update/res_goldField"; //金币场
} else {
    MjClient.RESOURCE_DIR[0] = "res";
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.MA_JIANG] = "res_majiang"; //麻将
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.ZI_PAI] = "res_zipai"; //字牌
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.POKER] = "res_poker"; //扑克
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.PAO_DE_KUAI] = "res_paodekuai"; //跑得快
    MjClient.RESOURCE_DIR[MjClient.RESOURCE_CLASS.GOLD_FIELD] = "res_goldField"; //金币场
}


//地区
MjClient.GAME_TYPE = {
    YA_AN_MAHJONG: 2019272, //雅安麻将
    RED_20_POKER: 2019273, //红20
    XUE_ZHAN_MAHJONG: 2019274, //血战
    PAO_DE_KUAI_YAAN: 2019275, //雅安跑得快
    XUE_ZHAN_3to2: 2019276, //血战
    XUE_ZHAN_2to2: 2019277, //血战
    XUE_ZHAN_2to1: 2019278, //血战
    XUE_ZHAN_3to3: 2019279, //血战
    SI_CHUAN_NEW_RUNFASTER: 2019280, //跑得快 16
    SI_CHUAN_NEW_RUNFASTER1: 2019281, //新跑得快 15
};

//玩法
MjClient.PLAY_TYPE = {
    PIAO_HU: 1, //飘胡
    DIAN_PAO_HU: 2, //点炮胡
    ZI_MO_HU: 3, //自摸胡
    QI_XIAO_DUI: 4, //七小对
    SHI_SAN_YAO: 5, //十三幺
    QING_YI_SE: 14, //清一色
};


//带花类型
var WithFlowerType = {
    noFlower: 0, //无花
    commonFlower: 1, //普通花，春夏秋冬，梅兰竹菊
    zfbFlower: 2, //中发白作花

    // 灌云玩法
    zFlower4: 3, //中作花 4张
    dnxbzFlower20: 4, //东南西北中作花 20张
    dnxbzfbFlower28: 5, //东南西北中发白作花 28张

    // 淮安团团转麻将玩法
    flower4: 6, // 春夏秋冬
    flower8: 7, // 春夏秋冬,梅兰竹菊
};

// 听牌类型
var TingCardType = {
    noTing: 0, //不可以听牌
    commonTing: 1, //普通听牌
    tingZiMo: 2, //听牌后其他三家都自摸
};

// 麻将游戏状态
var TableState = {
    waitJoin: 1,
    waitReady: 2,
    waitPut: 3,
    waitEat: 4,
    waitCard: 5,
    roundFinish: 6,
    isReady: 7,
    waitJiazhu: 8, //每局发牌前等待加注
    waitDingZhuang: 9,
    waitLong: 10, //每局发牌前龙操作
    waitJiaoFen: 11, // 三打哈叫分
    waitJiaoZhu: 12, // 三打哈叫主
    waitMaiPai: 13, // 三打哈埋牌
    waitKouDi: 14, // 三打哈扣底
    waitWang: 15, // 选择王牌
    afterReady: 16, // 准备后状态 (用于处理准备后发片前的逻辑)
    waitShuffle: 17,       // 洗牌
    waitChooseCard: 18, //忻州三打二选择朋友
    waitSelect: 19, // 等待玩家操作
    waitBao: 20, // 等待选择包牌 (打炸弹)
    waitTouXiang: 21, // 等待投降确认（打码子）
    waitBaoXi: 22,       //打码子报喜阶段
    isBaoXi: 23,         //打码子已报喜
    waitBaoTing: 24,    // 等待报听(贵州闷胡血流)
    waitHuanPai: 25,    // 换牌状态(湖北宜昌血流成河)
    waitPuPai: 26,      // 扑牌状态(湖北宜昌血流成河)
    waitVieGuan: 27,      // 等待抢关
    waitLiangCard: 28,  // 等待亮牌：湖北黄石晃晃麻将
};

MjClient.getAppType = function () {
    var appType = cc.game.config["appType"];
    if (cc.isUndefined(appType)) {
        for (var key in PackageName2AppType) {
            var preKey = key.replace(/\*/g, "");
            var substrPackageName = MjClient.native.GetPackageName().substring(0, preKey.length);
            if (preKey == substrPackageName) {
                appType = PackageName2AppType[key];
                return appType;
            }
        }
        appType = PackageName2AppType[MjClient.native.GetPackageName()];
    }
    return appType;
};

MjClient.IsTst = cc.game.config["dev"];

MjClient.fzcyfont = "fonts/fzcy.ttf"  //"fonts/lanting.TTF";
/*
    扑克牌 定义
 */
MjClient.CARD_JOKER_TYPE = {
    SMALL: 0,
    BIG: 1,
}

MjClient.CARD_FLOWER_TYPE = {
    HEI_TAO: 0,
    FANG_KUAI: 1,
    MEI_HUA: 2,
    HONG_TAO: 3,
}


if (MjClient.IsTst) {
    //测试地址
    var ossUrl = 'http://test-project-0.oss-cn-hangzhou.aliyuncs.com'
    var GameDownloadCfgUrl = {};//http://121.199.14.235:9990/update/jiangshu/configuration.json
    GameDownloadCfgUrl[MjClient.APP_TYPE.YAAN] = ossUrl + "/update/yaan-dev/";
} else {
    var ossUrl = 'http://project-update-oss.oss-cn-hangzhou.aliyuncs.com'
    var GameDownloadCfgUrl = {};//http://8.139.5.7:9990/update/jiangshu/configuration.json
    GameDownloadCfgUrl[MjClient.APP_TYPE.YAAN] = ossUrl + "/update/chengdu-dev/";
}



if (typeof (h5) != 'undefined' && h5.nativeHelper.isWeb()) h5.nativeHelper.changeGameDownloadCfgUrl(GameDownloadCfgUrl);


var GameClassEnterBtn = {};
GameClassEnterBtn[MjClient.GAME_CLASS.MA_JIANG] = "hall/MJ.png";
GameClassEnterBtn[MjClient.GAME_CLASS.NIU_NIU] = "hall/niuniu.png";
GameClassEnterBtn[MjClient.GAME_CLASS.GUAN_DAN] = "hall/guandan.png";
GameClassEnterBtn[MjClient.GAME_CLASS.PAO_HU_ZI] = "hall/paohuzi.png";
GameClassEnterBtn[MjClient.GAME_CLASS.CHANG_PAI] = "hall/changpai.png";
GameClassEnterBtn[MjClient.GAME_CLASS.PAO_DE_KUAI] = "hall/paodekuai.png";
GameClassEnterBtn[MjClient.GAME_CLASS.DOU_DI_ZHU] = "hall/doudizhu.png";
GameClassEnterBtn[MjClient.GAME_CLASS.NIU_SHI_BIE] = "hall/niushibie.png";
GameClassEnterBtn[MjClient.GAME_CLASS.DA_MA_ZI] = "hall/niushibie.png";

var JoinRoomBtn = {};
JoinRoomBtn[MjClient.GAME_CLASS.MA_JIANG] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.NIU_NIU] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.GUAN_DAN] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.PAO_HU_ZI] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.CHANG_PAI] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.PAO_DE_KUAI] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.DOU_DI_ZHU] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.NIU_SHI_BIE] = "joinGame/haoyouchang.png";
JoinRoomBtn[MjClient.GAME_CLASS.DA_MA_ZI] = "joinGame/haoyouchang.png";

var CreateRoomBtn = {};
CreateRoomBtn[MjClient.GAME_CLASS.MA_JIANG] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.NIU_NIU] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.GUAN_DAN] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.PAO_HU_ZI] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.CHANG_PAI] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.PAO_DE_KUAI] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.DOU_DI_ZHU] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.NIU_SHI_BIE] = "joinGame/bisaichang.png";
CreateRoomBtn[MjClient.GAME_CLASS.DA_MA_ZI] = "joinGame/bisaichang.png";


var GameClassTitleIcon = {};
GameClassTitleIcon[MjClient.GAME_CLASS.MA_JIANG] = "hall/MJ-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.NIU_NIU] = "hall/NN-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.GUAN_DAN] = "hall/guandan-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.PAO_HU_ZI] = "hall/paohuzi-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.CHANG_PAI] = "hall/changpai-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.PAO_DE_KUAI] = "hall/paodekuai-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.DOU_DI_ZHU] = "hall/doudizhu-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.NIU_SHI_BIE] = "hall/niushibie-biao.png";
GameClassTitleIcon[MjClient.GAME_CLASS.DA_MA_ZI] = "hall/niushibie-biao.png";

var GameClassSettingJson = {};
GameClassSettingJson[MjClient.GAME_CLASS.PAO_DE_KUAI] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.DOU_DI_ZHU] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.SAN_DA_HA] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.PAO_HU_ZI] = "setting_HongZi.json";
GameClassSettingJson[MjClient.GAME_CLASS.DA_QI] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.MA_JIANG] = "setting_MJPlaying.json";
GameClassSettingJson[MjClient.GAME_CLASS.DA_TONG_ZI] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.BA_ZHA_DAN] = "setting_poker.json";
GameClassSettingJson[MjClient.GAME_CLASS.BAN_BIAN_TIAN_ZHA] = "setting_poker.json";


var GameTypeList = {};
GameTypeList[MjClient.GAME_CLASS.MA_JIANG] = function () { return MjClient.gameListConfig.majiangList; };
GameTypeList[MjClient.GAME_CLASS.NIU_NIU] = function () { return MjClient.gameListConfig.niuniuList; };
GameTypeList[MjClient.GAME_CLASS.GUAN_DAN] = function () { return MjClient.gameListConfig.guandanList; };
GameTypeList[MjClient.GAME_CLASS.PAO_HU_ZI] = function () { return MjClient.gameListConfig.paohuziList; };
GameTypeList[MjClient.GAME_CLASS.CHANG_PAI] = function () { return MjClient.gameListConfig.changpaiList; };
GameTypeList[MjClient.GAME_CLASS.PAO_DE_KUAI] = function () { return MjClient.gameListConfig.paodekuaiList; };
GameTypeList[MjClient.GAME_CLASS.DOU_DI_ZHU] = function () { return MjClient.gameListConfig.doudizhulist; };
GameTypeList[MjClient.GAME_CLASS.NIU_SHI_BIE] = function () { return MjClient.gameListConfig.niushibieList; };
GameTypeList[MjClient.GAME_CLASS.DA_MA_ZI] = function () { return MjClient.gameListConfig.damaziList; };
GameTypeList[MjClient.GAME_CLASS.POKER] = function () { return MjClient.gameListConfig.pokerList; };


var GameCnName = {};
GameCnName[MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN] = "跑得快";
GameCnName[MjClient.GAME_TYPE.RED_20_POKER] = "红20";
GameCnName[MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG] = "血战到底";
GameCnName[MjClient.GAME_TYPE.XUE_ZHAN_3to3] = "三人三房";
GameCnName[MjClient.GAME_TYPE.XUE_ZHAN_3to2] = "三人两房";
GameCnName[MjClient.GAME_TYPE.XUE_ZHAN_2to2] = "二人两房";
GameCnName[MjClient.GAME_TYPE.XUE_ZHAN_2to1] = "二人一房";
GameCnName[MjClient.GAME_TYPE.YA_AN_MAHJONG] = "雅安麻将";
GameCnName[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER] = "跑得快(16)";
GameCnName[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER1] = "跑得快(15)";

var GameClass = {};
GameClass[MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG] = MjClient.GAME_CLASS.MA_JIANG;
GameClass[MjClient.GAME_TYPE.XUE_ZHAN_3to3] = MjClient.GAME_CLASS.MA_JIANG;
GameClass[MjClient.GAME_TYPE.XUE_ZHAN_3to2] = MjClient.GAME_CLASS.MA_JIANG;
GameClass[MjClient.GAME_TYPE.XUE_ZHAN_2to1] = MjClient.GAME_CLASS.MA_JIANG;
GameClass[MjClient.GAME_TYPE.XUE_ZHAN_2to2] = MjClient.GAME_CLASS.MA_JIANG;
GameClass[MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN] = MjClient.GAME_CLASS.PAO_DE_KUAI;
GameClass[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER] = MjClient.GAME_CLASS.PAO_DE_KUAI;
GameClass[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER1] = MjClient.GAME_CLASS.PAO_DE_KUAI;

//游戏大类型到资源分类的映射
var ResourceClass = {};
ResourceClass[MjClient.GAME_CLASS.MA_JIANG] = MjClient.RESOURCE_CLASS.MA_JIANG;
ResourceClass[MjClient.GAME_CLASS.NIU_NIU] = MjClient.RESOURCE_CLASS.MA_JIANG;
ResourceClass[MjClient.GAME_CLASS.GUAN_DAN] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.PAO_HU_ZI] = MjClient.RESOURCE_CLASS.ZI_PAI;
ResourceClass[MjClient.GAME_CLASS.CHANG_PAI] = MjClient.RESOURCE_CLASS.CHANG_PAI;
ResourceClass[MjClient.GAME_CLASS.PAO_DE_KUAI] = MjClient.RESOURCE_CLASS.PAO_DE_KUAI;
ResourceClass[MjClient.GAME_CLASS.DOU_DI_ZHU] = MjClient.RESOURCE_CLASS.PAO_DE_KUAI;
ResourceClass[MjClient.GAME_CLASS.SAN_DA_HA] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.DA_QI] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.NIU_SHI_BIE] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.DA_ZHA_DAN] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.DA_MA_ZI] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.GAME_CLASS.QIAN_FEN] = MjClient.RESOURCE_CLASS.POKER;
ResourceClass[MjClient.RESOURCE_CLASS.GOLD_FIELD] = MjClient.RESOURCE_CLASS.GOLD_FIELD;


var GameBg = {};
// GameBg[MjClient.GAME_TYPE.QI_CHUN_HONG_ZHONG_GANG] = "playing/gameTable/game_qiChunHongZhongGang.png";

const HelpUrls = 'http://8.139.5.7:9993/protocol/tips/'
var GameHelpUrl = {};
GameHelpUrl[MjClient.GAME_TYPE.RED_20_POKER] = HelpUrls + "helpRed20/helpRed20.html";
GameHelpUrl[MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN] = HelpUrls + "helpRunFasterYa/helpRunFasterYa.html";
GameHelpUrl[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER] = HelpUrls + "helpRunFasterYa/helpRunFasterYa.html";
GameHelpUrl[MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER1] = HelpUrls + "helpRunFasterYa/helpRunFasterYa.html";
GameHelpUrl[MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG] = HelpUrls + "helpXueZhanDaodi/helpXueZhanDaodi.html";
GameHelpUrl[MjClient.GAME_TYPE.XUE_ZHAN_3to3] = HelpUrls + "helpXueZhanDaodi/helpXueZhanDaodi33.html";
GameHelpUrl[MjClient.GAME_TYPE.XUE_ZHAN_3to2] = HelpUrls + "helpXueZhanDaodi/helpXueZhanDaodi32.html";
GameHelpUrl[MjClient.GAME_TYPE.XUE_ZHAN_2to2] = HelpUrls + "helpXueZhanDaodi/helpXueZhanDaodi22.html";
GameHelpUrl[MjClient.GAME_TYPE.XUE_ZHAN_2to1] = HelpUrls + "helpXueZhanDaodi/helpXueZhanDaodi21.html";

var GameButton = {};
// GameButton[MjClient.GAME_TYPE.EN_SHI_SHAO_HU] = "createNewPng/enShiShaoHu";

var pkGameButton = {};
// pkGameButton[MjClient.GAME_TYPE.EN_SHI_SHAO_HU] = "playground/shuyang";

var GameSound4Chat = {};
GameSound4Chat[MjClient.GAME_TYPE.TONG_SHAN_HH_MJ] = ["normal/fix_msg/nv/fix_msg_"];

var GameSound4Play = {};
GameSound4Play["normal"] = {
    1: ["normal/nv/1"],
    2: ["normal/nv/2"],
    3: ["normal/nv/3"],
    4: ["normal/nv/4"],
    5: ["normal/nv/5"],
    6: ["normal/nv/6"],
    7: ["normal/nv/7"],
    8: ["normal/nv/8"],
    9: ["normal/nv/9"],
    11: ["normal/nv/11"],
    12: ["normal/nv/12"],
    13: ["normal/nv/13"],
    14: ["normal/nv/14"],
    15: ["normal/nv/15"],
    16: ["normal/nv/16"],
    17: ["normal/nv/17"],
    18: ["normal/nv/18"],
    19: ["normal/nv/19"],
    21: ["normal/nv/21"],
    22: ["normal/nv/22"],
    23: ["normal/nv/23"],
    24: ["normal/nv/24"],
    25: ["normal/nv/25"],
    26: ["normal/nv/26"],
    27: ["normal/nv/27"],
    28: ["normal/nv/28"],
    29: ["normal/nv/29"],
    31: ["normal/nv/31"],
    41: ["normal/nv/41"],
    51: ["normal/nv/51"],
    61: ["normal/nv/61"],
    71: ["normal/nv/71"],
    81: ["normal/nv/81"],
    91: ["normal/nv/91"],
    anGang: ["normal/nv/gang"],
    kaiGang: ["normal/nv/gang"],
    chi: ["normal/nv/chi"],
    fangpao: ["normal/nv/fangpao"],
    flower: ["normal/nv/flower"],
    gang: ["normal/nv/gang"],
    gangshangkaihua: ["normal/nv/gangshangkaihua"],
    hu: ["normal/nv/hu"],
    peng: ["normal/nv/peng"],
    ting: ["normal/nv/ting"],
    zimo: ["normal/nv/zimo"],
    long: ["normal/nv/long"],
    shangjin: ["normal/nv/shangjin"],
    qinghu: ["normal/nv/qinghu"],
    quanhun: ["normal/nv/quanhun"],
    jiabei: ["normal/nv/jiabei"],
    bujiabei: ["normal/nv/bujiabei"]
};

var PayPlatformType = {
    WEIXIN: 1,
    ALIPAY: 2,
    WEIXIN_WEB: 3,
    ALIPAY_WEB: 4,
    WEIXIN_GZH_XY: 5, // 鑫燕泰杨公众号
    ALIPAY_WEB_XY: 6, // 鑫燕泰阳支付宝
    WEIXIN_GZH: 8, // 连连微信公众号支付
    IAPPPAY: 33,    // 原来是 3 （现在不用了，代码保留，要使用时需和后端确认值）
    PINGPLUSPLUS: 44, // 原来是 4 （现在不用了，代码保留，要使用时需和后端确认值）
    APPLE: 55, // 原来是 5 （现在不用了，代码保留，要使用时需和后端确认值）
};


var SharePlatformType = {
    WEIXIN: 1,
    WEIXIN_PYQ: 2,
    XIANLIAO: 3,
    ALIPAY: 4,
    DINGTALK: 5,
    QQ: 6,
    CHUINIU: 7,
    XIANGLIAO: 8,
    MOWANG: 9,
    DUOLIAO: 10
};


var ChangeLocationAppList = [
    { package: "com.wechatanywhere", name: "位置伪装" },
    { package: "com.godinsec.godinsec_private_space", name: "X分身" },
    { package: "com.wifi99.android.locationcheater", name: "位置修改器" },
    { package: "io.xudwoftencentmm", name: "虚拟定位精灵" },
    { package: "com.yy.monidingwei", name: "定位修改器" },
    { package: "com.changelocation", name: "定位修改" },
    { package: "com.rong.xposed.fakelocation", name: "模拟定位" },
    { package: "com.kollway.android.mocklocation", name: "虚拟定位穿越版" },
    { package: "com.virtualdroid.loc", name: "定位模拟器" },
    { package: "com.felix.mocklocation", name: "定位精灵" },
    { package: "io.xndwofmmtt", name: "社交虚拟定位" },
    { package: "com.wechathelper", name: "定位助手" },
    { package: "com.hawkmobile.locationmonitor", name: "微定位" },
    { package: "net.anylocation.ultra", name: "快定-虚拟定位" },
    { package: "com.map.pamap", name: "专业手机定位" },
    { package: "net.superal", name: "超级神行者" },
    { package: "com.finger.location", name: "定位精灵" },
    { package: "com.dracrays.fakelocc", name: "微商定营销定位加人" },
    { package: "com.xiaoya.xndw", name: "虚拟定位打卡" },
    { package: "com.sadjoke.fake", name: "虚拟定位打卡" },
    { package: "com.xunidingwei.newlocation", name: "手机虚拟定位" },
    { package: "net.anylocation", name: "神行者" },
    { package: "com.through.throughlocation", name: "定位穿越" },
    { package: "com.yunyou", name: "虚拟定位" },
    { package: "bulb.virtual", name: "模拟定位" },
    { package: "com.jtjsb.virtualdwsq", name: "模拟定位神器" },
    { package: "com.jtjsb.xndwsq", name: "虚拟定位助手" },
    { package: "com.txy.anywhere.clone", name: "伪装地理位置" },
    { package: "com.bly.dkplat", name: "多开分身" },
    { package: "com.pho.course", name: "手机定位器" },
    { package: "com.wearable.dingweiqi", name: "北斗定位器" },
    { package: "hk.rhmhpgjh.hmjvks.ptvr", name: "GPS定位手机助手" },
    { package: "com.shidawei.neverdie", name: "专业手机定位" },
    { package: "com.zczm.daka", name: "打卡签到神器" },
    { package: "com.tongfu.gps_normal", name: "定位神器" },
    { package: "com.svm.proteinbox_location", name: "虚拟定位" },
    { package: "bxwhandroid.gps", name: "远程定位" },
    { package: "com.zsapp.gpsposition", name: "GPS定位" },
    { package: "com.huirw.vlmaster", name: "定位大师" },
    { package: "com.kuci.gpspicker", name: "极光GPS定位" },
    { package: "com.yeung.fakegps", name: "伪装位置" },
    { package: "com.huichongzi.locationmocker", name: "位置伪装大师" },
    { package: "com.dehui.qsjpq", name: "轻松记牌器" }
];

// 大厅页面 类型 约牌场   或者是 金币场（娱乐场）
var HallPageTypeList = {
    ALL_TYPE: 0, // 普通 场 大厅界面 和 金币场 都有
    COMMON_TYPE: 1, // 普通 场 大厅界面
    GOLD_TYPE: 2, // 金币场

}



var WXMultiAppID = {};

//贵族表情配置 key = 10000 + aliasId数字
MjClient.GuizuEmojiConfig = {
    "10001": {
        sound: "",
        name: "daxiao",
    },
    "10002": {
        sound: "",
        name: "yihuo",
    },
    "10003": {
        sound: "",
        name: "huaixiao",
    },
    "10004": {
        sound: "",
        name: "yunle",
    },
    "10005": {
        sound: "",
        name: "keshui",
    },
    "10006": {
        sound: "",
        name: "weiqu",
    },
    "10007": {
        sound: "",
        name: "aini",
    },
    "10008": {
        sound: "",
        name: "jingle",
    },
    "10009": {
        sound: "",
        name: "shiluo",
    },
    "10010": {
        sound: "",
        name: "dengchang",
    },
    "10011": {
        sound: "",
        name: "kuaidian",
    },
    "10012": {
        sound: "",
        name: "zhenbang",
    },
    "10013": {
        sound: "",
        name: "dacuopaile",
    },
    "10014": {
        sound: "",
        name: "dalaozaici",
    },
    "10015": {
        sound: "",
        name: "yiqifacai",
    },
    "10016": {
        sound: "",
        name: "haixiu",
    },
    "10017": {
        sound: "",
        name: "shanyaodengchang",
    },
    "10018": {
        sound: "",
        name: "wolaile",
    },
    "10019": {
        sound: "",
        name: "kuaidianba",
    },
    "10020": {
        sound: "",
        name: "anzhongguancha",
    },
    "10021": {
        sound: "",
        name: "ainio",
    },
    "10022": {
        sound: "",
        name: "biepao",
    },
    "10023": {
        sound: "",
        name: "yishoulanpai",
    },
    "10024": {
        sound: "",
        name: "886",
    },
    "10025": {
        sound: "",
        name: "shiliqiangmeibanfa",
    },
    "10026": {
        sound: "",
        name: "daikouzhao",
    },
    "10027": {
        sound: "",
        name: "qinxishou",
    },
}

//贵族互动配置 key = 10000 + aliasId数字
MjClient.GuizuHDDJConfig = {
    "10001": {
        sound: "",
        name: "xueqiu",
    },
    "10002": {
        sound: "",
        name: "pingdiguo",
    },
    "10003": {
        sound: "",
        name: "rengpingzi",
    },
    "10004": {
        sound: "",
        name: "tuoxie",
    },
    "10005": {
        sound: "",
        name: "hongbao",
    },
    "10006": {
        sound: "",
        name: "fanqie10",
    },
    "10007": {
        sound: "",
        name: "huanggua",
    },
    "10008": {
        sound: "",
        name: "zuanjie10",
    },
    "10009": {
        sound: "",
        name: "chuizi",
    },
    "10010": {
        sound: "",
        name: "jiubei",
    },
    "10011": {
        sound: "",
        name: "dangao",
    },
    "10012": {
        sound: "",
        name: "jidan10",
    },
    "10013": {
        sound: "",
        name: "jiguanqiang",
    },
    "10014": {
        sound: "",
        name: "qinwen",
    },
    "10015": {
        sound: "",
        name: "banzhuan",
    },
    "10016": {
        sound: "",
        name: "banzhuan10",
    },
    "10017": {
        sound: "",
        name: "zhuaji",
    },
    "10018": {
        sound: "",
        name: "zhuaji10",
    },
    "10019": {
        sound: "",
        name: "kouzhao",
    },
    "10020": {
        sound: "",
        name: "zhusheqi",
    },
}

MjClient.rePlayVideo = -1;
MjClient.NetMsgQueue = [];
MjClient.clickTing = false; //客户端缓存的点击了“听”，但是还没请求后端。（沭阳）
MjClient.reconnectFailedCount = util.localStorageEncrypt.getNumberItem("reconnectFailedCount", 0);
MjClient.isShenhe = false; //软著审核

if (!cc.sys.isNative) {

    if (typeof (jsb) == 'undefined') {
        jsb = {}
        jsb.fileUtils = {}
        jsb.fileUtils.getWritablePath = function () {
            return GameDownloadCfgUrl[MjClient.getAppType()]
        }

        jsb.fileUtils.isFileExist = function () {
            return true;
        }

    }
}


MjClient.block = function () {
    if (!cc.sys.isObjectValid(MjClient.blockui)) {
        MjClient.Scene.addChild(new BlockView());
    }
    MjClient.blockui.zIndex = 1000;

    //岳阳3.0皮肤
    var bUserUIv3 = MjClient.isUseUIv3 && MjClient.isUseUIv3() && MjClient.isFriendCardUseUIv3();
    bUserUIv3 = MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ ? true : bUserUIv3;
    if (bUserUIv3) {
        if (cc.sys.isObjectValid(MjClient.blockui.jsBind.loading._node)) {
            MjClient.blockui.jsBind.loading._node.visible = false;
        }

        var spine = MjClient.blockui.getChildByName("loadingSpine");
        if (!spine) {
            var spine = createSpine("loading_3.0/zhuan.json", "loading_3.0/zhuan.atlas");
            spine.setName("loadingSpine");
            MjClient.blockui.addChild(spine);
            spine.setPosition(cc.p(MjClient.blockui.width / 2, MjClient.blockui.height / 2));
            spine.setScale(cc.winSize.width / 1280 * 0.5);
        }
        spine.visible = false;
        spine.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            spine.visible = true;
            if (cc.sys.isObjectValid(MjClient.blockui.jsBind.block._node)) {
                MjClient.blockui.jsBind.block._node.setBackGroundColor(cc.color(0, 0, 0));
                MjClient.blockui.jsBind.block._node.setOpacity(100);
            }
        })));
        spine.setAnimation(0, "animation", true);
        return;
    }


    if (cc.sys.isObjectValid(MjClient.blockui.jsBind.loading._node)) {
        MjClient.blockui.jsBind.loading._node.stopActionByTag(20180516);
        MjClient.blockui.jsBind.loading._node.visible = false;
        var action = cc.sequence(cc.delayTime(2), cc.show());
        action.setTag(20180516);
        MjClient.blockui.jsBind.loading._node.runAction(action);
    }
};


MjClient.unblock = function () {
    if (cc.sys.isObjectValid(MjClient.blockui)) {
        if (cc.sys.isObjectValid(MjClient.blockui.jsBind.loading._node)) {
            MjClient.blockui.jsBind.loading._node.stopActionByTag(20180516);
        }
        MjClient.blockui.zIndex = -1000;
        MjClient.blockui.removeFromParent();
        MjClient.blockui = null;
    }
};


MjClient.getCurrentTime = function (date) {
    var now = date ? date : new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒

    return [year, month, day, hh, mm, ss];
};

MjClient.dateFormat = function (date, format) {
    var millisecond = date.getMilliseconds();
    if (millisecond < 100) {
        millisecond = '0' + millisecond;
    } else if (millisecond < 10) {
        millisecond = '00' + millisecond;
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S+': millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};


MjClient.dateInRectDate = function (myTime, startTime, endTime) {
    if (!myTime || !startTime || !endTime) return;
    var makeNum = function (array) {
        var num = 0;
        for (var i = 0; i < array.length; i++) {
            num += array[i] * Math.pow(10, (10 - i * 2));
        }
        return num;
    };

    var myTime_Num = makeNum(myTime);
    var startTime_Num = makeNum(startTime);
    var endTime_Num = makeNum(endTime);
    return (myTime_Num >= startTime_Num && myTime_Num <= endTime_Num);
};



MjClient.loadWxHead = function (uid, url) {
    let frame = cc.spriteFrameCache.getSpriteFrame(url ? url : 'A_Common/HeadImgs/head_228.jpg');
    frame && MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: uid, img: frame }]);
};


MjClient.isGameClassAvailable = function (gameClass) {
    var result = false;
    if (MjClient.systemConfig.gameClass) {
        var _gameClassList = JSON.parse(MjClient.systemConfig.gameClass);
        for (var i = 0; i < _gameClassList.length; i++) {
            if (_gameClassList[i] == gameClass) {
                result = true;
                break;
            }
        }
    } else {
        result = true;
    }
    return result;
};


MjClient.getPlayerByIndex = function (idx) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    if (idx < uids.length) return sData.players[uids[idx]];
    return null;
};



MjClient.AllPlayerRun = function (func) {
    var sData = this.data.sData;
    for (var playerId in sData.players) {
        var pl = sData.players[playerId];
        // cc.log("playerId :" + playerId);
        func(pl);
    }
};



MjClient.CheckPlayerCount = function (func) {
    var count = 0;
    var sData = this.data.sData;
    for (var playerId in sData.players) {
        var pl = sData.players[playerId];
        // cc.log("playerId :" + playerId);
        if (func(pl)) {
            count++;
        }
    }
    return count;
};

MjClient.showPlayerInfo = function (info, canEditSignature, showMoney) {
    MjClient.uiPara = info;
    if (MjClient.isInGoldField() && typeof (GoldUserInfoLayer) != "undefined") {
        MjClient.Scene.addChild(new GoldUserInfoLayer(info, null));
    } else {
        MjClient.Scene.addChild(new PlayerInfoView(info, canEditSignature, showMoney));
    }
};

MjClient.showPlayerInfoBind = function (info, canEditSignature, showMoney) {
    MjClient.uiPara = info;
    MjClient.Scene.addChild(new PlayerInfoBindView(info, canEditSignature, showMoney));
};

/*
    游戏内的弹窗个人信息
 */
MjClient.showPlayerInfoPlaying = function (info) {
    MjClient.uiPara = info;
    var callback = function (idx) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "MJFight", uid: SelfUid(), targetUid: info.uid, kind: idx });
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Gerenzhuye_Fasongdaoju", { uid: SelfUid() });
    }
    if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP) {
        callback = function (idx) {
            MjClient.gamenet.request("pkplayer.handler.useInteractiveProp", { cmd: "MJFight", uid: SelfUid(), targetUid: info.uid, kind: idx }, function (rtn) {
                if (rtn.code == -1) {
                    MjClient.showToast(rtn.message);
                }
            });
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Gerenzhuye_Fasongdaoju", { uid: SelfUid() });
        }
    }
    var infoLayer;
    if (MjClient.isInGoldField() && typeof (GoldUserInfoLayer) != "undefined") {
        infoLayer = new GoldUserInfoLayer(info, callback);
    } else {
        if ((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
            && info.uid != MjClient.data.pinfo.uid) {
            infoLayer = new PlayerInfoViewPlayingOther(info, callback);
        } else {
            infoLayer = new PlayerInfoViewPlaying(info, callback);
        }
    }

    MjClient.Scene.addChild(infoLayer);
};

MjClient.restartGame = function () {
    stopEffect(playTimeUpEff);
    playTimeUpEff = null;
    if (MjClient.gamenet) MjClient.gamenet.disconnect();
    //postEvent("restartGame");
    cc.game.restart(); //等永州工程确认没问题了再修改
};

MjClient.exportDataLayer = function () {
    if (!ExportDataView) { return; }
    if (!MjClient.exportdataui) {
        MjClient.Scene.addChild(new ExportDataView());
    }
};


// typeof(null) 是"object" 的类型 ，marked by sking
MjClient.deepClone = function (sObj) {
    if (typeof (sObj) !== "object") {
        return sObj;
    }

    if (!sObj) return sObj;

    var s = {};
    if (sObj.constructor == Array) {
        s = [];
    }


    for (var i in sObj) {
        s[i] = MjClient.deepClone(sObj[i]); //Object.clone(sObj[i]);
    }
    return s;
};



MjClient.leaveGame = function (callback) {
    MjClient._lastTableId = "";
    util.localStorageEncrypt.setStringItem("_lastTableId", (MjClient._lastTableId + ""));
    var clubInfoTable = getClubInfoInTable();
    if (cc.sys.isObjectValid(MjClient.gemewaitingui)) {
        MjClient.gemewaitingui.removeFromParent();
        delete MjClient.gemewaitingui;
    }

    if (cc.sys.isObjectValid(MjClient.goldMatchingui)) {
        MjClient.goldMatchingui.removeFromParent();
        delete MjClient.goldMatchingui;
    }

    if (cc.sys.isObjectValid(MjClient.playui)) {
        var freeNumberVoteDialog = MjClient.playui.getChildByName("freeNumberVoteDialog");
        if (freeNumberVoteDialog)
            freeNumberVoteDialog.leaveGame();
    }

    MjClient.block();
    MjClient.native.doCopyToPasteBoard(""); //清空剪切板
    MjClient.gamenet.request("pkplayer.handler.LeaveGame", {}, function (rtn) {
        if (rtn.result == 0 || rtn.code == 0) {
            if (clubInfoTable) {
                if (!MjClient.FriendCard_main_ui)
                    MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
            } else if (!MjClient.enterui && !MjClient.FriendCard_main_ui) {
                // if (MjClient.getAppType() != MjClient.APP_TYPE.QXYZQP &&
                //     MjClient.getAppType() != MjClient.APP_TYPE.BDYZPHZ &&
                //     MjClient.getAppType() != MjClient.APP_TYPE.TXJINZHONGMJ &&
                //     MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG &&
                //     MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ) {
                //     MjClient.Scene.addChild(new EnterRoomLayer());
                // }
            }

            delete MjClient.data.sData;
            delete MjClient.gameType;
            postEvent("LeaveGame");
            if (callback)
                callback();
        } else if (rtn.message) {
            MjClient.showMsg(rtn.message);
        }
        MjClient.unblock();
    });

    //else if (!MjClient.enterui
    //    && !MjClient.FriendCard_main_ui
    //    && MjClient.data.sData
    //    && !MjClient.data.sData.tData.matchId){
    //    MjClient.Scene.addChild(new EnterRoomLayer());
    //}

};

MjClient.getPlayLog = function () {
    MjClient.block();
    MjClient.gamenet.request("pkcon.handler.getGameRecord", { uid: SelfUid() }, function (rtn) {
        MjClient.unblock();
        if (rtn.result == 0) {
            MjClient.data.playLog = rtn.playLog;
            MjClient.data.playLog.todayScore = rtn.todayScore;
            postEvent("playLog");
        }
    });
};

MjClient.getPlayLogOne = function (item, failCallback) {
    if (item.ip) {
        var playUrl = item.playbackUrl;
        if (!playUrl) {
            MjClient.showToast("文件已过期，不能回放");
            if (failCallback) failCallback();
            return;
        }

        var dialog = new UnclosedTipLayer("正在获取回放数据，请不要离开游戏");
        MjClient.Scene.addChild(dialog);

        var xhr = cc.loader.getXMLHttpRequest();
        //var playUrl = GamePlaybackUrlPrefix[MjClient.getAppType()] + item.now.substr(0, 10) + "/" + item.owner + "_" + item.tableid + ".json";


        xhr.open("GET", playUrl);
        xhr.onreadystatechange = function () {
            if (cc.sys.isObjectValid(dialog)) dialog.removeFromParent();
            if (xhr.readyState == 4 && xhr.status == 200) {
                var msg = null;
                try {
                    msg = JSON.parse(xhr.responseText);
                } catch (e) {
                    msg = null;
                    if (failCallback) failCallback();
                    MjClient.showToast("文件已过期，不能回放");
                }
                if (msg)
                    MjClient.playLogOne(msg);
            }
        };
        xhr.onerror = function (event) {
            if (cc.sys.isObjectValid(dialog)) dialog.removeFromParent();
            if (failCallback) failCallback();
            MjClient.showToast("网络不好，请稍后再试");
        };
        xhr.ontimeout = function (event) {
            if (cc.sys.isObjectValid(dialog)) dialog.removeFromParent();
            if (failCallback) failCallback();
            MjClient.showToast("网络超时，请稍后再试");
        };
        xhr.onabort = function (event) {
            if (cc.sys.isObjectValid(dialog)) dialog.removeFromParent();
            if (failCallback) failCallback();
            MjClient.showToast("网络请求中断，请稍后再试");
        };
        xhr.timeout = 5000; //5s超时
        xhr.send();
    } else {
        if (failCallback) failCallback();
        MjClient.showMsg("获取回放数据失败(ip缺失)，请联系群主或客服处理");
    }

    //cc.log("=====doomsky say:JSON.stringify(item)======", JSON.stringify(item));
};

MjClient.getOtherPlayLog = function (replayCode) {
    MjClient.block();
    MjClient.gamenet.request("pkcon.handler.getGameRecord", { code: replayCode }, function (ret) {
        MjClient.unblock();
        if (ret.code) {
            MjClient.showToast(ret.message);
        } else if (ret.data) {
            MjClient.rePlayVideo = ret.data.gametype;
            MjClient.otherReplayRound = ret.data.round;
            MjClient.otherReplayUid = ret.data.uid;
            MjClient.getPlayLogOne(ret.data, function () {
                MjClient.rePlayVideo = -1;
                MjClient.otherReplayRound = null;
                MjClient.otherReplayUid = null;
            });
        }
    });
};



MjClient.logout = function () {
    if (cc.sys.os != cc.sys.OS_WINDOWS) {
        if (!MjClient.data.pinfo.mobileNum) {
            MjClient.showToast("切换账号前请先绑定手机号！")
            return;
        }
    }

    MjClient.block();
    MjClient.gamenet.request("pkcon.handler.logout", {}, function () {
        MjClient.unblock();
        MjClient.logoutCallbackFunc();
    });
};

MjClient.logoutCallbackFunc = function () {
    util.localStorageEncrypt.removeItem("WX_USER_LOGIN");
    util.localStorageEncrypt.removeItem("XL_USER_LOGIN");
    util.localStorageEncrypt.removeItem("DL_USER_LOGIN");
    util.localStorageEncrypt.removeItem("MW_USER_LOGIN");
    util.localStorageEncrypt.setBoolItem("loginData_auto", false);
    if (MjClient.gamenet) MjClient.gamenet.disconnect(); //新加，为了支持登录时重新连接服务器
    postEvent("logout");
}




MjClient.joinGame = function (tableid, callback, isByInvite, gameType, notCheckResource, params) {
    if (!params) {
        params = {};
    }
    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui) && !MjClient.playui.visible) {
        //游戏已经开启了
        var backToGameLayer = new BackToGameLayer();
        MjClient.Scene.addChild(backToGameLayer);
        return;
    }
    if (!isStrNotEmpty(gameType) && !notCheckResource) {
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.roomInfo", {
            roomNum: tableid
        }, function (rtn) {
            MjClient.unblock();
            cc.log("pkplayer.handler.roomInfo: ", JSON.stringify(rtn));
            if (rtn.code == 0 && rtn.data) {
                if (rtn.data.info && rtn.data.info.leagueId) {
                    params.leagueId = rtn.data.info.leagueId
                }
                if (rtn.data.info && rtn.data.info.clubId) {
                    params.clubId = rtn.data.info.clubId
                }
                checkResourceAndJoinGame(rtn.data.info.gameType);
            } else {
                var msg = rtn.message;
                if (!msg) {
                    msg = "获取房间号信息失败，请确认房间号是否正确";
                }
                MjClient.showMsg(msg);
            }
        });
    }
    else {
        checkResourceAndJoinGame(gameType);
    }


    function checkResourceAndJoinGame(gameType) {
        if (cc.isUndefined(gameType) && !notCheckResource) {
            MjClient.showMsg("获取房间玩法失败");
            return;
        }

        var checkRescourCallBackFunc = function () {
            MjClient.block();
            MjClient.native.doCopyToPasteBoard(""); //清除剪切板
            var joinPara = { roomid: "common" };
            if (tableid) {
                joinPara.tableid = tableid;
            } else {
                joinPara.roomid = "symj2";
            }
            if (params.leagueId) {
                joinPara.leagueId = params.leagueId
            } else if (params.clubId) {
                joinPara.clubId = params.clubId
            }
            if (params.ruleId) {
                joinPara.ruleId = params.ruleId
            }
            if (isByInvite)
                joinPara.isByInvite = true;

            joinPara.area = { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos(), address: MjClient.native.GetAddress() };
            cc.log("joinGame ----------- " + JSON.stringify(joinPara));

            MjClient.gamenet.request("pkplayer.handler.JoinGame", joinPara,
                function (rtn) {
                    if (rtn && rtn.result == 0 &&
                        (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP ||
                            MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)) {
                        //遮罩处理
                        if (cc.sys.isObjectValid(MjClient.playui)) {
                            cc.log("已经在房间内,取消遮罩");
                            MjClient.unblock();
                        } else {
                            MjClient.block();
                            cc.log("不在房间内,取消遮罩等待initSceneData取消遮罩")
                            MjClient._initSceneDataHideBlock = true;
                            //在initSceneData里处理MjClient.unblock();
                        }
                    } else {
                        MjClient.unblock();
                    }
                    if (rtn.code == -2) {
                        if (!cc.isUndefined(rtn.message))
                            MjClient.showMsgOpenPos(rtn.message);
                    } else if (rtn.code == -9) { // 服务器检测到异常，返回重启信号
                        MjClient.showMsg(rtn.message, function () {
                            MjClient.restartGame();
                        });
                    } else if (rtn.code == -5) { //房卡不足
                        MjClient.Scene.addChild(new Friendcard_popUpMeg(rtn))
                    } else if (rtn.result != 0) {
                        if (!params.notShowErrorMsg && !cc.isUndefined(rtn.message)) {
                            if ((isJinZhongAPPType() ||
                                MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ ||
                                MjClient.getAppType() == MjClient.APP_TYPE.LYSICHUANMJ) && MjClient.FriendCard_main_ui && cc.sys.isObjectValid(MjClient.FriendCard_main_ui)) {
                                var uiPara = {}
                                uiPara.msg = rtn.message + "";
                                MjClient.FriendCard_main_ui.addChild(new Friendcard_popUpMeg(uiPara))
                            } else {
                                MjClient.showMsg(rtn.message);
                            }
                        }

                    }
                    if (callback)
                        callback(rtn);
                });

            //后台会发送一个initSceneData 事件，初始化游戏场景
            //mylog("logic joinGame ----------- sking  ");
        }
        if (notCheckResource) {
            checkRescourCallBackFunc();
        } else {
            CheckUpdateResourceClass(GameClass[gameType], checkRescourCallBackFunc);
        }
    }

};

MjClient.joinMatchGame = function (tableid, callback, roomid, gameType) {
    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui) && !MjClient.playui.visible) {
        //游戏已经开启了
        var backToGameLayer = new BackToGameLayer();
        MjClient.Scene.addChild(backToGameLayer);
        return;
    }

    if (!isStrNotEmpty(gameType)) {
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.roomInfo", {
            roomNum: tableid
        }, function (rtn) {
            MjClient.unblock();
            cc.log("pkplayer.handler.roomInfo: ", JSON.stringify(rtn));
            if (rtn.code == 0 && rtn.data) {
                checkResourceAndJoinGame(rtn.data.info.gameType);
            } else {
                checkResourceAndJoinGame(MjClient.gameType);
            }
        });
    }
    else {
        checkResourceAndJoinGame(gameType);
    }

    function checkResourceAndJoinGame(gameType) {
        CheckUpdateResourceClass(GameClass[gameType], function () {
            MjClient.block();
            MjClient.native.doCopyToPasteBoard(""); //清除剪切板
            var joinPara = { roomid: "common" };
            if (roomid) {
                joinPara.roomid = "match";
            }
            joinPara.tableid = tableid;

            joinPara.area = { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos() };
            cc.log("joinGame ----------- " + JSON.stringify(joinPara));

            MjClient.gamenet.request("pkplayer.handler.JoinGame", joinPara,
                function (rtn) {
                    MjClient.unblock();
                    if (rtn.code == -9) { // 服务器检测到异常，返回重启信号
                        MjClient.showMsg(rtn.message, function () {
                            MjClient.restartGame();
                        });
                    } else if (rtn.result != 0) {
                        if (!cc.isUndefined(rtn.message))
                            MjClient.showMsg(rtn.message);
                    }
                    if (callback)
                        callback(rtn);
                });

            //后台会发送一个initSceneData 事件，初始化游戏场景
            //mylog("logic joinGame ----------- sking  ");
        });
    }
};

MjClient.joinMatchTable = function (tableid, callback) {
    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui) && !MjClient.playui.visible) {
        //游戏已经开启了
        var backToGameLayer = new BackToGameLayer();
        MjClient.Scene.addChild(backToGameLayer);
        return;
    }
    MjClient.block();
    MjClient.native.doCopyToPasteBoard(""); //清除剪切板

    MjClient.gamenet.request("pkplayer.handler.reconnectMatchTable", { matchTable: tableid },
        function (rtn) {
            cc.log("joinMatchTable ----------- " + JSON.stringify(rtn));
            MjClient.unblock();
            if (rtn.code) {
                if (!cc.isUndefined(rtn.message))
                    MjClient.showMsg(rtn.message);
            }
            if (callback)
                callback(rtn);
        });

    //后台会发送一个initSceneData 事件，初始化游戏场景
    //mylog("logic joinMatchTable ----------- sking  ");
};

/*
 gType: 游戏类型
 subGameType: 子游戏类型,对于一个地区有多种玩法
 play: 玩法
 fanNum: 番数上限
 roundNum: 局数
 */
MjClient.createRoom = function (para, roundNum, payWay, callback) {
    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui) && !MjClient.playui.visible) {
        //游戏已经开启了
        var backToGameLayer = new BackToGameLayer();
        MjClient.Scene.addChild(backToGameLayer);
        return;
    }
    MjClient.gameType = para.gameType;
    para.round = roundNum;
    para.payWay = payWay;
    para.area = { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos() };

    MjClient.block();
    cc.log("     para    " + JSON.stringify(para));
    MjClient.gamenet.request("pkplayer.handler.CreateVipTable", para, function (rtn) {
        cc.log("     rtn      " + JSON.stringify(rtn));
        MjClient.unblock();
        if (rtn.result == 0) {
            MjClient.data.vipTable = rtn.vipTable;
            MjClient.joinGame(rtn.vipTable, callback, false, MjClient.gameType);
            util.localStorageEncrypt.setStringItem(KEYCURRGAMERULE + para.gameType, JSON.stringify(para));
        } else {
            if (!cc.isUndefined(rtn.message)) {
                if (rtn.code == -2) //创建房间失败 开启定位弹窗
                    MjClient.showMsgOpenPos(rtn.message);
                else if (rtn.code == -3) //创建房间失败有元宝正在代开房
                {
                    if (isJinZhongAPPType() || MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ || MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ)
                        MjClient.Scene.addChild(new PopUpMsg_addYB(rtn));
                    else
                        MjClient.showMsg(rtn.message);
                }
                else if (rtn.code == -4)//创建房间失败元宝不足
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.TXJINZHONGMJ || MjClient.getAppType() == MjClient.APP_TYPE.DQSHANXIMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ || MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ)
                        MjClient.Scene.addChild(new PopUpMsg_addYB(rtn));
                    else
                        MjClient.showMsg(rtn.message);
                }
                else {
                    MjClient.showMsg(rtn.message);
                }
            }

            if (callback)
                callback(rtn);
        }
    });
};

//房主创建房间再战一局
MjClient.reCreateRoom = function () {
    //cc.log("==================MjClient.deepClone1============="+JSON.stringify(MjClient.data.sData.tData));
    var tData = /*MjClient.deepClone*/ (MjClient.data.sData.tData);


    MjClient.leaveGame(function () {
        var para = tData.areaSelectMode;
        para.maxPlayer = tData.maxPlayer;
        para.gameType = tData.gameType;
        var roundNum = tData.roundAll;
        if (para.isQuan) roundNum = "2quan";
        MjClient.createRoom(para, roundNum, tData.areaSelectMode.payWay, function (rtn) {
            if (rtn.result == 0) {
                MjClient.rematchInfo(MjClient.data.vipTable, tData.uids);
            }
        });
    });

};



//通知其他玩家新的房间
MjClient.rematchInfo = function (vipTable, uids) {
    MjClient.gamenet.request("pkplayer.handler.rematchInfo", { code: parseInt(vipTable), uids: uids }, function (rtn) {
        if (rtn.code == 0) {
            MjClient.showToast("已邀请其他玩家加入，请稍候");
        } else {
            if (!cc.isUndefined(rtn.message))
                MjClient.showMsg(rtn.message);
        }
    });
};

// 新版 俱乐部 和联盟   通知其他玩家新的房间
MjClient.rematchInfo2 = function (clubId, uids, ruleId, gameType, callback) {
    var jiekouName, sendInfo;
    var params = {};
    if (clubId <= 9999) {
        jiekouName = "pkplayer.handler.leagueAgainGame";
        sendInfo = {
            leagueId: clubId,
            uids: uids,
            ruleId: ruleId,
        }
        params.leagueId = clubId;
    } else {
        jiekouName = "pkplayer.handler.clubAgainGame";
        sendInfo = {
            clubId: clubId,
            uids: uids,
            ruleId: ruleId,
        }
        params.clubId = clubId;
    }
    MjClient.gamenet.request(jiekouName, sendInfo, function (rtn) {
        if (rtn.code == 0) {
            MjClient.joinGame(rtn.data, function (rtn) {
                if (callback) {
                    callback(rtn);
                }
            }, false, gameType, false, params);
        } else {
            FriendCard_Common.serverFailToast(rtn);
            if (callback) {
                callback(rtn);
            }
        }
        MjClient.unblock();
    });
};


MjClient.tickGame = function (tickType) {
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "MJTick", tickType: tickType });
};



MjClient.openWeb = function (para) {
    postEvent("openWeb", para);
};

MjClient.openNotice = function (para) {
    postEvent("openNotice", para);
};

MjClient.showMsg = function (msg, yesfunc, nofunc, style, param) {
    postEvent("popUpMsg", { msg: msg, yes: yesfunc, no: nofunc, style: (style || ""), param: (param || "") });
};

MjClient.showMsgTop = function (msg, yesfunc, nofunc, style, param) {
    postEvent("popUpMsgTop", { msg: msg, yes: yesfunc, no: nofunc, style: (style || ""), param: (param || "") });
};

MjClient.showMsgOpenPos = function (msg, yesfunc, nofunc, style, param) {
    postEvent("popUpMsgOpenPos", { msg: msg });
};

MjClient.showUnclosedMsg = function (msg, yesfunc, nofunc, style) {
    postEvent("popUpUnclosedMsg", { msg: msg, yes: yesfunc, no: nofunc, style: (style || "") });
};

MjClient.showToastDelay = function (msg) {
    MjClient.Scene.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
        MjClient.showToast(msg);
    })));
};

MjClient.showToast = function (msg) {
    if (haveThirdPartyWebView()) {
        return;
    }
    var yPercent = 0.35;
    var jsFile = "ToastNode.json";
    var toastUI = ccs.load(jsFile).node;
    var text = toastUI.getChildByName("back").getChildByName("text");
    var bg_text = toastUI.getChildByName("back").getChildByName("bg_text");
    MjClient.Scene.addChild(toastUI, 99999);
    // 记录每一个生成显示的吐丝提示在 MjClient.Scene.ToastNodeArray 数组中
    if (MjClient.Scene.ToastNodeArray) {
        MjClient.Scene.ToastNodeArray.push(toastUI);
    }
    else {
        MjClient.Scene.ToastNodeArray = [toastUI];
    }
    if (msg.message) {
        text.setString(msg.message + '');
    } else
        text.setString(JSON.stringify(msg));
    text.ignoreContentAdaptWithSize(true);

    bg_text.setContentSize(text.getVirtualRendererSize().width + 140, bg_text.getContentSize().height);
    setWgtLayout(toastUI.getChildByName("back"), [0.35, 0.5], [0.5, -0.1], [0, 0]);

    toastUI.runAction(cc.sequence(
        cc.moveBy(0.5, 0, cc.director.getVisibleSize().height * yPercent),
        cc.delayTime(2.5),
        cc.fadeOut(0.5),
        cc.callFunc(function () {
            // 删除对应的吐丝提示，并且在 MjClient.Scene.ToastNodeArray 数组中移除
            var i = 0;
            while (i < MjClient.Scene.ToastNodeArray.length) {
                if (MjClient.Scene.ToastNodeArray[i] == toastUI) {
                    MjClient.Scene.ToastNodeArray.splice(i, 1);
                }
                else {
                    i++;
                }
            }
        }),
        cc.removeSelf(true)
    )
    );
};

MjClient.showToastEXP = function (data) {
    if (haveThirdPartyWebView()) {
        return;
    }
    var yPercent = 0.35;
    var jsFile = "ToastNode2.json";

    var toastUI = ccs.load(jsFile).node;
    var _back = toastUI.getChildByName("back")
    setWgtLayout(_back, [1, 1], [0.5, -0.1], [0, 0], true);
    var bg_text = _back.getChildByName("bg_text");
    MjClient.Scene.addChild(toastUI, 99999);

    setWgtLayout(toastUI.getChildByName("back"), [1, 1], [0.5, -0.1], [0, 0]);
    // 记录每一个生成显示的吐丝提示在 MjClient.Scene.ToastNodeArray 数组中

    var textMatch = _back.getChildByName("textMatch");
    textMatch.setString("加时赛+" + data.overtimePer);
    textMatch.ignoreContentAdaptWithSize(true)

    var textExp = _back.getChildByName("textExp");
    var textExpNum = textExp.getChildByName("textExpNum");
    textExpNum.setString("+" + data.incrEmp);
    textExpNum.ignoreContentAdaptWithSize(true);

    if (!data.overtimePer) {
        textMatch.visible = false;
        textExp.y += 15;

    }

    toastUI.runAction(cc.sequence(
        cc.moveBy(0.5, 0, cc.director.getVisibleSize().height * yPercent),
        cc.delayTime(2.5),
        cc.fadeOut(0.5),
        cc.removeSelf(true)
    )
    );
};

/*
    factor 是屏幕的高度比例 by sking
 */
MjClient.showToastbyPos = function (msg, factor) {
    if (!factor || factor == 0) {
        factor = 0.35;
    }
    var toastUI = ccs.load("ToastNode.json").node;
    var text = toastUI.getChildByName("back").getChildByName("text");
    var bg_text = toastUI.getChildByName("back").getChildByName("bg_text");
    MjClient.Scene.addChild(toastUI);
    text.setString(msg);
    text.ignoreContentAdaptWithSize(true);
    bg_text.setContentSize(text.getVirtualRendererSize().width + 140, bg_text.getContentSize().height);
    setWgtLayout(toastUI.getChildByName("back"), [0.35, 0.5], [0.5, -0.1], [0, 0]);
    toastUI.runAction(
        cc.sequence(
            cc.moveBy(0.5, 0, cc.director.getVisibleSize().height * factor),
            cc.delayTime(2.5),
            cc.fadeOut(0.5),
            cc.removeSelf(true),
            cc.callFunc(function () {
                MjClient.GameTipMessageNode = null;
            })
        )
    );
    MjClient.GameTipMessageNode = toastUI;
};

/*
    #富文本toast提示
    @para msg1 名字，需要转码处理
    @para msg2 字符串，不做处理
    @para factor 是屏幕的高度比例
 */
MjClient.showToastWithInfobyPos = function (msg1, msg2, factor) {
    if (!factor || factor == 0) {
        factor = 0.35;
    }
    var toastUI = ccs.load("ToastNode.json").node;
    var text = toastUI.getChildByName("back").getChildByName("text");
    var bg_text = toastUI.getChildByName("back").getChildByName("bg_text");
    MjClient.Scene.addChild(toastUI);

    var richText2 = new ccui.RichText();
    richText2.ignoreContentAdaptWithSize(false);
    richText2.setAnchorPoint(-0.2, 0);
    richText2.width = 300;
    richText2.height = 30;
    //不同颜色文本
    var _nameStr = unescape(msg1);
    var newname = getNewName(_nameStr, 6);
    var re2 = new ccui.RichElementText(1, cc.color("#F3DA75"), 255, newname, "fonts/lanting.TTF", 24);
    var re3 = new ccui.RichElementText(2, cc.color("#F1FFFF"), 255, msg2, "fonts/lanting.TTF", 24);
    richText2.pushBackElement(re2);
    richText2.pushBackElement(re3);
    toastUI.getChildByName("back").addChild(richText2);

    //text.setString(msg);
    text.ignoreContentAdaptWithSize(true);
    text.visible = false;
    bg_text.setContentSize(richText2.getVirtualRendererSize().width + 140, bg_text.getContentSize().height);
    setWgtLayout(toastUI.getChildByName("back"), [0.3, 0.3], [0.5, -0.1], [0, 0]);
    toastUI.runAction(
        cc.sequence(
            cc.moveBy(0.5, 0, cc.director.getVisibleSize().height * factor),
            cc.delayTime(2.5),
            cc.fadeOut(0.5),
            cc.removeSelf(true),
            cc.callFunc(function () {
                MjClient.GameTipMessageNode = null;
            })
        )
    );
    MjClient.GameTipMessageNode = toastUI;
};
//是否是金币场
MjClient.isInGoldField = function () {
    if (!MjClient.data.sData || !MjClient.data.sData.tData) {
        return false
    }
    return MjClient.data.sData.tData.fieldId;
}
//是否是金币场普通场
MjClient.isInGoldFieldNormal = function () {
    if (!MjClient.data.sData || !MjClient.data.sData.tData) {
        return false
    }
    return MjClient.data.sData.tData.fieldId && MjClient.data.sData.tData.fieldType != 1;
}
//金币场快速场
MjClient.isInGoldFieldQuick = function () {
    if (!MjClient.data.sData || !MjClient.data.sData.tData) {
        return false
    }
    return MjClient.data.sData.tData.fieldId && MjClient.data.sData.tData.fieldType == 1;
}

MjClient.getSystemConfig = function (successCallback, failCallback) {
    var _sys = "android";
    if (cc.sys.os == cc.sys.OS_IOS) {
        _sys = "ios";
    }

    MjClient.block();
    MjClient.gamenet.request("pkplayer.handler.getSystemConfig", {
        os: _sys,
        version: MjClient.resVersion || "1.1.1",
        appVersion: MjClient.native.GetVersionName(),
        appid: MjClient.native.GetPackageName()
    },
        function (rtn) {
            MjClient.unblock();
            if (rtn.code == 0) {
                MjClient.systemConfig = rtn.data;
                MjClient.activityConfig = rtn.data.award;
                for (var i = 0; i < MjClient.systemConfig.recharge.length; i++) {
                    MjClient.native.initPay(MjClient.systemConfig.recharge[i].platform);
                }
                MjClient.native.initPay(PayPlatformType.WEIXIN);

                var shareImages = MjClient.systemConfig.shareImageConfig;
                cc.log("wxd============================shareImageConfig:" + JSON.stringify(MjClient.systemConfig.shareImageConfig));
                for (var area in shareImages) {
                    var shareImageUrl = shareImages[area].url;
                    if (shareImageUrl) {
                        var nameArr = shareImageUrl.split("/");
                        var nameStr = nameArr[nameArr.length - 1];
                        var filePath = jsb.fileUtils.getWritablePath() + nameStr;
                        if (!jsb.fileUtils.isFileExist(filePath)) {
                            MjClient.urlImageDown(shareImageUrl, nameStr);
                        }
                    }
                }

                var shareImagesMall = MjClient.systemConfig.shareImageMallConfig;
                cc.log("wxd============================shareImageMallConfig:" + JSON.stringify(MjClient.systemConfig.shareImageMallConfig));
                for (var area in shareImagesMall) {
                    var shareImageUrl = shareImagesMall[area].url;
                    if (shareImageUrl) {
                        var nameArr = shareImageUrl.split("/");
                        var nameStr = nameArr[nameArr.length - 1];
                        var filePath = jsb.fileUtils.getWritablePath() + nameStr;
                        if (!jsb.fileUtils.isFileExist(filePath)) {
                            MjClient.urlImageDown(shareImageUrl, nameStr);
                        }
                    }
                }

                if (setLocalConfig) {
                    setLocalConfig();
                } else {
                    MjClient.gameListConfig = {};
                    for (var key in MjClient.systemConfig) {
                        if (key.indexOf("List") == -1)
                            continue;

                        try {
                            MjClient.gameListConfig[key] = JSON.parse(MjClient.systemConfig[key]) || [];
                        } catch (e) {
                            MjClient.gameListConfig[key] = [];
                        }
                    }
                }
                if (successCallback) successCallback();
            }
            else {
                MjClient.showMsg("获取系统配置失败(getSystemConfig)");
                if (failCallback) failCallback();
            }
        }
    );
};


MjClient.getRechargeLadder = function (callback, param) {
    var _sys = "android";
    if (cc.sys.os == cc.sys.OS_IOS) {
        _sys = "ios";
    }
    param = param || {}
    param.os = _sys
    param.version = MjClient.resVersion || "1.1.1"
    param.uid = SelfUid()
    cc.log("getRechargeLadder = request ");
    MjClient.gamenet.request("pkplayer.handler.getRechargeLadder", param,
        function (rtn) {
            cc.log("============getRechargeLadder========  ")
            if (rtn.code == 0) {
                MjClient.rechargeLadder = rtn.data.list;
                MjClient.systemConfig.recharge = rtn.data.method;
                if (callback) {
                    callback(rtn.data.list);
                }
            }
        }
    );
};

MjClient.getGoldfieldNewUserInfo = function (callback) {
    var _sys = "android";
    if (cc.sys.os == cc.sys.OS_IOS) {
        _sys = "ios";
    }

    cc.log("getRechargeLadder = request ");
    MjClient.gamenet.request("pkplayer.handler.goldfieldNewUserInfo", { os: _sys, version: MjClient.resVersion || "1.1.1", uid: SelfUid() },
        function (rtn) {
            cc.log("============goldfieldNewUserInfo========  ")
            if (rtn.code == 0) {
                MjClient.goldfieldNewUserInfo = rtn.data;
                if (callback) {
                    callback(rtn.data);
                }
            }
        }
    );
};

MjClient.getFangkaRechargeLadder = function (callback) {
    var _sys = "android";
    if (cc.sys.os == cc.sys.OS_IOS) {
        _sys = "ios";
    }

    cc.log("getRechargeLadder = request ");
    MjClient.gamenet.request("pkplayer.handler.getRechargeLadder", { os: _sys, version: MjClient.resVersion || "1.1.1", uid: SelfUid(), type: "fangka" },
        function (rtn) {
            cc.log("============  房卡充值 ========  ")
            if (rtn.code == 0) {
                MjClient.rechargeLadderFangka = rtn.data.list;
                MjClient.systemConfig.recharge = rtn.data.method;
                if (callback) {
                    callback(rtn.data.list);
                }
            }
        }
    );
}
MjClient.getGoldFiledType = function () {
    return 0;
}
MjClient.getJinbiRechargeLadder = function (callback) {
    cc.log("getRechargeLadder = request ");
    if (MjClient.getGoldFiledType() == 1) {
        MjClient.gamenet.request("pkplayer.handler.getGoodsList", { type: "gold" },
            function (rtn) {
                if (rtn.code == 0) {
                    if (MjClient.getGoldFiledType() == 1) {
                        if (rtn.data) {
                            for (var i = 0; i < rtn.data.length; i++) {
                                var tempAmount = rtn.data[i].amount;
                                rtn.data[i].amount = rtn.data[i].price;
                                rtn.data[i].money = tempAmount;
                            }
                        }
                    }
                    MjClient.rechargeLadderJinbi = rtn.data;
                    if (callback) {
                        callback(rtn.data);
                    }
                }
            }
        );
    } else {
        var _sys = "android";
        if (cc.sys.os == cc.sys.OS_IOS) {
            _sys = "ios";
        }
        MjClient.gamenet.request("pkplayer.handler.getRechargeLadder", { os: _sys, version: MjClient.resVersion || "1.1.1", uid: SelfUid(), type: 2 },
            function (rtn) {
                cc.log("============getRechargeLadder========  ")
                if (rtn.code == 0) {
                    MjClient.rechargeLadderJinbi = rtn.data;
                    if (callback) {
                        callback(rtn.data);
                    }
                }
            }
        );
    }
}
//增加一个表 param  存放参数  以后不要随便加字段了
MjClient.recharge = function (itemId, platform, limitMoney, voucher, param) {
    var _sys = "android";
    if (cc.sys.os == cc.sys.OS_IOS) {
        _sys = "ios";
    }

    var _data = {};
    if (!limitMoney) {
        _data = { ladderId: itemId, os: _sys, platform: platform, appid: MjClient.native.GetPackageName(), wx_appid: MjClient.native.getNativeConfig().wx_appId || "" };
    } else {
        _data = { limitMoney: limitMoney, os: _sys, platform: platform, appid: MjClient.native.GetPackageName(), wx_appid: MjClient.native.getNativeConfig().wx_appId || "" };
    }
    if (voucher) {
        _data.voucher = voucher;
    }
    if (param && param.receiverId) {
        _data.receiverId = param.receiverId;
    }
    MjClient.block();
    MjClient.gamenet.request("pkplayer.handler.recharge", _data,
        function (rtn) {
            cc.log(" ====== pkplayer.handler.recharge : ", JSON.stringify(rtn));
            if (rtn.code == 0) {
                MjClient.onRecharge(rtn.data);
            } else {
                if (rtn.message) {
                    MjClient.showToast(rtn.message);
                }
            }
            MjClient.unblock();
        }
    );
}

MjClient.onRecharge = function (paras) {
    if (paras.indexOf("title") != -1 && paras.indexOf("content") != -1 && paras.indexOf("url") != -1) {
        var obj = JSON.parse(paras);
        MjClient.native.wxShareUrl(obj.url, unescape(obj.title), unescape(obj.content));

        if (cc.sys.OS_WINDOWS == cc.sys.os)
            MjClient.showToast("模拟公众号支付成功");
    } else if (paras.indexOf("http") == 0) {
        MjClient.native.weixinWebPay(paras);

        if (cc.sys.OS_WINDOWS == cc.sys.os)
            MjClient.showToast("模拟网页支付成功");
    } else if (paras.indexOf("prepayId") >= 0) {
        MjClient.native.pay(PayPlatformType.WEIXIN, JSON.parse(paras));
    }

    // 【商城支付】支付返回流程优化——增加异常情况联系客服
    MjClient.Scene.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
        MjClient.showMsg("支付到账可能存在延迟1-15分钟，请耐心等待，如资产长时间仍然未到账，请联系客服。", function () {
            if (!isCurrentNativeVersionBiggerThan("14.0.0")) {
                MjClient.gamenet.request("pkplayer.handler.openBrowser", {
                    type: 9
                }, function (rtn) {
                    if (rtn.code == 0) {
                        MjClient.Scene.addChild(new NormalWebviewLayer(rtn.data));
                    } else {
                        if (rtn.message) {
                            MjClient.showToast(rtn.message);
                        } else {
                            MjClient.showToast("获取数据失败");
                        }
                    }
                });
            } else {
                MjClient.native.showQiYuChatDialog();
            }
        }, function () { }, "1",
            {
                titleText: "订单确认",
                yesNormal: "store/payProblemBtn.png",
                noNormal: "store/payFinishBtn.png",
                yesScale: 1.0,
                noScale: 1.0,
                titleImage: "store_3.0/orderConfirm.png"
            });
    })));
}

//已废弃的接口
MjClient.getActivityConfig = function () {
    MjClient.gamenet.request("pkcon.handler.getActivityConfig", {},
        function (rtn) {
            if (rtn.code == 0) {
                MjClient.activityConfig = rtn.data;
            } else {
                MjClient.activityConfig = null;
            }
        }
    );
};




MjClient.delRoom = function (yes) {
    MjClient.native.doCopyToPasteBoard(""); //清空剪切板
    var sData = MjClient.data.sData;
    if (typeof (sData) != "undefined" &&
        (sData.tData.tState == TableState.waitJoin || sData.tData.tState == TableState.waitReady) &&
        sData.tData.owner != SelfUid()
    ) {
        if (MjClient.delroomui && MjClient.delroomui.visible == true) {
            MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "DelRoom", yes: yes }, function (data) {
                if (data != null && data.code == -1 && data.message) {
                    MjClient.showToast(data.message);
                }
            });
        } else {
            MjClient.leaveGame();
        }
    } else {
        cc.log("------delRoom------ sking -----");
        MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "DelRoom", yes: yes }, function (data) {
            if (data != null && data.code == -1 && data.message) {
                MjClient.showToast(data.message);
            }
        });
    }
};







MjClient.getServerPort = function (parts) {
    if (parts.length > 3) {
        return parseInt(parts[1 + Math.floor(Math.random() * (parts.length - 1))]);
    } else {
        var min = parseInt(parts[1]);
        var max = parseInt(parts[2]);
        var offset = max - min + 1;
        var part = Math.floor(Math.random() * offset) + min;
        return parseInt(part);
    }
};



//进入游戏
MjClient.LoginGame = function (host, port, successCallback, failedCallback) {
    if (MjClient.gamenet.isConnected && MjClient.gamenet.isConnected()) {
        mylog("MjClient.gamenet.isConnected!!!!");
        cc.log("MjClient.gamenet.isConnected!!!!");
        if (successCallback) successCallback();
        return;
    }

    MjClient.gamenet.disconnect();
    MjClient.gamenet.connect(host, port,
        function () {
            cc.log("MjClient.LoginGame success!!!!host:" + host + "   port:" + port);
            //当前连接ip和端口
            MjClient.curServerPort = { host: host, port: port };
            if (successCallback) successCallback();
        },
        function () {
            mylog("MjClient.LoginGame failed!!!!!host:" + host + "   port:" + port);
            cc.log("MjClient.LoginGame failed!!!!!host:" + host + "   port:" + port);
            if (failedCallback) failedCallback();
            //postEvent("disconnect", 1);
        }
    );
};


MjClient.ConnectServer = function (openID, callback) {
    function func_oldConnectServer() {
        var servers = JSON.parse(MjClient.updateCfg.servers);
        var ports = JSON.parse(MjClient.updateCfg.ports);
        MjClient.updateCfg.serversGF = MjClient.updateCfg.serversGF || "[]";
        MjClient.updateCfg.portsGF = MjClient.updateCfg.portsGF || "[]";
        var serversGF = JSON.parse(MjClient.updateCfg.serversGF);
        var portsGF = JSON.parse(MjClient.updateCfg.portsGF);
        MjClient.updateCfg.serversAbroad = MjClient.updateCfg.serversAbroad || "[]";
        MjClient.updateCfg.portsAbroad = MjClient.updateCfg.portsAbroad || "[]";
        var serversAbroad = JSON.parse(MjClient.updateCfg.serversAbroad);
        var portsAbroad = JSON.parse(MjClient.updateCfg.portsAbroad);
        var tryCount = 0;
        if (MjClient.remoteCfg.guestLogin) {
            //苹果审核服
            servers = ["8.139.5.7"];
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                servers = ["8.139.5.7"];
            }
            ports = [16010, 16011];
        }
        // if (MjClient.isAbroad() && serversAbroad.length > 0 && portsAbroad.length > 0) {
        //     serversGF = serversAbroad;
        //     portsGF = portsAbroad;
        // }
        function doConnectServer() {
            if (servers.length == 0 || (tryCount >= 2 && serversGF.length > 0)) {
                doConnectServerGF();
            } else {
                var host = servers[getRandomRange(0, servers.length - 1)];
                var port = ports[getRandomRange(0, ports.length - 1)];
                if (!!MjClient.curServerPort && MjClient.curServerPort.host == host && MjClient.curServerPort.port == port) {
                    if (servers.length > ports.length && servers.length > 1) {
                        servers.splice(servers.indexOf(host), 1);
                        host = servers[getRandomRange(0, servers.length - 1)];
                    }
                    else if (servers.length < ports.length && ports.length > 1) {
                        var portsNew = ports.slice();
                        portsNew.splice(portsNew.indexOf(port), 1);
                        port = portsNew[getRandomRange(0, portsNew.length - 1)];
                    }
                }
                cc.log("----------OldConnectServer---------" + host + ":" + port);
                servers.splice(servers.indexOf(host), 1);
                tryCount++;
                MjClient.LoginGame(host, port, callback, function () {
                    MjClient.Scene.runAction(cc.callFunc(doConnectServer)); //doConnectServer();
                });
            }
        }

        function doConnectServerGF() {
            if (serversGF.length == 0) {
                postEvent("disconnect", 1);
            } else {
                var hostGF = serversGF[getRandomRange(0, serversGF.length - 1)];
                var portGF = portsGF[getRandomRange(0, portsGF.length - 1)];
                if (!!MjClient.curServerPort && MjClient.curServerPort.host == hostGF && MjClient.curServerPort.port == portGF) {
                    if (serversGF.length > portsGF.length && serversGF.length > 1) {
                        serversGF.splice(serversGF.indexOf(hostGF), 1);
                        hostGF = serversGF[getRandomRange(0, serversGF.length - 1)];
                    }
                    else if (serversGF.length < portsGF.length && portsGF.length > 1) {
                        var portsGFNew = portsGF.slice();
                        portsGFNew.splice(portsGFNew.indexOf(portGF), 1);
                        portGF = portsGFNew[getRandomRange(0, portsGFNew.length - 1)];
                    }
                }
                cc.log("----------OldConnectServerGF---------" + hostGF + ":" + portGF);
                serversGF.splice(serversGF.indexOf(hostGF), 1);
                MjClient.LoginGame(hostGF, portGF, callback, function () {
                    MjClient.Scene.runAction(cc.callFunc(doConnectServerGF)); //doConnectServerGF();
                });
            }
        }

        doConnectServer();
    }


    //用户分组模式下的服务器连接
    function func_newConnectServer() {
        var servers = [];
        var ports = [];
        try {
            var groupServerString = util.localStorageEncrypt.getStringItem("groupServer");
            if (groupServerString == "") {
                func_oldConnectServer();
                return;
            }
            var groupServer = JSON.parse(groupServerString);
            if (!groupServer || !groupServer.ips || !groupServer.ports) {
                func_oldConnectServer();
                return;
            }
            servers = groupServer.ips;
            ports = groupServer.ports;
            if (!cc.isArray(servers) || servers.length == 0 || !cc.isArray(ports) || ports.length == 0) {
                func_oldConnectServer();
                return;
            }
        } catch (e) {
            func_oldConnectServer();
            return;
        }
        var tryCount = 0;

        function doConnectServer() {
            if (servers.length == 0 || tryCount >= servers.length) {
                func_oldConnectServer();
                return;
            }

            var host = servers[getRandomRange(0, servers.length - 1)];
            var port = ports[getRandomRange(0, ports.length - 1)];
            if (!!MjClient.curServerPort && MjClient.curServerPort.host == host && MjClient.curServerPort.port == port) {
                if (servers.length > ports.length && servers.length > 1) {
                    servers.splice(servers.indexOf(host), 1);
                    host = servers[getRandomRange(0, servers.length - 1)];
                }
                else if (servers.length < ports.length && ports.length > 1) {
                    var portsNew = ports.slice();
                    portsNew.splice(portsNew.indexOf(port), 1);
                    port = portsNew[getRandomRange(0, portsNew.length - 1)];
                }
            }
            cc.log("----------NewConnectServer---------" + host + ":" + port);
            servers.splice(servers.indexOf(host), 1);
            tryCount++;
            MjClient.LoginGame(host, port, callback, function () {
                MjClient.Scene.runAction(cc.callFunc(doConnectServer)); //doConnectServer();
            });
        }
        doConnectServer();
    }

    func_newConnectServer();
};


//是否在国外
MjClient.isAbroad = function () {
    var addressVec = JSON.parse(MjClient.native.GetAddress());
    if (addressVec[0].length == 0 && addressVec[1].length == 0) {
        //没有取到地址，则认为不在海外
        return false;
    }

    if (addressVec[0].indexOf("中国") < 0 &&
        addressVec[0].indexOf("中华人民共和国") < 0 &&
        addressVec[0].toLowerCase().indexOf("china") < 0 &&
        addressVec[0].toLowerCase().indexOf("chinese") < 0) {
        return true;
    }

    if (addressVec[0].indexOf("台湾") >= 0 ||
        addressVec[0].toLowerCase().indexOf("taiwan") >= 0 ||
        addressVec[0].toLowerCase().indexOf("tw") >= 0 ||
        addressVec[0].indexOf("香港") >= 0 ||
        addressVec[0].toLowerCase().indexOf("hong kong") >= 0 ||
        addressVec[0].toLowerCase().indexOf("hk") >= 0 ||
        addressVec[0].indexOf("澳门") >= 0 ||
        addressVec[0].toLowerCase().indexOf("macao") >= 0 ||
        addressVec[0].toLowerCase().indexOf("mo") >= 0 ||
        addressVec[1].indexOf("台湾") >= 0 ||
        addressVec[1].toLowerCase().indexOf("taiwan") >= 0 ||
        addressVec[1].toLowerCase().indexOf("tw") >= 0 ||
        addressVec[1].indexOf("香港") >= 0 ||
        addressVec[1].toLowerCase().indexOf("hong kong") >= 0 ||
        addressVec[1].toLowerCase().indexOf("hk") >= 0 ||
        addressVec[1].indexOf("澳门") >= 0 ||
        addressVec[1].toLowerCase().indexOf("macao") >= 0 ||
        addressVec[1].toLowerCase().indexOf("mo") >= 0
    ) {
        return true;
    }

    return false;
};


//是否在北京周围:版号审核用
MjClient.isAroundBeijing = function () {
    //if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ)
    //{
    //    return false;
    //}
    //
    //var latitude = 39.92;
    //var longitude = 116.46;
    //var selfLatitude = MjClient.native.GetLatitudePos();
    //if (selfLatitude == null || selfLatitude == 0 || selfLatitude == "")
    //{
    //    return false;
    //}
    //var selfLongitude = MjClient.native.GetLongitudePos();
    //if (selfLongitude == null || selfLongitude == 0 || selfLongitude == "")
    //{
    //    return false;
    //}
    //var distance = MjClient.native.CalculateLineDistance(latitude, longitude, selfLatitude, selfLongitude);
    //if (distance <= 150*1000 && distance>=0)
    //{
    //    return true;
    //}
    return false;
};

//播放回放
MjClient.playLogOne = function (msg) {
    var tempPlayLogIfoArry = [];
    var arry = [];
    arry[0] = [];
    var j = 0;
    for (var i = 0; i < msg.length; i++) {
        arry[j].push(msg[i]);
        if (msg[i].cmd == "roundEnd") {
            tempPlayLogIfoArry.push(arry[j]);
            arry[++j] = [msg[0]];
            if (msg[1].cmd == "TZTeam") { //打筒子4人回放分组数据
                arry[j].push(msg[1]);
            }
        }
    }
    if (MjClient.otherReplayRound) {
        var scene = cc.director.getRunningScene();
        if (!scene.replayControllerNode) {
            var node = new cc.Node();
            scene.addChild(node);
            scene.replayControllerNode = node;
        }
        playLogIfoArry = tempPlayLogIfoArry; //add by sking
        RePlaySelectRole(scene.replayControllerNode, MjClient.otherReplayRound, tempPlayLogIfoArry);
    } else if (msg) {
        playLogIfoArry = tempPlayLogIfoArry;
        MjClient.Scene.addChild(new playLogInfoLayer());
    }
};



/**
 * 下载网络文件
 * @param  {String} url 文件url地址
 * @param  {String} fullFileName 下载成功后保存在本地的文件名全路径
 * @param  {function} successCallBack 下载成功回调
 * @param  {function} failedCallBack 下载失败回调
 */
MjClient.downloadFile = function (url, fullFileName, successCallBack, failedCallBack) {
    if (fullFileName.length == 0 || url.length == 0) {
        if (failedCallBack) failedCallBack(fullFileName, "MjClient.downloadFile error params.");
        return;
    }
    if (jsb.fileUtils.isFileExist(fullFileName)) {
        if (successCallBack) successCallBack(fullFileName);
        return;
    }
    var downloader = new jsb.Downloader();
    downloader.setOnTaskError(function (downloadTask, errorCode, errorCodeInternal, errorStr) {
        cc.log("downloader OnTaskError: ", JSON.stringify(downloadTask), errorCode, errorCodeInternal, errorStr);
        if (failedCallBack) failedCallBack(downloadTask.storagePath, errorStr);
    });
    downloader.setOnFileTaskSuccess(function (downloadTask) {
        cc.log("downloader OnFileTaskSuccess: ", JSON.stringify(downloadTask));
        if (successCallBack) successCallBack(downloadTask.storagePath);
    });
    downloader.createDownloadFileTask(url, fullFileName, fullFileName);
};

/**
 * 下载网络图片 png / jpg
 * @param  {String} urlImage 图片url地址
 * @param  {String} fileName 下载成功后保存在本地的文件名
 * @param  {function} successCallBack 下载成功毁掉
 * @param  {function} failedCallBack 下载失败毁掉
 */
MjClient.urlImageDown = function (urlImage, fileName, successCallBack, failedCallBack) {
    var write_path = jsb.fileUtils.getWritablePath();
    var savepath = write_path + fileName;
    cc.log("MjClient.urlImageDown url:", urlImage);
    cc.log("MjClient.urlImageDown savepath:", savepath);

    // var imgcb = function(texture) {
    //     if (texture instanceof cc.Texture2D) {
    //         cc.log("Success urlImageDown to path:", savepath);
    //         var IMAGE_FORMAT_TYPE = cc.IMAGE_FORMAT_PNG;
    //         if (fileName.endsWith(".jpg")) {
    //             IMAGE_FORMAT_TYPE = cc.IMAGE_FORMAT_JPEG;
    //         }
    //
    //         var sprite = new cc.Sprite(texture);
    //         sprite.setAnchorPoint(0, 0);
    //         sprite.x = 0;
    //         sprite.y = 0;
    //
    //         var rt = new cc.RenderTexture(sprite.width, sprite.height);
    //         rt.begin();
    //         sprite.visit();
    //         rt.end();
    //         rt.saveToFile(fileName, IMAGE_FORMAT_TYPE, true);
    //
    //         if (successCallBack) successCallBack(sprite, savepath);
    //     } else {
    //         cc.log("Fail to load remote texture by urlImageDown");
    //         if (failedCallBack) failedCallBack();
    //     }
    // };
    // cc.textureCache.addImageAsync(urlImage, imgcb);
    MjClient.downloadFile(urlImage, savepath, function (filePath) {
        if (successCallBack) successCallBack(new cc.Sprite(filePath), filePath);
    }, failedCallBack);
};


/**
 * 下载头像
 * @param  {String} url 图片url地址
 * @param  {function} successCallBack(error, fullFileName) 下载成功回调，形参:文件完整路径
 */
MjClient.downloadHeadImage = function (url, successCallBack) {
    if (!url || url.length == 0) {
        return;
    }

    var fileName = util.md5.hex_md5(url);
    var fullFileName = jsb.fileUtils.getWritablePath() + fileName;
    MjClient.downloadFile(url, fullFileName, function (fullPath) {
        var ccImage = new cc.Image();
        ccImage.initWithImageFile(fullPath);
        cc.textureCache.addImage(ccImage, url);
        if (successCallBack) successCallBack(null, fullPath);
    }, function (file, error) {
        cc.log(error);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), fullFileName)) {
                    var ccImage = new cc.Image();
                    ccImage.initWithImageFile(fullFileName);
                    cc.textureCache.addImage(ccImage, url);
                    if (successCallBack) successCallBack(null, fullFileName);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    });
};



MjClient.saveNodeToImage = function (node, imageName, savecallback, isFullScene) {
    var write_path = jsb.fileUtils.getWritablePath();
    var savepath = write_path + imageName;
    cc.log("MjClient.saveNodeToImage savepath:", savepath);

    var IMAGE_FORMAT_TYPE = cc.IMAGE_FORMAT_PNG;
    if (imageName.endsWith(".jpg")) {
        IMAGE_FORMAT_TYPE = cc.IMAGE_FORMAT_JPEG;
    }

    var saveimg = function () {
        var scale = node.getScale();
        var rt = null;
        if (isFullScene) {
            var ws = cc.director.getWinSize();
            rt = new cc.RenderTexture(ws.width, ws.height);
        } else {
            rt = new cc.RenderTexture(node.width * scale, node.height * scale);
        }
        rt.begin();
        node.visit();
        rt.end();
        rt.saveToFile(imageName, IMAGE_FORMAT_TYPE, true, function () {
            if (typeof (savecallback) == 'function') savecallback(node, savepath);
        });
    }
    node.runAction(cc.sequence(cc.callFunc(saveimg)));
}


//分享有礼时获取分享图片路径
MjClient.getShareImageFileToPYQ = function (specifiedArea) {
    function checkAreaFromAddress(area) {
        var result = false;
        var vecAddress = JSON.parse(MjClient.native.GetAddress());
        for (var i = 0; i < vecAddress.length; i++) {
            var address = vecAddress[i];
            if (address.indexOf(area) >= 0) {
                result = true;
                break;
            }
        }
        return result;
    }

    function getFileContentByArea(area) {
        var file = "";
        var shareImageUrl = MjClient.systemConfig.shareImageConfig[area].url;
        if (shareImageUrl) {
            var nameArr = shareImageUrl.split("/");
            var nameStr = nameArr[nameArr.length - 1];
            file = jsb.fileUtils.getWritablePath() + nameStr;
        }
        return { file: file, content: "" + MjClient.systemConfig.shareImageConfig[area].content };
    }

    var str = "";
    if (Object.keys(MjClient.systemConfig.shareImageConfig).length > 0) {
        str = Object.keys(MjClient.systemConfig.shareImageConfig)[0];
    } else {
        MjClient.showToast("没有配置分享图");
        return;
    }
    var fileContent = getFileContentByArea(str);
    if (specifiedArea) {
        fileContent = getFileContentByArea(specifiedArea);
    } else {
        for (var area in MjClient.systemConfig.shareImageConfig) {
            if (checkAreaFromAddress(area)) {
                fileContent = getFileContentByArea(area);
                break;
            }
        }
    }

    return fileContent;
};



//积分商城获取分享图片路径
MjClient.getShareImageMallFileToPYQ = function (specifiedArea) {
    function checkAreaFromAddress(area) {
        var result = false;
        var vecAddress = JSON.parse(MjClient.native.GetAddress());
        for (var i = 0; i < vecAddress.length; i++) {
            var address = vecAddress[i];
            if (address.indexOf(area) >= 0) {
                result = true;
                break;
            }
        }
        return result;
    }

    function getFileContentByArea(area) {
        var file = "";
        var shareImageUrl = MjClient.systemConfig.shareImageMallConfig[area].url;
        if (shareImageUrl) {
            var nameArr = shareImageUrl.split("/");
            var nameStr = nameArr[nameArr.length - 1];
            file = jsb.fileUtils.getWritablePath() + nameStr;
        }
        return { file: file, content: "" + MjClient.systemConfig.shareImageMallConfig[area].content };
    }

    var str = "";
    if (Object.keys(MjClient.systemConfig.shareImageMallConfig).length > 0) {
        str = Object.keys(MjClient.systemConfig.shareImageMallConfig)[0];
    } else {
        MjClient.showToast("没有配置分享图");
        return;
    }
    var fileContent = getFileContentByArea(str);
    if (specifiedArea) {
        fileContent = getFileContentByArea(specifiedArea);
    } else {
        for (var area in MjClient.systemConfig.shareImageMallConfig) {
            if (checkAreaFromAddress(area)) {
                fileContent = getFileContentByArea(area);
                break;
            }
        }
    }

    return fileContent;
};


MjClient.addHomeView = function (type) {
    if (MjClient.homeui && cc.sys.isObjectValid(MjClient.homeui))
        return;

    var homeView = null;
    switch (MjClient.getAppType()) {
        case MjClient.APP_TYPE.YAAN: //雅安
            homeView = new HomeView_yaan();
            break;
    }
    MjClient.Scene.addChild(homeView, -1);
    if (MjClient.emailData) {
        homeView.runAction(cc.callFunc(function () {
            postEvent("refresh_mail_list", MjClient.emailData);
        }))
    }
};


MjClient.checkChangeLocationApp = function () {
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    var checkedAppList = [];
    for (var index in ChangeLocationAppList) {
        var appInfo = ChangeLocationAppList[index];
        if (MjClient.native.isAppInstalled(appInfo.package)) {
            checkedAppList.push(appInfo);
        }
    }
    var cmd = "MJChangeLocationApp";
    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ ||
        (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP && GameClass[MjClient.gameType] == MjClient.GAME_CLASS.PAO_HU_ZI)) {
        cmd = "sendLocationApps";
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: cmd, uid: SelfUid(), appList: checkedAppList });
};

MjClient.getWxHeadLocalUrlByHttp = function (uid, url) {
    // var dayStr = MjClient.dateFormat(new Date(), 'yyyy-MM-dd');
    var tempurl = url;
    var headFileName = uid + "_url_head" + ".jpg";
    var saveHeadUrl = jsb.fileUtils.getWritablePath() + headFileName;
    var urllocal = util.localStorageEncrypt.getStringItem(headFileName, "");
    if (urllocal != "" && (urllocal == url) && jsb.fileUtils.isFileExist(saveHeadUrl)) {
        return saveHeadUrl;
    } else {
        var randomInt = Math.floor(Math.random() * 100);
        tempurl += "?" + randomInt + "=" + randomInt + ".jpg";

        if (url && (uid)) {
            MjClient.urlImageDown(tempurl, headFileName, function (sprite, savepath) {
                util.localStorageEncrypt.setStringItem(headFileName, url);
            });
        }
        return tempurl;
    }

    return saveHeadUrl;
}
var loadArr = [];
MjClient.getWxHeadLocalUrl = function (uid, url) {
    // var dayStr = MjClient.dateFormat(new Date(), 'yyyy-MM-dd');
    var tempurl = url;
    var base64Name = util.base64.base64encode(url);
    var headFileName = base64Name + "_url_head" + ".jpg";
    var saveHeadUrl = jsb.fileUtils.getWritablePath() + headFileName;
    var urllocal = util.localStorageEncrypt.getStringItem(headFileName, "");
    if (urllocal != "" && (urllocal == url) && jsb.fileUtils.isFileExist(saveHeadUrl)) {
        return saveHeadUrl;
    } else {
        var randomInt = Math.floor(Math.random() * 100);
        tempurl += "?" + randomInt + "=" + randomInt + ".png";

        if (url && loadArr.length < 5) {
            loadArr.push(saveHeadUrl);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = function () {
                cc.log("xhr.readyState " + xhr.readyState);
                cc.log("xhr.status " + xhr.status);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), saveHeadUrl)) {
                            cc.log("writeDataToFile-------->5:" + saveHeadUrl);
                            util.localStorageEncrypt.setStringItem(headFileName, url);
                            loadArr.length = loadArr.length - 1;
                        } else {
                            loadArr.length = loadArr.length - 1;
                        }

                    } else {
                        loadArr.length = loadArr.length - 1;
                    }
                }
            };
            xhr.send();
        }
    }

    return tempurl;
}


//更新微信个人信息
MjClient.updateWXLoginData = function () {
    var wxLoginDataStr = util.localStorageEncrypt.getStringItem("WX_USER_LOGIN");
    if (wxLoginDataStr.length == 0) {
        return;
    }
    var wxLoginData = JSON.parse(wxLoginDataStr);
    if (!wxLoginData.refresh_token || !wxLoginData.appid) {
        return;
    }

    function refreshToken(callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + wxLoginData.appid + "&grant_type=refresh_token&refresh_token=" + wxLoginData.refresh_token;
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var msg = null;
                try {
                    msg = JSON.parse(xhr.responseText);
                    if (msg.refresh_token) {
                        wxLoginData.refresh_token = msg.refresh_token;
                    }
                    if (msg.access_token) {
                        if (callback) callback(msg.access_token);
                    }
                } catch (e) {
                    cc.log("refreshToken throw: " + JSON.stringify(e));
                }
            }
        };
        xhr.timeout = 3000;
        xhr.send();
    }

    function getUserinfo(access_token) {
        var xhr = cc.loader.getXMLHttpRequest();
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + wxLoginData.openid;
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var msg = null;
                try {
                    msg = JSON.parse(xhr.responseText);
                    if (msg.nickname) {
                        wxLoginData.nickname = escape(msg.nickname);
                    }
                    if (msg.sex) {
                        wxLoginData.sex = msg.sex;
                    }
                    if (msg.province) {
                        wxLoginData.province = msg.province;
                    }
                    if (msg.city) {
                        wxLoginData.city = msg.city;
                    }
                    if (msg.country) {
                        wxLoginData.country = msg.country;
                    }
                    if (msg.headimgurl) {
                        wxLoginData.headimgurl = msg.headimgurl;
                    }
                    util.localStorageEncrypt.setStringItem("WX_USER_LOGIN", JSON.stringify(wxLoginData));
                } catch (e) {
                    cc.log("getUserinfo throw: " + JSON.stringify(e));
                }
            }
        };
        xhr.timeout = 3000;
        xhr.send();
    }

    refreshToken(getUserinfo);
};

//是否开启贵族头像框（牌桌）
MjClient.isOpenHeadFrame = function () {
    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
        return true;
    }
    return false;
};
//是否开启入场动画(牌桌）
MjClient.isOpenJoinGameAni = function () {
    return util.localStorageEncrypt.getBoolItem("_RuChangAni", true);
};

var JSScene = cc.Scene.extend({
    jsBind: {
        _event: {
            changeUIEvent: function (type) {
                if (MjClient.homeui && cc.sys.isObjectValid(MjClient.homeui)) {
                    MjClient.homeui.removeFromParent(true);
                    MjClient.homeui = null;
                }
                MjClient.addHomeView(type);
            },
            openWeb: function (para) {
                if (haveThirdPartyWebView()) {
                    return;
                }
                MjClient.uiPara = para;
                let layer = new WebViewLayer();
                if (para.isGold) {
                    COMMON_UI.layerShowEffect(layer);
                }
                this.addChild(layer);
            },
            openNotice: function () {
                if (haveThirdPartyWebView()) {
                    return;
                }
                this.addChild(new InfoLayer());
            },
            popUpUnclosedMsg: function (pmsg) {
                if (haveThirdPartyWebView()) {
                    return;
                }
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
                this.addChild(UnclosedPopMsgView(pmsg));
            },
            popUpMsg: function (pmsg) {
                if (haveThirdPartyWebView()) {
                    return;
                }
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
                if (pmsg.param && pmsg.param == "nantongReplay")
                    this.addChild(NewPopMsgView(pmsg), 1);
                else
                    this.addChild(NewPopMsgView(pmsg));
            },
            popUpMsgTop: function (pmsg) {
                if (haveThirdPartyWebView()) {
                    return;
                }
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
                this.addChild(NewPopMsgView(pmsg), 9999);
            },
            popUpMsgOpenPos: function (pmsg) {
                if (haveThirdPartyWebView()) {
                    return;
                }
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
                this.addChild(PopMsgView_openPos(pmsg));
            },
            cfgUpdate: function (changeValue) {
                if (MjClient.restartTip || !changeValue.severRestart) return;
                MjClient.Scene.addChild(new RestartGameTip(), 99999);
            },
            updateFinish: function () {
                //if(!MjClient.gamenet)
                MjClient.gamenet = new MJNet();
                /*
                为了适配用户分组连接，将连接服务器的操作后置到微信授权成功后
                 */
                //MjClient.LoginGame();
                cc.log("updateFinish event");
                if (cc.sys.isObjectValid(MjClient.updateui)) {
                    MjClient.updateui.removeFromParent();
                    MjClient.updateui = null;
                }
                postEvent("connect");
            },
            connect: function () {
                cc.log("connect event");
                MjClient.game_on_show = true;
                if (!MjClient.homeui && !MjClient.playui) {
                    // mylog("loginui");
                    this.addChild(createLoginView());
                } else {
                    mylog("auto login");
                    MjClient.autoLogin();
                }
            },
            game_on_hide: function () {
                MjClient.game_on_show = false;
                MjClient.isJustComeBack = false;
            },
            game_on_show: function () {
                MjClient.game_on_show = true;
                MjClient.isJustComeBack = true; //从后台切回来
                setTimeout(function () {
                    MjClient.isJustComeBack = false;
                }, 10000);
                //理财宝箱时间 起后台 开启
                if (cc.sys.isObjectValid(MjClient.LiCaiBaoXiang_ui)) {
                    var _self = MjClient.LiCaiBaoXiang_ui;
                    _self.unscheduleAllCallbacks();
                    _self._schedule = false;
                    _self.reqBuyBoxInfo();
                }

                if (MjClient.playui || (MjClient.data && MjClient.data.sData)) MjClient.tickGame(0);
            },
            disconnect: function (code) {
                cc.log('----------disconnect---------', code)
                if (!MjClient.remoteCfg || code < 6 /*||MjClient.game_on_show*/) {
                    MjClient.unblock();
                    if (MjClient.reconnectFailedCount >= 3) {
                        MjClient.showMsgTop("网络连接断开(" + g_ErrorCode[code] + ")，请检查网络设置，重新连接", function () { MjClient.restartGame(); })
                    } else {
                        MjClient.reconnectFailedCount++;
                        util.localStorageEncrypt.setNumberItem("reconnectFailedCount", MjClient.reconnectFailedCount);
                        MjClient.restartGame();
                    }
                } else if (MjClient.remoteCfg && code == 6) {
                    MjClient.block();
                    MjClient.Scene.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                        MjClient.game_on_show = true;
                        MjClient.reconnect = true;
                        cc.log("reconnect");

                        if (!MjClient.gamenet)
                            MjClient.gamenet = new MJNet();
                        MjClient.autoLogin();
                    })));
                } else if (code == 7) {
                    let msg = {
                        content: '你的账号已在其他设备登录，请确认是否为本人操作。若非本人操作请尽快修改账号信息，请勿将账号告知他人。',
                        showCanel: false,
                        yesCall: () => {
                            MjClient.logoutCallbackFunc();
                        }
                    }
                    MjClient.Scene.addChild(new CommonTipsLayer(msg));
                }
            },
            loginOK: function (rtn) {
                if (MjClient.reconnect) {
                    MjClient.reconnect = false;
                    CheckUpdateResource();
                    mylog("CheckUpdateResource");
                }
                MjClient.lastMJTick = new Date().getTime();
                MjClient.reconnectFailedCount = 0;
                util.localStorageEncrypt.setNumberItem("reconnectFailedCount", 0);
                cc.log("loginOk creat home page --- by sking");
                //MjClient.data=rtn;
                MjClient.data = MjClient.data || {};
                for (var key in rtn) {
                    MjClient.data[key] = rtn[key];
                }
                MjClient._localTime = Date.now();
                util.localStorageEncrypt.setBoolItem("isAgent", isAgent());

                //本地缓存用户分组IP
                try {
                    if ("groupServer" in MjClient.data.pinfo) {
                        util.localStorageEncrypt.setStringItem("groupServer", JSON.stringify(MjClient.data.pinfo.groupServer));
                    }
                }
                catch (e) { }


                if ("uiType" in MjClient.data.pinfo && MjClient.setSkinToLocal) {
                    MjClient.setSkinToLocal(MjClient.data.pinfo.uiType);
                }

                for (var netEvt in MjClient.netCallBack) {
                    MjClient.gamenet.QueueNetMsgCallback(netEvt);
                }
                MjClient.gamenet.SetCallBack("disconnect", function () { postEvent("disconnect", 6); });

                if (!MjClient.homeui && !MjClient.playui && !haveThirdPartyWebView()) {
                    MjClient.native.setAliasAndTags4Jpush(MjClient.data.pinfo.uid, [MjClient.native.GetVersionName(), "" + MjClient.resVersion]);
                    MjClient.native.setInfo4Bugly(MjClient.data.pinfo.uid, MjClient.resVersion);
                    //登录成功加载主界面
                    MjClient.addHomeView();
                } else {
                    postEvent("updateInfo");
                }


                if (MjClient.FriendCard_main_ui && cc.sys.isObjectValid(MjClient.FriendCard_main_ui)) {
                    MjClient.FriendCard_main_ui.requestClubList();
                }

                if (rtn.matchTable > 0) {
                    MjClient.joinMatchTable(rtn.matchTable);
                } else if (rtn.vipTable > 0) {
                    delete MjClient._LAST_FIELD;
                    MjClient.UpdateResourceClassViewCallback = true;
                    MjClient.joinGame(rtn.vipTable);
                } else if (rtn.matchOngoing) {
                    MjClient.joinMatchTable(0, function (ret) {
                        if (ret.code) {
                            MjClient.showToast(ret.message);
                        } else {
                            MjClient.Scene.addChild(new roundEndLayer(1));
                        }
                    });
                } else if (rtn.matchs && Object.keys(rtn.matchs).length > 0) {
                    MjClient.block();
                    MjClient.gamenet.request("pkplayer.handler.matchSignUp", { matchId: rtn.matchs[(Object.keys(rtn.matchs))[0]].id }, function (rtn) {
                        MjClient.unblock();
                        if (rtn.code) {
                            MjClient.showToast(rtn.message);
                        } else {
                            //报名成功
                            cc.log("wxd..........重连报名成功" + JSON.stringify(rtn));
                            MjClient.Scene.addChild(new gameWaitingLayer(rtn.match));
                        }
                    });
                    //MjClient.Scene.addChild(new gameWaitingLayer(rtn.matchs[(Object.keys(rtn.matchs))[0]]));
                } else {
                    if (MjClient.rePlayVideo == -1) {
                        //MjClient.gamenet.request("pkplayer.handler.LeaveGame",{},function(rtn){});//这里发这个请求有什么鸟用？
                        delete MjClient.data.sData;
                        delete MjClient.gameType;
                        postEvent("LeaveGame");
                    }
                }
                if (MjClient.loginToGoldField && !MjClient.atGoldField) {
                    MjClient.loginToGoldField = false;
                    goldField_start();
                }
            },
            logout: function () {
                this.addChild(createLoginView());
            },
            createRoom: function (data) {
                cc.log("creat room layer --- by sking YYYYYYYYY ");

                var callbackFunc = function () {
                    MjClient.Scene.addChild(new CreateViewYaAn(data));
                    if (!data.IsFriendCard) {
                        MjClient.gamenet.request("pkplayer.handler.getRoomConfig", {
                            appid: "jiangshu"
                        },
                            function (rtn) {
                                cc.log("---------rtn.code------", JSON.stringify(rtn))
                                if (rtn.code == 0) {
                                    //MjClient.data.gameInfo.js3mj = rtn.data.gameInfo.js3mj;
                                    MjClient.data.gamePrice = rtn.data.gamePrice;
                                }
                            });
                    }
                }
                if (data && data.clubType == 1) {
                    FriendCard_Common.getRoomCardFreeConfig(callbackFunc);
                } else {
                    callbackFunc();
                }

            },
            field_reconnection: function (data) {
                if (typeof (goldField_start) != "undefined") {
                    goldField_start();
                    return;
                }

                MjClient.block();
                MjClient.GoldFieldInto(function (code) {
                    MjClient.unblock();
                    if (code == 0) {
                        if (!cc.sys.isObjectValid(MjClient.goldHallLayer)) {
                            if (cc.sys.isObjectValid(MjClient.homeui) && MjClient.homeui.doHideAction) {
                                MjClient.homeui.doHideAction();
                            } else {
                                var goldHallLayer = new GoldHallLayer(1);
                                MjClient.goldHallLayer = goldHallLayer;
                                MjClient.Scene.addChild(goldHallLayer, -1);
                            }
                        }
                    }
                });

            },
            initSceneData: function (data) {
                MjClient.unblock();
            },
            WX_SHARE_SUCCESS: function (data) //分享成功的回调
            {
                cc.log("WX_SHARE_SUCCESS:" + JSON.stringify(data));
                cc.log("WX_SHARE_SUCCESS:" + data.errCode);
                cc.log("WX_SHARE_SUCCESS:" + parseInt(data.errCode));
                if (parseInt(data.errCode) == 0 && MjClient.wxShareImageToPYQ == true) {
                    var _shareType = MjClient.shareType;

                    MjClient.gamenet.request("pkplayer.handler.wxShare", {
                        uid: SelfUid(),
                        key: _shareType,
                    },
                        function (rtn) {
                            cc.log("pkplayer.handler.wxShare ----------- " + JSON.stringify(rtn));
                            if (rtn.code == 0 && rtn.data) {
                                var _type = null;
                                var _number = null;
                                let data = {}
                                data.award = rtn.data
                                if (rtn.data.redPacket > 0) {
                                    //分享得红包
                                    _type = 2;
                                    _number = rtn.data.redPacket;
                                } else if (rtn.data.money > 0) {
                                    //分享得元宝
                                    _type = 1;
                                    _number = rtn.data.money;
                                } else if (rtn.data.integral > 0) {
                                    //分享得礼券
                                    _type = 3;
                                    _number = rtn.data.integral;
                                } else if (rtn.data.gold > 0) {
                                    //分享得金币
                                    _type = 4;
                                    _number = rtn.data.gold;
                                }
                                data.award.redpacket = rtn.data.redPacket //命名大小写不一样，重新赋值一次
                                MjClient.Scene.addChild(new luckyBack_QiandaoLayer(data));


                            } else {
                                MjClient.showToast(rtn.message);
                            }
                        });

                }
                MjClient.wxShareImageToPYQ = false;
            },
            appPayFinished: function (jsonString) //前端支付完成的回调
            {
                var json = jsonString;
                if (cc.isString(jsonString)) {
                    json = JSON.parse(jsonString);
                }
                var result = parseInt(json.result);
                var msg = "";
                if (json.msg) {
                    msg = "" + json.msg;
                    msg = decodeURI(msg);
                }
                var str = "";
                if (result == 0) {
                    str = "支付成功.";
                } else if (result == 1) {
                    str = "取消支付." + msg;
                } else {
                    str = "支付失败." + msg;
                }
                MjClient.showToastDelay(str);



                if (json.platform == PayPlatformType.APPLE) {
                    var data = {
                        orderId: json.orderId,
                        result: result,
                        transactionReceipt: json.transactionReceipt
                    };
                    MjClient.gamenet.request("pkplayer.handler.applePayNotify", data,
                        function (rtn) {
                            cc.log("pkplayer.handler.applePayNotify ----------- " + JSON.stringify(rtn));
                        });
                }
            },
        }
    },
    isQueueNetHadEvent: function (eventName) {
        for (var i in MjClient.NetMsgQueue) {
            var tempEd = MjClient.NetMsgQueue[i];
            if (tempEd[0] == eventName) {
                return true;
            }
        }
        return false;
    },
    canPushQueueNet: function (eventName) {
        var initSceneFilt = {
            'MJPeng': true,
            'MJChi': true,
            'MJGang': true
        }

        // 等待执行 initSceneData 的时候， 不需要执行 initSceneFilt 中的事件
        if (this.isQueueNetHadEvent('initSceneData') && initSceneFilt[eventName]) {
            return false;
        }

        return true;
    },
    pushQueueNetMsg: function (ed) {//使用新的事件循环机制
        var eventName = ed[0];
        if (eventName == "mjhand" && ed.length == 2) {
            MjClient.NetMsgQueue.push(["moveHead", {}]);
        }
        // 汨罗红中 修改碰牌显示多牌的问题 现在汨罗红中测试 修复情况
        if (MjClient.gameType == MjClient.GAME_TYPE.ML_HONGZHONG ||
            MjClient.gameType == MjClient.GAME_TYPE.CHEN_ZHOU ||
            MjClient.gameType == MjClient.GAME_TYPE.HAI_AN_MJ ||
            MjClient.gameType == MjClient.GAME_TYPE.HAI_AN_BAI_DA) {
            if (this.canPushQueueNet(eventName)) MjClient.NetMsgQueue.push(ed);
        } else {
            MjClient.NetMsgQueue.push(ed);
        }
    },
    update: function (dt) {
        this._downAndPlayVoiceMessageQueueRemainTime = this._downAndPlayVoiceMessageQueueRemainTime || 0;
        this._downAndPlayVoiceMessageQueueRemainTime -= dt;
        if (this._downAndPlayVoiceMessageQueueRemainTime <= 0) {
            this._downAndPlayVoiceMessageQueueRemainTime = 0;
            MjClient.downAndPlayVoiceMessageQueue = MjClient.downAndPlayVoiceMessageQueue || [];
            if (MjClient.downAndPlayVoiceMessageQueue.length > 0) {
                var msg = MjClient.downAndPlayVoiceMessageQueue[0];
                msg.num = msg.num || 1; //录音时长
                this._downAndPlayVoiceMessageQueueRemainTime = parseInt(msg.num) / 1000 + 1.5;
                postEvent("downAndPlayVoice", msg);
                MjClient.downAndPlayVoiceMessageQueue.splice(0, 1);
            }
        }


        //configuration.json中的通知循环弹出
        if (MjClient.updateCfg &&
            MjClient.dateInRectDate(MjClient.getCurrentTime(), formatData(MjClient.updateCfg.restartTipBegin), formatData(MjClient.updateCfg.restartTipEnd))) {
            this._restartTipTime = this._restartTipTime || 0;
            this._restartTipTime -= dt;

            if (this._restartTipTime < 0) {
                var changeValue = {};
                changeValue.severRestart = MjClient.updateCfg.severRestart;
                postEvent("cfgUpdate", changeValue);
                this._restartTipTime = Number(MjClient.updateCfg.restartTipInterval);
            }
        }


        //使用新的事件循环机制
        this._netMsgQueueRemainTime = this._netMsgQueueRemainTime || 0;
        this._netMsgQueueRemainTime -= dt;
        if (this._netMsgQueueRemainTime <= 0) {
            this._netMsgQueueRemainTime = 0;

            // 修正比赛场从后台切回来后报各种错的bug
            try {
                var isXing = false;
                if (MjClient.data && MjClient.data.sData && MjClient.data.sData.tData) {
                    var tData = MjClient.data.sData.tData;
                    var selfIndex = tData.uids.indexOf(SelfUid());
                    if (selfIndex == tData.xingPlayer) {
                        isXing = true;
                    }
                }

                if (MjClient.isJustComeBack &&
                    MjClient.data &&
                    MjClient.data.sData &&
                    MjClient.data.sData.tData &&
                    (MjClient.data.sData.tData.matchId || isXing)) {
                    var len = MjClient.NetMsgQueue.length;
                    var hasRoundEnd = false;
                    var count = len;
                    for (var i = 0; i < len; i++) {
                        var str = MjClient.NetMsgQueue[i][0];
                        if (str == "MJTick") {
                            count -= 1;
                        } else if (str == "roundEnd") {
                            hasRoundEnd = true;
                        }
                    }

                    if (count > 10 || hasRoundEnd) {
                        MjClient.isJustComeBack = false;
                        MjClient.NetMsgQueue = [];
                        pomelo.disconnect();
                    }
                }
            } catch (e) { }

            if (MjClient.NetMsgQueue.length > 0) {
                var ed = MjClient.NetMsgQueue[0];
                var dh = MjClient.netCallBack[ed[0]];
                var delay = dh[0];
                if (MjClient.rePlayVideo != -1) { //回放时不延时
                    delay = 0;
                }
                // 汨罗红字 延迟处理（麻将 字牌公用MJPut）
                try {
                    if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ML_HONG_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_WAI_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_YANG_WAI_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NAN_XIAN_GUI_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_JIANG_GUI_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_ZI_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.GUI_YANG_ZI_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NING_XIANG_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_PENG_HU ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_MAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHANG_DE_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_LING_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHI_MEN_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XI_2710 ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HAN_SHOU_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_XIANG_WEI_MA_QUE ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XI_96POKER ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XU_PU_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_ZI_BO_PI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DANG_YANG_FAN_JING ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_YE_ZI_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_CHANG_SHANG_DA_REN ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HU_BEI_HUA_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.GONG_AN_HUA_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.TONG_CHENG_GE_ZI_PAI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.EN_SHI_SHAO_HU) &&
                        (ed[0] == "MJPut" || ed[0] == "HZNewCard")) {

                        var type = ziPai.getSuDuType();
                        if (MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP &&
                            (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA)) {
                            delay = [0.9, 1, 0.7, 0.3][getSuDuType_leiYang()];
                        }
                        else if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_ZI_BO_PI) {
                            delay = 1;
                        }
                        else if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP && (
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI)) {
                            delay = 0.9;
                        }
                        else if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_WAI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_YANG_WAI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.GUI_YANG_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NING_XIANG_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_PENG_HU ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_MAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XI_2710 ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HAN_SHOU_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_XIANG_WEI_MA_QUE ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_YE_ZI_PAI) {
                            delay = [0.9, 0.7, 1.1, 0.3][type];
                        }
                        else if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHANG_DE_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_LING_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHI_MEN_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NAN_XIAN_GUI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_JIANG_GUI_HU_ZI) && MjClient.rePlayVideo == -1) {
                            delay = [0.9, 0.7, 1.1, 0.3][type];
                        }
                        else {
                            if (type == 0) {
                                delay = 0.7;
                            } else {
                                delay = 0.3;
                            }
                            if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
                                if (type == 0) {
                                    delay = 0.3;
                                } else {
                                    delay = 0.7;
                                }
                            }
                            if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DANG_YANG_FAN_JING ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_CHANG_SHANG_DA_REN ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HU_BEI_HUA_PAI ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.GONG_AN_HUA_PAI ||
                                MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.TONG_CHENG_GE_ZI_PAI) {
                                delay = 0.7;
                            }
                        }
                        cc.log("delay = " + delay);
                    }

                    if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LEI_YANG_GMJ ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.WANG_DIAO_MA_JIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YONG_ZHOU_MJ ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.JIANG_HUA_MJ ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.TY_ZHUANZHUAN ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.TY_HONGZHONG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XIANG_HONG_ZHONG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HUAI_HUA_MA_JIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_MA_JIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DAO_ZHOU_MJ ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_MA_JIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHANG_SHA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_CHANG_SHA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIN_NING_MA_JIANG) && ed[0] == "MJPut") {
                        delay = 0;
                    }

                    // 打筒子PKPass
                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG && (ed[0] == "waitPut")) {
                        delay = 0.6;
                    }
                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.BAN_BIAN_TIAN_ZHA && (ed[0] == "PKPut") && MjClient.majiang.isTianZha(MjClient.data.sData.tData.lastPutCard)) {
                        delay = 1.0;
                    }
                    if (ed[0] == "HZPickCard" && (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP)) {
                        delay = 0.8;
                    }

                    if ((MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) &&
                        (GameClass[MjClient.gameType] == MjClient.GAME_CLASS.PAO_HU_ZI) && (ed[0] == "MJPut" || ed[0] == "HZNewCard")) {
                        delay = ziPai.getAutoPassTime();
                        if (MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP) {
                            delay = getCurrentCardSpeed();
                        }
                    }

                    //湘乡告胡子/娄底放炮罚庄家亮张的牌需要完成动画
                    if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HUAI_HUA_HONG_GUAI_WAN ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_FANG_PAO_FA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XIANG_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_TAN_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LENG_SHUI_JIANG_SHI_HU_DAO) &&
                        ed[0] == "HZNewCard" && MjClient.data.sData.tData.isLastDraw) {
                        delay = 1.2;
                    } else if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XIANG_PAO_HU_ZI ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_TAN_PAO_HU_ZI) &&
                        ed[0] == "HZNewCard" && MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        delay = ziPai.getAutoPassTime();
                    }

                    //安化跑胡子有洗牌特效要展示
                    if (MjClient.rePlayVideo == -1 &&
                        (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.GUI_YANG_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NING_XIANG_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_PENG_HU ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHEN_ZHOU_MAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.CHANG_DE_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_LING_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHI_MEN_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.ML_HONG_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_YANG_WAI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NAN_XIAN_GUI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUAN_JIANG_GUI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_WAI_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XI_2710 ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HAN_SHOU_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_FANG_PAO_FA ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_ZI_BO_PI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HUAI_HUA_HONG_GUAI_WAN ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_ER_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_PAO_HU_ZI ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LENG_SHUI_JIANG_SHI_HU_DAO ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_XIANG_WEI_MA_QUE ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_YE_ZI_PAI)) {
                        if (ed[0] == "mjhand") {
                            delay = 4;
                            //剥皮小结算洗牌特殊情况
                            if (MjClient.playui && MjClient.playui.getMjhandDelay) {
                                delay = MjClient.playui.getMjhandDelay();
                            }
                            else if (MjClient.data.sData.tData.areaSelectMode.isManualCutCard) {
                                delay = 2;
                            } else if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_PENG_HU) {
                                delay = 0;
                            }
                        }
                        //永州扯胡子(邵阳)有洗牌特效要展示
                    } else if (MjClient.rePlayVideo == -1 && (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_ER
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King
                        || MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.LUO_DI_SAO)) {
                        if (MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) {
                            if (ed[0] == "mjhand") {
                                delay = 4;
                                if (MjClient.playui && MjClient.playui.getMjhandDelay) {
                                    delay = MjClient.playui.getMjhandDelay();
                                } else if (MjClient.data.sData.tData.areaSelectMode.isManualCutCard) {
                                    delay = 2;
                                }
                            }
                        }
                    }

                    //打炸弹
                    if ((MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_DA_ZHA_DAN ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG) &&
                        (ed[0] == "mjhand" || ed[0] == "roundEnd")) {
                        delay = 2.5;
                    }

                    if (MjClient.rePlayVideo == -1 && MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP &&
                        MjClient.data.sData.tData.areaSelectMode.isManualCutCard == 0 && ed[0] == "mjhand" &&
                        (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG ||
                            MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA)) {
                        delay = 2;
                    }

                    //安化麻将掷骰子延迟
                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_MA_JIANG_SW ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.AN_HUA_MA_JIANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.NING_XIANG_KAI_WANG ||
                        MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.HUAI_HUA_MA_JIANG) {
                        if (ed[0] == "MJZhiTouZi") {
                            delay = 3;
                        }
                    }

                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.TAO_JIANG_MA_JIANG) {
                        if (ed[0] == "MJZhiTouZi") {
                            delay = 1;
                        }
                    }

                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU
                        && (ed[0] == "HZNewCard" || ed[0] == "newCard")) {
                        //海底延迟

                        var next = MjClient.majiang.getAllCardsTotal() - MjClient.data.sData.tData.cardNext;
                        if ((next - MjClient.data.sData.tData.maxPlayer) < 0) {
                            delay = 1;
                        }

                    }
                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.YI_YANG_MA_JIANG
                        && ed[0] == "PickHaiDiCard") {
                        delay = 0.5;
                    }

                    //湘西96扑克延迟
                    if (MjClient.data.sData.tData.gameType == MjClient.GAME_TYPE.XIANG_XI_96POKER) {
                        var type = ziPai.getSuDuType();
                        if (ed[0] == 'HZNewCard' || ed[0] == 'MJPut') {
                            delay = [1, 1.2, 1.6, 0.4][type];
                        }
                        else if (ed[0] == 'HZTieCard' || ed[0] == 'HZChiCard' || ed[0] == 'HZWeiCard' ||
                            ed[0] == 'MJPeng' || ed[0] == 'HZGangCard' || ed[0] == 'MJHu') {
                            delay = 0.5
                        }
                    }

                    if (ed[0] == "MJHu" && (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ
                        || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                        && GameClass[MjClient.gameType] == MjClient.GAME_CLASS.PAO_HU_ZI) {
                        delay = 0.5;
                    }

                    if (ed[0] == "MJHu" && (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ
                        || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                        && (MjClient.gameType == MjClient.GAME_TYPE.CHANG_SHA ||
                            MjClient.gameType == MjClient.GAME_TYPE.HENG_YANG_CHANG_SHA)) {
                        delay = 0.5;
                    }
                } catch (e) { }

                //邵阳剥皮 发牌吃牌动画调整
                try {
                    if (MjClient.playui.getSendCardInterval && MjClient.data.sData.tData.areaSelectMode.faPai != undefined) {
                        //出牌没有落牌 扣除落牌时间
                        if ("MJPut" == ed[0]) {
                            delay = MjClient.playui.getSendCardInterval() * 0.5;
                        } else if ("HZNewCard" == ed[0]) {
                            delay = MjClient.playui.getSendCardInterval();
                        } else if ("HZGangCard" == ed[0]) {
                            delay = 0.65;//最慢动画时间总长0.65
                        }
                    }
                } catch (e) { }

                // 跑得快取消头像移动，因此延迟时间要短
                if (ed[0] == "moveHead" && GameClass[MjClient.gameType] == MjClient.GAME_CLASS.PAO_DE_KUAI)
                    delay = 0.1;

                //阳新麻将发倒数最后的牌时，如果玩家不能胡，直接给下家发牌，需要延时处理下个消息，玩家自己将牌加入到手牌中并显示出来
                if (MjClient.GAME_TYPE.YANG_XIN_MA_JIANG == MjClient.gameType && MjClient.APP_TYPE.HUBEIMJ == MjClient.getAppType() && ed[0] == "waitPut") {
                    var tData = MjClient.data.sData.tData;
                    var maxPlayer = tData.maxPlayer;
                    var currPlayer = MjClient.data.sData.players[tData.uids[ed[1].curPlayer]];
                    if (ed[0] == "waitPut" && (MjClient.majiang.getAllCardsTotal(tData) - 14 - maxPlayer) < (ed[1].cardNext) && (currPlayer.eatFlag & 8) == 0) {
                        delay = 1;
                    }
                }

                //蕲春红中杠麻将发倒数最后的牌时，如果玩家不能胡，直接给下家发牌，需要延时处理下个消息，玩家自己将牌加入到手牌中并显示出来
                if (MjClient.GAME_TYPE.QI_CHUN_HONG_ZHONG_GANG == MjClient.gameType && MjClient.APP_TYPE.HUBEIMJ == MjClient.getAppType() && ed[0] == "waitPut") {
                    var tData = MjClient.data.sData.tData;
                    var maxPlayer = tData.maxPlayer;
                    var currPlayer = MjClient.data.sData.players[tData.uids[ed[1].curPlayer]];
                    if (ed[0] == "waitPut" && (MjClient.majiang.getAllCardsTotal(tData) - 10 - maxPlayer) < (ed[1].cardNext) && (currPlayer.eatFlag & 8) == 0) {
                        delay = 1;
                    }
                }
                if (MjClient.gameType == MjClient.GAME_TYPE.EN_SHI_SHAO_HU) {
                    if (ed[0] == 'HZLiuCard') {
                        delay = 0.5;
                    }
                }

                if (MjClient.gameType == MjClient.GAME_TYPE.YONG_ZHOU_LAO_CHUO) {
                    if (ed[0] == 'PKPass') {
                        delay = 0.5;
                    }
                }

                if (ed[0] == "newCard" && MjClient.MJPutCache) {
                    MjClient.netCallBack.MJPut[1](MjClient.MJPutCache);
                    postEvent("MJPut", MjClient.MJPutCache);
                    delete MjClient.MJPutCache;
                }
                else if (ed[0] == "MJPut" && ed[1].nextUid == SelfUid()) {
                    MjClient.MJPutCache = ed[1];
                    MjClient.NetMsgQueue.splice(0, 1);
                }
                else {
                    var handleData = dh[1](ed[1]);
                    cc.log("============postEvent=====", ed[0]);
                    if (handleData != -1) postEvent(ed[0], ed[1]);
                    this._netMsgQueueRemainTime = delay;
                    MjClient.NetMsgQueue.splice(0, 1);
                }


            }
        }

    },
    ctor: function () {
        this._super();
        this.isNewCreate = true;
        if (!util.localStorageEncrypt.getNumberItem("loginFirst")) {
            util.localStorageEncrypt.setNumberItem("loginFirst", 1)
            util.localStorageEncrypt.setBoolItem("loginData_auto", true);
        }
        cc.log("scene init");
    },
    onEnter: function () {
        //只创建了一次场景

        cc.log("create sence -----22-----by sking");
        this._super();

        if (!this.isNewCreate) {
            if (MjClient.loginToGoldField) {
                MjClient.Scene.stopActionByTag(20190319);
                MjClient.logoutCallbackFunc();
            }
            return;
        }
        this.isNewCreate = false;

        setMusicVolume(-1);
        BindUiAndLogic(this, this.jsBind);
        this.addChild(new UpdateView());

        this.scheduleUpdate();
    }
});


