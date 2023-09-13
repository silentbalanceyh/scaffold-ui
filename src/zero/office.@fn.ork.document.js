import __Zn from './zero.module.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const {
        record = {},     // X_ATTACHMENT 记录,
        blob,
    } = parameters;

    if (!blob) {
        return __Zn.promise(null);
    }

    // 文件构造
    const fileData = new Blob([blob], record.name, {type: record.type});
    const document = {
        fileType: record.extension,
        key: record.fileKey,
        title: record.name,
    }
    // 路径处理（可处理 embed 的情况）
    document.url = window.URL.createObjectURL(fileData);

    // 挂载：configuration.document
    configuration.document = document;
    return __Zn.promise(configuration);
}