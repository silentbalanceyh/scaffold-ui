import Ux from 'ux';

const ajaxConfiguration = (fileUrl, record = {}) => {
    return Ux.ajaxDownload(fileUrl, {})
        .then(blob => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            const data = new Blob([blob], {type: record.mime});
            reader.readAsDataURL(data);
        })).then(data => {
            /*
             * documentType: "???",
             * document: {
             *     "fileType": "???",
             *     "key": "???",
             *     "title": "???.docx",
             *     "uri": "???"
             * }
             */
            console.log(Ux.Env.OFFICE_TYPE);
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
    return ajaxConfiguration(fileUrl, record);
}
export default {
    componentInit
}