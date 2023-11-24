import React from 'react';
/*
 * 由于是 Zero Extension 部分，所以此处可直接引用
 * ux / web 两个包的内容
 * 然后此处属于新的包信息，和 variant-input 中的内容对应
 * 此处 variant-input 中的 JSX 可直接引用 variant-aero-uca 中的
 * 内容，目前版本是为了辅助它的开发
 */
import Ux from "ux";
import {TableEditor} from 'web';
import __Zn from '../zero.uca.dependency';
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class ComponentInternal extends React.PureComponent {
    render() {
        const config = Ux.inHoc(this, "config");
        const inherit = __Zn.yoAmbient(this);
        const {
            reference,
            value,
            $disabled = false,
        } = this.props;
        inherit.reference = reference;
        inherit.value = value;
        inherit.config = config;
        inherit.disabled = $disabled;
        return (
            <TableEditor {...inherit}/>
        )
    }
}

class Component extends React.PureComponent {
    render() {
        return (
            <ComponentInternal {...this.props}/>
        )
    }
}

export default Component;