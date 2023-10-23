import Ux from 'ux';
import {Modal, Tag, Popconfirm} from "antd";
import Ex from 'ex';
import {CloseOutlined} from "@ant-design/icons";
import Op from './Op';

import UiForm from './form/UI.Add';
import UiSelector from './selector/UI';
const yoForm = (reference) => {
    const formAttrs = Ex.yoAmbient(reference);
    formAttrs.rxClose = (params = {}) => {
        const { $data = []} = reference.state;
        const saved = Ux.elementSave($data, params, 'name');
        Ux.of(reference).in({$data: Ux.clone(saved)}).hide().done();
    }
    return formAttrs;
}
const renderClose = (reference, item) => {
    const request = Ux.inHoc(reference, "request");
    const message = request?.remove;
    return (
        <Popconfirm title={message}
                    onConfirm={Op.event.rxConfirm(reference, item)}>
            <CloseOutlined/>
        </Popconfirm>
    )
}
export default {
    renderWin: (reference) => {
        const { $visible } = reference.state;
        if(!$visible){
            return false;
        }
        const configW = Ux.inHoc(reference, "window");
        const configDialog = Ux.configDialog(reference, configW);
        configDialog.open = $visible;

        const {config, $view = true} = reference.props;
        if($view){
            const inherit = Ex.yoAmbient(reference);
            return (
                <Modal {...configDialog} wrapClassName={"uex_ExTag_Dialog_View"}>
                    <UiSelector {...inherit}/>
                </Modal>
            )
        }else{
            const formAttrs = yoForm(reference);
            return (
                <Modal {...configDialog} wrapClassName={"uex_ExTag_Dialog"}>
                    <UiForm {...formAttrs} dataTag={config}/>
                </Modal>
            )
        }
    },
    renderTags: (reference) => {
        const { $data = []} = reference.state;
        return (
            <span className={"tag-content"}>
                {$data.map(item => {
                    const style = item?.uiStyle ? item?.uiStyle: {};
                    const { color } = style;
                    return (
                        <Tag color={color} key={item.key}
                             // 禁用默认关闭行为
                             onClose={event => Ux.prevent(event)}
                             closeIcon={renderClose(reference, item)}>
                            {item.name}
                        </Tag>
                    )
                })}
            </span>
        );
    }
}