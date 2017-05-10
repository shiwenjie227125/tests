/**
 * Created by lenovo on 2017/5/10.
 */
/**
 * Created by lenovo on 2017/5/10.
 */
const Mock=require("mockjs")
exports.data=function(){
    return [
        {
            route:'/index',
            handle:function(req,res,next){
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin":"*"
                });
                var data={
                    name:"chen",
                    age:2344,
                    address:"beijing"
                }
                res.write(JSON.stringify(data))
                res.end();
            }
        },
        {
            route:'/smock',
            handle:function(req,res,next){
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin":"*"
                });
                var Random=Mock.Random;
                Random.integer();
                Random.string('lower',4);
                Random.date('yyyy-MM-dd');
                var data=Mock.mock({
                    "menuList|6":[{
                        "menuNav":"@string()",
                        "menuNavContent|1-5":[{
                            "url":"index.html",
                            "name":"@string('lower',4)",
                            "id":"@integer(0,10)"
                        }]
                    }]
                })
                res.write(JSON.stringify(data))
                res.end();
            }
        }
    ]
}