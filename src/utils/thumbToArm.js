import { 
    ARM_SHIFTER,
    ARM_DP_OPCODES,
    ARM_REGS,
    ARM_BASE_INSTRUCTIONS,
    ARM_DT_OPCODES
} from "./armConstants";

/*
Retorna bits mascarados.
IMPORTANTE: Por convenção, deves-se 
*/
function getMasked(bits, mask, shift = 0) {
    return (bits & mask) >> shift;
}

// Se o offset for imediato, immediate flag = 0 (ARM things)
function armLoadStore(opcode, imm_flag, byte_flag, write_back, ldr_str, Rn, Rd, offset) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['DATA_TRANSF'];
    arm_bits += opcode << 26;
    arm_bits += imm_flag << 25;
    arm_bits += byte_flag << 22;
    arm_bits += write_back << 21;
    arm_bits += ldr_str << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += offset;

    return arm_bits;
}

function armDataProcessing(immediate_flag, opcode, set_condition_codes, Rn, Rd, operand2) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['DATA_PCSS'];
    arm_bits += immediate_flag << 25;
    arm_bits += opcode << 21;
    arm_bits += set_condition_codes << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += operand2 << 0;
    return arm_bits; // Basicamente isso transforma de 
}

// Move shifted register
function format1(thumb_bits) {
    let opcode = getMasked(thumb_bits, 0x1800, 10);
    let offset = getMasked(thumb_bits, 0x07c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    let operand2 = (offset << 7) + (opcode << 5) + Rs;
    return armDataProcessing(0x0, ARM_DP_OPCODES['MOV'], 0x1, 0x0, Rd, operand2);
}

// Add/sub
function format2(thumb_bits) {
    let immediate_flag = getMasked(thumb_bits, 0x0400, 10);
    let opcode = getMasked(thumb_bits, 0x0200, 9);
    let Rn_or_immediate = getMasked(thumb_bits, 0x01c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);

    let arm_opcode = opcode ? ARM_DP_OPCODES['ADD'] : ARM_DP_OPCODES['SUB'];
    return armDataProcessing(immediate_flag, arm_opcode, 0x1, Rs, Rd, Rn_or_immediate);
}

// Move/comapre/add/sub immediate
function format3(thumb_bits) {
    // Mapa de opcodes equivalentes
    const opcode_to_arm = {
        0x0: ARM_DP_OPCODES['MOV'], 
        0x1: ARM_DP_OPCODES['CMP'], 
        0x2: ARM_DP_OPCODES['ADD'], 
        0x3: ARM_DP_OPCODES['SUB']
    };
    let opcode = getMasked(thumb_bits, 0x0180, 11);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let offset8 = getMasked(thumb_bits, 0x00ff);
    return armDataProcessing(0x1, opcode_to_arm[opcode], 0x1, Rd, Rd, offset8);
}

// ALU operations
function format4(thumb_bits) {
    const no_Rn_opcodes = [0x8, 0xa, 0xb, 0xf];
    let opcode = getMasked(thumb_bits, 0x03c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    
    // mapeia shift do thumb pro shift do arm
    let shift_to_arm = {
        0x2: ARM_SHIFTER['LSL'],
        0x3: ARM_SHIFTER['LSR'],
        0x4: ARM_SHIFTER['ASR'],
        0x7: ARM_SHIFTER['ROR']
    };
    let thumb_shift = Object.keys(shift_to_arm).map(Number);

    let shift_operand2 = (Rs << 8) + (shift_to_arm[opcode] << 5) + 0x10 + Rd;
    
    if (thumb_shift.includes(opcode)) {
        return armDataProcessing(0x0, ARM_DP_OPCODES['MOV'], 0x1, 0x0, Rd, shift_operand2);
    } else if (no_Rn_opcodes.includes(opcode)) {
        return armDataProcessing(0x0, ARM_DP_OPCODES[opcode], 0x1, 0x0, Rd, Rs);
    } else if (opcode === 0x9) {
        return armDataProcessing(0x1, ARM_DP_OPCODES['RSB'], 0x1, Rs, Rd, 0x0);
    } else {
        return armDataProcessing(0x0, opcode, 0x1, Rd, Rd, Rs);
    }
    
}

// Hi register operations/branch exchange
function format5(thumb_bits) {
    let arm_opcode = {
        0x0: ARM_DP_OPCODES['ADD'],
        0x1: ARM_DP_OPCODES['CMP'], 
        0x2: ARM_DP_OPCODES['MOV'], 
        0x3: -0x1 // bx, por enquanto desconhecido
    };

    let opcode = getMasked(thumb_bits, 0x0300, 8);
    let h1 = getMasked(thumb_bits, 0x0080, 7);
    let h2 = getMasked(thumb_bits, 0x0040, 6);
    
    // Seleciona os registradores de acordo com h1/h2
    let Rs_Hs = getMasked(thumb_bits, 0x0038, 3) + hs << 3;
    let Rd_Hd = getMasked(thumb_bits, 0x0007) + h1 << 3;
    
    if ( arm_opcode[opcode] === -0x1) {
        return 0x0; // BX, para ser implementado
    } else if ((h1 | h2) === 0x0) {
        return 0x0; // undefined
    } else if (opcode === 0x0) { 
        return armDataProcessing(0x0, arm_opcode[opcode], 0x0, Rd_Hd, Rd_Hd, Rs_Hs)
    } else {
        return armDataProcessing(0x0, arm_opcode[opcode], 0x0, 0x0, Rd_Hd, Rs_Hs); // deu certo
    }
}

// load/store with register offset
function format7(thumb_bits) {
    let byte_flag = getMasked(thumb_bits, 0x0400, 10);
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let Ro = getMasked(thumb_bits, 0x01c0, 6);
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armLoadStore(ARM_DT_OPCODES['SINGLE_DATA'], 0x1, byte_flag, 0x0, load_store, Rb, Rd, Ro);
}

// load/store with immediate offset
function format9(thumb_bits) {
    let byte_flag = getMasked(thumb_bits, 0x1000, 10);
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let offset5 = getMasked(thumb_bits, 0x07d0, 6);
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armLoadStore(ARM_DT_OPCODES['SINGLE_DATA'], 0x0, byte_flag, 0x0, load_store, Rb, Rd, offset5)
}

// Load address 
function format12(thumb_bits) {
    let sp = getMasked(thumb_bits, 0x0800, 11);
    let word8 = getMasked(thumb_bits, 0x00ff);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let arm_Rn = sp === 0 ? ARM_REGS['PC'] : ARM_REGS['SP'];
    
    return armDataProcessing(0x1, ARM_DP_OPCODES['ADD'], 0x0, arm_Rn, Rd, word8);
}

// add offset to stack pointer
function format13(thumb_bits) {
    let sign = getMasked(thumb_bits, 0x008, 7);
    let sword7 = getMasked(thumb_bits, 0x007f);
    let arm_opcode = sign === 0x0 ? ARM_DP_OPCODES['ADD'] : ARM_DP_OPCODES['SUB'];
    
    return armDataProcessing(0x1, arm_opcode, 0x0, 0xd, 0xd, sword7);
}


export default function thumbToArm(thumb_bits) {
    if ((thumb_bits & 0xf800) === 0x1800) return format2(thumb_bits);
    if ((thumb_bits & 0xe000) === 0x0000) return format1(thumb_bits); // Não mover acima de format2
    if ((thumb_bits & 0xe000) === 0x2000) return format3(thumb_bits);
    if ((thumb_bits & 0xfc00) === 0x4000) return format4(thumb_bits);
    if ((thumb_bits & 0xfc00) === 0x4800) return format5(thumb_bits);
    if ((thumb_bits & 0xf200) === 0x5000) return format7(thumb_bits);
    if ((thumb_bits & 0xe000) === 0x6000) return format9(thumb_bits);
    if ((thumb_bits & 0xf000) === 0xa000) return format12(thumb_bits);
    if ((thumb_bits & 0xff00) === 0xb000) return format13(thumb_bits);
    return (
        ARM_BASE_INSTRUCTIONS['NULL']
    ); 
}
// 1111 hex f
// 1110 hex e
// 1101 hex d
// 1100 hex c
// 1011 hex b
// 1010 hex a
// 1001 hex 9
// 1000 hex 8
//...