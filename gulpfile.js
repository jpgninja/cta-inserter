var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , less = require('gulp-less')
  , gutil = require('gulp-util')
  , path = require('path')
  , fs = require('fs')
  , glob = require('glob')
  , mkdirp = require('mkdirp')
  , bower = require('bower')
  , Combine = require('stream-combiner')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')
  , config = require('./bower.json')
  , livereload = require('gulp-livereload')
  // , svgSprites = require('gulp-svg-sprites')
  // , svg = svgSprites.svg
  ; 


/////////////////////>  Configuration



/**
 * @TODO: Remember to uncomment the view watching below (in tasks/utils)
 *  List html views (here php files)
 *  Each entry in the array represent a package.
 *  This represent a standard situation, don't hesitate 
 *  to add or remove a package to reflect the application
 *  For now, it is just use for livereload
 *
 *  Each group have the following parameters
 *  @param watch <String> or <Array> Files to watch in dev
 **/
// var views = [
//  {
//    name:   "template",
//    watch:  "wp-content/themes/worlds_best_story/**/*.php"
//  }
// ];


/**
 *  List of all the css packages with their information
 *  Each entry in the array represent a package.
 *  This represent a standard situation, don't hesitate 
 *  to add or remove a package to reflect the application
 *  
 *  Each group have the following parameters
 *  @param name <String> The name of the group. It will be used to name the generated output
 *  @param output <String> Where to store the result
 *  @param src <String> or <Array> List of the file to include in the package
 *  @param watch <String> or <Array> Files to watch in dev
 **/
var styles = [
  {
    name:   "cta",
    output: "html/styles/",
    // style:  "compressed",
    // compress: true,
    src:    "html/styles/less/cta.less",
    watch:  [
      "html/styles/less/**/*.less",
      "html/styles/less/cta.less"
    ]
  }
  // ,{
  //  name:   "vendors",
  //  output: "html/static/styles/",
  //  src:    "html/static/styles/less/vendors.less",
  //  watch:  [
  //    "html/static/styles/less/vendors/**/*.less",
  //    "html/static/styles/less/vendors.less"
  //  ]
  // }
];

/**
 *  List of all the libs packages with their information
 *  Each entry in the array represent a package.
 *  This represent a standard situation, don't hesitate 
 *  to add or remove a package to reflect the application
 *  
 *  Each group have the following parameters:
 *  @param name <String> The name of the group. It will be used to name the generated output
 *  @param output <String> The path where to store the finale compressed output
 *  @param sourceMap <Boolean> Output the sourcemap or not (only in development).
 *  @param lint <Boolean> Lint the library.
 *  @param build <String> How to build the librairies. Available values: uglify, concat
 *  @param watch <String> or <Array> Lint the code.
 *  @param src <String> or <Array> List of all the file to include in the package
 **/
var libs = [
  {
    name:       "cta",
    output:     "html/",
    // template:    "application/views/includes/libs/app.php",
    sourceMap:  false,
    lint:       false,
    build:      'concat',
    watch:      'html/libs/**/*.js',
    src:        [
      // Compile files
      'html/libs/vendor/jquery/*.js',
      'html/libs/vendor/**/*.js',
      'html/libs/cta.js',

      // Ignore files
      '!html/libs/vendor/gsap/*.js',
      '!html/libs/bookmarklet.js'
    ]
  }
  ,{
    name:       "bookmarklet",
    output:     "html/",
    sourceMap:  false,
    lint:       true,
    build:      'uglify',
    watch:      'html/libs/bookmarklet.js',
    src:        [
      'html/libs/bookmarklet.js'
    ]
  }
]


/////////////////////>  Tasks

///////////> Utils

/**
 *  Convert the svg files to a svg sprites
 **/
// gulp.task('sprites', function()
// {
//  var config = 
//  {
//      defs:true
//    , cssFile: "../styles/less/app/utils/svg.less"
//    , svg: 
//    {
//      defs: "svg-defs.svg"
//    }
//  }

//  gulp.src('html/static/images/svg/*.svg')
//    .pipe( svg(config) )
//    .pipe( gulp.dest('html/static/images/') )
//  ;
// });

/**
 *  Install the frontend librairies + styles with bower
 **/
gulp.task('install', function()
{
  bower.commands
    .install()
    .on('end', function (message)
    {
      bower.commands
        .list({paths: true})
        .on('end', function (data) 
        {
        installLibrairies( data );
        });
    });
});

/**
 *  Lint the libraries to detect flaws
 **/
gulp.task('libs.lint', function()
{
  var n = libs.length;
  var lib;
  while(n--)
  {
    lib = libs[n];

    if ( !lib.lint || lib.lint == false )
      continue;

    gulp.src( lib.src )
      .pipe( jshint({strict:true}) )
      .pipe( jshint.reporter('default') )
    ;
  }
});

/**
 *  Concatenate the libraries into a file (not compressed)
 **/
gulp.task('libs.concat', function()
{
  var n = libs.length;
  var lib;

  while(n-->0)
  {
    lib = libs[n];

    gulp.src( lib.src )
      .pipe( concat(lib.name+'.min.js') )
      .pipe( gulp.dest(lib.output) );
  }
});

/**
 *  function called when the librairies have been installed by bower.
 *
 *  - move the librairies to the destination folder specified in the bower.json file
 *  - remove the bower_components installation in the end
 **/
function installLibrairies( libs )
{
  var destinations = config.destinations;

  for( libName in libs )
  {
    lib = libs[libName];
    options = destinations[libName];

    // if a main file is referenced in the bower.json of the included project
    // go back to the root
    if ( fs.existsSync(lib) && fs.lstatSync(lib).isFile() )
    {
      lib = path.dirname(lib);
    }

    if (options)
    {
      sources = options.sources != undefined ? options.sources : [ lib+'/**'];
      
      // resolve all the sources files
      bowersources = [];
      n = sources.length;
      while(n-->0)
      {
        bowersources = bowersources.concat( glob.sync(sources[n]) );
      }

      // copy the file to destination
      n = bowersources.length;
      while(n-->0)
      {
        source = bowersources[n];
        sourceDirectory = source.substring( lib.length );
        sourceFile = path.basename( sourceDirectory );
        sourceDirectory = path.dirname( sourceDirectory );

        destDirectory = path.join(__dirname, options.path, sourceDirectory);
        destFile = path.basename( source );
        dest = path.join( destDirectory, destFile );

        // console.log( '---' );
        // console.log( 'lib:', lib );
        // console.log( 'libName:', libName );
        // console.log( 'libOption:', options.path );
        // console.log( '' );
        // console.log( 'source:', source );
        // console.log( 'sourceFile:', sourceFile );
        // console.log( 'sourceDirectory:', sourceDirectory );
        // console.log( );
        // console.log( 'destDirectory:', destDirectory );
        // console.log( 'destFile:', destFile );
        // console.log( 'dest:',dest );

        if (!fs.existsSync(destDirectory))
        {
          console.log( 'create directory', destDirectory );
          mkdirp.sync(destDirectory, 0744);
        }

        if ( fs.lstatSync(source).isFile() )
          fs.createReadStream( source ).pipe(fs.createWriteStream( dest ));

      }
    }
    else
    {
      console.warn( 'WARN: Skip this library because no option defined', libName );
    }
  }
}

///////////> Dev

/**
 *  Process all the styles groups in the configuration section
 *  - generate the stylesheet (uncompressed)
 *  - generate the source map file
 **/
gulp.task('styles.dev', function () 
{
  var n = styles.length;
  var style;
  var combined;

  while(n-- > 0)
  {
    style = styles[n];

    combined = Combine(
      gulp.src( style.src )
      .pipe(
        less(
        {
          compress: false,
          sourceMap: true,
          sourceMapFileInline: true,
          sourceMapBasepath:__dirname,
          relativeUrls: true
        })
        .on('error', function(message){
          gutil.beep();
          gutil.log( gutil.colors.red('!!! LESS ERROR : \n'), message );
        })
      )
      .pipe(gulp.dest( style.output ))
      .on('error', gutil.log)
    );

    gutil.log( style.src );
    
    combined.on('error', function(err) {
      console.warn(err.message)
    });
  }
});

/**
 *  Process the javascript groups in the configuration section
 *  - concat the files
 *  - generate the sourcemap
 **/
gulp.task('libs.dev', ['libs.lint'], function()
{
  var n = libs.length;
  var lib;
  var map;

  while(n-->0)
  {
    lib = libs[n];
    map = lib.sourceMap == undefined ? false : lib.sourceMap;

    switch ( lib.build )
    {
      case 'uglify':
        gulp.src( lib.src )
          .pipe( concat(lib.name+'.min.js') )
          .pipe(
            uglify({ outSourceMap:map })
            .on('error', function(message){
              gutil.beep();
              gutil.log( gutil.colors.red('!!! JS ERROR : \n'), message );
            })
          )
          .pipe( gulp.dest(lib.output) );
        break;

      case 'concat':
      default:
        gulp.src( lib.src )
          .pipe( concat(lib.name+'.min.js') )
          .pipe( gulp.dest(lib.output) );
        break;
    }
  }
});

/**
 *  Developpement mode 
 *
 *  - build the styles (for dev)
 *  - build the scripts (for dev)
 *  - Watch for changed to build the scripts and/or the styles
 **/
gulp.task('dev', ['styles.dev', 'libs.dev'], function ()
{
  // auto watch styles file change
  var n = styles.length;
  var style;
  var server = livereload();
  while( n-- )
  {
    style = styles[n];
    if (style.watch)
    {
      gutil.log( '[watch] [styles]' + style.watch );
      gulp.watch(style.watch, ['styles.dev']).on('change', function(file) {
        server.changed(file.path);
      });
    }
  }

  // auto watch libs file change
  var n = libs.length;
  var lib;
  while ( n-- )
  {
    lib = libs[n];
    if (lib.watch)
    {
      gutil.log( '[watch] [libs]' + lib.watch );
      gulp.watch(lib.watch, ['libs.dev']).on('change', function(file) {
        server.changed(file.path);
      });
    }
  }

  // Watching the PHP views
  // var n = views.length;
  // var view;
  // while(n--)
  // {
  //  view = views[n];

  //  gulp.watch(view.watch).on('change', function(file) {
  //    server.changed(file.path);
  //  });
  // }
});

///////////> Distribution

/**
 *  Process all the styles groups in the configuration section
 *  - generate the stylesheets (compressed)
 **/
gulp.task('styles', [], function()
{
  var n = styles.length;
  var style;
  var combined;

  while(n-- > 0)
  {
    style = styles[n];

    combined = Combine(
      gulp.src( style.src )
        .pipe(
          less(
          {
            compress: true
          }))
        .pipe(gulp.dest( style.output ))
        .on('error', gutil.log)
    );
    
    combined.on('error', function(err) {
      console.warn(err.message)
    });
  }
});

/**
 *  Process the javascript groups in the configuration section
 *  - concat all the libraries
 *  - uglify the concatenated files
 **/
gulp.task('libs', ['libs.lint'], function()
{
  var n = libs.length;
  var lib;
  var map;

  while(n-->0)
  {
    lib = libs[n];
    map = lib.sourceMap == undefined ? false : lib.sourceMap;

    gulp.src( lib.src )
      .pipe( concat(lib.name+'.min.js') )
      .pipe( uglify({mangle: false}) )
      .pipe( gulp.dest(lib.output) );
  }
});

/**
 *  Prepare the project for distribution
 *  - launch the libs task
 *  - launch the styles task
 **/
gulp.task('dist', ['libs', 'styles']);

/**
 *  Alias for the distribution
 **/  
gulp.task('prod', ['dist']);

///////////> Doc

gulp.task('default', function()
{
  console.log( 'Gulp build script for frontend development' );
  console.log( 'Version: 1.3' );
  console.log( '' );
  console.log( 'Available tasks:' );
  console.log( '' );
  console.log( ' gulp install \t Install the frontend librairies and styles with bower.' );
  console.log( ' gulp dev \t\t This is the task to launch on development, it will build the styles (for dev), build the scripts (for dev), Watch for changed to build the scripts and/or the styles' );
  console.log( ' gulp styles.dev \t Process all the styles groups in the configuration section, generate the stylesheet (uncompressed), generate the source map file' );
  console.log( ' gulp libs.dev \t\t Process the libraries groups in the configuration section, concat the files, uglify the files, generate the sourcemap' );
  console.log( '' );
  console.log( ' gulp dist \t\t This will build the scripts.min.js and the styles.css, based on the configuration on the top of the gulpfile.js. All the files will be minified and compressed.' );
  console.log( ' gulp styles \t\t Process all the styles groups in the configuration section, generate the stylesheet (compressed)' );
  console.log( ' gulp libs \t\t Process the libraries groups in the configuration section, concat the files, ugligy the files' );
  console.log( '' );
});