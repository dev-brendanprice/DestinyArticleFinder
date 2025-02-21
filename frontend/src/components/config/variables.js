
let host;
if (import.meta.env.MODE === 'development') {
    host = import.meta.env.DEV_HOST;
    console.log(`MODE: ${import.meta.env.MODE}`);
}
else if (import.meta.env.MODE === 'production') {
    host = import.meta.env.PROD_HOST;
};

export default { HOST: host };