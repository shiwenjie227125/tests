/**
 * Created by lenovo on 2017/5/10.
 */
const gulp=require("gulp");
const uglify=require("gulp-uglify");//js�ļ�ѹ��
const concat=require("gulp-concat");//�ϲ��ļ�
const rename=require("gulp-rename");//�ļ�������
const browserify=require("gulp-browserify");//ģ�黯�Ĵ��
const sass=require("gulp-sass")//sass����
const cleanCSS=require("gulp-clean-css")//css��ѹ��
const webserver=require("gulp-webserver")//web�ķ���������
const imagemin=require("gulp-imagemin")//ͼƬѹ��
const rev=require("gulp-rev")//���ļ���MD5��׺��
const revCollector=require("gulp-rev-collector")//·���滻
const url=require("url")
const datajson=require("./data/main.js")

//����js
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

//����css
gulp.task('cssmin',function(){
    gulp.src('src/css/*.sass')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
})

//�ļ����滻
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

//web�ķ���������
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