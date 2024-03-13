import Ux from 'ux';
export default {
    actions: {
        $opSave: (reference) => (params = {}) => {
            Ux.of(reference).close(params);
        }
    }
}