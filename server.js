const http = require("http");
const errorHandeler = require("./errorHandeler.js");
const { v4: uuidv4 } = require('uuid');

const todos = [];

const requestLinstener= (req,res)=>{
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
    // 取得代辦事項
    if (req.url =="/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        // 網路請求只看得懂字串
        res.write(JSON.stringify({
        "status":"success",
        "data": todos,
        
        }));
        res.end();
    }
    // 新增代辦事項
    else if (req.url =="/todos" && req.method == "POST") {
        let body = "";
        req.on("data",(chunk)=>{
            body += chunk
        })
        req.on("end",()=>{
            try
            {
                const title = JSON.parse(body).title

                if (title !== undefined){
                    const todo = {
                        _id:uuidv4(),
                        title
                    }
                    todos.push(todo);

                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status":"success",
                        "data":todo
                    }))
                    res.end()
                } else {
                    errorHandeler (res,error,"新增待辦失敗")
                }                
            }
            catch(error)
            {
                errorHandeler (res,error,"資料載入失敗")
            }
            
        })

       
    }
    // 刪除全部待辦事項
    else if (req.url =="/todos" && req.method == "DELETE") {
        
        todos.length = 0;

        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            "data":todos
        }))
        res.end()
    }
    // 刪除單筆代辦事項
    else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
        
        const urlParts = req.url.split("/");
        const id = urlParts[2];
        
        const editTodoIndex = todos.findIndex(e=>e._id === id);
        

        if (editTodoIndex !== -1) {
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                "status":"success",
                "data":todos[editTodoIndex]
            }))
            todos.splice(editTodoIndex,1)
            res.end()
        }
        else {
            errorHandeler (res,"刪除待辦失敗","刪除待辦失敗")
        }                             
            
        

       
    }
    // 編輯代辦事項
    else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
        let body = "";
        req.on("data",(chunk)=>{
            body += chunk
        })
        req.on("end",()=>{
            try
            {   const urlParts = req.url.split("/");
                const id = urlParts[2];
                const editTodoData = JSON.parse(body).title;
                const editTodoIndex = todos.findIndex(e=>e._id === id);
                

                if (editTodoIndex !== -1) {
                    todos[editTodoIndex].title = editTodoData

                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status":"success",
                        "data":todos[editTodoIndex]
                    }))
                    res.end()
                }
                else {
                    errorHandeler (res,error,"編輯待辦失敗")
                }                             
            }
            catch(error)
            {
                errorHandeler (res,error,"資料載入失敗")
            }
            
        })

       
    }
    // 給 preflight options API 檢查機制 用
    else if (req.url=="/" && req.method== "OPTIONS") {
        res.writeHead(200,headers);
        res.end()
    }
    // 找不到路由
    else {
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status":"error",
            "message": "找不到路由"
        }))
        res.end()
    }
}

const server = http.createServer(requestLinstener);
server.listen(3005);