COPY SLIPRATE_tb(FaultName,NSHM23FaultId,LastUpdate,SCECId,NSHM23RateId,State,SiteName,Longitude,Latitude,DistToCFMFault,CFM7ObjectName,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,UCERF3AppB,ShortReference,Links,FullReference) FROM '/home/postgres/GSRD/data/sliprate/sliprate_site_tb.csv' DELIMITER ',' CSV HEADER;

