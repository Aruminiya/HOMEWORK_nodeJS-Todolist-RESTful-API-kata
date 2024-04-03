function errorHandeler (res,error,message) {
    const headers = {
        // 允許的請求標頭
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        // 允許的來源（此處為所有來源，請謹慎使用）
        'Access-Control-Allow-Origin': '*',
        // 允許的請求方法
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        // Content-Type 標頭指示請求/回應的媒體類型
        'Content-Type': 'application/json'
    }

    res.writeHead(400,headers);
    res.write(JSON.stringify({
        "status":"error",
        message,
        error
    }))
    res.end()
} 

module.exports = errorHandeler