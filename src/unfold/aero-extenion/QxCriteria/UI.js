import React from 'react';
import Ux from "ux";
import {Col, Row} from "antd";
import Jsx from './Form';
import Sk from 'skin';
import __Zn from '../zero.aero.dependency';
import "./Cab.norm.scss";
import renderNotice from './UI.Notice';

const UCA_NAME = "QxCriteria";
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * metadata definition
     */
    const combine = __Zn.yiCombine(reference, Ux.dataCab(require('./Cab.json'), "UI"));

    const {
        pattern = {}, field = [],
        label = {},
        op = [], info = {}, ignores = {},
        query = {}
    } = combine;
    const $metadata = {};
    $metadata.pattern = pattern;
    $metadata.mapping = {};
    $metadata.messageConnect = info.connector;
    const options = [];
    /* 锁定条件相关信息 */
    const locked = Ux.qrMessage(query.criteria, $metadata);
    const lockedFields = locked.message
        .map(item => item.field)
        .filter(item => !!item);
    const normalized = Ux.parseColumn(field, reference);
    normalized
        .filter(each => !lockedFields.includes(each.dataIndex))
        .forEach(each => {
            // Label
            $metadata.mapping[each.dataIndex] = each.label;
            // The Whole
            options.push(each);
        })
    state.$locked = locked;
    state.$metadata = $metadata;
    /*
     * 基础表单信息
     */
    const formInput = {
        op: []
    }
    if (op) {
        op.forEach(item => {
            const kv = item.split(',');
            formInput.op.push({key: kv[0], label: kv[1], value: kv[0]});
        });
    }
    state.$form = {
        formLabel: label,
        formInput,
        info,
        options,
        ignores,
    };
    state.$combine = combine;
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
    // if (!value) {
    //     Ux.fn(reference).onChange({});
    // }
    // reference.?etState(state);
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = {
            $waiting: {
                op: "="
            }
        };
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {$metadata, $form = {}} = this.state;
            const {value = {}} = this.props;
            const jsx = Ux.toLimit(this.props, [
                "reference",
                "config"
            ]);
            const qrMessage = Ux.qrMessage(value, $metadata, $form);
            const attrInput = Sk.mixQx(UCA_NAME);
            const WebField = Ux.V4InputGroup;
            return (
                <WebField {...jsx} {...attrInput}>
                    <Row>
                        <Col span={12} className={"left"}>
                            {Jsx.renderForm(this, $form, {
                                // 连接符
                                connector: qrMessage.connector,
                            })}
                        </Col>
                        <Col span={12} className={"right"}>
                            {renderNotice(this, qrMessage)}
                        </Col>
                    </Row>
                </WebField>
            );
        }, __Zn.parserOfColor(UCA_NAME).control({off: false}))
    }
}

export default Component