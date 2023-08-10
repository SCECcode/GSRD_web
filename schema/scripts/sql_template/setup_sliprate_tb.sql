COPY SLIPRATE_tb(FaultName,FaultID,State,SiteName,EGDId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM6ObjectName,DataType,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,
UCERF3AppB,ShortReferences,Links,FullReferences) FROM '/home/postgres/EGD/data/DATATYPE/sliprate_site_tb.csv' DELIMITER ',' CSV HEADER;
