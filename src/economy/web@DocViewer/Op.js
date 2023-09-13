import Ux from 'ux';

const __ajaxConfiguration = (fileUrl, record = {}, reference) => {
    if (!Ux.Env.DOC_SERVER) {
        console.error("请配置 Z_DOC_SERVER");
        return Ux.promise({$error: "Z_DOC_SERVER environment variable missed! "});
    }
    // 参数构造优先
    const parameters = {};
    return Ux.ajaxDownload(fileUrl, {}).then(blob => {
        parameters.blob = blob;
        parameters.record = record;
        parameters.reference = reference;
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
            .then(configData => Ux.orkEditor(configData, parameters));
    });
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
export default {
    componentInit
}