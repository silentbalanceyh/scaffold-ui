import __Zo from 'zo';
import __Zn from 'zone';
import __Zi from 'zi';

const ajaxError = (reference, error = {}, redux = false) =>
    __Zo.ajaxError(reference, error, redux, __Zi.toUnauthorized);

export {_Ant} from 'zo';
export default {
    ...__Zi,
    ...__Zo,
    ajaxError,
    ...__Zn,
    Env: {
        ...__Zi.Env,
        ...__Zn.Env,
    }
};
