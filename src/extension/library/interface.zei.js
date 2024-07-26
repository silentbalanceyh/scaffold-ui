import __Zi, {_Locator} from 'zei';
import __Zt from 'zet';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...__Zi,
    /**
     * 此处的 dock 和 designer / dialog 作用相同，且都使用了小写 d 前缀的相关命名
     * @param reference 引用
     */
    dock: (reference) => _Locator.create(reference),
    a4MenuDash: __Zt.a4MenuDash,
    a4MenuWeb: __Zt.a4MenuWeb,
}