import group from "./db.group";

export default {
    mock: true,
    processor: (response, request) =>
        group.viewMy(request)
}