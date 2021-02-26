import './App.css';
import Gauge from './Gauge';
import { useState } from "react";
import * as d3 from "d3";

function App() {

  const [startSpeedometer, setStartSpeedometer] = useState(false);
  const [resetSpeedometer, setResetSpeedometer] = useState(false);

  const handleStartSpeedometer = () => {
    setStartSpeedometer(true)
    setResetSpeedometer(false)
  }

  const handleResetSpeedometer = () => {
    setStartSpeedometer(false)
    setResetSpeedometer(true)
    var svg = d3.select('svg');
    svg.selectAll('.fixed-arc').remove();
  }

  return (
    <div className="App">  
    <br></br>    
      <button className="start" onClick={handleStartSpeedometer}>Start</button>&nbsp;
      <button className="reset" onClick={handleResetSpeedometer}>Reset</button>
      {startSpeedometer && <Gauge value={0}/>}
      {resetSpeedometer && <Gauge value={220}/>}
    </div>
  );
}

export default App;
