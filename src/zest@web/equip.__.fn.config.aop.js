import __Zn from './zero.module.dependency';
/*
 * 在数据部分，已经存在
 * rxBefore / rxAfter
 * 所以此处依旧使用 Before 和 After 关键字来接入配置处理
 * 整个生命周期如下
 * - rxCBefore，      前置配置处理
 * - rxCAfter,        后置配置处理
 * - rxBefore，       前置数据处理
 * - rxAfter，        后置数据处理
 */
export default {
    configBefore: (reference, config = {}) => {
        const {
            rxCBefore
        } = reference.props;
        let $config = {};
        if(__Zn.isFunction(rxCBefore)){
            $config = rxCBefore(config, reference);
        }else{
            $config = config;
        }
        return $config;
    },
    configAfter: (reference, config = {}, ) => {
        const {
            rxCAfter
        } = reference.props;
        let $config = {};
        if(__Zn.isFunction(rxCAfter)){
            $config = rxCAfter(config, reference);
        }else{
            $config = config;
        }
        return $config;
    }
}