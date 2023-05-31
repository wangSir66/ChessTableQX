function screenChange(isW) {
    var size = cc.view.getFrameSize();
    var w = size.width; var h = size.height;
    if (cc.sys.OS_WINDOWS != cc.sys.os) {
        w = Math.max(size.width, size.height);
        h = Math.min(size.width, size.height);
    } else {
        w = 1280;
        h = 720;
        w = 1040;
        h = 500;
    }
    MjClient.size = { width: w, height: h };
    cc.view.setFrameSize(w, h);
    cc.view.adjustViewPort(true);
    cc.view.resizeWithBrowserSize(true);
    cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.NO_BORDER);
    postEvent("resize");
}

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

    // Adjust viewport meta
    // Setup the resolution policy and design resolution size
    // Instead of set design resolution, you can also set the real pixel resolution size
    // Uncomment the following line and delete the previous line.
    // cc.view.setRealPixelResolution(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    //load resources
    cc.log("******:" + JSON.stringify(json_res[MjClient.getAppType()]))
    var game_res = json_res[MjClient.getAppType()].concat(sound_res[MjClient.getAppType()]);

    cc.LoaderScene.preload(game_res, function () {
        MjClient.Scene = new JSScene();
        // if (cc.sys.OS_WINDOWS == cc.sys.os) {
        //     if( cc.sys.isNative && jsb.fileUtils.isFileExist("TestManager.js")) {
        //         require("TestManager.js")
        //     }
        // }
        cc.director.runScene(MjClient.Scene);

        // if (cc.sys.OS_WINDOWS == cc.sys.os) {
        //     if(cc.sys.isNative && jsb.fileUtils.isFileExist("TestManager.js")) {
        //         MjClient.Scene._afterRunScene();
        //     }
        // }

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
};
cc.game.run();