/* eslint-disable no-undef */
export const variables = {
    HOST: process.env.HOST
};

export function initializeVariables() {
    const origin = window.location.origin;

    // if accessing from another device on the network, change HOST variable
    if (origin.includes('localhost') && origin.includes('http://')) {
        variables.HOST = 'http://localhost:3000';
    } else if (origin.includes('192.168') && origin.includes('http://')) {
        variables.HOST = `http://${process.env.LOCAL_DEV_SERVER_NETWORK_IP}:3000`;
    };
    console.log(variables.HOST);
}
