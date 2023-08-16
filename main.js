function screenChange(isW) {
    var size = cc.view.getFrameSize();
    var w = size.width; var h = size.height;
    if (cc.sys.OS_WINDOWS != cc.sys.os) {
        w = Math.max(size.width, size.height);
        h = Math.min(size.width, size.height);
    } else {
        w = 640;
        h = 360;
        // w = 1480;
        // h = 720;
    }
    MjClient.size = { width: w, height: h };
    cc.view.setFrameSize(w, h);
    cc.view.adjustViewPort(true);
    cc.view.resizeWithBrowserSize(true);
    cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.NO_BORDER);
    postEvent("resize");
}
var gameStartTime = 0;
cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    cc.eventManager.addCustomListener("resizew", function () { screenChange(1) });
    cc.eventManager.addCustomListener("resizeh", function () { screenChange(2) });

    cc.view.setResizeCallback(screenChange);
    screenChange();

    if (initResourceDir)
        initResourceDir();

    cc.log("******:" + JSON.stringify(json_res[MjClient.getAppType()]))
    var game_res = json_res[MjClient.getAppType()].concat(sound_res[MjClient.getAppType()]);

    cc.spriteFrameCache.addSpriteFrames("A_Common/HeadImgs.plist", "A_Common/HeadImgs.png");
    cc.LoaderScene.preload(game_res, function () {
        MjClient.Scene = new JSScene();
        cc.director.runScene(MjClient.Scene);

        // 按钮添加点击声音
        ccui.Button.prototype.addTouchEventListenerOrigin = ccui.Button.prototype.addTouchEventListener
        ccui.Button.prototype.addTouchEventListener = function (selector, target, isCommonClickMusicEnabled) {
            var _selector = function (sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED && (isCommonClickMusicEnabled !== false)) {
                    if (((MjClient.getAppType() != MjClient.APP_TYPE.QXYYQP && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ && MjClient.getAppType() != MjClient.APP_TYPE.HUBEIMJ) || (MjClient.isUseUIv3 && MjClient.isUseUIv3())) &&
                        MjClient.getAppType() != MjClient.APP_TYPE.YLHUNANMJ) {
                        if (reallyPlayEffect)
                            reallyPlayEffect("sound/button_click.mp3", false);
                        else
                            cc.audioEngine.playEffect("sound/button_click.mp3", false);
                    }
                }
                selector.call(this, sender, type)
            }
            this.addTouchEventListenerOrigin(_selector, target)
        };
        ccui.Button.prototype.addClickEventListenerOrigin = ccui.Button.prototype.addClickEventListener
        ccui.Button.prototype.addClickEventListener = function (callback, isCommonClickMusicEnabled) {
            var _callBack = function (target) {
                if (isCommonClickMusicEnabled !== false) {
                    if (((MjClient.getAppType() != MjClient.APP_TYPE.QXYYQP && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ && MjClient.getAppType() != MjClient.APP_TYPE.HUBEIMJ) || (MjClient.isUseUIv3 && MjClient.isUseUIv3())) &&
                        MjClient.getAppType() != MjClient.APP_TYPE.YLHUNANMJ) {
                        if (reallyPlayEffect)
                            reallyPlayEffect("sound/button_click.mp3", false);
                        else
                            cc.audioEngine.playEffect("sound/button_click.mp3", false);
                    }
                }
                callback.call(this, target)
            }
            this.addClickEventListenerOrigin(_callBack)
        }


    }, this);

    gameStartTime = new Date().getTime();

};
cc.game.run();

var cLogs = cc.log;
cc.log = function (...pra) {
    cLogs && cLogs('LOG:---game cc debug:', ...pra);
}
cc.warn = function (...pra) {
    cLogs && cLogs('WARN:---game cc debug:', ...pra);
}
cc.error = function (...pra) {
    cLogs && cLogs('ERROR:---game cc debug:', ...pra);
}
cc.assert= function (...pra) {
    cLogs && cLogs('ASSERT:---game cc debug:', ...pra);
}
