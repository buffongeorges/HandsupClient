const { default: axios } = require("axios");
const backendUrl = process.env.REACT_APP_API_URL;

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response.status === 401) {
        await axios.get(`${backendUrl}/refreshToken`, {
            withCredentials: true
        }).catch((refreshTokenApiError) => {
            localStorage.removeItem('userProfile');
            console.log('refreshTokenApiError');
            console.log(refreshTokenApiError);
            return Promise.reject(refreshTokenApiError)
        });

        return axios(error.config);
    }
    Promise.reject(error)
});

export default jwtInterceptor;
