// import __RS from './idyl.fn.rs.state';
import Ux from 'ux';

export default {
    /**
     * ## 「2阶」`Ex.rxClose`
     *
     * @memberOf module:rx/utter
     * @param reference
     * @returns {*}
     */
    rxClose: (reference) => (data = {}, addOn = {}) => {
        const updated = {};
        updated.$inited = data;
        // 解决批量更新表单中无法刷新和加载的问题
        updated.$loading = true;
        Object.assign(updated, addOn);
        return Ux.of(reference).in(updated).hide().future(() => Ux.promise(updated));
    }
}