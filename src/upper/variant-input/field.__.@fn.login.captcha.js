import Ux from 'ux';

export default (reference, jsx) => {
    jsx.onPressEnter = (event) => {
        Ux.prevent(event);
        const {connectId = "$opLogin"} = jsx.config ? jsx.config : {};
        Ux.connectId(connectId);
    };
    // $session 处理
    const {$session} = reference.state ? reference.state : {};
    if ($session) {
        jsx.$session = $session;
    }
    return Ux.aiCaptcha(reference, jsx);
}