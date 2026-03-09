import Ux from 'ux';

const rxSelected = (reference) => (keys = []) => {
    const {$roles = []} = reference.state;
    if (1 === keys.length) {
        const data = Ux.elementUnique($roles, 'key', keys[0]);
        const $selected = {};
        $selected.key = data.key;
        $selected.type = "ROLE";
        $selected.data = data;
        Ux.of(reference).in({$selected}).done();
    }
}
export default {
    rxSelected,
}