import MainGrid from './../components/MainGrid.js';
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
      <MainGrid
        bits={thumbBits}
        instruction={thumbInstruction}
        isThumb={true}
        change_bits={change_thumb_bits}
        message="my message"
      />
      <MainGrid
        bits={armBits}
        instruction={armInstruction}
        isThumb={false}
        message="error message"
      />
    </div>
  );
}

const Styles = {
  app: {
    textAlign: "center",
    overflow: 'hidden'
  },
};

export default App;