import { COLORS } from './../utils/Colors.js';
import BitBox from './../components/BitBox.js';
import { useState, useEffect } from 'react';
import { thumbToASCII } from './../utils/thumbTranslator.js';
import { armToASCII } from './../utils/armTranslator.js';

function App(){

  const [thumbBits, setThumbBits] = useState(Array(16).fill(false));
  const [thumbInstruction, setThumbInstruction] = useState("Array(16).fill(false)");
  const [armBits, setArmBits] = useState(Array(32).fill(false));
  const [armInstruction, setArmInstruction] = useState("Array(16).fill(false)");

  useEffect(() => {
    console.log("thumbBits changed!");
    var result = thumbToASCII(thumbBits);
    console.log(result.instrucao);
    setThumbInstruction(result.instrucao);
  }, [thumbBits]);

  useEffect(() => {
    console.log("armBits changed!");
    var result = armToASCII(armBits);
    console.log(result.instrucao);
    setArmInstruction(result.instrucao);
  }, [armBits]);

  const change_thumb_bits = (index) => {
    var newArray = thumbBits.slice(0);
    newArray[index] = !newArray[index];
    setThumbBits(newArray);
    setArmBits([...newArray, ...newArray]);
  }

  return (
    <div style={Styles.app}>
      <div style={{backgroundColor: COLORS.green, ...Styles.background}}>
        <div style={Styles.bitRowDiv}><div style={Styles.bitRow}>
          {thumbBits.map((element, index) => <BitBox value={element} onPress={() => change_thumb_bits(index)}/>)}
        </div></div>
        <p>{thumbInstruction}</p>
        <p>Thumb</p>
      </div>
      <div style={{backgroundColor: COLORS.black, ...Styles.background}}>
        <div style={Styles.bitRowDiv}><div style={Styles.bitRow}>
          {armBits.map((element, index) => <BitBox value={element}/>)}
        </div></div>
        <p>{armInstruction}</p>
        <p>ARM</p>
      </div>
    </div>
  );
}

const Styles = {
  app: {
    textAlign: "center",
  },
  background: {
    padding: "10px",
    fontFamily: "Arial",
  },
  bitRowDiv: {
    display: "flex",
    justifyContent: "center"
  },
  bitRow: {
    display: "flex",
    flexDirection: "row"
  }
};

export default App;