import Ux from 'ux';

const componentUp = (reference, previous) => {
    /**
     * useForm connected 的问题，实际 <Form/> 已经渲染了，但由于此处的
     * 更新比对略微快了点，所以导致警告出现，这里使用 setTimeout 解决，限定到
     * 200（ 0.2s）对复杂表单做出对应的反馈，如此警告消除，挂载之后就可用
     */
    setTimeout(() => {
        const $inited = reference.props.$inited;
        const $initedPre = previous.props.$inited;
        // 第一更新条件，若初始值发生变化，则直接更新
        if (Ux.isDiff($inited, $initedPre)) {
            // 表单重新初始化
            Ux.formInit(reference, Ux.aiInit);
        }
    }, 200);
}

export default {
    componentUp
}