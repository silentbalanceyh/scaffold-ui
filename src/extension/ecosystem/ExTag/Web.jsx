import Ux from 'ux';
import {Modal} from "antd";
import UiForm from './form/UI.Add';
export default {
    renderWin: (reference) => {
        const { $visible } = reference.state;
        if(!$visible){
            return false;
        }
        const configW = Ux.inHoc(reference, "window");
        const config = Ux.configDialog(reference, configW);
        config.open = $visible;
        return (
            <Modal {...config}>
                <UiForm/>
            </Modal>
        )
    }
}