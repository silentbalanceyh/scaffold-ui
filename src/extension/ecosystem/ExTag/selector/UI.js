import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Row, Flex, Checkbox, Tag} from "antd";
@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Selector")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiSource(this)
            .then(Ux.ready)
            .then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.inHoc(this, "config");
            const { $source = [] } = this.state;
            return (
                <div>
                    <Row className={"ux_title"}>
                        {config.title}
                    </Row>
                    <Row className={"tag-selector"}>
                        <Checkbox.Group>
                            <Flex justify={"flex-start"}
                                  align={"flex-start"}
                                  wrap={'wrap'}
                                  gap={"middle"}>
                                {$source.map(item => {
                                    return (
                                        <Checkbox key={item.key}>
                                            <Tag color={item.color} style={{
                                                fontSize: 14
                                            }}>
                                                {item.name}
                                            </Tag>
                                        </Checkbox>
                                    )
                                })}
                            </Flex>
                        </Checkbox.Group>
                    </Row>
                </div>
            )
        },  Ex.parserOfColor("ExTagSelector").control())
    }
}
export default Component