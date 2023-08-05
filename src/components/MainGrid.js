import { COLORS } from '../utils/Colors.js';
import BitBox from './BitBox.js';

function MainGrid({bits, instruction, isThumb, change_bits, message }) {

  const Styles = {
    background: {
      fontFamily: 'Arial',
      height: window.innerHeight/2,
    },
    bitRowDiv: {
      display: 'flex',
      justifyContent: 'center',
    },
    center: {
      height: "100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    instructionText: {
      paddingTop: 10,
      fontSize: 40,
      color: isThumb ? COLORS.black : COLORS.white,
    },
    messageText: {
      paddingTop: 20,
      fontSize: 20,
      color: isThumb ? COLORS.black : COLORS.red,
    },
    title: {
      fontSize: 100,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textAlign: isThumb ? 'left' : 'right',
      color: isThumb ? COLORS.black : COLORS.green,
      top: isThumb ? -90 : window.innerHeight/2 - 22,
      left: !isThumb ? window.innerWidth - 230 - 30 : 30,
      position: isThumb ? 'relative' : 'absolute'
    },
    indexDiv: {
      display: "flex",
      flexDirection: "column"
    },
    bitIndex: {
      color: "rgb(255, 255, 255)"
    }
  };

  return (
    <div style={{backgroundColor: isThumb ? COLORS.green : COLORS.black, ...Styles.background}}>
      {!isThumb && <div style={Styles.title}>ARM</div>}
      <div style={Styles.center}>
        <div style={Styles.bitRowDiv}>
          {bits.map((element, index) =>
            <div style={Styles.indexDiv}>
              <div style={Styles.bitIndex}>{bits.length-index-1}</div>
              <BitBox value={element} onPress={() => change_bits && change_bits(index)}/>
            </div> 
          )}
        </div>
        {message && <a style={Styles.messageText}>{message}</a>}
        <a style={Styles.instructionText}>{instruction}</a>
      </div>
      {!!isThumb && <div style={Styles.title}>THUMB</div>}
    </div>
  );
}
  
export default MainGrid;