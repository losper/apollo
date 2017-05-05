cd tmp/poseidon
:build
pscp -pw yangchao buildimx6q.sh yangchao@192.168.3.248:/home/yangchao/buildimx6q.sh
plink -pw yangchao yangchao@192.168.3.248 "bash ~/buildimx6q.sh"
pscp -pw yangchao yangchao@192.168.3.248:/home/yangchao/do.sh do.sh