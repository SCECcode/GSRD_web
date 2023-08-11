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
  EGDPATH=${PWD}"/../EGD_1_slip_rates/"
  EGDTYPE="EGD1_sliprates"
  EXCEL_NM="EGD_SlipRatesSites"
  DATATYPE="sliprate"
  EXCEL_NM_SHEET="EGD1 Slip Rates"
#  EXCEL_NM_FILE=${EGDPATH}"/EGD_SlipRates.xlsx"
fi

if [ $TOGGLE_C1 == 1 ]
then
  EGDPATH=${PWD}"/../EGD_1_chronology/"
  EGDTYPE="EGD1_chronology"
  EXCEL_NM="EGD1_Metadata_C"
  DATATYPE="chronology1"
  EXCEL_NM_SHEET="EGD1 Chronology"
  EXCEL_NM_FILE=${PWD}"/EGD_Chronology_Metadata.xlsx"
fi

