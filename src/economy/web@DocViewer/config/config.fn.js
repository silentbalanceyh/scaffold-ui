import Ux from 'ux';
export default (configuration = {}, data = {}, reference) => {
    const {
        record = {}
    } = data;

    // JWT token 加载
    if(Ux.Env.DOC_TOKEN){
        configuration.token = Ux.Env.DOC_TOKEN;
    }

    // 宽度计算
    configuration.height = 800;
    configuration.width = 800;

    // 文件类型解析
    configuration.documentType = Ux.Env.OFFICE_TYPE[record.extension];
    return Ux.promise(configuration);
}