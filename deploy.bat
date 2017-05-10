rd tmp /S/Q
mkdir tmp
cd tmp
git clone %1 %2
cd %2
call buildmsvc.bat %3 %4
echo "build imx6q!!!"
call buildimx6q.bat
exit 0