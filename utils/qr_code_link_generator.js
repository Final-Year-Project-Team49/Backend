exports.qr_code_link_generator = async (height, width, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${height}x${width}&data=${data}`;
            resolve(url);

        } catch (error) {
            reject(error);
        }
    });
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022