import __Zn from './zero.module.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    // 宽度计算
    configuration.height = 800;
    configuration.width = 800;
    return __Zn.promise(configuration);
}