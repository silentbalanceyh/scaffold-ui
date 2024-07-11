import __Zn from '../zero.uca.dependency';

const rxError = (config, reference) => (error) => {
    const message = config.error ? config.error : {};
    const {data = {}} = error;
    const $error = message[data.status];
    if ($error && reference) {
        __Zn.of(reference).in({$error}).done();
    }
    return Promise.reject({$error})
}
export default {
    rxError
}