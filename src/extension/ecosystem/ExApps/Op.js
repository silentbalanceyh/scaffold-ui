import Ex from 'ex';

export default {

    rxClickApp: (reference, item = {}) => (event) => {
        const dock = Ex.dock(reference);
        if (dock) {
            dock.goApp(item);
        } else {
            console.error("对不起，dock 变量初始化失败", dock);
        }
    }
}