import __Zn from './zero.module.dependency';
import __O from './lighting.option.__.fn.header';
import {Stomp} from 'stompjs';

const Cv = __Zn.Env;

const __buildClient = () => {
    let sockEndpoint = Cv['SOCK'];
    if (!sockEndpoint) {
        return;
    }
    let endpoint = Cv['ENDPOINT'];
    if (endpoint.startsWith("http:")) {
        endpoint = endpoint.replace("http:", "ws:");
    } else if (endpoint.startsWith("https:")) {
        endpoint = endpoint.replace("https:", "wss:");
    }

    if (endpoint.endsWith("/")) {
        endpoint = endpoint.substring(0, endpoint.length - 1);
    }
    if (!sockEndpoint.startsWith("/")) {
        sockEndpoint = `/${sockEndpoint}`;
    }

    const sockAddr = `${endpoint}${sockEndpoint}`;
    const stompClient = Stomp.client(sockAddr);
    stompClient.debug = null;
    return stompClient;
};

const sockSubscribe = (client, {
    address,
    fn,
    reference,
}) => {
    client.subscribe(address, (message) => {
        if (__Zn.isFunction(fn)) {
            const message_id = message.headers['message-id'];
            const body = decodeURIComponent(escape(message.body));
            const data = JSON.parse(body);
            if (message_id) {
                data.messageId = message_id;
            }
            fn(data, reference);
        }
    });
};

const sockOn = (websocket = {}, componentRef) => {
    const stompClient = __buildClient();
    if (!stompClient) {
        return;
    }
    const headers = __O.headerMimeS({}, true);
    const headerJ = {};
    headers.forEach((value, key) => {
        headerJ[key] = value;
    });

    const authorization = headerJ.Authorization || headerJ.authorization;
    if (!authorization) {
        console.warn("[ STOMP ] Skip connect, missing Authorization header.");
        return;
    }

    stompClient.connect(headerJ, (res) => {
        __Zn.dgDebug(res, `连接成功! ${stompClient.ws?.url}`, "#8B4513");
        const addresses = Object.keys(websocket);
        addresses.forEach(address => {
            const fn = websocket[address];
            __Zn.dgDebug(res, `订阅地址! ${address}`, "#6B8E23");
            sockSubscribe(stompClient, {
                address,
                fn,
                reference: componentRef,
            });
        });
    }, (error) => {
        console.error("[ STOMP ] Connect failed.", {
            url: stompClient?.ws?.url,
            hasAuthorization: !!authorization,
            error,
        });
    });
};

export default {
    sockOn,
};
