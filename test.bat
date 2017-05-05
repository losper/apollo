echo %1
cd tmp
cd %2/aeolus
call :build
echo "aha?"
goto :eof
:build
echo "??"
exit 1