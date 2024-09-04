COPY SLIPRATE_tb(FaultName,FaultID,State,SiteName,SCECId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM7ObjectName,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,
UCERF3AppB,ShortReferences,Links,FullReferences) FROM '/home/postgres/GSRD/data/sliprate/sliprate_site_tb.csv' DELIMITER ',' CSV HEADER;
