"use strict";

const Logger = require('./logger_class');

const dbLogger = new Logger('DB');
dbLogger.info('一般情報メッセージ');

const accessLogger = new Logger('ACCESS');
accessLogger.verbose('詳細情報メッセージ');