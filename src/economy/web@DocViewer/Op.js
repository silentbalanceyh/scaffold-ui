import Ux from 'ux';

const __ajaxConfiguration = (fileUrl, record = {}, reference) => {
    if (!Ux.Env.DOC_SERVER) {
        console.error("请配置 Z_DOC_SERVER");
        return Ux.promise({$error: "Z_DOC_SERVER environment variable missed! "});
    }
    // 参数构造优先
    const parameters = {};
    parameters.record = record;
    parameters.reference = reference;
    // eslint-disable-next-line
    {
        parameters.pView = true;    // 简易模式
    }
    return Ux.promise({})
        /*
         * documentType: "???",
         * token: "???",
         */
        .then(configData => Ux.orkConfig(configData, parameters))
        /*
         * width:
         * height:
         */
        .then(configData => Ux.orkPage(configData, parameters))
        /*
         * document: {
         *     "fileType": "???",
         *     "key": "???",
         *     "title": "???.docx",
         *     "url": "???"
         * }
         */
        .then(configData => Ux.orkDocument(configData, parameters))
        /*
         * editorConfig: {
         * }
         */
        .then(configData => Ux.orkEditor(configData, parameters))
        /*
         * token 申请
         */
        .then(configData => __ajaxToken(configData, parameters))
}

const __ajaxToken = (configData = {}, parameters) => {
    return Ux.ajaxPost("/api/doc/token", configData).then(response => {
        configData.token = response.access_token;
        return Ux.promise(configData);
    })
}
const componentInit = (reference) => {
    const {data} = reference.props;
    let record = {};
    if (Ux.isArray(data)) {
        record = data[0] ? data[0] : null;
    } else if (Ux.isObject(data, false)) {
        record = data;
    } else {
        record = null;
    }
    if (!record) {
        console.error("数据错误，请检查您的输入数据！", data);
        return;
    }
    const {fileUrl} = record;
    if (!fileUrl) {
        console.error("数据错误，请检查 fileUrl 下载链接！", record);
        return;
    }
    return __ajaxConfiguration(fileUrl, record, reference).then(config => {
        const state = {};
        state.$config = Ux.clone(config);
        Ux.dgDebug(config, "[ DocViewer ] 文档配置：", "#FF69B4");
        Ux.of(reference).in(state).ready().done();
    });
}

const onLoadComponentError = (reference) => (errorCode, errorDescription) => {
    switch (errorCode) {
        case -1:
            // Unknown error loading component
            console.error("未知错误，组件加载失败！", errorDescription);
            break;
        case -2:
            // Error load DocsAPI from http://document-server/
            console.error("文档服务加载失败！", errorDescription);
            break;
        case -3:
            // DocsAPI is not defined
            console.error("API 未定义", errorDescription);
            break;
        default:
            // Can not capture
            console.error("未知错误！", errorCode, errorDescription);
            break;
    }
}
export default {
    componentInit,
    onLoadComponentError
}