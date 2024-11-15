import { useEffect, useState } from "react";
import AgGridTableComponent from "./agGridTable";
import { useGlobalState } from "./globalState";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function DailyRecord() {
    const {periods, dailyRecord, updateDailyRecord} = useGlobalState()
  const [dailyRecordState, setDailyRecordState] = useState(structuredClone(dailyRecord));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleStateUpdate = (period, newval) => {
    setDailyRecordState({
        ...dailyRecordState,
        [period] : newval,
    });
    updateDailyRecord({
        ...dailyRecordState,
        [period] : newval,
    });
  };

  const syncDailyRecords = () => {
    let forDate = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const postDailyRecord = async () => {
      const payload = {
        "date": forDate,
        "data": dailyRecordState
      }
      console.log(payload);
      try{
        const response = await fetch(`http://127.0.0.1:4000/daily_record`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        updateDailyRecord(structuredClone(dailyRecordState));
      }catch (error){
        console.log(error);
      }
    }
    //send data for sync to server
    postDailyRecord();
  }
  const getDailyRecords = async () => {
    //get data from server adn update global state
    let forDate = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const fetchDailyRecord = async () => {
      try{
        const response = await fetch(`http://127.0.0.1:4000/daily_record?date=${forDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        let allData = {};
        if(result["rows"].length){
          allData = JSON.parse(result["rows"][0][1]);
        }
        console.log(allData);
        setDailyRecordState(structuredClone(allData));
        updateDailyRecord(structuredClone(allData));
      }catch (error){
        console.log(error);
      }
    }

    fetchDailyRecord();
  }
  return (
    <div>
      <div className="flex-vertical">
      <button onClick={getDailyRecords}>GET DATA</button>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd-MM-yyyy" // Display format
        isClearable
        placeholderText="Click to select a date"
      />
      <button className="button-red" onClick={syncDailyRecords}>SEND DATA</button>
      </div>  
    {periods.map((period) => (
        <AgGridTableComponent 
            period={period} 
            value={dailyRecordState[ period ] ? dailyRecordState[ period ] : [] }
            updateValue={handleStateUpdate}
        />
      ))}
    </div>
  );
}

export default DailyRecord;
