import Ux from 'ux';
/*
 * 文档构造器，用来构造文档专用的配置数据，对应到 document 节点
 * {
 *     "document": {
 *         "fileType": "???",
 *         "key": "???",
 *         "title": "???.docx",
 *         "url": "???"
 *     }
 * }
 */
export default (configuration = {}, data = {}, reference) => {
    const {
        blob,
        record = {}
    } = data;
    if(!blob){
        return Ux.promise(null);
    }
    // 文件构造
    const file = new File([blob], record.name, {type: record.type});
    const document = {
        fileType: record.extension,
        key: record.fileKey,
        title: record.name,
    };
    // 路径处理（可处理 embed 的情况）
    document.url = window.URL.createObjectURL(file);


    // 挂载：configuration.document
    configuration.document = document;
    return Ux.promise(configuration);
}