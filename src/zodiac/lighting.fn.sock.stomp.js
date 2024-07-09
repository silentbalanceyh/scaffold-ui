import __Zn from './zero.module.dependency';
import __O from './lighting.option.__.fn.header';
import {Stomp} from 'stompjs';

const Cv = __Zn.Env;

const __buildClient = () => {
    let sockEndpoint = Cv['SOCK'];
    if (!sockEndpoint) {
        return;
    }
    // 连接SockJs对应的 EndPoint
    let endpoint = Cv['ENDPOINT'];
    if (endpoint.startsWith("http:")) {
        // Stomp URI Modify
        endpoint = endpoint.replace("http:", "ws:");
    }
    // 地址计算
    if (endpoint.endsWith("/")) {
        endpoint = endpoint.substring(0, endpoint.length - 1);
    }
    if (!sockEndpoint.startsWith("/")) {
        sockEndpoint = `/${sockEndpoint}`
    }
    /*
     * 最终计算结果
     * - endpoint 不带最后的 /
     * - sockEndpoint 以 / 开头
     */
    const sockAddr = `${endpoint}${sockEndpoint}`;
    // 获取STOMP自协议的客户端对象
    const stompClient = Stomp.client(sockAddr);
    // 关闭日志：
    stompClient.debug = null;
    return stompClient;
}

const sockSubscribe = (client, {
    address,
    fn,
    reference,
}) => {
    client.subscribe(address, (message) => {
        if (__Zn.isFunction(fn)) {
            /*
             * 这行代码是必须的，从远处得到的消息信息是 UTF-8 的格式，但这个消息类似：
             * æ¨æä¸å¼ æ°çæ¿é´é¢å®è®¢åï¼åå·ï¼
             * 这种，这种格式并非乱码，而是需要直接调用 decodeURIComponent 和 escape 方法
             * 对这种格式的文本进行解码，如此才会正常操作。
             * 从 headers 中抽取 message_id 作为 name / code 专用。
             */
            const message_id = message.headers['message-id'];
            const body = decodeURIComponent(escape(message.body));
            const data = JSON.parse(body);
            if (message_id) {
                data.messageId = message_id;
            }
            fn(data, reference);
        }
    })
}

const sockOn = (websocket = {}, componentRef) => {
    let stompClient = __buildClient();
    if (!stompClient) {
        return;
    }
    // 自定义客户端的认证信息，按需求配置
    const headers = __O.headerMimeS({}, true);
    const headerJ = {};
    headers.forEach((value, key) =>
        headerJ[key] = value);
    // 发起 Ws Socket 连接
    stompClient.connect(headerJ, (res) => {
        __Zn.dgDebug(res, `连接成功！${stompClient.ws?.url}`, "#8B4513");
        const addresses = Object.keys(websocket);
        addresses.forEach(address => {
            const fn = websocket[address];
            __Zn.dgDebug(res, `订阅地址！${address}`, "#6B8E23");
            sockSubscribe(stompClient, {
                address,
                fn,
                reference: componentRef,
            });
        })
    })
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sockOn,
}