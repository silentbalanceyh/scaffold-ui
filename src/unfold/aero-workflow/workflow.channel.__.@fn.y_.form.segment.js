import Ux from "ux";
import {Langue} from "environment";

const __ioSegment = (reference, form, cab) => {
    const $cab = form.cab ? form.cab : {};
    const segment = {};
    [
        "SxAssign",
        "SxClose",
        "SxOpen",
        "SxRun"
    ].forEach(filename => {
        const name = cab.ns + '/' + ($cab.name ? $cab.name : filename)
        const resource = Langue(name);
        if (resource) {
            Object.assign(segment, resource);
        }
    });
    return segment;
}

export default (reference, form = {}, cab) => {
    const segment = __ioSegment(reference, form, cab);
    const segmentRef = form.segment;
    const formRef = Ux.clone(form);
    const segmentCombine = {};
    if (segmentRef) {
        // Fix: convert undefined or null to object
        Object.keys(segmentRef).forEach(key => {
            const value = segmentRef[key];
            if ("string" === typeof value) {
                const connected = segment[value];
                if (Ux.isArray(connected)) {
                    segmentCombine[key] = connected;
                }
            } else {
                segmentCombine[key] = value;
            }
        });
    }
    formRef.segment = segmentCombine;
    return formRef;
}