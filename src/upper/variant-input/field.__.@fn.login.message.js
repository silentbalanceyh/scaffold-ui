import Ux from 'ux';

export default (reference, jsx) => {
    jsx.onPressEnter = (event) => {
        Ux.prevent(event);
        const {connectId = "$opLogin"} = jsx.config ? jsx.config : {};
        Ux.connectId(connectId);
    };
    // $session 处理
    const {
        $session,
        $message = false
    } = reference.state ? reference.state : {};
    jsx.$message = $message;
    if ($session) {
        jsx.$session = $session;
    }
    return Ux.aiCaptcha(reference, jsx);
}