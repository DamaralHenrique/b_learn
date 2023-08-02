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
    margin: '2px',
    padding: '5px',
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    borderStyle: "solid",
    borderWidth: "2px",
    borderRadius: 10
  },
  bit_text: {
    fontSize: 20,
    innerHeight: 100,
  }
};
  
export default BitBox;