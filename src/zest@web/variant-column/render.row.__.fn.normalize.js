import __Zn from './zero.uca.dependency';
export default {
    "aiInput": (value, $config = {}) => {
        // normalize 处理
        const normalize = $config.config?.normalize;
        const jFun = __Zn.aiNormalizerFn(normalize);
        if(__Zn.isFunction(jFun)){
            return jFun(value);
        }else{
            return value;
        }
    }
}