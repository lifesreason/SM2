var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
    var clean = require('gulp-clean');
    //jshint = require('gulp-jshint'),
gulp.task('clean', function () {
	return gulp.src('build/')
        .pipe(clean())
});

gulp.task('js', function () {
   return gulp.src([
   		'core/*.js', 
   		'lib/asn1-1.0.js', 
   		'lib/asn1cms-1.0.js',
   		'lib/asn1cades-1.0.js',
   		'lib/asn1csr-1.0.js',
   		'lib/asn1hex-1.1.js',
   		'lib/asn1ocsp-1.0.js',
   		'lib/asn1tsp-1.0.js',
   		'lib/asn1x509-1.0.js',
   		'lib/base64.js',
   		'lib/base64x-1.1.js',
   		'lib/x64-core.js',
   		'lib/cipher-core.js',
   		'lib/md5.js',
   		'lib/pbkdf2.js',
   		'lib/prng4.js',
   		'lib/ripemd160.js',
   		'lib/aes.js',
   		'lib/rng.js',
   		'lib/rsa.js',
   		'lib/rsa2.js',
   		'lib/sha1.js',
   		'lib/sha256.js',
   		'lib/sha224.js',
   		'lib/sha512.js',
   		'lib/sha384.js',
   		'lib/dsa-modified-1.0.js',
   		'lib/ec.js',
   		'lib/ecdsa-modified-1.0.js',
   		'lib/ec-patch.js',
   		'lib/enc-base64.js',
   		'lib/hmac.js',
   		'lib/jsbn.js',
   		'lib/jsbn2.js',
   		'lib/json-sans-eval.js',
   		'lib/jws-3.3.js',
   		'lib/jwsjs-2.0.js',
   		'lib/keyutil-1.0.js',
   		'lib/pkcs5pkey-1.0.js',
   		'lib/rsapem-1.1.js',
   		'lib/rsasign-1.2.js',
   		'lib/x509-1.1.js',
   		'ext/*.js', 
   		'sm/crypto-1.1.js',
         'sm/ecparam-1.0.js',
         'sm/sm2-1.0.1.js',
         'sm/sm3-sm2-1.0.js',
         'sm/sm3-1.0.0.js',
         'sm/api.js',

         ])
      // .pipe(plugins.jshint())
      // .pipe(plugins.jshint.reporter('default'))
      //.pipe(plugins.uglify())
      .pipe(plugins.concat('index.js'))
      .pipe(gulp.dest('build'));
});

gulp.task('default', ['clean', 'js']);