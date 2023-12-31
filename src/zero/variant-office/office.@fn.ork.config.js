import __Zn from './zero.office.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const {
        record = {}     // X_ATTACHMENT 记录
    } = parameters;

    // documentType, 文件类型解析
    configuration.documentType = __Zn.Env.OFFICE_TYPE[record.extension];
    return __Zn.promise(configuration);
}