import __Zn from '../zero.module.dependency';
import {InPayment} from '../variant-aero-uca';
import React from 'react';
// 付款方式处理，使用内置配置，所以不依赖任何配置
export default (reference, jsx = {}) => {
    const inherit = __Zn.yoAmbient(reference);
    // 表单 disabled 绑定到自定义中
    inherit.$disabled = jsx.disabled;
    return (
        <InPayment {...inherit} reference={reference}/>
    )
}