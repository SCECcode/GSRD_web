#!/bin/sh

## extract csv files from user supplied xlsx file
##
## in2csv and csvcut are from https://csvkit.readthedocs.io/en/latest/index.html
##
## sudo pip install csvkit

. ./common.sh

rm -f *.csv
#in2csv --sheet "${EXCEL_NM_SHEET}" ${EXCEL_NM_FILE} | csvcut -c 1-26 > ${EXCEL_NM}_raw.csv

cat ${GSRDPATH}/${EXCEL_NM}.csv | csvcut -v -e "utf-8-sig" -c 1-27> ${EXCEL_NM}_raw.csv
cat ${EXCEL_NM}_raw.csv |sed "s/  / /g" | sed "s/, E/,E/"  > ${EXCEL_NM}.csv
csvcut -n ${EXCEL_NM}.csv > ${EXCEL_NM}_column_labels

#csvcut -c 21 ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
#sliprate_id,test
#"> my_tb.csv 

#csvcut -c "27" ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
csvcut -c "16" ${EXCEL_NM}.csv |csvcut -K 1 | sed "1i\\
id,target
"> id_test_tb.csv 

# 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27
#FaultName,FaultID,State,SiteName,
#SCECId,SliprateId,
#Longitude,Latitude,
#DistToCFMFault,CFM6ObjectName,
#Observation,PrefRate,LowRate,HighRate,RateUncertainty,RateType,ReptReint,
#OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,
#UCERF3 AppB,Short References,DOI/Web Link,Full References
#
csvcut -c "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27" ${EXCEL_NM}.csv |csvcut -K 1|sort -n|uniq | sed "1i\\
FaultName,FaultID,State,SiteName,SCECId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM7ObjectName,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,UCERF3AppB,ShortReferences,Links,FullReferences
"> sliprate_site_tb.csv 
