
/*
ATENÇÃO: O CÓDIGO AQUI PRESENTRE PERTENCE A BRUNO BASSETO
https://github.com/bru4bas

Esse arquivo contém as funções necessárias para a
conversão da instrução binária para legível
*/


const ccodes = [
  "eq",             // 0000
  "ne",             // 0001
  "cs",             // 0010
  "cc",             // 0011
  "mi",             // 0100
  "pl",             // 0101
  "vs",             // 0110
  "vc",             // 0111
  "hi",             // 1000
  "ls",             // 1001
  "ge",             // 1010
  "lt",             // 1011
  "gt",             // 1100
  "le",             // 1101
  "",               // 1110
  ""                // 1111
];

function trata_rlist(bits) {
   let res = '';
   let mask = 1;
   let reg = 0;
   let marca = false;
   let last = -1;
   for(mask=1, reg=0; reg<8; mask<<=1, reg++) {
      if((bits & mask) == mask) {
         if(!marca) last = reg;
         marca = true;
      } else {
         if(marca) {
            let p = reg - 1;
            if(res.length > 0) res += ',';
            if(last != p) res += `r${last}-r${p}`;
            else res += `r${last}`;
         }
         marca = false;
      }
   }
 
   if(marca) {
      if(res.length > 0) res += ',';
      if(last != 15) res += `r${last}-r15`;
      else res += `r15`;
   }
   return res;
 }

/**
* Trata saltos (b).
*/
function trata_b(bits) {
  let offset = bits & 0x07ff;
  if((offset & 0x0400) == 0x0400) {
     offset ^= 0x07ff;
     offset = -offset-1;
  }
  let res = 'b';
  res += ` pc+#${(offset+2)*2}`
  return {
     instrucao: res,
     mask: "0000033333333333"
  };
}

/**
* Trata saltos condicionais (b).
*/
function trata_bcond(bits) {
  let offset = bits & 0x00ff;
  if((offset & 0x0080) == 0x0080) {
     offset ^= 0x00ff;
     offset = -offset-1;
  }
  let res = 'b';
  let cond = (bits >> 8) & 0x0f;
  res += ccodes[cond];

  res += ` pc+#${(offset+2)*2}`
  return {
     instrucao: res,
     mask: "0000111133333333"
  };
}

/**
* Trata saltos (bl).  AQUI
*/
function trata_bl(bits) {
  let offset = bits & 0x07ff;
  if((offset & 0x0400) == 0x0400) {
     offset ^= 0x07ff;
     offset = -offset-1;
  }
  let res = 'bl';
  res += ` pc+#${(offset+2)*4}`
  return {
     instrucao: res,
     mask: "0000233333333333"
  };
}

/**
* Trata saltos (bx).
*/
function trata_bx(bits) {
  let rm = (bits >> 3) & 0x07;
  let res = 'bx';
  if((bits & 0x0040) == 0x0040) rm = rm + 8;
  res += ` r${rm}`
  return {
     instrucao: res,
     mask: "0000000002444000"
  };
}

/**
* Trata SWI (ou SVC?)
*/
function trata_swi(bits) {
  let n = bits & 0x00ff;
  let res = "swi";
  res = res + ` #${n}`;
  return {
     instrucao: res,
     mask: "0000000033333333"
  };
}

function trata_op1(bits) {
  let rm = (bits >> 6) & 0x07;
  let rn = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let res = 'adds';
  if((bits & 0x0200) == 0x0200) res = 'subs';
  res = res + ` r${rd}, r${rn}, r${rm}`;
  return {
     instrucao: res,
     mask: "0000002444555666"
  };
}

function trata_op2(bits) {
  let imm = (bits >> 6) & 0x07;
  let rn = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let res = 'adds';
  if((bits & 0x0200) == 0x0200) res = 'subs';
  res = res + ` r${rd}, r${rn}, #${imm}`;
  return {
     instrucao: res,
     mask: "0000002333555666"
  };
}

function trata_op3(bits) {
  let imm = bits & 0x00ff;
  let rd = (bits >> 8) & 0x07;
  let op = (bits >> 11) & 0x03;
  let res = [
     'movs',
     'cmp', 
     'adds',
     'subs'
  ][op];
  res = res + ` r${rd}, #${imm}`;
  return {
     instrucao: res,
     mask: "0002244433333333"
  };
}

function trata_op4(bits) {
  let rn = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let sh = (bits >> 6) & 0x1f;
  let op = (bits >> 11) & 0x03;
  let res = [
     'lsls',
     'lsrs', 
     'asrs',
     '???'
  ][op];

  res = res + ` r${rd}, r${rn}, #${sh}`;
  return {
     instrucao: res,
     mask: "0002233333555666"
  };
}

function trata_op5(bits) {
  console.log("trata_op5");
  let rs = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let op = (bits >> 6) & 0x0f;
  let res = [
     'ands',
     'eors',
     'lsl',
     'lsr',
     'asr',
     'adcs',
     'sbcs',
     'ror',
     'tsts',
     'negs',
     'cmps',
     'cmns',
     'orrs',
     'muls',
     'bics',
     'mvns'
  ][op];

  res = res + ` r${rd}, r${rs}`;
  return {
     instrucao: res,
     mask: "0000002222555666"
  };
}

// Hi register operations/branch exchange
function trata_op6(bits) {
   
   let opcode = (bits & 0x0300) >> 8;
   let h1 =  (bits & 0x0080) >> 7;
   let h2 = (bits & 0x0040) >> 6;
   let res = [
      'add',
      'cmp',
      'mov',
      'bx'
   ][opcode];
   
   // Seleciona os registradores de acordo com h1/h2
   let Rs_Hs = ((bits & 0x0038) >> 3) + (h2 << 3);
   let Rd_Hd = (bits & 0x0007) + (h1 << 3);
   
   if ( opcode === 0x3) {
      if( h1 === 0x1) {
            return {
               instrucao: "???",
               mask: "0000000000000000"
            };
      }
      res = res + ` r${Rd_Hd}`;
      return {
         instrucao: res,
         mask: "0000002222555666"
      };
   } else if ((h1 | h2) === 0x0) {
      return {
         instrucao: "???",
         mask: "0000000000000000"
      };
   } else {
      res = res + ` r${Rd_Hd}, r${Rs_Hs} `;
      return {
         instrucao: res,
         mask: "0000000000000000"
      };
   }
}

function trata_op7(bits) {
   let res = "add";
   let sp = (bits & 0x0800) >> 11;
   let word8 = (bits & 0x00ff);
   let Rd = (bits & 0x0700) >> 8;
   let arm_Rn = sp === 0 ? "PC" : "SP";
   res = res + ` r${Rd}, ${arm_Rn}, #${word8 * 4}`
   return {
      instrucao: res,
      mask: "0000000000000000"
   };
}

function trata_op8(bits) {
   let res = "add SP, #";
   let sign = (bits & 0x0080) >> 7;
   let sword7 = (bits & 0x007f);
   let offset = sword7 === 0x007f ? 0x0 : sword7; // sign extended problems
   if (sign === 1) {
      res = res + `-`;
   }
   res = res + ` ${offset << 2} `;
   return {
      instrucao: res,
      mask: "0000000000000000"
   };
}

function trata_ld1(bits) {
  let rn = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let res = 'str';
  if((bits & 0x0800) == 0x0800) res = 'ldr';
  if((bits & 0x1000) == 0x1000) res += 'b';

  let offset = (bits >> 6) & 0x001f;
  if((bits & 0x1000) == 0) offset = offset * 4; 
  res = res + ` r${rd}, [r${rn}, #${offset}]`;
  return {
     instrucao: res,
     mask: "0001233333555666"
  };
}

function trata_ld2(bits) {
  let rn = (bits >> 3) & 0x07;
  let rd = (bits & 0x07);
  let res = 'strh';
  if((bits & 0x0800) == 0x0800) res = 'ldrh';

  let offset = (bits >> 6) & 0x001f;
  offset = 2 * offset;
  res = res + ` r${rd}, [r${rn}, #${offset}]`;
  return {
     instrucao: res,
     mask: "0000233333555666"
  };
}

function trata_ld3(bits) {
  let rn = (bits >> 3) & 0x07;
  let rm = (bits >> 6) & 0x07;
  let rd = (bits & 0x07);
  let op = (bits >> 9) & 0x07;
  let res = [
     'str',
     'strh',
     'strb',
     'ldrsb',
     'ldr',
     'ldrh',
     'ldrb',
     'ldrsh'
  ][op];
  res = res + ` r${rd}, [r${rn}, r${rm}]`;
  return {
     instrucao: res,
     mask: "0000222444555666"
  };
}

function trata_ld4(bits) {
  let rd = (bits >> 8) & 0x07;
  let res = 'ldr';

  let offset = bits & 0x00ff;
  offset = 4 * offset;
  res = res + ` r${rd}, [pc, #${offset}]`;
  return {
     instrucao: res,
     mask: "0000044433333333"
  };
}

function trata_ld5(bits) {
  let rd = (bits >> 8) & 0x07;
  let res = 'str';
  if((bits & 0x0800) == 0x0800) res = 'ldr';

  let offset = bits & 0x00ff;
  offset = 4 * offset;
  res = res + ` r${rd}, [sp, #${offset}]`;
  return {
     instrucao: res,
     mask: "0000244433333333"
  };
}

function trata_ld6(bits) {
   let res;
   let ldr_str = (bits & 0x0800) >> 11;
   let pc_lr = (bits & 0x0100) >> 8;
   let extra_reg;
   let Rlist = trata_rlist(bits);

   if (ldr_str === 0x1){
       extra_reg = 'PC';
       res = `POP {${Rlist}`
   } else {
       extra_reg = 'LR';
       res = `PUSH {${Rlist}`
   }

   if (pc_lr === 1) {
      res = res + `, ${extra_reg}}`;
   } else {
      res = res + `}`;
   }

   return {
      instrucao: res,
      mask: "0000244433333333"
   };   
}

function trata_ld7(bits) {
   let res;
   let ldr_str = (bits & 0x0800) >> 11;
   let Rb = (bits & 0x0700) >> 8;
   let Rlist = trata_rlist(bits);

   if (ldr_str === 1) {
      res = "ldmia";
   } else {
      res = "stmia";
   }
   res = res + ` r${Rb}!, {${Rlist}}`;
   return {
      instrucao: res,
      mask: "0000244433333333"
   };   
}


/*
console.log(disasm(0xe002));
console.log(disasm(0xe7fd));
console.log(disasm(0xd102));
console.log(disasm(0x4718));
console.log(disasm(0x4758));
console.log(disasm(0xdf19));
console.log(disasm(0x1888));
console.log(disasm(0x1dc8));
console.log(disasm(0x280a));
console.log(disasm(0x230a));
console.log(disasm(0x0151));
console.log(disasm(0x1151));
console.log(disasm(0x1951));
console.log(disasm(0x402b));
*/


/**
* Desassembla a instrução passada como parâmetro (16 bits).
*/
function thumbToASCII(array) {
  var bits = 0;
  array.map((element, index) => {
    if(element){
      bits += 2 ** (15 - index);
    }
  });
  console.log(bits.toString(16));
  if((bits & 0xff00) == 0xdf00) return trata_swi(bits);
  if((bits & 0xfc00) == 0x1800) return trata_op1(bits);
  if((bits & 0xfc00) == 0x1c00) return trata_op2(bits);
  if((bits & 0xe000) == 0x2000) return trata_op3(bits);
  if((bits & 0xe000) == 0x0000) return trata_op4(bits);
  if((bits & 0xfc00) == 0x4000) return trata_op5(bits);
  if((bits & 0xfc00) == 0x4400) return trata_op6(bits);
  if((bits & 0xf000) == 0xa000) return trata_op7(bits);
  if((bits & 0xff00) == 0xb000) return trata_op8(bits);
  if((bits & 0xf000) == 0xd000) return trata_bcond(bits);
  if((bits & 0xf800) == 0xe000) return trata_b(bits);
  if((bits & 0xf000) == 0xf000) return trata_bl(bits);
  if((bits & 0xff87) == 0x4700) return trata_bx(bits);
  if((bits & 0xe000) == 0x6000) return trata_ld1(bits);
  if((bits & 0xf000) == 0x8000) return trata_ld2(bits);
  if((bits & 0xf000) == 0x5000) return trata_ld3(bits);
  if((bits & 0xf800) == 0x4800) return trata_ld4(bits);
  if((bits & 0xf000) == 0x9000) return trata_ld5(bits);
  if((bits & 0xf600) == 0xb400) return trata_ld6(bits);
  if((bits & 0xf000) == 0xc000) return trata_ld7(bits);

  return {
     instrucao: "???",
     mask: "0000000000000000"
  };
}


export { thumbToASCII }
