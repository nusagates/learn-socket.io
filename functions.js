const response = (code, message, data) => {
    return {
        code: code,
        message: message,
        data: data
    }
}

exports.response = response;