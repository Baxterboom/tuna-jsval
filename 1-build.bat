@echo off
call gulp build
call gulp file:watch
echo Done! 