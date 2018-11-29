// npm i gulp -g
// npm init
// npm i gulp gulp-sass browser-sync gulp-cssnano gulp-rename del gulp-autoprefixer gulp-notify gulp-pug --save-dev

var gulp 			= require('gulp'); // Подключаем Gulp
	sass 			= require('gulp-sass'); //Подключаем Sass пакет
	watch			= require('gulp-watch');
    browserSync 	= require('browser-sync'); // Подключаем Browser Sync
    cssnano     	= require('gulp-cssnano'); // Подключаем пакет для минификации CSS
    rename      	= require('gulp-rename'); // Подключаем библиотеку для переименования файлов
    del         	= require('del'); // Подключаем библиотеку для удаления файлов и папок
    autoprefixer 	= require('gulp-autoprefixer'); //Подключаем автопрефиксы
	notify 			= require('gulp-notify'); //Подклчаем уведомления
	pug 			= require('gulp-pug'); //Подключаем Pug

	gulp.task('sass', function(){
	    return gulp.src('app/sass/**/*.sass') // Берем все sass файлы из папки sass и дочерних, если таковые будут
	    	.pipe( sass().on( 'error', notify.onError( //уведомления
			      {
			        message: "<%= error.message %>",
			        title  : "Кэп! Твой код пошел по пизде!"
			      } ) )
			  )
	        .pipe(sass())
	        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //автопрефикс
	        .pipe(gulp.dest('app/css'))
	        // .pipe( notify( 'Кэп! Твой код великолепен!' ) )
	        // .pipe(browserSync.stream());
	});

	gulp.task('css-min', function() {
		return gulp.src('app/css/main.css') // Выбираем файл для минификации
			.pipe(cssnano()) // Сжимаем
			.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
			.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
	});
	
	gulp.task('pug', function() {
		return gulp.src("app/*.pug")
			.pipe( pug().on( 'error', notify.onError( //уведомления
				{
				message: "<%= error.message %>",
				title  : "Кэп! Твой код пошел по пизде!"
				} ) )
			)
			.pipe(pug())
			.pipe(gulp.dest("app"))
			// .pipe( notify( 'Кэп! Твой код великолепен!' ) )
			// .pipe(browserSync.reload({stream: true}));
	});

	gulp.task('browser-sync', function() { // Создаем таск browser-sync
	    browserSync({ // Выполняем browser Sync
	        server: { // Определяем параметры сервера
	            baseDir: 'app' // Директория для сервера - app
	        },
	        notify: true 
	        });
	});

	gulp.task('app',['browser-sync', 'sass', 'css-min', 'pug'], function() {
		gulp.watch('app/sass/**/*.sass', ['sass']).on('change', browserSync.reload); //Наблюдение за sass файлами
		gulp.watch('app/*.pug', ['pug']).on('change', browserSync.reload);
	    gulp.watch('app/css/*.css', ['css-min']).on('change', browserSync.reload); //Наблюдение за css файлами в корне проекта
	    gulp.watch('app/*.html').on('change', browserSync.reload); //Наблюдение за HTML файлами в корне проекта
		gulp.watch('app/js/**/*.js').on('change', browserSync.reload); //Наблюдение за JS файлами в папке js
	});

	gulp.task('default', ['app']); 

	//Прода
	gulp.task('clean', function() {
		return del.sync('dist'); // Удаляем папку dist перед сборкой
	});

	gulp.task('dist', ['clean', 'sass', 'css-min', 'pug'], function() {

		var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
			.pipe(gulp.dest('dist'));
			
		var buildCss = gulp.src([ // Переносим CSS стили в продакшен
			'app/css/main.min.css',
			// 'app/css/libs.min.css'
			])
			.pipe(gulp.dest('dist/css'))

		var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
			.pipe(gulp.dest('dist/js'))

		var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
			.pipe(gulp.dest('dist/fonts'))

		var buildFonts = gulp.src('app/img/**/*') // Переносим картинки в продакшен
			.pipe(gulp.dest('dist/img'))
	});