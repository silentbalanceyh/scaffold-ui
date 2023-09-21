import __Zn from './zero.office.dependency';
// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    // 宽度计算
    const {
        pAdjust = 210,
    } = parameters;
    configuration.width = "100%";
    configuration.height = window.innerHeight - pAdjust;
    return __Zn.promise(configuration);
}