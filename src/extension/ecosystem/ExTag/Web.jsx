import Ux from 'ux';
import {Modal} from "antd";
import UiForm from './form/UI.Add';
import Ex from 'ex';

const yoForm = (reference) => {
    const formAttrs = Ex.yoAmbient(reference);
    return formAttrs;
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

        const formAttrs = yoForm(reference);
        const {config} = reference.props;
        return (
            <Modal {...configDialog} wrapClassName={"uex_ExTag_Dialog"}>
                <UiForm {...formAttrs} dataTag={config}/>
            </Modal>
        )
    }
}