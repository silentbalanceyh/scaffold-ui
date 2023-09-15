import __Zn from './zero.office.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const {
        record = {},     // X_ATTACHMENT 记录,
    } = parameters;

    // 文件构造
    // const fileData = new File([blob], record.name, {type: record.type});
    const document = {
        fileType: record.extension,
        key: record.fileKey,
        title: record.name,
    }
    /*
     * 路径处理
     * 1. 远程 Z_ENDPOINT/doc/store/:fileKey?token=:token 的格式
     * 2. 最终会得到访问文档的详细信息
     */
    const params = {};
    params.endpoint = __Zn.Env.ENDPOINT;
    params.fileKey = record.fileKey;
    const user = __Zn.isLogged();
    let documentUrl;
    if(user){
        params.token = user.token;
        documentUrl = __Zn.formatExpr(`:endpoint/doc/store/:fileKey?token=:token`, params);
    }else{
        documentUrl = __Zn.formatExpr(`:endpoint/doc/store/:fileKey`, params);
    }
    document.url = documentUrl;
    configuration.document = document;
    return __Zn.promise(configuration);
}