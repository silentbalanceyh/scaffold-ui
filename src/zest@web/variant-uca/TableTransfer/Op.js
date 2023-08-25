import __Zn from '../zero.uca.dependency';
import rxTree from './Op.fn.tree';

const rxSearch = (reference) => $keyword =>
    __Zn.of(reference).in({$keyword}).done();
// reference.?etState({$keyword})
const rxDelete = (reference, key) => (event) => {
    __Zn.prevent(event);
    const {value = []} = reference.props;
    const items = value.filter(item => key !== item.key);
    __Zn.fn(reference).onChange(items);
}
export default {
    rxTree,
    rxSearch,
    rxDelete,
}