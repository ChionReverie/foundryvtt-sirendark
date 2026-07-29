export default class Logger {
	static DEBUG_ENABLED: Setting | null = null;

	static SYSTEM_ID = "sirendark";
	static SYSTEM_NAME = "SIRENDARK";

	static debug(...args: any[]) {
		if (Logger.DEBUG_ENABLED === null) {
			Logger.DEBUG_ENABLED = game.settings.get(Logger.SYSTEM_ID, "debugEnabled");
		}

		if (!Logger.DEBUG_ENABLED) {
            return
        } 
        console.debug(`${Logger.SYSTEM_NAME} |`, ...args);
	}

	static error(...args: any[]) {
		console.error(`${Logger.SYSTEM_NAME} |`, ...args);
	}

	static log(...args: any[]) {
		console.log(`${Logger.SYSTEM_NAME} |`, ...args);
	}

	static warn(...args: any[]) {
		console.warn(`${Logger.SYSTEM_NAME} |`, ...args);
	}
}
