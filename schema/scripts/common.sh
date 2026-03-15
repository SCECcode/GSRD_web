#####  processing schema/data
#####  cp target_data's  target.csv here
#####  unmark the data type at the bottom
#####
#####    ./extract-csv.sh
#####        mv *.csv to  schema/data/target
#####    ./create-sql.sh
#####        mv *.sql to  schema/sql/target
#####

TOGGLE_S1=1
TOGGLE_C1=0

PWD=`pwd`


if [ $TOGGLE_S1 == 1 ]
then
  GSRDPATH=${PWD}"/../GSRD_slip_rates_v2026_03/"
  GSRDTYPE="GSRD_sliprates"
  EXCEL_NM="GSRD_v2026.03"
  DATATYPE="sliprate"
  EXCEL_NM_SHEET="GSRD Slip Rates"
  LABEL_CNT=28
#  EXCEL_NM_FILE=${GSRDPATH}"/GSRD_SlipRates.xlsx"
fi

if [ $TOGGLE_C1 == 1 ]
then
  GSRDPATH=${PWD}"/../GSRD_chronology/"
  GSRDTYPE="GSRD_chronology"
  EXCEL_NM="GSRD_Metadata_C"
  DATATYPE="chronology"
  EXCEL_NM_SHEET="GSRD Chronology"
  EXCEL_NM_FILE=${PWD}"/GSRD_Chronology_Metadata.xlsx"
fi

