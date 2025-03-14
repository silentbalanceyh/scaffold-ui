import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Event from "./Op";
import {Button, Col, Input, Row, Transfer} from "antd";
import {LoadingAlert} from "web";
import Sk from 'skin';
import "./Cab.norm.scss";

/**
 * ## 「组件」`ExEditorExport`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-------------------------------|
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___                |
 * |          Save  Cancel         |
 * |-------------------------------|
 * ```
 *
 *
 * @memberOf module:uca/extension
 * @method *ExEditorExport
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExEditorExport";
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const state = {};/*
     * 动态还是静态
     */
    const $combine = Ex.yiCombine(reference, config);
    /*
     * notice 专用
     */
    const {notice = {}, transfer = {}, input = {}} = $combine;
    state.$combine = $combine;
    state.$notice = Ux.clone(notice);
    /*
     * 选项处理，默认全选
     */
    const {$columns = [], button = "", $columnsMy = []} = $combine;
    const $options = $columns.map(column => {
        const option = {};
        option.key = column.dataIndex;
        option.label = column.title;
        option.value = column.dataIndex;
        return option;
    }).filter(column => "key" !== column.key);
    /*
     * 默认全选
     */
    state.$selectedKeys = $columnsMy.filter(item => "key" !== item);
    state.$options = $options;
    /*
     * 按钮专用选项
     */
    if ("string" === typeof button) {
        const $button = {};
        $button.id = button;
        $button.className = "ux_hidden";
        $button.onClick = Event.rxExport(reference);
        state.$button = $button;
    }
    /*
     * 穿梭框
     */
    transfer.render = (item) => Ux.aiItemTransfer(item, reference);
    transfer.onChange = Ux.xtTransfer(reference,
        ($selectedKeys = []) => Ux.of(reference).in({$selectedKeys}).done());
    // reference.?etState({$selectedKeys});
    state.$transfer = transfer;
    /*
     * 文件名设置
     */
    const $input = Ux.clone(input);
    if (!$input.text) $input.text = {};
    $input.text.onChange = Event.rxInput(reference);
    state.$input = $input;
    Ux.of(reference).in(state).ready().done();
    //state.$ready = true;
    //this.?etState(state);
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 根据核心状态处理
             */
            const {
                $button = {},                       // 隐藏按钮
                $options = [], $selectedKeys = [],     // 数据源和选中项
                $notice = {},                       // 提示
                $transfer = {},                     // 穿梭框
                $filename, $input = {}                     // 文件名
            } = this.state;
            /*
             * 选项处理
             */
            const button = Ux.clone($button);
            if (!Ux.isEmpty(button)) {
                // $submitting = false,                // 提交状态
                button.loading = Ux.of(this).is.submitting(); // $submitting;
            }

            const attrEditor = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEditor}>
                    <Row>
                        <Col span={24} className={"editor_content"}>
                            <LoadingAlert $alert={$notice}/>
                            <div className={"input"}>
                                {(() => {
                                    const {text = {}, label} = $input;
                                    return (
                                        <Row>
                                            <Col span={6} className={"input-label"}>
                                                {label}
                                            </Col>
                                            <Col span={12}>
                                                <Input {...text} value={$filename}/>
                                            </Col>
                                        </Row>
                                    )
                                })()}
                            </div>
                            <div className={"ux_op_transfer"}>
                                <Transfer {...$transfer}
                                          targetKeys={$selectedKeys}
                                          dataSource={$options}/>
                            </div>
                            <div className={"button"}>
                                {/* Warning: A props object containing a "key" prop is being spread into JSX: */}
                                <Button key={button.key} {...button}/>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).private());
    }
}

export default Component;