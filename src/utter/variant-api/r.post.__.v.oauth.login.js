import Ux from 'ux';

export default {
    // failure
    inData: (request = {}) => ({
        ...request,

    }),
    // api
    uri: `/auth/jwt-login`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}