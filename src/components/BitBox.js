import { COLORS } from './../utils/Colors.js';

function BitBox({value, onPress}) {
  return (
    <button style={Styles.app} onClick={() => onPress()}>
      <a style={Styles.bit_text}>{value ? 1 : 0}</a>
    </button>
  );
}

const Styles = {
  app: {
    padding: '5px',
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    borderStyle: "solid",
    borderWidth: "2px",
  },
  bit_text: {
    innerHeight: 100,
    fontFamily: "Montserrat",
  }
};
  
export default BitBox;