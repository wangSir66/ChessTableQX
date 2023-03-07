// 96扑克
var Layout_96poker_cfg = {};

//*st表示目前未使用

//动态配置头像坐标
Layout_96poker_cfg.layout_head = {
    2:{
        node_down: { pct:[126/1280, 125/720], pos:[60, 35], isMax: true },
        //node_left: { pct:[126/1280, 125/720], pos:[560, 650], isMax: true, child:hLayout }
        node_left: { pct:[126/1280, 125/720], pos:[560, 650], isMax: true }
    },
    3:{
        node_down: { pct:[126/1280, 125/720], pos:[60, 40], isMax:true },
        // node_left: { pct:[0.1, 0.1], pos:[60, 450], isMax:true, child:vLayout },
        // node_right: { pct:[0.1, 0.1], pos:[1216, 450], isMax:true, child:vLayout }
        node_left: { pct:[126/1280, 125/720], pos:[60, 450], isMax:true, iphoneX:{
            pct:[126/1280, 125/720], pos:[100, 450]
        } },
        node_right: { pct:[126/1280, 125/720], pos:[1216, 450], isMax:true }
    },
    4:{
        node_down: { pct:[126/1280, 125/720], pos:[60, 40], isMax:true },
        // node_left: { pct:[0.1, 0.1], pos:[60, 450], isMax:true, child:vLayout },
        // node_right: { pct:[0.1, 0.1], pos:[560, 650], isMax:true, child:hLayout },
        node_left: { pct:[126/1280, 125/720], pos:[60, 450], isMax:true, iphoneX:{
            pct:[126/1280, 125/720], pos:[100, 450]
        } },
        node_right: { pct:[126/1280, 125/720], pos:[560, 650], isMax:true },
        node_xing: { pct:[126/1280, 125/720], pos:[1216, 450], isMax:true }
    }
};

//动态配置准备状态坐标
Layout_96poker_cfg.sp_ready = {
    2:{
        node_down: { pct:[0.07, 0.07], pos:[300, 180] },
        node_left: { pct:[0.07, 0.07], pos:[640, 500] }
    },
    3:{
        node_down: { pct:[0.07, 0.07], pos:[300, 180] },
        node_left: { pct:[0.07, 0.07], pos:[360, 450] },
        node_right: { pct:[0.07, 0.07], pos:[900, 450] }
    },
    4:{
        node_down: { pct:[0.07, 0.07], pos:[300, 180] },
        node_left: { pct:[0.07, 0.07], pos:[360, 450] },
        node_right: { pct:[0.07, 0.07], pos:[640, 500] },
        node_xing: { pct:[0.07, 0.07], pos:[900, 450] }
    }
};

//动态配置回放坐标 
Layout_96poker_cfg.layout_replayCards = {
    2:{
        node_down: { pct:[0.14, 0.14], pos:[40, 30] },
        node_left: { pct:[0.14, 0.14], pos:[600, 555] }
    },
    3:{
        node_down: { pct:[0.14, 0.14], pos:[40, 30] },
        node_left: { pct:[0.14, 0.14], pos:[10, 580] },
        node_right:  { pct:[0.14, 0.14], pos:[1272, 580] }
    },
    4:{
        node_down: { pct:[0.14, 0.14], pos:[40, 30] },
        node_left: { pct:[0.14, 0.14], pos:[10, 580] },
        node_right: { pct:[0.14, 0.14], pos:[700, 560] },
        node_xing: { pct:[0.14, 0.14], pos:[1272, 580] }
    }
};

//动态配置门牌坐标
Layout_96poker_cfg.layout_eatCards = {
    2:{
        node_down: { pct:[0.14, 0.14], pos:[10, 140], iphoneX:{
            pct:[0.14, 0.14], pos:[50, 160]
        } },
        node_left: { pct:[0.14, 0.14], pos:[700, 710], iphoneX:{
            pct:[0.14, 0.14], pos:[700, 720]
        } }
    },
    3:{
        node_down: { pct:[0.14, 0.14], pos:[10, 140], iphoneX:{
            pct:[0.14, 0.14], pos:[50, 160]
        } },
        node_left: { pct:[0.14, 0.14], pos:[105, 550], iphoneX:{
            pct:[0.14, 0.14], pos:[145, 560]
        } },
        node_right: { pct:[0.14, 0.14], pos:[1170, 550], iphoneX:{
            pct:[0.14, 0.14], pos:[1170, 560]
        } }
    },
    4:{
        node_down: { pct:[0.14, 0.14], pos:[10, 140], iphoneX:{
            pct:[0.14, 0.14], pos:[50, 160]
        } },
        node_left: { pct:[0.14, 0.14], pos:[10, 550], iphoneX:{
            pct:[0.14, 0.14], pos:[60, 560]
        } },
        node_right: { pct:[0.14, 0.14], pos:[700, 710], iphoneX:{
            pct:[0.14, 0.14], pos:[700, 720]
        } },
        node_xing: { pct:[0.14, 0.14], pos:[1160, 450], iphoneX:{
            pct:[0.14, 0.14], pos:[1170, 460]
        } }
    }
};

//动态配置弃牌坐标
Layout_96poker_cfg.layout_outCards = {
    2:{
        node_down: { pct:[0.14, 0.14], pos:[560, 400] },
        node_left: { pct:[0.14, 0.14], pos:[360, 630] }
    },
    3:{
        node_down: { pct:[0.14, 0.14], pos:[560, 400] },
        node_left: { pct:[0.14, 0.14], pos:[310, 710], iphoneX:{
            pct:[0.14, 0.14], pos:[350, 710]
        } },
        node_right: { pct:[0.14, 0.14], pos:[960, 710] }
    },
    4:{
        node_down: { pct:[0.14, 0.14], pos:[530, 400] },
        node_left: { pct:[0.14, 0.14], pos:[310, 600], iphoneX:{
            pct:[0.14, 0.14], pos:[350, 710]
        } },
        node_right: { pct:[0.14, 0.14], pos:[530, 610] },
        node_xing: { pct:[0.14, 0.14], pos:[980, 500] }
    }
};

//动态配置(摸牌)弃牌坐标
Layout_96poker_cfg.layout_outExCards = {
    2:{
        node_down: { pct:[0.14, 0.14], pos:[560, 400] },
        node_left: { pct:[0.14, 0.14], pos:[350, 500] }
    },
    3:{
        node_down: { pct:[0.14, 0.14], pos:[560, 372] },
        node_left: { pct:[0.14, 0.14], pos:[300, 600], iphoneX:{
            pct:[0.14, 0.14], pos:[340, 600]
        } },
        node_right: { pct:[0.14, 0.14], pos:[950, 600] }
    },
    4:{
        node_down: { pct:[0.14, 0.14], pos:[40, 30] },
        node_left: { pct:[0.14, 0.14], pos:[40, 440], iphoneX:{
            pct:[0.14, 0.14], pos:[80, 440]
        } },
        node_right: { pct:[0.14, 0.14], pos:[560, 660] },
        node_xing: { pct:[0.14, 0.14], pos:[1236, 440] }
    }
};

//动态配置打牌出牌坐标 
Layout_96poker_cfg.img_putCard = {
    2:{
        node_down: { pct:[0.224, 0.224], pos:[800, 347] },
        node_left: { pct:[0.224, 0.224], pos:[750, 520] }
    },
    3:{
        node_down: { pct:[0.224, 0.224], pos:[800, 347] },
        node_left: { pct:[0.224, 0.224], pos:[260, 470], iphoneX:{
            pct:[0.224, 0.224], pos:[300, 470]
        } },
        node_right: { pct:[0.224, 0.224], pos:[1050, 470] }
    },
    4:{
        node_down: { pct:[0.224, 0.224], pos:[800, 347] },
        node_left: { pct:[0.224, 0.224], pos:[260, 470], iphoneX:{
            pct:[0.224, 0.224], pos:[300, 470]
        } },
        node_right: { pct:[0.224, 0.224], pos:[750, 520] },
        node_xing: { pct:[0.224, 0.224], pos:[1050, 470] }
    }
};

//动态配置坐标 *st
Layout_96poker_cfg.img_outCard = {
    2:{
        node_down: { pct:[0.35, 0.35], pos:[40, 30] },
        node_left: { pct:[0.35, 0.35], pos:[560, 660] }
    },
    3:{
        node_down: { pct:[0.35, 0.35], pos:[40, 30] },
        node_left: { pct:[0.35, 0.35], pos:[40, 450] },
        node_right: { pct:[0.35, 0.35], pos:[1236, 450] }
    },
    4:{
        node_down: { pct:[0.35, 0.35], pos:[40, 30] },
        node_left: { pct:[0.35, 0.35], pos:[40, 450] },
        node_right: { pct:[0.35, 0.35], pos:[560, 660] },
        node_xing: { pct:[0.35, 0.35], pos:[1236, 450] }
    }
};

//动态配置操作动画坐标 
Layout_96poker_cfg.layout_eatDisplay = {
    2:{
        node_down: { pct:[0.1, 0.1], pos:[640, 350] },
        node_left: { pct:[0.1, 0.1], pos:[620, 500] }
    },
    3:{
        node_down: { pct:[0.1, 0.1], pos:[640, 350] },
        node_left: { pct:[0.1, 0.1], pos:[280, 450] },
        node_right: { pct:[0.1, 0.1], pos:[1000, 450] }
    },
    4:{
        node_down: { pct:[0.1, 0.1], pos:[640, 350] },
        node_left: { pct:[0.1, 0.1], pos:[280, 450] },
        node_right: { pct:[0.1, 0.1], pos:[620, 500] },
        node_xing: { pct:[0.1, 0.1], pos:[800, 320] }
    }
};

//动态配置坐标 *st
Layout_96poker_cfg.layout_handCards = {
    2:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[560, 660] }
    },
    3:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[40, 500] },
        node_right: { pct:[0.2, 0.2], pos:[1236, 500] }
    },
    4:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[40, 450] },
        node_right: { pct:[0.2, 0.2], pos:[560, 660] },
        node_xing: { pct:[0.2, 0.2], pos:[1236, 450] }
    }
};

//动态配置手牌坐标 *st
Layout_96poker_cfg.img_handCard = {
    2:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[560, 660] }
    },
    3:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[40, 450] },
        node_right: { pct:[0.2, 0.2], pos:[1236, 450] }
    },
    4:{
        node_down: { pct:[0.2, 0.2], pos:[40, 30] },
        node_left: { pct:[0.2, 0.2], pos:[40, 450] },
        node_right: { pct:[0.2, 0.2], pos:[560, 660] },
        node_xing: { pct:[0.2, 0.2], pos:[1236, 450] }
    }
};

module.exports = Layout_96poker_cfg;




