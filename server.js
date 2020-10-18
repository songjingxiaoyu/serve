let Koa = require('koa')
let KoaRouter = require('koa-router');
let Fly=require("flyio/src/node")
let fly=new Fly;
let jwt = require('jsonwebtoken');

const app = new Koa();
const router = new KoaRouter();


//注册路由
router.get('/',(ctx,next)=>{
    ctx.body='服务器返回的测试数据'
})

//主页数据接口
let indexData = require('./datas/index.json')
router.get('/getIndexData',(ctx,next)=>{
    ctx.body={
        code:200,
        data:indexData
    }
})

//demo
let demo = require('./datas/demo.json')
router.get('/demo',(ctx,next)=>{
    ctx.body={
        code:200,
        data:demo
    }
})


//主页导航分类数据
let indexCateListData = require('./datas/indexCateList.json')
router.get('/getIndexCateListData',(ctx,next)=>{
    ctx.body={
        code:200,
        data:indexCateListData
    }
})

//分类页接口
let cateGoryData = require('./datas/categoryDatas.json')
router.get('/getCateGoryData',(ctx,next)=>{
    ctx.body={
        code:200,
        data:cateGoryData
    }
})

//获取用户唯一标识接口
router.get('/getOpenId',async (ctx,next)=>{
    //1 获取请求参数
    const code = ctx.query.code;
    console.log('code',code)
    //2 整合数据 appid appSecret code
    const appId = 'wx4f388ab8608b0159';
    const appSecret = 'ee348d19ea4773388c0a22557261361f';
    //3 发请求给微信服务器,换取openid
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    let result = await fly.get(url)
    let openId=JSON.parse(result.data).openid;
    //自定义登录状态
    let user = {
        token:openId,
        username:'haha',
        age:20
    }
    //对openId加密
    let token = jwt.sign(openId,'haha')
    
    //测试解密token
    let testResult = jwt.verify(token,'haha')
    ctx.body=token
})



//搜索页面接口
let searchData=require('./datas/search.json')
router.get(`/getSearchData`,(ctx,next)=>{
    ctx.body={
        code:200,
        data:searchData
    }
})

//值得买导航接口
let buyNavData=require('./datas/buyNav.json')
router.get('/getBuyNavData',(ctx,next)=>{
    ctx.body={
        code:200,
        data:buyNavData
    }
})


//值得买瀑布流数据
let buyData=require('./datas/buy.json')
router.get('/getBuyData',(ctx,next)=>{
    ctx.body={
        code:200,
        data:buyData
    }
})






app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen('3001', (err) => {
    if(err){
        console.log('服务器启动失败');
        console.log(err)
    }else{
        console.log('服务器启动成功');
        console.log('服务器地址: http://localhost:3001');
    }
  
})
