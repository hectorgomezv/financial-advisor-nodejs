#!/bin/bash

## Usage
## DB=financialAdvisorDB ADMIN_PASSWORD=myAdminPassword sh backup.sh

set -e
BACKUP_NAME=$DB-$(date +%y%m%d_%H%M%S).gz

date

echo "Dumping MongoDB $DB database to compressed archive"
docker exec financial-advisor-nodejs-fa-mongo-1 mongodump --db $DB --archive=$HOME/backup/$BACKUP_NAME --gzip -u admin --authenticationDatabase=admin -p $ADMIN_PASSWORD 
docker cp financial-advisor-nodejs-fa-mongo-1:/root/backup/ /root/backup/

