@echo off
call gulp build
call start ./demo/index.html
call gulp file:watch
echo Done! 