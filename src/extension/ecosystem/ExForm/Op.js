import Ux from 'ux';

const componentUp = (reference, previous) => {
    const $inited = reference.props.$inited;
    const $initedPre = previous.props.$inited;
    // 第一更新条件，若初始值发生变化，则直接更新
    if (Ux.isDiff($inited, $initedPre)) {
        // 表单重新初始化
        Ux.formInit(reference, Ux.aiInit);
    }
}

export default {
    componentUp
}