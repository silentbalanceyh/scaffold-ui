declare module "zei" {
    import entry from './index.entry';

    export {
        ExEditorLink,
        ExLinkage,
        ExBpmn,

        TxPhase,
        TxHistory,

        HxFlow,
        HxQueue,
        HxMenu,
        HxAction,
        HxSite,

        ExButton,
        ExDialog,
        ExAction,
        ExSearch,
        QxCriteria,
    } from './aero-extenion';

    export {
        _wf
    } from './aero-workflow';

    export {
        _Locator
    } from './allocation.__.c.locator.navigation';

    export default entry;
}