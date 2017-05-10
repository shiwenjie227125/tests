/**
 * Created by lenovo on 2017/5/10.
 */
const gulp=require("gulp");
const uglify=require("gulp-uglify");//js文件压缩
const concat=require("gulp-concat");//合并文件
const rename=require("gulp-rename");//文件重命名
const browserify=require("gulp-browserify");//模块化的打包
const sass=require("gulp-sass")//sass编译
const cleanCSS=require("gulp-clean-css")//css的压缩
const webserver=require("gulp-webserver")//web的服务热启动
const imagemin=require("gulp-imagemin")//图片压缩
const rev=require("gulp-rev")//对文件加MD5后缀名
const revCollector=require("gulp-rev-collector")//路径替换
const url=require("url")
const datajson=require("./data/main.js")

//操作js
gulp.task('jsmin',function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('concat.js'))
        .pipe(browserify({
            insertGlobals:true,
            debug:!gulp.env.production
        }))
        .pipe(rev())
        .pipe(gulp.dest('build/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
})

//操作css
gulp.task('cssmin',function(){
    gulp.src('src/css/*.sass')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
})

//文件名替换
gulp.task('rev',function(){
    gulp.src(['rev/**/*.json','src/html/*.html'])
        .pipe(revCollector({
            replaceReved:true,
            dirReplacements:{
                'css':'css',
                'js':'js'
            }
        }))
        .pipe(gulp.dest('build/html'))
})

gulp.task('build',['jsmin','cssmin','rev'])
gulp.task('html',function(){

})

//web的服务热启动
gulp.task('webserver',['build'],function(){
    gulp.watch('src/css/*.sass',['cssmin'])
    gulp.watch('src/html/*.html',['rev'])
    gulp.src('build')
        .pipe(webserver({
            livereload:true,
            directoryListing:true,
            middleware:function(req,res,next){
                const reqPath=url.parse(req.url).pathname
                const routes=datajson.data()
                routes.forEach(function(i){
                    if(i.route==reqPath){
                        i.handle(req,res,next)
                    }
                })
                next()
            },
            open:'/html/index.html'
        }))
})