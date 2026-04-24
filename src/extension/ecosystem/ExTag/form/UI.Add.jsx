import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import ExForm from '../../ExForm/UI';

import Op from './Op';
import {Radio, Tag} from "antd";

const Jsx = {
    color: (reference, jsx) => {
        const {config = {}} = jsx;
        const options = Ux.Ant.toOptions(reference, config);
        return (
            <Radio.Group>
                {options.map(option => (
                    <Radio key={option.key} value={option.value}>
                        <Tag color={option.value} style={{
                            fontSize: 14
                        }}>
                            {option.label}
                        </Tag>
                    </Radio>
                ))}
            </Radio.Group>
        )
    }
}

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        return (
            <ExForm {...form} $height={"80px"}
                    $renders={Jsx}
                    $op={Op.actions}/>
        );
    }
}

export default Component;