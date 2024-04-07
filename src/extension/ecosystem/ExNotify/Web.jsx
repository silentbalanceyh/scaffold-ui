import Ux from 'ux';
import {Drawer, List} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import Op from './Op';

const actionReadAll = (reference, text) => {
    const { $data = []} = reference.state ? reference.state: {};
    const unread = $data.filter(item => "SENT" === item.status);
    const attrs = {};
    attrs.href = "#";
    if(0 === unread.length) {
        attrs.disabled = true;
    }else{
        attrs.onClick = Op.rxReadAll(reference);
    }
    return (
        // eslint-disabled-next-line
        <a {...attrs}>{text}</a>
    )
}

const actionDelete = (reference, text) => {
    const { $data = []} = reference.state ? reference.state: {};
    const attrs = {};
    attrs.href = "#";
    attrs.className = "aClear"
    if(0 === $data.length) {
        attrs.disabled = true;
    }else{
        attrs.onClick = Op.rxDelete(reference);
    }
    return (
        // eslint-disabled-next-line
        <a {...attrs}>{text}</a>
    )
}

const actionRead = (reference, text, item) => {
    const attrs = {};
    attrs.href = "#";
    attrs.className = "aRead";
    if("SENT" === item.status) {
        attrs.onClick = Op.rxRead(reference, item);
    }else{
        attrs.disabled = true;
    }
    return (
        // eslint-disabled-next-line
        <a {...attrs}>{text}</a>
    )
}

const renderToolbar = (reference, action = {}) => {
    const { $data = []} = reference.state? reference.state: {};
    return (
        <div>
            <List header={
                <div className={"aHeader"}>
                    {actionReadAll(reference, action.readAll)}
                    {actionDelete(reference, action.clear)}
                </div>
            } dataSource={$data} renderItem={item => {
                return (
                    <List.Item key={item.key}>
                        <List.Item.Meta title={
                            <div>
                                {actionRead(reference, action.read, item)}
                                {("SENT" === item.status) ? (
                                    <InfoCircleOutlined style={{color: "#66CD00", fontSize:16 }}/>
                                ): false}
                                <span className={"aContent"}>
                                {item.subject}
                                </span>
                            </div>
                        } description={item.content}/>
                    </List.Item>
                )
            }}/>
        </div>
    )
}
export default {
    renderDrawer: (reference) => {
        const {$visible = false } = reference.state ? reference.state : {};
        if($visible){
            const config = Ux.inHoc(reference, "config");
            const drawer = config?.drawer ? config.drawer : {};
            if(Ux.isEmpty(drawer)){
                return false;
            }
            const drawerConfig = Ux.aiExprDrawer(drawer);
            drawerConfig.open = $visible;
            drawerConfig.onClose = () => Ux.of(reference).hide().done();
            drawerConfig.destroyOnClose = true;
            drawerConfig.className = "uex_ExNotify_Drawer"
            return (
                <Drawer {...drawerConfig}>
                    {renderToolbar(reference, config.action)}
                </Drawer>
            )
        }else{
            return false;
        }
    }
}