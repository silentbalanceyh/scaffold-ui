import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Row, Flex, Checkbox, Tag, Button} from "antd";

const renderConnect = (reference) => {
    const { $connectId } = reference.props;
    if($connectId){
        return (
            <Button className={"ux_hidden"} id={$connectId}
                    onClick={Op.rxSubmit(reference)}/>
        )
    }else{
        return false;
    }
}
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
            const { $source = [], $selected = [] } = this.state;
            return (
                <div>
                    <Row className={"ux_title"}>
                        {config.title}
                    </Row>
                    <Row className={"tag-selector"}>
                        <Checkbox.Group value={$selected} onChange={Op.rxChecked(this)}>
                            <Flex justify={"flex-start"}
                                  align={"flex-start"}
                                  wrap={'wrap'}
                                  gap={"middle"}>
                                {$source.map(item => {
                                    return (
                                        <Checkbox key={item.key} value={item.key}>
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
                        {renderConnect(this)}
                    </Row>
                </div>
            )
        },  Ex.parserOfColor("ExTagSelector").control())
    }
}
export default Component