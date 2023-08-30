import handler from './__.event.handler';
import drawNode from './__.event.node';
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => (event = {}) => {
    const {
        error,
        warnings
    } = event;

    if (error) {
        return handler.onError(reference, error);
    }

    const canvas = reference.viewer?.get('canvas');
    canvas.zoom('fit-viewport');

    drawNode(canvas, reference);

    return handler.onShow(reference, warnings);
}