// add by chenyanchang

//雅安
var gameListConfig_yaan = {
	majiangList: [],
	pokerList: [2019273, 2019275, 2019274, 2019279, 2019276, 2019277, 2019278]// 2019274, 2019279, 2019276, 2019277, 2019278
}

MjClient.gameListConfig = {};
var setLocalConfig = function () {
	switch (MjClient.getAppType()) {
		case MjClient.APP_TYPE.YAAN: // 雅安
			MjClient.gameListConfig = gameListConfig_yaan;
			break;
	}
}

