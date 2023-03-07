// 安乡偎麻雀算法
(function() {
    //老名堂版 小卓版 大卓版 全名堂版 钻石版 至尊(added 2019-6.28)
    var MingTangType = {
        LAO_MING_TANG: 0,
        XIAO_ZHUO: 1,
        DA_ZHUO: 2,
        QUAN_MING_TANG: 3,
        ZUAN_SHI: 4,
        ZHI_ZUN: 5
    };
    var MingTang = {
        YIN_HU: 1,
        HONG_HU: 2,
        DUI_ZI_HU: 3,
        WU_DUI: 4,
        WU_HU: 5,
        DIAN_HU: 6,
        MAN_YUAN_HUA_1: 7,
        MAN_YUAN_HUA_2: 8,
        DA_XIAO_ZI_HU: 9,
        CHUN_YIN: 10,
        ZHUO_HU: 11,
        ZI_MEI_ZHUO: 12,
        SAN_LUAN_ZHUO: 13,
        ZI_MEI_ZHUO_DAI_TUO: 14,
        DIA_SUN_ZHUO: 15,
        SI_LUAN_ZHUO: 16,
        DIA_SUN_ZHUO_DAI_TUO: 17,
        LIANG_ZI_MEI_ZHUO: 18,
        ZU_SUN_ZHUO: 19,
        HAI_DI_HU: 20,
        DAN_DIAO: 21,
        ZHEN_BA_PENG_TOU: 22,
        JIA_BA_PENG_TOU: 23,
        BEI_KAO_BEI: 24,
        SHOU_QIAN_SHOU: 25,
        LONG_BAI_WEI: 26,
        QIA_WEI: 27,
        WU_XI_TIAN_HU: 28,
        YOU_XI_TIAN_HU: 29,
        QUAN_QIU_REN: 30,
        DING_DUI: 31,
        PIAO_DUI: 32,
        JI_DING: 33,
        BIAN_DING: 34,
        SHANG_XIA_WU_QIAN_NIAN: 35,
        FENG_BAI_WEI: 36,
        BIAN_KAN: 37,
        DUI_DAO_HU: 38,
        YUAN_YUAN_DING: 39,
        QIA_HU: 40,
        ZHE_ZHE_HU: 41,
        HONG_ZHA_DAN: 42,
        HEI_ZHA_DAN: 43,
        ZHEN_BEI_KAO_BEI: 44,
        QUAN_HEI: 45,
        LIU_DUI_HONG: 46,
        JIU_DUI: 47,
        SI_BIAN_DUI: 48,
        XIN_LIAN_XIN: 49,
        GA_NUAN_DA: 50,
        YI_TIAO_LONG: 51,
        GE_SHAN_DA_NIU: 52,
        HUO_ZHUO_XIAO_SAN: 53,
        LIANG_HONG_LIANG_HEI: 54,
        QUAN_KAN_QUAN_DUI: 55,
        DA_XIAO_TONG_ZHA: 56,
        ZI_MEI_ZHA: 57,
        DIA_SUN_ZHA: 58,
        ZU_SUN_ZHA: 59,
        MEI_NV_CAI_DAN_CHE: 60,
        ER_LONG_XI_ZHU: 61,
        ZI_MO_HU: 62,
    };

    function PaoHuZiAnXiangWeiMaQue() {
        this.handCount = 19;
        this.MingTangCfg = {};

        this.MingTangCfg[MingTang.YIN_HU] = {
            name: "印胡",
            score: [10, 20, 30, 30, 30, 50],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtYinHu.bind(this)
        };
        this.MingTangCfg[MingTang.HONG_HU] = {
            name: "红胡",
            score: [10, 10, 20, 20, 30, 50],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtHongHu.bind(this)
        };
        this.MingTangCfg[MingTang.DUI_ZI_HU] = {
            name: "对子胡",
            score: [4, 6, 10, 10, 10, 12],
            isHardHuXiRate:true,
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtDuiZiHu.bind(this)
        };
        this.MingTangCfg[MingTang.WU_DUI] = {
            name: "乌对",
            isHardHuXiRate:true,
            score: [6, 8, 15, 15, 15, 18],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtWuDui.bind(this)
        };
        this.MingTangCfg[MingTang.WU_HU] = {
            name: "乌胡",
            isHardHuXiRate:true,
            score: [3, 5, 6, 6, 8, 10],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtWuHu.bind(this)
        };
        this.MingTangCfg[MingTang.DIAN_HU] = {
            name: "点胡",
            isHardHuXiRate:true,
            score: [2, 3, 4, 4, 6, 8],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtDianHu.bind(this)
        };
        this.MingTangCfg[MingTang.MAN_YUAN_HUA_1] = {
            name: "10息满园花",
            score: [50, 100, 150, 150, 200, 300],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtManYuanHua1.bind(this)
        };
        this.MingTangCfg[MingTang.MAN_YUAN_HUA_2] = {
            name: "2息满园花",
            score: [50, 100, 120, 120, 150, 200],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtManYuanHua2.bind(this)
        };
        this.MingTangCfg[MingTang.DA_XIAO_ZI_HU] = {
            name: "大小字胡",
            score: [50, 100, 150, 150, 200, 200],
            isActive: [1, 1, 1, 1, 1, 1],
            func: this.mtDaXiaoZi.bind(this)
        };
        this.MingTangCfg[MingTang.CHUN_YIN] = {
            name: "纯印",
            score: [0, 100, 150, 150, 150, 200],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtChunYin.bind(this)
        };
        this.MingTangCfg[MingTang.ZHUO_HU] = {
            name: "卓胡",
            score: [0, 20, 40, 40, 50, 50],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtZhuoHu.bind(this)
        };
        this.MingTangCfg[MingTang.ZI_MEI_ZHUO] = {
            name: "姊妹卓",
            score: [0, 40, 80, 80, 100, 100],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtZiMeiZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.SAN_LUAN_ZHUO] = {
            name: "三乱卓",
            score: [0, 60, 100, 100, 150, 150],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtSanLuanZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.ZI_MEI_ZHUO_DAI_TUO] = {
            name: "姊妹卓带拖",
            score: [0, 80, 150, 150, 200, 200],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtZiMeiZhuoDaiTuo.bind(this)
        };
        this.MingTangCfg[MingTang.DIA_SUN_ZHUO] = {
            name: "嗲孙卓",
            score: [0, 150, 300, 300, 300, 400],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtDiaSunZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.SI_LUAN_ZHUO] = {
            name: "四乱卓",
            score: [0, 200, 300, 300, 300, 400],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtSiLuanZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.DIA_SUN_ZHUO_DAI_TUO] = {
            name: "嗲孙卓带拖",
            score: [0, 300, 400, 400, 400, 500],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtDiaSunZhuoDaiTuo.bind(this)
        };
        this.MingTangCfg[MingTang.LIANG_ZI_MEI_ZHUO] = {
            name: "两姊妹卓",
            score: [0, 300, 400, 400, 400, 500],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtLiangZiMeiZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.ZU_SUN_ZHUO] = {
            name: "祖孙卓",
            score: [0, 400, 500, 500, 500, 600],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtZhuSunZhuo.bind(this)
        };
        this.MingTangCfg[MingTang.HAI_DI_HU] = {
            name: "海底胡",
            score: [0, 20, 50, 50, 50, 50],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtHaiDiHu.bind(this)
        };
        this.MingTangCfg[MingTang.DAN_DIAO] = {
            name: "单吊",
            score: [
                [0, 0],
                [10, 20],
                [30, 50],
                [30, 50],
                [30, 50],
                [50, 80]
            ],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtDanDiao.bind(this)
        };
        this.MingTangCfg[MingTang.ZHEN_BA_PENG_TOU] = {
            name: "真八碰头",
            score: [0, 200, 300, 300, 400, 400],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtZhenBaPengTou.bind(this)
        };
        this.MingTangCfg[MingTang.JIA_BA_PENG_TOU] = {
            name: "假八碰头",
            score: [0, 100, 150, 150, 200, 200],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtJiaBaPengTou.bind(this)
        };
        this.MingTangCfg[MingTang.BEI_KAO_BEI] = {
            name: "背靠背",
            score: [0, 20, 50, 50, 50, 80],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtBeiKaoBei.bind(this)
        };
        this.MingTangCfg[MingTang.SHOU_QIAN_SHOU] = {
            name: "手牵手",
            score: [0, 20, 50, 50, 50, 80],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtShouQianShou.bind(this)
        };
        this.MingTangCfg[MingTang.LONG_BAI_WEI] = {
            name: "龙摆尾",
            score: [0, 100, 150, 150, 150, 150],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtLongBaiWei.bind(this)
        };
        this.MingTangCfg[MingTang.QIA_WEI] = {
            name: "卡偎",
            score: [0, 50, 50, 50, 100, 100],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtQiaWei.bind(this)
        };
        this.MingTangCfg[MingTang.WU_XI_TIAN_HU] = {
            name: "无息天胡",
            score: [0, 50, 100, 100, 100, 150],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.thWuXiTianHu.bind(this)
        };
        this.MingTangCfg[MingTang.YOU_XI_TIAN_HU] = {
            name: "有息天胡",
            score: [0, 50, 100, 100, 100, 150],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtYouXiTianHu.bind(this)
        };
        this.MingTangCfg[MingTang.QUAN_QIU_REN] = {
            name: "全球人",
            score: [0, 100, 150, 150, 150, 200],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtQuanQiuRen.bind(this)
        };
        this.MingTangCfg[MingTang.DING_DUI] = {
            name: "顶对",
            score: [0, 20, 50, 50, 50, 100],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtDingDui.bind(this)
        };
        this.MingTangCfg[MingTang.PIAO_DUI] = {
            name: "飘对",
            score: [0, 20, 50, 50, 50, 80],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtPiaoDui.bind(this)
        };
        this.MingTangCfg[MingTang.JI_DING] = {
            name: "鸡丁",
            score: [0, 50, 100, 100, 100, 150],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtJiDing.bind(this)
        };
        this.MingTangCfg[MingTang.BIAN_DING] = {
            name: "边丁",
            score: [0, 20, 50, 50, 50, 60],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtBianDing.bind(this)
        };
        this.MingTangCfg[MingTang.SHANG_XIA_WU_QIAN_NIAN] = {
            name: "上下五千年",
            score: [0, 20, 50, 50, 50, 80],
            isActive: [0, 1, 1, 1, 1, 1],
            func: this.mtShangXiaWuQianNian.bind(this)
        };
        this.MingTangCfg[MingTang.FENG_BAI_WEI] = {
            name: "凤摆尾",
            score: [0, 0, 50, 50, 50, 80],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtFengBaiWei.bind(this)
        };
        this.MingTangCfg[MingTang.BIAN_KAN] = {
            name: "边坎",
            score: [0, 0, 30, 30, 30, 50],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtBianKan.bind(this)
        };
        this.MingTangCfg[MingTang.DUI_DAO_HU] = {
            name: "对倒胡",
            score: [0, 0, 30, 30, 30, 50],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtDuiDaoHu.bind(this)
        };
        this.MingTangCfg[MingTang.YUAN_YUAN_DING] = {
            name: "圆圆丁",
            score: [0, 0, 100, 100, 100, 200],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtYuanYuanDing.bind(this)
        };
        this.MingTangCfg[MingTang.QIA_HU] = {
            name: "卡胡",
            score: [0, 0, 30, 30, 30, 80],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtQiaHu.bind(this)
        };
        this.MingTangCfg[MingTang.ZHE_ZHE_HU] = {
            name: "啫啫胡",
            score: [0, 0, 30, 30, 30, 50],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.mtZheZheHu.bind(this)
        };
        this.MingTangCfg[MingTang.HONG_ZHA_DAN] = {
            name: "红炸弹",
            score: [0, 0, 200, 200, 200, 260],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.thHongZhaDan.bind(this)
        };
        this.MingTangCfg[MingTang.HEI_ZHA_DAN] = {
            name: "黑炸弹",
            score: [0, 0, 100, 100, 100, 150],
            isActive: [0, 0, 1, 1, 1, 1],
            func: this.thHeiZhaDan.bind(this)
        };
        this.MingTangCfg[MingTang.ZHEN_BEI_KAO_BEI] = {
            name: "真背靠背",
            score: [0, 0, 0, 100, 100, 150],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtZhenBeiKaoBei.bind(this)
        };
        this.MingTangCfg[MingTang.QUAN_HEI] = {
            name: "全黑",
            score: [0, 0, 0, 120, 150, 150],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.thQuanHei.bind(this)
        };
        this.MingTangCfg[MingTang.LIU_DUI_HONG] = {
            name: "六对红",
            score: [0, 0, 0, 120, 150, 150],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.thLiuDuiHong.bind(this)
        };
        this.MingTangCfg[MingTang.JIU_DUI] = {
            name: "九对",
            score: [
                [0, 0],
                [0, 0],
                [0, 0],
                [120, 240],
                [150, 300],
                [150, 300]
            ],
            isActive: [0, 0, 0, 1, 1],
            func: this.thJiuDui.bind(this)
        };
        this.MingTangCfg[MingTang.SI_BIAN_DUI] = {
            name: "四边对",
            score: [0, 0, 0, 120, 150, 150],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.thSiBianDui.bind(this)
        };
        this.MingTangCfg[MingTang.XIN_LIAN_XIN] = {
            name: "心连心",
            score: [0, 0, 0, 30, 30, 50],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtXinLianXin.bind(this)
        };
        this.MingTangCfg[MingTang.GA_NUAN_DA] = {
            name: "嘎暖哒",
            score: [0, 0, 0, 30, 30, 0],
            isActive: [0, 0, 0, 1, 1, 0],
            func: this.mtGaNuanDa.bind(this)
        };
        this.MingTangCfg[MingTang.YI_TIAO_LONG] = {
            name: "一条龙",
            score: [0, 0, 0, 150, 150, 150],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtYiTiaoLong.bind(this)
        };
        this.MingTangCfg[MingTang.GE_SHAN_DA_NIU] = {
            name: "隔山打牛",
            score: [0, 0, 0, 30, 30, 50],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtGeShanDaNiu.bind(this)
        };
        this.MingTangCfg[MingTang.HUO_ZHUO_XIAO_SAN] = {
            name: "活捉小三",
            score: [0, 0, 0, 30, 30, 50],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtHuoZhuoXiaoSan.bind(this)
        };
        this.MingTangCfg[MingTang.LIANG_HONG_LIANG_HEI] = {
            name: "两红两黑",
            score: [0, 0, 0, 30, 30, 50],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtLiangHongLiangHei.bind(this)
        };
        this.MingTangCfg[MingTang.QUAN_KAN_QUAN_DUI] = {
            name: "全坎全对",
            score: [0, 0, 0, 0, 150, 200],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.thQuanKanQuanDui.bind(this)
        };
        this.MingTangCfg[MingTang.DA_XIAO_TONG_ZHA] = {
            name: "大小同炸",
            score: [0, 0, 0, 0, 150, 200],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.thDaXiaoTongZha.bind(this)
        };
        this.MingTangCfg[MingTang.ZI_MEI_ZHA] = {
            name: "姊妹炸",
            score: [0, 0, 0, 0, 150, 200],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.thZiMeiZha.bind(this)
        };
        this.MingTangCfg[MingTang.DIA_SUN_ZHA] = {
            name: "嗲孙炸",
            score: [0, 0, 0, 0, 300, 400],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.thDiaSunZha.bind(this)
        };
        this.MingTangCfg[MingTang.ZU_SUN_ZHA] = {
            name: "祖孙炸",
            score: [0, 0, 0, 0, 450, 600],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.thZhuSunZha.bind(this)
        };
        this.MingTangCfg[MingTang.MEI_NV_CAI_DAN_CHE] = {
            name: "美女踩单车",
            score: [0, 0, 0, 0, 50, 150],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.mtMeiNvCaiDanChe.bind(this)
        };
        this.MingTangCfg[MingTang.ER_LONG_XI_ZHU] = {
            name: "二龙戏珠",
            score: [0, 0, 0, 0, 50, 100],
            isActive: [0, 0, 0, 0, 1, 1],
            func: this.mtErLongXiZhu.bind(this)
        };
        this.MingTangCfg[MingTang.ZI_MO_HU] = {
            name: "自摸胡",
            score: [0, 0, 0, 30, 30, 50],
            isActive: [0, 0, 0, 1, 1, 1],
            func: this.mtZiMoHu.bind(this)
        };

        //选项相关
        //   this.mtXiaoZhuo = {"全球人":30, "上下五千年":35, "大龙摆尾":26};
        //   this.mtDaZhuo = {"2息满园花":8};
        //   this.mtQuanMingTang = {
        //       "自摸":62, "心连心":49, "对倒胡":38,
        //       "活捉小三":53, "两红两黑":54, "一条龙":51,
        //       "隔山打牛":52, "2息满园花":8
        //   };
        //   this.mtZuanShi = {"2息满园花":8};
        //   /*
        //选项相关
        var createRoomOption = {};
        createRoomOption[MingTangType.XIAO_ZHUO] = [
            MingTang.QUAN_QIU_REN,
            MingTang.SHANG_XIA_WU_QIAN_NIAN,
            MingTang.LONG_BAI_WEI
        ];
        createRoomOption[MingTangType.DA_ZHUO] = [
            MingTang.MAN_YUAN_HUA_2
        ];
        createRoomOption[MingTangType.QUAN_MING_TANG] = [
            MingTang.ZI_MO_HU,
            MingTang.XIN_LIAN_XIN,
            MingTang.DUI_DAO_HU,
            MingTang.HUO_ZHUO_XIAO_SAN,
            MingTang.LIANG_HONG_LIANG_HEI,
            MingTang.YI_TIAO_LONG,
            MingTang.GE_SHAN_DA_NIU,
            MingTang.MAN_YUAN_HUA_2
        ];
        createRoomOption[MingTangType.ZUAN_SHI] = [
            MingTang.MAN_YUAN_HUA_2
        ];
        createRoomOption[MingTangType.ZHI_ZUN] = [
            MingTang.MAN_YUAN_HUA_2
        ];

        for (var type in createRoomOption) {
            type = Number(type);
            for (var i = 0; i < createRoomOption[type].length; i++) {
                this.MingTangCfg[createRoomOption[type][i]].isActive[type] = 0;
            }
        }

        //天胡牌型名堂
        this.TianHuArr = [MingTang.WU_XI_TIAN_HU,
            MingTang.YOU_XI_TIAN_HU,
            MingTang.HONG_ZHA_DAN,
            MingTang.HEI_ZHA_DAN,
            MingTang.QUAN_HEI,
            MingTang.LIU_DUI_HONG,
            MingTang.JIU_DUI,
            MingTang.SI_BIAN_DUI,
            MingTang.QUAN_KAN_QUAN_DUI,
            MingTang.DA_XIAO_TONG_ZHA,
            MingTang.ZI_MEI_ZHA,
            MingTang.DIA_SUN_ZHA,
            MingTang.ZU_SUN_ZHA
        ];
        //互斥名堂
        this.MutexMingTangArr = [
            [MingTang.WU_DUI, MingTang.DUI_ZI_HU, MingTang.WU_HU],
            [MingTang.MAN_YUAN_HUA_1, MingTang.MAN_YUAN_HUA_2],
            [MingTang.ZU_SUN_ZHUO, MingTang.LIANG_ZI_MEI_ZHUO, MingTang.DIA_SUN_ZHUO_DAI_TUO, MingTang.SI_LUAN_ZHUO, MingTang.DIA_SUN_ZHUO, MingTang.ZI_MEI_ZHUO_DAI_TUO, MingTang.SAN_LUAN_ZHUO, MingTang.ZI_MEI_ZHUO],
            [MingTang.JI_DING, MingTang.BIAN_DING],
            [MingTang.QIA_WEI, MingTang.QIA_HU],
            [MingTang.CHUN_YIN, MingTang.YIN_HU],
            [MingTang.ZHEN_BEI_KAO_BEI, MingTang.BEI_KAO_BEI, MingTang.FENG_BAI_WEI, MingTang.SHOU_QIAN_SHOU, MingTang.GE_SHAN_DA_NIU, MingTang.DUI_DAO_HU],
        ];
        this.OtherMingTangArr = [];
        for (var k in this.MingTangCfg) {
            k = Number(k);
            var isInTianHuOrMutexMingTang = false;
            if (this.TianHuArr.indexOf(k) >= 0) {
                isInTianHuOrMutexMingTang = true;
            } else {
                for (var i = 0; i < this.MutexMingTangArr.length; ++i) {
                    if (this.MutexMingTangArr[i].indexOf(k) >= 0) {
                        isInTianHuOrMutexMingTang = true;
                        break;
                    }
                }
            }
            if (!isInTianHuOrMutexMingTang) {
                this.OtherMingTangArr.push(k);
            }
        }
    };

    var menziList = []; // 所有可能牌型组合
    for (var i = 1; i <= 10; i++) {
        menziList.push([i, i, i], [i + 20, i + 20, i + 20]);
    }

    for (var i = 1; i <= 8; i++) {
        menziList.push([i, i + 1, i + 2]);
        menziList.push([i + 20, i + 21, i + 22]);
    }

    var HuXiDict = {
        peng:{black:2,red:3},
        wei:{black:3,red:4},
        maque:{black:0,red:2},
        maqueZhuanWan:{black:2,red:3},
        anTuanYuan:{black:6,red:8},
        mingTuanYuan:{black:5,red:7},
    }

    //------------前端用到的一些接口 start---------------- 
    var ROW_TYPE = {
        jiao: 1,
        dui: 2
    }

    // 绞牌(一律无胡息, 此玩法中的绞牌 = 同为小牌或者同为大牌的一句话, 不是传统的 1,1,21之类的概念)
    var jiaoList = []; 
    for (var i = 1; i <= 8; i++) {
        jiaoList.push([i, i + 1, i + 2], [i + 20, i + 21, i + 22]);
    }

    // 对子
    var duiList = [];
    for (var i = 1; i <= 10; i++) {
        duiList.push([i, i], [i + 20, i + 20]);
    }

    PaoHuZiAnXiangWeiMaQue.prototype.getAllCardsTotal = function() {
        var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        return 80 - (areaSelectMode.isMaiPai ? 19 : 0);
    };

    PaoHuZiAnXiangWeiMaQue.prototype.sortCard = function(hand, sortType) {
        sortType = sortType || this.sortType % 2 + 1;
        this.sortType = sortType;

        var maxColNum = 10; 

        hand = hand.slice();
        var dict = [];
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }

        function delRow(row) {
            for (var i = 0; i < row.length; i++) {
                var card = row[i];
                hand.splice(hand.indexOf(card), 1);
                dict[card]--;
            }
        }

        // 坎
        var kanMatrix = [];
        var duiArr = [];
        for (var k in dict) {
            var card = Number(k);
            if (dict[k] >= 3) {
                var row = [];
                for (var i = 0; i < dict[k]; i++) {
                    row.push(card);
                }
                kanMatrix.push(row);
                delRow(row);
            } else if (dict[k] == 2) {
                duiArr.push(card);
            }
        }

        var matrix = [];
        function getRow(rowType) { // 取组合
            var list = [];
            switch (rowType) {
                case ROW_TYPE.jiao: 
                    list = jiaoList;
                    break;
                case ROW_TYPE.dui:
                    list = duiList;
                    break;
            }

            for (var i = 0; i < list.length; i++) {
                var row = list[i].slice();
                var dict2 = {};
                for (var j = 0; j < row.length; j++) {
                    dict2[row[j]] = dict2[row[j]] ? dict2[row[j]] + 1 : 1;
                }

                var isContain = true;
                for (var k in dict2) {
                    if (!(dict[k] >= dict2[k])) { // dict[k]可能为undefined 用非判断
                        isContain = false;
                    }
                }

                if (isContain) {
                    matrix.push(row);
                    delRow(row);
                }
            }
        }

        function getLink(rowType) { // 取连接的牌
            var list = [];
            switch (rowType) {
                case ROW_TYPE.jiao: 
                    list = jiaoList;
                    break;
                default:
                    break;
            }

            for (var i = 0; i < list.length; i++) {
                var row = list[i].slice();
                var tmp = [];
                for (var j = 0; j < 3; j++) {
                    if (j > 0 && row[j] == row[j - 1]) {
                        continue;
                    }

                    if (dict[row[j]] > 0) {
                        tmp.push(row[j]);
                    }
                }

                if (tmp.length >= 2) {
                    matrix.push(tmp);
                    delRow(tmp);
                }
            }
        }

        // 1.对子 -- 绞牌 -- 有关联的牌
        // 2.绞牌 -- 对子 -- 有关联的牌
        switch (sortType) {
            case 1:
                getRow(ROW_TYPE.dui);
                getRow(ROW_TYPE.jiao);
                break;
            case 2:
                getRow(ROW_TYPE.jiao);
                getRow(ROW_TYPE.dui);
                break;
        }

        getLink(ROW_TYPE.jiao);

        for (var i = 0; i < hand.length; i++) {
            matrix.push([hand[i]]);
        }

        // 先列内排列
        for(var i=0; i < matrix.length; i++) {
            var row = matrix[i];
            row.sort(function(a, b) {
                return a - b;
            })
        }

        // 矩阵按列排序
        matrix.sort(function(a, b) {
            return a[0] - b[0];
        });

        // 最大列数 处理
        if (matrix.length + kanMatrix.length > maxColNum) {
            var total = matrix.length + kanMatrix.length - maxColNum;
            for (var i = 1; i <= total; i++) {
                // console.log('i@@ ', i);
                for (var j = 0; j < matrix.length; j++) {
                    if (matrix[j].length == 1) {
                        for (var k = j + 1; k < matrix.length; k++) {
                            if (matrix[k].length == 1) {
                                // console.log("j@@ ", j, "k@@ ", k);
                                matrix[j] = matrix[j].concat(matrix[k]);
                                matrix.splice(k, 1);
                                j = matrix.length;
                                break;
                            }
                        }
                    }
                }
            }
        }

        var cpMatrix =  kanMatrix.concat(matrix);
        //从小到大排序
        cpMatrix.sort(function(a, b) {
            return a[0] - b[0];
        })

        return cpMatrix;
    }

    //删手牌重排序
    PaoHuZiAnXiangWeiMaQue.prototype.sortByUser = function(arr) {
        if (!MjClient.HandCardArr) {
            return [];
        }
        var cardArr = MjClient.HandCardArr;
        if (arr) {
            cardArr = arr;
        }

        var tmpArr = [];
        for (var i = 0; i < cardArr.length; i++) {
            for (var k = 0; k < cardArr[i].length; k++) {
                tmpArr.push(cardArr[i][k]);
            }
        }

        return this.sortCard(tmpArr);
    }

    //吃牌数组(剔除过吃)
    PaoHuZiAnXiangWeiMaQue.prototype.getChiCards = function(mjhand, putCard) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        if(!pl)
            return [];

        var chiList = this.getChiList(pl, putCard);
        if (chiList.length == 0) {
            return [];
        }

        if (pl.info.uid == tData.uids[tData.curPlayer] || (pl.uid == tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] && (tData.putType == 1 || tData.maxPlayer != 2 || tData.areaSelectMode.isCanChiDuiJiaChuPai))) {
            var skipCard = [].concat(pl.mjput); // 自己弃牌
            if (pl.info.uid == tData.uids[tData.curPlayer]) {
                skipCard.pop();
            }

            var preUid = tData.uids[(tData.uids.indexOf(pl.info.uid) - 1 + tData.maxPlayer) % tData.maxPlayer];
            var prePl = sData.players[preUid]; 
          
            //不可吃对家出牌 对家出牌不计入过吃
            if (tData.maxPlayer == 2 && !tData.areaSelectMode.isCanChiDuiJiaChuPai) {
                for(var i = 0; i < prePl.mjput.length; ++i){
                    if (prePl.mjputType[i] == 1) {
                        skipCard.push(prePl.mjput[i]);
                    }
                }
                if (prePl.uid == tData.uids[tData.curPlayer] && prePl.mjputType[prePl.mjputType.length - 1] == 1) {
                    skipCard.pop();
                }
            //上家弃牌
            }else{
                skipCard = skipCard.concat(prePl.mjput);
                if (prePl.uid == tData.uids[tData.curPlayer]) {
                    skipCard.pop();
                }
            }
            
            skipCard = skipCard.concat(pl.skipChi);
            
            //过牌不能吃
            if (skipCard.indexOf(putCard) >= 0) {
                return [];
            }
        }

        return chiList;
    };

    // 获取一列牌胡息(由于团圆息概念的存在，此玩法不能用于显示一列手牌息)
    PaoHuZiAnXiangWeiMaQue.prototype.getRowHuxi_hand = function(row, tData) {
        var huXi = 0;
        var isMaQueZhuanWan = function(card) {
            var jiao = [];
            for (var i = 0; i < MjClient.HandCardArr; i++) {
                var list = MjClient.HandCardArr[i].slice();
                if (list.length == 3) {
                    list.sort(function(a, b) {
                        return a - b;
                    });
                    if (list.indexOf(card) >= 0 && 
                        ((list[0] == list[1] -1) && (list[1] == list[2] - 1))) {
                        return true;
                    }
                }
            }
            return false;
        }

        if (row.length == 4) {
            huXi += 0;  //团圆息不能重复计算
        } else if (row.length == 3) {   
            if (row[0] == row[1] && row[0] == row[2]) {
                huXi += this.isRed(row[0]) ? 8 : 3;             //坎
            }
        } else if (row.length == 2) {   
            if (row[0] == row[1]) {
                //遍历是否存在麻雀转弯
                if (isMaQueZhuanWan(row[0])) {
                    huXi += 3;      //麻雀转弯
                } else {
                    huXi += this.isRed(row[0]) ? 2 : 0;             //麻雀
                }
            }
        }

        return huXi;
    };

    //获取手牌总胡息
    PaoHuZiAnXiangWeiMaQue.prototype.getHuxi = function(pl) {
        //所有人只算桌面息!!!
        var huxiTable = 0;

        if (!pl)
            return huxiTable;

        //优先算团圆息
        //var tuanYuan = this.getTuanYuan();
        //var ming = tuanYuan.mingTuanYuan;
        //var an = tuanYuan.anTuanYuan;

        var huxiTable = 0;
        var tableDict = {};

        //桌上牌统计
        if(pl.info.uid == SelfUid()) {
            for (var i = 0; i < pl.mjwei.length; i++) {
                var c = pl.mjwei[i];
                tableDict[c] = (tableDict[c] ? tableDict[c] : 0) + 3;
            }
        }
        
        for (var i = 0; i < pl.mjpeng.length; i++) {
            var c = pl.mjpeng[i];
            tableDict[c] = (tableDict[c] ? tableDict[c] : 0) + 3;
        }

        for (var i = 0; i < pl.mjchi.length; i++) {
            var row = pl.mjchi[i].eatCards.slice();
            for (var j = 0; j < row.length; j++) {
                var c = row[j];
                tableDict[c] = tableDict[c] ? ++tableDict[c] : 1;
            }
        }

        if(pl.info.uid == SelfUid()) {
            for (var i = 0; i < pl.mjwei.length; i++) {
                var c = pl.mjwei[i];
                if (tableDict[c] == 4) {
                    huxiTable += HuXiDict.anTuanYuan[this.isRed(c) ? "red" : "black"];
                }else{
                    huxiTable += HuXiDict.wei[this.isRed(c) ? "red" : "black"];
                }
            }
        }
        
        for (var i = 0; i < pl.mjpeng.length; i++) {
            var c = pl.mjpeng[i];
            if (tableDict[c] == 4) {
                huxiTable += HuXiDict.mingTuanYuan[this.isRed(c) ? "red" : "black"];
            }else{
                huxiTable += HuXiDict.peng[this.isRed(c) ? "red" : "black"];
            }
        }

        return huxiTable;

        /*策划说不算手牌息了(自己也不算)
        if(pl.info.uid == SelfUid()) {
            //如果是自己要检查团息，偎息
            if()
        }

        for(var j = 0; j < ming.length; ++j){
            var c = ming[j];
            huXi += this.isRed(c) ? 7 : 5;
        }   
        for(var j = 0; j < an.length; ++j){
            var c = an[j];
            huXi += this.isRed(c) ? 8 : 6;
        }

        //门牌息
        for(var j = 0; j < pl.mjpeng.length; ++j){
            var c = pl.mjpeng[j];
            if (ming.indexOf(c) < 0 && an.indexOf(c) < 0) {
                huXi += this.isRed(c) ? 3 : 2;
            }
        }

        for(var j = 0; j < pl.mjwei.length; ++j){
            var c = pl.mjwei[j];
            if (ming.indexOf(c) < 0 && an.indexOf(c) < 0) {
                 huXi += this.isRed(c) ? 4 : 3;
            }
        }
        
        //手牌息
        var isInTuanYuan = function(row) {
            for(var i = 0; i < row.length; i++) {
                if (ming.indexOf(row[i]) >= 0 ||
                    an.indexOf(row[i]) >= 0) {
                    return true;
                } 
            }
            return false;
        }

        if(!MjClient.HandCardArr || MjClient.HandCardArr.length == 0)
            MjClient.HandCardArr = this.sortCard(mjhand, this.sortType);

        for (var i = 0; i < MjClient.HandCardArr.length; i++) {
            var row = MjClient.HandCardArr[i];
            if (!isInTuanYuan(row)) {
                huXi += this.getRowHuxi_hand(row);
            }
        }
        
        return huXi;
        */
    };

    //听牌
    PaoHuZiAnXiangWeiMaQue.prototype.getTingCards = function(tb, pl, putCard) {
        var copy = pl.mjhand.slice();
        var tingCards = [];
        if (putCard != undefined) {
            var idx = pl.mjhand.indexOf(putCard);
            if (idx < 0) {
                return [];
            }
            pl.mjhand.splice(idx, 1);
        } 

        var tData = tb.tData;
        // 牌数量合法判断
        if (pl.mjhand.length % 3 != 1) {
            pl.mjhand = copy;
            return [];
        } 
        
        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }
            var p = tb.players[uid];
            var addMenPaiNum = function(list) {
                if (!list) return;
                for (var i = 0; i < list.length; i++) {
                    add(list[i], 3);
                }
            }
            addMenPaiNum(p.mjpeng);
            if(SelfUid() == uid) {    //自己的偎才算进去
                addMenPaiNum(p.mjwei);
            }

            //添加吃的门牌
            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i].eatCards;
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        /*
        //如果是啫牌后
        if(pl.zheCards && pl.zheCards.length > 0) {
            for(var i = 0; i < pl.zheCards.length; i++) {
                var cd = pl.zheCards[i];
                var num = stats[cd];
                if(num && num >= 4)
                    continue;
                tingCards.push(pl.zheCards[i]);
            } 

            tingCards.sort(function(a, b) {return a - b});
            return tingCards;
        }
        */

        var allCards = [];
        for (var i = 1; i <= 10; i++) {
            allCards.push(i, i+20);
        }

        //统计听的牌
        this.isTingAll = true;
        for(var k in allCards) {
            var card = allCards[k];
            //cc.log("验证听牌", card);
            if (this.canHu(tb, pl, card, 1)) {
                //cc.log("可以听", card);
                tingCards.push(card);
            } else {
                //cc.log("不能听", card);
                //不能全听
                this.isTingAll = false;
            }
        }

        for (var i = 0; i < tingCards.length; i++) {
            var feiQiCd = stats[tingCards[i]];
            if (feiQiCd && feiQiCd >= 4) {
                tingCards.splice(i, 1);
                i--;
            }
        }
        tingCards.sort(function(a, b) {return a - b});

        pl.mjhand = copy;
        return tingCards;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.getTingStats = function(tb, pl, putCard) {
        var tingCards = this.getTingCards(tb, pl, putCard);
        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }

            var p = tb.players[uid];

            //碰招杠的数据
            var addMenPaiNum = function(list, isPeng) {
                for (var i = 0; i < list.length; i++) {
                    add(list[i], 3);
                }
            }
            addMenPaiNum(p.mjpeng);
            if(SelfUid() == uid) {
                addMenPaiNum(p.mjwei);
            }

            //添加吃的门牌
            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i].eatCards;
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        var tingStats = {};
        for (var i = 0; i < tingCards.length; i++) {
            var card = tingCards[i];
            var totalNum = 4;
            tingStats[card] = totalNum - (stats[card] || 0);
        }

        return tingStats;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.hintPutCardsToTing = function() {
        //return [];
        var tb = sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        if (tData.tState != TableState.waitPut || tData.uids[tData.curPlayer] != pl.info.uid) {
            return [];
        }

        var hand = pl.mjhand.slice();
        // 牌数量合法判断
        if (hand.length % 3 != 2) {
            return [];
        }

        var dict = {};
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }

        var putList = [];
        for (var k in dict) {
            var card = Number(k);
            if (pl.canNotPutCard && pl.canNotPutCard.indexOf(card) >= 0) {
                continue;
            }
            var tingList = this.getTingStats(tb, pl, card);
            for(var key in tingList) {
                if (tingList[key] > 0) {
                    putList.push(card);
                    break;   //只要有一个可听的牌，此牌贴角标
                }
            }
        }

        return putList;
    };

    //获取团圆
    PaoHuZiAnXiangWeiMaQue.prototype.getTuanYuan = function() {
        var mingTuanYuan = [];
        var anTuanYuan = [];
        var pl = MjClient.data.sData.players[SelfUid()];
        if(!pl)
            return {"mingTuanYuan":mingTuanYuan, "anTuanYuan":anTuanYuan};

        var dict = {};
        function add(list) {
            for (var i = 0; i < list.length; i++) {
                var card = list[i];
                dict[card] = dict[card] ? dict[card] + 1 : 1;
            }
        }

        add(pl.mjwei);
        add(pl.mjpeng);
        add(pl.mjhand);

        for (var i = 0; i < pl.mjchi.length; i++) {
            add(pl.mjchi[i].eatCards);
        }

        for (var c in dict) {
            if (dict[c] == 4) {
                c = Number(c);
                var count = pl.beginHandCardDict[c];
                if (count == 4 || (count >= 2 && pl.mjwei.indexOf(c))) {
                    mingTuanYuan.push(c);
                }else{
                    anTuanYuan.push(c);
                }
            }
        }

        return {"mingTuanYuan":mingTuanYuan, "anTuanYuan":anTuanYuan};
    }

    //获取结算牌矩阵
    PaoHuZiAnXiangWeiMaQue.prototype.getEndOneCards = function(pl) {
        if (!pl) 
            return {};

        //吃
        var chi = pl.mjchi;
        for (var i = 0; i < chi.length; i++) {
            
        }
        //碰
        //偎
        //手牌
    }

    //------------前端用到的一些接口 end----------------

    PaoHuZiAnXiangWeiMaQue.prototype.randomCards = function(areaSelectMode) {
        var cards = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ];
        shuffleArray(cards);
        return cards;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.cardsCount = function(tb) {
        return 80 - ((tb.tData.maxPlayer == 2 && tb.tData.areaSelectMode.isMaiPai) ? 19 : 0);
    };

    PaoHuZiAnXiangWeiMaQue.prototype.getHandCardCount = function(pl, card) {
        return this.getCardCount(pl.mjhand, card);
    };

    //支持二维数组
    PaoHuZiAnXiangWeiMaQue.prototype.getCardCount = function(cards, card) {
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].length) {
                count += this.getCardCount(cards[i], card);
            } else if (cards[i] == card) {
                count++;
            }
        }
        return count;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.getRowValue = function(row) {
        if (row.length == 2) { // 对
            return row[0] * 10 + 1;
        }

        if (row[0] == row[1]) { // 坎
            return row[0] * 10 + 2;
        }

        return row[0] * 10 + 3;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.isRed = function(card) {
        return [2, 7, 10, 22, 27, 30].indexOf(card) >= 0;
    };

    // 红字 大字统计
    PaoHuZiAnXiangWeiMaQue.prototype.stats = function(pl, card) {
        var hand = pl.mjhand.slice();
        if (card > 0) {
            hand.push(card);
        }

        var redNum = 0;
        var bigNum = 0;
        var redJuNum = 0; //带红字的牌句数
        var dict = {};

        function add(card) {
            dict[card] = dict[card] ? dict[card] + 1 : 1;
        }

        for (var i = 0; i < pl.mjwei.length; i++) {
            add(pl.mjwei[i]);
            add(pl.mjwei[i]);
            add(pl.mjwei[i]);
            if (this.isRed(pl.mjwei[i])) {
                redNum += 3;
                redJuNum++;
            }

            if (pl.mjwei[i] >= 21) {
                bigNum += 3;
            }
        }

        for (var i = 0; i < pl.mjpeng.length; i++) {
            add(pl.mjpeng[i]);
            add(pl.mjpeng[i]);
            add(pl.mjpeng[i]);
            if (this.isRed(pl.mjpeng[i])) {
                redNum += 3;
                redJuNum++;
            }

            if (pl.mjpeng[i] >= 21) {
                bigNum += 3;
            }
        }

        for (var i = 0; i < pl.mjchi.length; i++) {
            var row = pl.mjchi[i].eatCards;
            for (var j = 0; j < 3; j++) {
                add(row[j]);
                if (this.isRed(row[j])) {
                    redNum++;
                    redJuNum++;
                }

                if (row[j] >= 21) {
                    bigNum++;
                }
            }
        }

        for (var i = 0; i < hand.length; i++) {
            add(hand[i]);
            if (this.isRed(hand[i])) {
                redNum++;
            }

            if (hand[i] >= 21) {
                bigNum++;
            }
        }

        return {
            dict: dict,
            redNum: redNum,
            bigNum: bigNum,
            redJuNum: redJuNum
        };
    };

    PaoHuZiAnXiangWeiMaQue.prototype.getAllHuMatrix = function(tb, pl, card) {
        var hand = pl.mjhand.slice();
        if (card > 0) {
            hand.push(card);
        }

        if (hand.length % 3 != 2) {
            return [];
        }

        hand.sort(function(a, b) {
            return a - b;
        });

        var allHuMatrix = [];
        var hu = function(hand, matrix, value) {
            if (hand.length == 0) {
                allHuMatrix.push([].concat(matrix));
                return;
            }

            var list = []; // 组合list
            if (hand.length % 3 == 2) { // 对
                list.push([hand[0], hand[0]]);
            }

            list.push([hand[0], hand[0], hand[0]]); // 坎

            if (hand[0] % 10 <= 8) {
                list.push([hand[0], hand[0] + 1, hand[0] + 2]); // 顺
            }

            for (var i = 0; i < list.length; i++) {
                var comb = list[i]; // 组合
                if (this.getRowValue(comb) < value) {
                    continue;
                }

                var num = 1;
                if (comb[0] == comb[1]) {
                    if (hand[1] == hand[0]) {
                        num++;
                    }

                    if (hand.length >= 3 && hand[2] == hand[0]) {
                        num++;
                    }
                } else {
                    if (hand.indexOf(comb[1]) >= 0) {
                        num++;
                    }

                    if (hand.indexOf(comb[2]) >= 0) {
                        num++;
                    }
                }

                if (num >= comb.length) {
                    var hand_copy = hand.slice();
                    for (var j = 0; j < comb.length; j++) {
                        hand_copy.splice(hand_copy.indexOf(comb[j]), 1);
                    }

                    matrix.push(comb);
                    hu(hand_copy, matrix, this.getRowValue(comb));
                    matrix.pop();
                }
            }
        }.bind(this);
        hu(hand, [], 0);

        return allHuMatrix;
    };

    //获取吃牌数组
    PaoHuZiAnXiangWeiMaQue.prototype.getChiList = function(pl, card) {
        var hand = pl.mjhand.slice();
        hand.push(card);
        var chiList = [];
        for (var i = 20; i < menziList.length; i++) { // 写死20！！
            var row = menziList[i].slice();
            if (row.indexOf(card) >= 0) {
                var flag = true;
                for (var j = 0; j < 3; j++) {
                    if (hand.indexOf(row[j]) < 0) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    /*
                    var copy = hand.slice();
                    copy.splice(copy.indexOf(row[0]), 1);
                    copy.splice(copy.indexOf(row[1]), 1);
                    copy.splice(copy.indexOf(row[2]), 1);  
                    for (var j = 0; j < copy.length; j++) {
                        if (pl.canNotPutCard.indexOf(copy[j]) < 0 && copy[j] != card) {
                            chiList.push(row);
                            break;
                        }
                    }
                    */
                    //吃牌改为不防死手
                    chiList.push(row);
                }
            }
        }
        return chiList;
    };

    //获取胡的详细信息
    PaoHuZiAnXiangWeiMaQue.prototype.getHuInfo = function(tb, pl) {
        var stats = this.stats(pl, tb.tData.currCard);
        //天胡
        if (tb.tData.putCardCount == 0) {
            var huInfo = this.getBestTianHuInfo(tb, pl, stats);
        } else {
            var huInfo = this.getBestMatrixHuInfo(tb, pl, stats);
        }

        //handSort
        if (huInfo && huInfo.score > 0) {
            if (huInfo.matrix.length == 0) {
                var cards = [[],[],[],[]];
                for (var c in stats.dict) {
                    cards[4 - stats.dict[c]].push(Number(c));
                }
                for (var i = 0; i < cards.length; i++) {
                    var num = 4 - i;
                    if (num == 1) {
                        var row = [];
                        var j = 0;
                        while(j < cards[i].length){
                            huInfo.handSort.push({cards: cards[i].slice(j, j + 3), name : "dan"});
                            j += 3;
                        }
                    }else{
                        for (var j = 0; j < cards[i].length; j++) {
                            var c = cards[i][j];
                            if (num == 4) {
                                huInfo.handSort.push({cards: [c,c,c,c], name : "tuan"});
                            }else if (num == 3) {
                                huInfo.handSort.push({cards: [c,c,c], name : "kan"});
                            }else if (num == 2) {
                                huInfo.handSort.push({cards: [c,c], name : "jiang"});
                            }
                        }
                    }
                }
            }else{
                for (var i = 0; i < huInfo.matrix.length; i++) {
                    var row = huInfo.matrix[i];
                    var name = "";
                    if (row.length == 1){
                        name = "dan";
                    }else if (row.length == 2){
                        name = "jiang";
                    }else if (row.length == 3){
                        if (row[0] == row[2]){
                            if (huInfo.huCardPos == i){
                                if (pl.uid == tb.tData.uids[tb.tData.curPlayer]){
                                    name = "mjwei";
                                }else{
                                    name = "mjpeng";
                                }
                            }else{
                                name = "kan";
                            }
                        }else{
                            name = "shun";
                        }
                    }
                    huInfo.handSort.push({cards: row, name : name});
                }
            }
        }
        return huInfo;
    };

    //判断可胡 cardType:1自己摸出 0别人摸出
    PaoHuZiAnXiangWeiMaQue.prototype.canHu = function(tb, pl, card, cardType) {
        if(pl.isDead) {
            return false;  //死手不能胡，没有听牌
        }
        card = card || tb.tData.currCard;
        cardType = cardType || (pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0);
        var stats = this.stats(pl, card);

        //可以矩阵胡
        var canMatrixHu = function() {
            var allHuMatrix = this.getAllHuMatrix(tb, pl, card);
            for (var i = 0; i < allHuMatrix.length; i++) {
                var huInfoArr = this.analyseMatrixHu(tb, pl, card, cardType, allHuMatrix[i], stats);
                if (huInfoArr.length > 0) {
                    return true;
                }
            }
            return false;
        }

        /*----------------前端不能使用下面的逻辑，服务器使用 @陈武
        //判断天胡
        if (tb.tData.putCardCount == 0) {
            for (var i = 0; i < this.TianHuArr.length; i++) {
                var type = this.TianHuArr[i];
                var cfg = this.getOneMtCfg(tb, type);
                //除了矩阵胡外的特殊天胡
                if (cfg && type != MingTang.YOU_XI_TIAN_HU) {
                    var mingTangInfo = cfg.func(tb, pl, stats, cfg);
                    if (mingTangInfo) {
                        return true;
                    }
                }
            }
        }
        --------------------------------------------------------*/

        return canMatrixHu.bind(this)();
    };

    //获取一个名堂对应方法
    PaoHuZiAnXiangWeiMaQue.prototype.getOneMtCfg = function(tb, type) {
        var cfg = this.MingTangCfg[type];
        if (cfg && cfg.func && (cfg.isActive[tb.tData.areaSelectMode.mingTangType] || tb.tData.areaSelectMode.mingTangSelectList.indexOf(type) >= 0)) {
            return cfg;
        }
        return null;
    }

    //获取一个名堂对应分
    PaoHuZiAnXiangWeiMaQue.prototype.getOneMtScore = function(tb, cfg, mtScoreRate) {
        var mtScore = {
            name: cfg.name,
            score: cfg.score[tb.tData.areaSelectMode.mingTangType],//基础分翻倍
            isHardHuXiRate: !!cfg.isHardHuXiRate//硬息翻翻
        };
        if (typeof mtScore == "number") {
            mtScore.score = mtScore.score * (mtScoreRate || 1);
        }
        return mtScore;
    }

    //获取矩阵胡牌的名堂
    PaoHuZiAnXiangWeiMaQue.prototype.getMatrixHuMT = function(tb, pl, stats, huInfo, isTianHu) {
        var mtArr = [];
        //天胡 有息天胡
        if (isTianHu) {
            var cfg = this.getOneMtCfg(tb, MingTang.YOU_XI_TIAN_HU);
            if (cfg) {
                var mingTangInfo = cfg.func(tb, pl, stats, cfg, huInfo);
                if (mingTangInfo) {
                    mtArr.push(mingTangInfo);
                }
            }
        }

        //互斥名堂
        for (var j = 0; j < this.MutexMingTangArr.length; j++) {
            for (var k = 0; k < this.MutexMingTangArr[j].length; k++) {
                var cfg = this.getOneMtCfg(tb, this.MutexMingTangArr[j][k]);
                if (cfg) {
                    var mingTangInfo = cfg.func(tb, pl, stats, cfg, huInfo);
                    if (mingTangInfo) {
                        mtArr.push(mingTangInfo);
                        break;
                    }
                }
            }
        }

        //其他名堂
        for (var j = 0; j < this.OtherMingTangArr.length; j++) {
            var cfg = this.getOneMtCfg(tb, this.OtherMingTangArr[j]);
            if (cfg) {
                //console.log("mt", cfg.name);
                var mingTangInfo = cfg.func(tb, pl, stats, cfg, huInfo);
                //console.log("mt", cfg.name, mingTangInfo);
                if (mingTangInfo) {
                    mtArr.push(mingTangInfo);
                }
            }
        }
        return mtArr;
    };

    //获取最佳天胡
    PaoHuZiAnXiangWeiMaQue.prototype.getBestTianHuInfo = function(tb, pl, stats) {
        //最佳的矩阵胡
        var bestHuInfo = this.getBestMatrixHuInfo(tb, pl, stats, true);
        for (var i = 0; i < this.TianHuArr.length; i++) {
            var type = this.TianHuArr[i];
            var cfg = this.getOneMtCfg(tb, type);
            //除了矩阵胡外的特殊天胡
            if (cfg && type != MingTang.YOU_XI_TIAN_HU) {
                var mingTangInfo = cfg.func(tb, pl, stats, cfg);
                if (mingTangInfo) {
                    var huInfo = {
                        matrix: [],
                        handSort:[],
                        hzdesc: [{name:mingTangInfo.name + ":",desc: "+" + mingTangInfo.score}],
                        hardHuXi: 0,
                        rate: 1,     //翻
                        score: mingTangInfo.score,
                        huCardPos: -1,
                        huCard: -1,
                        dengNum: 0,
                        liuZiScore: 0
                    };
                    if (huInfo.score > 0 && (!bestHuInfo || huInfo.score > bestHuInfo.score)) {
                        bestHuInfo = huInfo;
                    }
                }
            }
        }
        return bestHuInfo;
    };

    //最佳的矩阵胡
    PaoHuZiAnXiangWeiMaQue.prototype.getBestMatrixHuInfo = function(tb, pl, stats, isTianHu) {
        var bestHuInfo = {
            matrix: [],
            handSort:[],
            hzdesc: [],
            hardHuXi: 0,
            rate: 1,     //翻
            score: 0,
            huCardPos: -1,
            huCard: -1,
            dengNum: 0,
            liuZiScore: 0
        };
        var allHuMatrix = this.getAllHuMatrix(tb, pl, tb.tData.currCard);
        for (var i = 0; i < allHuMatrix.length; i++) {
            var huInfoArr = this.analyseMatrixHu(tb, pl, tb.tData.currCard, pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0, allHuMatrix[i], stats);
            for (var j = 0; j < huInfoArr.length; j++) {
                var huInfo = huInfoArr[j];
                //逗留子
                if (tb.tData.areaSelectMode.isDouLiuZi && huInfo.hardHuXi >= 18) {
                    huInfo.dengNum = huInfo.hardHuXi - 17;
                    var score = huInfo.dengNum * [80, 100, 200][tb.tData.areaSelectMode.yiDengScore] || 80;
                    huInfo.liuZiScore = score > tb.tData.liuZiScore ? tb.tData.liuZiScore : score;
                } else {
                    huInfo.dengNum = 0;
                    huInfo.liuZiScore = 0;
                }
                
                var mtArr = this.getMatrixHuMT(tb, pl, stats, huInfo, isTianHu);
                huInfo.rate = 0;
                huInfo.score = 0;
                for (var i = 0; i < mtArr.length; i++) {
                    var mt = mtArr[i];
                    if (mt.isHardHuXiRate) {
                        huInfo.rate += mt.score;
                        huInfo.hzdesc.push({name:mt.name + ":", desc: "x" +  mt.score});
                    }else{
                        huInfo.score += mt.score;
                        huInfo.hzdesc.push({name:mt.name + ":", desc: "+" +  mt.score});
                    }
                }
                huInfo.rate = huInfo.rate || 1;

                huInfo.score += huInfo.hardHuXi * huInfo.rate;
                huInfo.score = huInfo.score * (tb.tData.maxPlayer - 1) + huInfo.liuZiScore;

                //console.log(huInfo);
                if (huInfo.score > bestHuInfo.score) {
                    bestHuInfo = huInfo;
                }
            }
        }
        return bestHuInfo;
    };

    PaoHuZiAnXiangWeiMaQue.prototype.analyseMatrixHu = function(tb, pl, card, cardType, matrix, stats) {
        //求胡的那张牌
        var huCard = card || - 1;
        var isHuCardDui = (huCard <= 0 && pl.mjwei.length > 0);
        if (huCard <= 0 && pl.mjwei.length > 0) {
            huCard = pl.mjwei[pl.mjwei.length - 1];
        }

        //拆解成带位置的胡牌矩阵
        var huInfoArr = [];
        for (var i = 0; i < matrix.length; i++) {
            var row = matrix[i];
            if (row.indexOf(card) >= 0) {
                var huInfo = {
                    matrix: matrix,
                    handSort:[],
                    hzdesc: [],
                    hardHuXi: 0,
                    rate: 1,     //翻
                    score: 0,
                    huCardPos: i,
                    huCard: huCard,
                    dengNum: 0,
                    liuZiScore: 0,
                    statsEx:{}
                };
                huInfoArr.push(huInfo);
            }
        }
        //偎后胡 或者天胡
        if (huInfoArr.length == 0) {
            var huInfo = {
                matrix: matrix,
                handSort:[],
                hzdesc: [],
                hardHuXi: 0,
                rate: 1,     //翻
                score: 0,
                huCardPos: -1,
                huCard: huCard,
                dengNum: 0,
                liuZiScore: 0,
                statsEx:{}
            };
            huInfoArr.push(huInfo);
        }

        //基础胡息
        var baseHuxi = 0;
        //将牌
        var jiangCard = (function() {
            for (var i = 0; i < matrix.length; i++) {
                if (matrix[i].length == 2) {
                    return matrix[i][0];
                }
            }
        })();

        var mingTuanYuan = [];
        var anTuanYuan = [];

        //硬息计算
        for (var i = 0; i < pl.mjpeng.length; ++i) {
            var c = pl.mjpeng[i];
            if (stats.dict[c] == 4) {
                baseHuxi += HuXiDict.mingTuanYuan[this.isRed(c) ? "red" : "black"];
                mingTuanYuan.push(c);
            }else{
                baseHuxi += HuXiDict.peng[this.isRed(c) ? "red" : "black"];
            }
        }

        for (var i = 0; i < pl.mjwei.length; ++i) {
            var c = pl.mjwei[i];
            if (stats.dict[c] == 4) {
                baseHuxi += HuXiDict.anTuanYuan[this.isRed(c) ? "red" : "black"];
                anTuanYuan.push(c);
            }else{
                baseHuxi += HuXiDict.wei[this.isRed(c) ? "red" : "black"];
            }
        }

        //红对数
        var redJuNum = stats.redJuNum;
        //对子数
        var duiNum = pl.mjwei.length + pl.mjpeng.length;
        for (var i = 0; i < matrix.length; i++) {
            var row = matrix[i];
            if (this.isRed(row[0]) || this.isRed(row[1]) || (row.length > 2 && this.isRed(row[2]))) {
                redJuNum++;
            }
            if (row[0] == row[1]) {
                duiNum++;
            }
        }
        //符合满园花
        var isManYuanHua = redJuNum == 7;

        
        var canHuArr = []; 
        for (var i = 0; i < huInfoArr.length; i++) {
            var huInfo = huInfoArr[i];
            huInfo.hardHuXi = baseHuxi;
            //附加的统计信息
            huInfo.statsEx = {
                mingTuanYuan:mingTuanYuan.slice(),
                anTuanYuan:anTuanYuan.slice(),
                tuanYuan:[],
                jiangCard:jiangCard,
                redJuNum:redJuNum,
                isManYuanHua:isManYuanHua,
                duiNum:duiNum,
                isHuCardDui:isHuCardDui,
            };

            for (var j = 0; j < huInfo.matrix.length; j++) {
                var row = huInfo.matrix[j];
                if (row[0] == row[1]) {
                    var c = row[0];
                    if (row.length == 3) {
                        //碰
                        if (huInfo.huCardPos == j && cardType == 0) {
                            if (stats.dict[c] == 4) {
                                huInfo.hardHuXi += HuXiDict.mingTuanYuan[this.isRed(c) ? "red" : "black"];
                                huInfo.statsEx.mingTuanYuan.push(c);
                            }else{
                                huInfo.hardHuXi += HuXiDict.peng[this.isRed(c) ? "red" : "black"];
                            }
                        //偎
                        } else {
                            if (stats.dict[c] == 4) {
                                huInfo.hardHuXi += HuXiDict.anTuanYuan[this.isRed(c) ? "red" : "black"];
                                huInfo.statsEx.anTuanYuan.push(c);
                            }else{
                                huInfo.hardHuXi += HuXiDict.wei[this.isRed(c) ? "red" : "black"];
                            }
                        }

                        if (huInfo.huCardPos == j) {
                            huInfo.statsEx.isHuCardDui = true;
                        }
                    } else {
                        //麻雀转弯
                        if (stats.dict[row[0]] > 2) {
                            huInfo.hardHuXi += HuXiDict.maqueZhuanWan[this.isRed(c) ? "red" : "black"];
                        //麻雀
                        } else {
                            huInfo.hardHuXi += HuXiDict.maque[this.isRed(c) ? "red" : "black"];
                        }
                    }

                }
            }

            huInfo.statsEx.tuanYuan = huInfo.statsEx.mingTuanYuan.concat(huInfo.statsEx.anTuanYuan);
            huInfo.statsEx.tuanYuan.sort(function(a, b){return a - b;});

            //可以胡满园花(2息或者10息)
            var isCanManYuanHuaHu = isManYuanHua &&
                (
                    (this.getOneMtCfg(tb, MingTang.MAN_YUAN_HUA_2) && huInfo.hardHuXi == 2) ||
                    (this.getOneMtCfg(tb, MingTang.MAN_YUAN_HUA_1) && huInfo.hardHuXi >= 10)
                );

            if (huInfo.hardHuXi >= tb.tData.minHuxi || isCanManYuanHuaHu) {
                canHuArr.push(huInfo);
            }
        }
        return canHuArr;
    }

    //印胡    一个红字团圆叫一口印  "一口印，加30息；两口印加2X30息；以此类推
    PaoHuZiAnXiangWeiMaQue.prototype.mtYinHu = function(tb, pl, stats, cfg, huInfo) {
        var yinCount = 0;
        for (var i = 0; i < huInfo.statsEx.tuanYuan.length; i++) {
            if (this.isRed(huInfo.statsEx.tuanYuan[i])) {
                yinCount++;
            }
        }

        if (yinCount > 0) {
            return this.getOneMtScore(tb, cfg, yinCount);
        }
    };

    //红胡    胡牌后红字的个数有大于等于10个    30息，每多一个红字加30息  20息，每多一个红字加20息  20息，每多一个红字加20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtHongHu = function(tb, pl, stats, cfg, huInfo) {
        if (stats.redNum >= 10) {
            return this.getOneMtScore(tb, cfg, stats.redNum - 9);
        }
    };

    //对子胡   7句全由对子组成（就是6个碰偎加一个麻雀）   硬息X10   硬息X10   硬息X10
    PaoHuZiAnXiangWeiMaQue.prototype.mtDuiZiHu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.duiNum == 7) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //乌胡    胡牌时没有红字 硬息X8    硬息X6    硬息X6
    PaoHuZiAnXiangWeiMaQue.prototype.mtWuHu = function(tb, pl, stats, cfg, huInfo) {
        if (stats.redNum == 0) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //乌对    7句全由黑字对子组成  硬息X15   硬息X15   硬息X15
    PaoHuZiAnXiangWeiMaQue.prototype.mtWuDui = function(tb, pl, stats, cfg, huInfo) {
        if (stats.redNum == 0 && huInfo.statsEx.duiNum == 7) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //点胡    胡牌时只有一个红字   硬息X6    硬息X4    硬息X4
    PaoHuZiAnXiangWeiMaQue.prototype.mtDianHu = function(tb, pl, stats, cfg, huInfo) {
        if (stats.redNum == 1) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //满园花10息 硬息大于等于10息的满园花
    PaoHuZiAnXiangWeiMaQue.prototype.mtManYuanHua1 = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isManYuanHua && huInfo.hardHuXi >= 10) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //满园花2息 7句中每句必须有红字
    PaoHuZiAnXiangWeiMaQue.prototype.mtManYuanHua2 = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isManYuanHua && huInfo.hardHuXi == 2) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //大小字胡 都是大字或小字
    PaoHuZiAnXiangWeiMaQue.prototype.mtDaXiaoZi = function(tb, pl, stats, cfg, huInfo) {
        if (stats.bigNum == 0 || stats.bigNum == 20) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    //纯印 任意一个红字团圆，且没有零散红字
    PaoHuZiAnXiangWeiMaQue.prototype.mtChunYin = function(tb, pl, stats, cfg, huInfo) {
        var yinCount = 0;

        for (var i = 0; i < huInfo.statsEx.tuanYuan.length; i++) {
            if (this.isRed(huInfo.statsEx.tuanYuan[i])) {
                yinCount++;
            }
        }

        if (yinCount > 0 && stats.redNum == 4 * yinCount) {
            return this.getOneMtScore(tb, cfg, yinCount);
        }
    };

    //卓胡 两个四字团圆，且没有零散红字
    PaoHuZiAnXiangWeiMaQue.prototype.mtZhuoHu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length != 2) {
            return;
        }
        var yinCount = 0;
        for (var i = 0; i < huInfo.statsEx.tuanYuan.length; i++) {
            if (this.isRed(huInfo.statsEx.tuanYuan[i])) {
                yinCount++;
            }
        }

        if (stats.redNum == 4 * yinCount) {
            return this.getOneMtScore(tb, cfg);
        }
        return;
    };

    //姊妹卓   1和2、2和3等以此类推的两个四字团圆
    PaoHuZiAnXiangWeiMaQue.prototype.mtZiMeiZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 2 && huInfo.statsEx.tuanYuan[1] - huInfo.statsEx.tuanYuan[0] == 1) {
            return this.getOneMtScore(tb, cfg);
        }
        return;
    };

    // 三乱卓 任意三个字，四字团圆  150息    100息    100息    60息
    PaoHuZiAnXiangWeiMaQue.prototype.mtSanLuanZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 3) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 姊妹卓带拖   姊妹卓再加一个字团圆  200息    150息    150息    80息
    PaoHuZiAnXiangWeiMaQue.prototype.mtZiMeiZhuoDaiTuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 3 && (huInfo.statsEx.tuanYuan[1] - huInfo.statsEx.tuanYuan[0] == 1 || huInfo.statsEx.tuanYuan[2] - huInfo.statsEx.tuanYuan[1] == 1)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 嗲孙卓 123、234等以此类推的团圆 300息    300息    300息    150息
    PaoHuZiAnXiangWeiMaQue.prototype.mtDiaSunZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 3 && huInfo.statsEx.tuanYuan[2] - huInfo.statsEx.tuanYuan[0] == 2) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 四乱卓 四个任意字，四字团圆  300息    300息    300息    200息
    PaoHuZiAnXiangWeiMaQue.prototype.mtSiLuanZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 4) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 嗲孙卓带拖   嗲孙卓再加一个字团圆  400息    400息    400息    300息
    PaoHuZiAnXiangWeiMaQue.prototype.mtDiaSunZhuoDaiTuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 4 && (huInfo.statsEx.tuanYuan[2] - huInfo.statsEx.tuanYuan[0] == 2 || huInfo.statsEx.tuanYuan[3] - huInfo.statsEx.tuanYuan[1] == 2)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 两姊妹卓    两对相邻的四字团圆：例如：12+78四字团圆  400息    400息    400息    300息
    PaoHuZiAnXiangWeiMaQue.prototype.mtLiangZiMeiZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 4 && (huInfo.statsEx.tuanYuan[1] - huInfo.statsEx.tuanYuan[0] == 1 || huInfo.statsEx.tuanYuan[3] - huInfo.statsEx.tuanYuan[2] == 1)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 祖孙卓 1234、2345四个连着的四字团圆  500息    500息    500息    400息
    PaoHuZiAnXiangWeiMaQue.prototype.mtZhuSunZhuo = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length == 4 && (huInfo.statsEx.tuanYuan[3] - huInfo.statsEx.tuanYuan[0] == 3)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 海底胡 最后一个字胡  50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtHaiDiHu = function(tb, pl, stats, cfg, huInfo) {
        if (tb.tData.cardNext >= this.cardsCount(tb)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 单吊（单丁）  胡牌时只剩下一张字单钓 一般单吊加30息，对子胡息单吊加50息 一般单吊加30息，对子胡息单吊加50息 一般单吊加30息，对子胡息单吊加50息 一般单吊加10息，对子胡息单吊加20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtDanDiao = function(tb, pl, stats, cfg, huInfo) {
        if (pl.mjhand.length == 1) {
            var mtScore = this.getOneMtScore(tb, cfg);
            mtScore.score = mtScore.score[huInfo.statsEx.duiNum == 7 ? 1 : 0];
            return mtScore;
        }
    };

    // 真八碰头    大捌/小八团圆 400息    300息    300息    200息
    PaoHuZiAnXiangWeiMaQue.prototype.mtZhenBaPengTou = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.indexOf(8) >= 0 && huInfo.statsEx.tuanYuan.indexOf(28) >= 0) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 假八碰头    除大捌/小八团圆外的大小字团圆 200息    150息    150息    100息
    PaoHuZiAnXiangWeiMaQue.prototype.mtJiaBaPengTou = function(tb, pl, stats, cfg, huInfo) {
        for (var i = 0; i < huInfo.statsEx.tuanYuan.length; i++) {
            var c = huInfo.statsEx.tuanYuan[i];
            if (c != 8 && c <= 10 && huInfo.statsEx.tuanYuan.indexOf(c + 20) >= 0) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 背靠背 大小字对子胡牌；例如：听大壹小一，大壹或小一胡了算背靠背    50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtBeiKaoBei = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui) {
            if (huInfo.huCard + 20 == huInfo.statsEx.jiangCard || huInfo.huCard - 20 == huInfo.statsEx.jiangCard) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 手牵手 12、23、34以此类推的两个对子胡牌；例:听小一小二，小一胡了算手牵手    50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtShouQianShou = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui) {
             if (Math.abs(huInfo.huCard - huInfo.statsEx.jiangCard) == 1) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 龙摆尾 大拾大壹团圆或小一小十团圆（不分大小字：小一和大拾也算）    150息    150息    150息    100息
    PaoHuZiAnXiangWeiMaQue.prototype.mtLongBaiWei = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.tuanYuan.length < 2) {
            return;
        }
        if ((huInfo.statsEx.tuanYuan.indexOf(21) >= 0 || huInfo.statsEx.tuanYuan.indexOf(1) >= 0) &&
            (huInfo.statsEx.tuanYuan.indexOf(30) >= 0 || huInfo.statsEx.tuanYuan.indexOf(10) >= 0)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 卡偎  必须是偎后胡，且胡息刚好最小胡息 100息    50息 50息 50息
    PaoHuZiAnXiangWeiMaQue.prototype.mtQiaWei = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        if (card <= 0) {
            //偎后胡
            if (pl.mjwei.length > 0) {
                if (huInfo.hardHuXi == tb.tData.minHuxi) {
                    return this.getOneMtScore(tb, cfg);
                }
            }
        }
    };

    // 无息天胡    玩家起手牌后，无论怎么打永远打不出10硬息   100息    100息    100息    /
    PaoHuZiAnXiangWeiMaQue.prototype.thWuXiTianHu = function(tb, pl, stats, cfg) {
        //无对 或者 一对黑 判断
        var blackDuiNum = 0;
        for (var c in stats.dict) {
            c = Number(c);
            if (stats.dict[c] >= 2) {
                if (this.isRed(c)) {
                    return;
                } else {
                    blackDuiNum++;
                }
            }
        }

        if (blackDuiNum <= 1) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 有息天胡    满足七方门子。且达到10硬息的天胡   100息    100息    100息    50息
    PaoHuZiAnXiangWeiMaQue.prototype.mtYouXiTianHu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.hardHuXi >= tb.tData.minHuxi) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 全球人（耍猴） 所有牌都吃碰别人的，手中就剩一张牌了 150息    150息    150息    100息
    PaoHuZiAnXiangWeiMaQue.prototype.mtQuanQiuRen = function(tb, pl, stats, cfg, huInfo) {
        if (pl.mjhand.length == 1 && pl.mjwei.length == 0 && pl.mjchiCardFromSelf.length == 0) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 顶对（行行息） 对子胡胡牌每组都有息；例：对子胡胡小七小八，出小八胡牌就是顶对（对子中只有红对才有息，如果出小七胡牌就不是顶对）    50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtDingDui = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.duiNum == 7 && this.isRed(huInfo.statsEx.jiangCard)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 飘对  对子胡胡牌手里除将牌外只有一列是红字  50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtPiaoDui = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.duiNum == 7 && (huInfo.statsEx.redJuNum - 1 == (this.isRed(huInfo.statsEx.jiangCard) ? 1 : 0))) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 鸡丁（点炮胡） 1223丁小二胡牌叫鸡丁，胡中间的牌才算    100息    100息    100息    50息
    PaoHuZiAnXiangWeiMaQue.prototype.mtJiDing = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        if (card > 0 && card == huInfo.statsEx.jiangCard && cardType == 0 && huInfo.matrix[huInfo.huCardPos].length == 2) {
            for (var i = 0; i < huInfo.matrix.length; ++i) {
                var row = huInfo.matrix[i];
                if (row.length == 3 && row[0] + 1 == row[1] && row[1] == card) {
                    return this.getOneMtScore(tb, cfg);
                }
            }
        } 
    };

    // 边丁（点炮胡） 1233丁小三胡牌叫边丁，4456丁4也叫边丁 50息 50息 50息 20息
    PaoHuZiAnXiangWeiMaQue.prototype.mtBianDing = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        if (card > 0 && card == huInfo.statsEx.jiangCard && cardType == 0 && huInfo.matrix[huInfo.huCardPos].length == 2) {
            for (var i = 0; i < huInfo.matrix.length; ++i) {
                var row = huInfo.matrix[i];
                if (row.length == 3 && row[0] + 1 == row[1] && (row[0] == card || row[2] == card)) {
                    return this.getOneMtScore(tb, cfg);
                }
            }
        }
    };

    // 上下五千年   桌面上5硬息，手上5硬息    50息 50息 50息 20息
    // 胡牌10胡息 桌上5胡息 团圆及麻雀转弯在一侧  胡牌所在的一句牌不能有息=》上下五千年
    PaoHuZiAnXiangWeiMaQue.prototype.mtShangXiaWuQianNian = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.hardHuXi == 10 && huInfo.huCardPos >= 0) {
            var huxiTable = 0;
            var huxiHand = 0;
            var handDict = {};
            var tableDict = {};

            //手上牌统计
            for (var i = 0; i < huInfo.matrix.length; i++) {
                //胡的那列不参与胡息计算
                if (i != huInfo.huCardPos) {
                    var row = huInfo.matrix[i];
                    for (var j = 0; j < row.length; j++) {
                        var c = row[j];
                        handDict[c] = handDict[c] ? ++handDict[c] : 1;
                    }
                }
            }

            //桌上牌统计
            for (var i = 0; i < pl.mjwei.length; i++) {
                var c = pl.mjwei[i];
                tableDict[c] = (tableDict[c] ? tableDict[c] : 0) + 3;
            }

            for (var i = 0; i < pl.mjpeng.length; i++) {
                var c = pl.mjpeng[i];
                tableDict[c] = (tableDict[c] ? tableDict[c] : 0) + 3;
            }

            for (var i = 0; i < pl.mjchi.length; i++) {
                var row = pl.mjchi[i].eatCards.slice();
                for (var j = 0; j < row.length; j++) {
                    var c = row[j];
                    tableDict[c] = tableDict[c] ? ++tableDict[c] : 1;
                }
            }

            //胡息单独算
            for (var j = 0; j < huInfo.matrix.length; j++) {
                var row = huInfo.matrix[j];
                if (row[0] == row[1] && i != huInfo.huCardPos) {
                    var c = row[0];
                    if (row.length == 3) {
                        if (handDict[c] == 4) {
                            huxiHand += HuXiDict.anTuanYuan[this.isRed(c) ? "red" : "black"];
                        }else{
                            huxiHand += HuXiDict.wei[this.isRed(c) ? "red" : "black"];
                        }
                    } else {
                        //麻雀转弯
                        if (handDict[c] > 2) {
                            huxiHand += HuXiDict.maqueZhuanWan[this.isRed(c) ? "red" : "black"];
                        }else{
                            huxiHand += HuXiDict.maque[this.isRed(c) ? "red" : "black"];
                        }
                    }
                }
            }

            for (var i = 0; i < pl.mjwei.length; i++) {
                var c = pl.mjwei[i];
                if (tableDict[c] == 4) {
                    huxiTable += HuXiDict.anTuanYuan[this.isRed(c) ? "red" : "black"];
                }else{
                    huxiTable += HuXiDict.wei[this.isRed(c) ? "red" : "black"];
                }
            }

            for (var i = 0; i < pl.mjpeng.length; i++) {
                var c = pl.mjpeng[i];
                if (tableDict[c] == 4) {
                    huxiTable += HuXiDict.mingTuanYuan[this.isRed(c) ? "red" : "black"];
                }else{
                    huxiTable += HuXiDict.peng[this.isRed(c) ? "red" : "black"];
                }
            }

            if (huxiTable == 5 && huxiHand == 5) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 凤摆尾 一（壹）或十（拾）两对胡牌   50息 50息 50息 /
    PaoHuZiAnXiangWeiMaQue.prototype.mtFengBaiWei = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui) {
            if (huInfo.huCard % 10 + huInfo.statsEx.jiangCard % 10 == 1) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 边坎  只能胡一张牌叫边；例：1、2胡3或9、10胡8，胡中间的牌叫坎 30息 30息 30息 /
    PaoHuZiAnXiangWeiMaQue.prototype.mtBianKan = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        if (card > 0) {
            var row = huInfo.matrix[huInfo.huCardPos];
            if (row.length == 3 && row[0] + 1 == row[1]) {
                if ((row[2] == card && card % 10 == 3) ||
                    (row[0] == card && card % 10 == 8) ||
                    (row[1] == card)) {
                    return this.getOneMtScore(tb, cfg);
                }
            }
        }
    };

    // 对倒胡 两对对子胡牌  30息 30息 30息 /
    PaoHuZiAnXiangWeiMaQue.prototype.mtDuiDaoHu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 圆圆丁（只能点炮胡）  一坎拆牌通过拆或吃组成两句话后第三个胡第四张。例如：将3个3拆成123、345、3等一个3胡牌 100息    100息    100息    /
    PaoHuZiAnXiangWeiMaQue.prototype.mtYuanYuanDing = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        if (card <= 0 || cardType != 0) {
            return;
        }
        if (pl.beginHandCardDict[card] == 3 && huInfo.statsEx.jiangCard == card && huInfo.matrix[huInfo.huCardPos].length == 2) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 卡胡  刚好10息胡牌 30息 30息 30息 /
    PaoHuZiAnXiangWeiMaQue.prototype.mtQiaHu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.hardHuXi == tb.tData.minHuxi) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 啫啫胡 出胡字不胡，等下一张一样的牌再胡    30息 30息 30息 /
    PaoHuZiAnXiangWeiMaQue.prototype.mtZheZheHu = function(tb, pl, stats, cfg, huInfo) {
        if (pl.zheCards.indexOf(huInfo.huCard) >= 0) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 红炸弹 起手4张红字且前后不能组成一句话，如4张小七，没有5、6、8、9，是天胡的一张 200息    200息    200息    /
    PaoHuZiAnXiangWeiMaQue.prototype.thHongZhaDan = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        var count = 0;
        for (var c in dict) {
            c = Number(c);
            if (dict[c] == 4 && this.isRed(c) && (
                    (!dict[c - 1] && !dict[c + 1]) ||
                    (!dict[c - 2] && !dict[c - 1]) ||
                    (!dict[c + 1] && !dict[c + 2])
                )) {
                count++;
            }
        }

        if (count > 0) {
            return this.getOneMtScore(tb, cfg, count);
        }
    };

    // 黑炸弹 起手4张黑字且前后不能组成一句话，如4张小七，没有5、6、8、9，是天胡的一张 100息    100息    100息    /
    PaoHuZiAnXiangWeiMaQue.prototype.thHeiZhaDan = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        var count = 0;
        for (var c in dict) {
            c = Number(c);
            if (dict[c] == 4 && !this.isRed(c) && (
                    (!dict[c - 1] && !dict[c + 1]) ||
                    (!dict[c - 2] && !dict[c - 1]) ||
                    (!dict[c + 1] && !dict[c + 2])
                )) {
                count++;
            }
        }

        //黑红炸弹根据炸弹数翻翻 2019-3-23 产品确认
        if (count > 0) {
            return this.getOneMtScore(tb, cfg, count);
        }
    };

    // 真背靠背    八捌两对胡牌  100息    100息    /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtZhenBeiKaoBei = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui && huInfo.huCard % 10 == 8) {
            if (huInfo.huCard + 20 == huInfo.statsEx.jiangCard || huInfo.huCard - 20 == huInfo.statsEx.jiangCard) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 全黑  庄家或闲家摸完牌后全是黑字，是天胡的一种    150息    120息    /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thQuanHei = function(tb, pl, stats, cfg) {
        if (stats.redNum == 0) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 六对红 庄家或闲家摸完牌后，手上有6对红字，算天胡的一种    150息    120息    /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thLiuDuiHong = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        var hongDuiNum = 0;
        for (var c in dict) {
            c = Number(c);
            if (this.isRed(c)) {
                if (dict[c] == 4) {
                    hongDuiNum += 2;
                } else if (dict[c] >= 2) {
                    hongDuiNum++;
                }
            }
        }

        if (hongDuiNum >= 6) {
            return this.getOneMtScore(tb, cfg);
        }
    };
    // 九对  庄家或闲家摸完牌后，手上有9对或超过9对牌，算天胡的一种    150息    120息，庄家10对加240息 /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thJiuDui = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        var duiNum = 0;
        for (var c in dict) {
            c = Number(c);
            if (dict[c] == 4) {
                duiNum += 2;
            } else if (dict[c] >= 2) {
                duiNum++;
            }
        }

        if (duiNum >= 9) {
            var mtScore = this.getOneMtScore(tb, cfg);
            mtScore.score = mtScore.score[duiNum > 9 ? 1 : 0];
            return mtScore;
        }
    };

    // 四边对 小一小十大壹大拾各一对，算天胡的一种  150息    120息    /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thSiBianDui = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        if (dict[1] >= 2 && dict[10] >= 2 && dict[21] >= 2 && dict[30] >= 2) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 心连心 两句话以中间相同字穿插往两边辐射，如456+678   30息 30息 /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtXinLianXin = function(tb, pl, stats, cfg, huInfo) {
        var chiLeft = [];
        var chiRight = [];

        for (var i = 0; i < pl.mjchi.length; i++) {
            var row = pl.mjchi[i].eatCards.slice();
            row.sort(function(a, b) {
                return a - b;
            })
            chiLeft.push(row[0]);
            chiRight.push(row[2]);
        }

        for (var i = 0; i < huInfo.matrix.length; ++i) {
            var row = huInfo.matrix[i];
            if (row[0] != row[1]) {
                chiLeft.push(row[0]);
                chiRight.push(row[2]);
            }
        }

        for (var i = 0; i < chiLeft.length; i++) {
            if (chiRight.indexOf(chiLeft[i]) >= 0) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 嘎暖哒 鸡丁听牌后卡偎偎死了，退字以后再胡牌  30息 30息 /   /
    // 文案没有理清楚 后期再做
    PaoHuZiAnXiangWeiMaQue.prototype.mtGaNuanDa = function(tb, pl, stats, cfg, huInfo) {};

    // 一条龙 结算时有大小同字，手上及手下满足123.456.789三句话且满足10硬息   150息    150息    /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtYiTiaoLong = function(tb, pl, stats, cfg, huInfo) {
        var long = [
            [0, 0, 0],
            [0, 0, 0]
        ];
        if (huInfo.hardHuXi == 10) {
            for (var i = 0; i < pl.mjchi.length; i++) {
                var row = pl.mjchi[i].eatCards.slice();
                row.sort(function(a, b) {
                    return a - b;
                });
                long[Math.floor(row[0] / 20)][Math.floor(row[0] % 20 / 3)] = 1;
            }

            for (var i = 0; i < huInfo.matrix.length; ++i) {
                var row = huInfo.matrix[i];
                if (row[0] + 1 == row[1]) {
                    long[Math.floor(row[0] / 20)][Math.floor(row[0] % 20 / 3)] = 1;
                }
            }
        }

        if (long[0][0] + long[0][1] + long[0][2] == 3 || long[1][0] + long[1][1] + long[1][2] == 3) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 隔山打牛    对倒胡，中间隔一数字，如对倒胡胡壹、叁，或者或小二和小四    30息 30息 /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtGeShanDaNiu = function(tb, pl, stats, cfg, huInfo) {
        if (huInfo.statsEx.isHuCardDui) {
            if (Math.abs(huInfo.huCard - huInfo.statsEx.jiangCard) == 2) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 活捉小三    自摸，并且胡的是小三  30息 30息 /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtHuoZhuoXiaoSan = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        if (cardType == 1 || card <= 0) {
            if (huInfo.huCard == 3) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 两红两黑    胡牌后桌上有两碰黑两碰红刚好10息，余牌均无胡息    30息 30息 //
    PaoHuZiAnXiangWeiMaQue.prototype.mtLiangHongLiangHei = function(tb, pl, stats, cfg, huInfo) {
        var redPeng = 0;
        var blackPeng = 0;
        if (huInfo.hardHuXi == 10) {
            for (var i = 0; i < pl.mjpeng.length; i++) {
                if (this.isRed(pl.mjpeng[i])) {
                    redPeng++;
                } else {
                    blackPeng++;
                }
            }

            for (var i = 0; i < huInfo.matrix.length; ++i) {
                var row = huInfo.matrix[i];
                if (row[0] == row[1] && row.length == 3) {
                    if (this.isRed(row[0])) {
                        redPeng++;
                    } else {
                        blackPeng++;
                    }
                }
            }
            if (redPeng == 2 && blackPeng == 2) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 全坎全对    庄家或闲家摸完牌后，手上的牌为全坎全对 150息    /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thQuanKanQuanDui = function(tb, pl, stats, cfg) {
        var isQuanKanDui = true;
        var dict = stats.dict;
        for (var c in dict) {
            if (dict[c] == 1) {
                isQuanKanDui = false;
                break;
            }
        }

        if (isQuanKanDui) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 大小同炸    庄家或闲家摸完牌后，手上牌为8张一样大小的牌，如4张小一加4张大壹，可以有挨着的散牌，算天胡的一种   150息    /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thDaXiaoTongZha = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        for (var i = 1; i <= 10; i++) {
            if (dict[i] == 4 && dict[i + 20] == 4) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 姊妹炸 庄家或闲家摸完牌后，手上牌为4张小一 + 4张小二，可以有挨着的散牌，算天胡的一种   150息    /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thZiMeiZha = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        for (var i = 1; i <= 9; i++) {
            if ((dict[i] == 4 && dict[i + 1] == 4) ||
                (dict[i + 20] == 4 && dict[i + 20 + 1] == 4)) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 嗲孙炸 庄家或闲家摸完牌后，手上牌为有4张小一 + 4张小二 + 4张小三，可以有挨着的牌，算天胡的一种    300息    /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thDiaSunZha = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        for (var i = 1; i <= 8; i++) {
            if ((dict[i] == 4 && dict[i + 1] == 4 && dict[i + 2] == 4) ||
                (dict[i + 20] == 4 && dict[i + 20 + 1] == 4 && dict[i + 20 + 2] == 4)) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 祖孙炸 庄家或闲家摸完牌后，手上牌为有1234、2345四个连着的四字团圆，可以有挨着的散牌，算天胡的一种   450息    /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.thZhuSunZha = function(tb, pl, stats, cfg) {
        var dict = stats.dict;
        for (var i = 1; i <= 7; i++) {
            if ((dict[i] == 4 && dict[i + 1] == 4 && dict[i + 2] == 4 && dict[i + 3] == 4) ||
                (dict[i + 20] == 4 && dict[i + 20 + 1] == 4 && dict[i + 20 + 2] == 4 && dict[i + 20 + 3] == 4)) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 美女踩单车   全球人后只能是红字单丁，可以和全球人重叠    50息，可与全球人重叠 /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtMeiNvCaiDanChe = function(tb, pl, stats, cfg, huInfo) {
        if (pl.mjhand.length == 1 && pl.mjwei.length == 0 && pl.mjchiCardFromSelf.length == 0 && this.isRed(huInfo.statsEx.jiangCard)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 二龙戏珠    胡牌后有小字一二三、大字壹贰叁，两句话后再无其它红字  50息 /   /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtErLongXiZhu = function(tb, pl, stats, cfg, huInfo) {
        var erlong = [0, 0];
        if (stats.redNum == 2) {
            for (var i = 0; i < pl.mjchi.length; i++) {
                var row = pl.mjchi[i].eatCards.slice();
                row.sort(function(a, b) {
                    return a - b;
                });
                if (row[0] == 1) {
                    erlong[0] = 1;
                }
                if (row[0] == 21) {
                    erlong[1] = 1;
                }
            }

            for (var i = 0; i < huInfo.matrix.length; ++i) {
                var row = huInfo.matrix[i];
                if (row[0] + 1 == row[1]) {
                    if (row[0] == 1) {
                        erlong[0] = 1;
                    }
                    if (row[0] == 21) {
                        erlong[1] = 1;
                    }
                }
            }
            if (erlong[0] + erlong[1] == 2) {
                return this.getOneMtScore(tb, cfg);
            }
        }
    };

    // 自摸胡 自摸胡牌    /   30息 /   /
    PaoHuZiAnXiangWeiMaQue.prototype.mtZiMoHu = function(tb, pl, stats, cfg, huInfo) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        if (tb.tData.putCardCount > 0 && (cardType == 1 || card <= 0)) {
            return this.getOneMtScore(tb, cfg);
        }
    };

    // 是否有牌可打
    PaoHuZiAnXiangWeiMaQue.prototype.hasCardPut = function(pl) {
        var canPut = false;
        for (var i = 0; i < pl.mjhand.length; i++) {
            if (pl.canNotPutCard.indexOf(pl.mjhand[i]) < 0) {
                canPut = true;
                break;
            }
        }
        return canPut;
    }

    // var tb = {
    //     tData: {
    //         maxPlayer:2,
    //         uids: [100, 101],
    //         curPlayer: 1,
    //         minHuxi: 10,
    //         putCardCount: 1,
    //         areaSelectMode: {
    //             mingTangType: 4,
    //             mingTangSelectList: []
    //         },
    //         currCard:29
    //     }
    // };
    // var pl = {
    //     uid: 100,
    //     //mjhand: [1,2,3,6,7,8,8,9,10,21,22,23,26,27,28,28,29,30,7,7],//2息满园花
    //     //mjhand:[2,2,2,2,3,4,10,10,10,10,8,9,22,22,22,22,23,24,27,27],//10息满园花
    //     mjhand:[8,8,8,1,2,3,29],
    //     mjwei: [],
    //     mjchi:[{"eatCards":[27,28,29]},{"eatCards":[22,24,23]}],
    //     mjpeng: [30,9],
    //     beginHandCardDict: {}
    // }
    // var a = new PaoHuZiAnXiangWeiMaQue();

    // var rst = a.canHu(tb, pl);
    // var rst = a.getHuInfo(tb, pl);


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_anXiangWeiMaQue = new PaoHuZiAnXiangWeiMaQue();
    }  
})();