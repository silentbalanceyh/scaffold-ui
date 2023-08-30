import Ux from "ux";

const drawTask = (task, canvas, phase) => {
    let classPrefix;
    if ("CANCELED" === phase) {
        classPrefix = 'ux_bpmn_error'
    } else if (["END", "FINISHED"].includes(phase)) {
        classPrefix = 'ux_bpmn_end'
    } else {
        classPrefix = 'ux_bpmn_active'
    }
    canvas['addMarker'](task, classPrefix);
    try {
        canvas['addMarker'](`${task}_label`, classPrefix + "_label")
    } catch (ex) {
    }
}
const drawHistory = (histories = [], canvas) => {
    histories.forEach(history => {
        canvas['addMarker'](history, 'ux_bpmn_end');
        try {
            canvas['addMarker'](`${history}_label`, 'ux_bpmn_end_label')
        } catch (ex) {
        }
    })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (canvas, reference) => {
    const {
        task,
        trace = [],
        phase
    } = reference.props;
    if (task && "string" === typeof task) {
        drawTask(task, canvas, phase);
    }
    if (Ux.isArray(trace)) {
        drawHistory(trace, canvas);
    }
}