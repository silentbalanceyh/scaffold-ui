import __Zn from "./zero.form.dependency";

const Cv = __Zn.Env;
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => (event) => {
    __Zn.prevent(event);
    __Zn.toOriginal(reference, null, [Cv.K_ARG.TID]);
}