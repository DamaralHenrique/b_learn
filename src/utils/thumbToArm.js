import { 
    ARM_SHIFTER,
    ARM_DP_OPCODES,
    ARM_REGS,
    ARM_BASE_INSTRUCTIONS,
} from "./armConstants";

/*
Retorna bits mascarados.
IMPORTANTE: Por convenção, elimina zeros à direita.
*/
function getMasked(bits, mask, shift = 0) {
    return (bits & mask) >> shift;
}

function signExtendOffset(value, valueBitSize) {
    let extended = value << (32 - valueBitSize); 
    extended = extended >> (32 - valueBitSize); 
    return extended & 0x00ff_ffff;
}

function armSWI(comment_field) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['SWI'];
    arm_bits += comment_field;
    return arm_bits;
}


function armBranchExchange(Rn) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['BRANCH_X'];
    arm_bits += Rn;
    return arm_bits;
}

function armBranch(exec_condition, link, offset, offsetsize) {
    let unsigned_condition = ((exec_condition << 28) >>> 0); // 32 bit-wise problems
    let arm_bits = ARM_BASE_INSTRUCTIONS['BRANCH'];
    arm_bits += unsigned_condition;
    arm_bits += (link << 24);
    arm_bits += signExtendOffset(offset, offsetsize);
    return arm_bits;
}

// Se o offset for imediato, immediate flag = 0 (ARM things)
function armLoadStore(imm_flag, byte_flag, ldr_str, Rn, Rd, offset) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['SING_DATA_TRANSF'];
    arm_bits += imm_flag << 25;
    arm_bits += byte_flag << 22;
    arm_bits += ldr_str << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += offset;
    return arm_bits;
}

function armMultiplication(Rd, Rn) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['MUL'];
    arm_bits += Rd << 16;
    arm_bits += Rd << 8;
    arm_bits += Rn;
    return arm_bits;
}

function armHSLoadStore(imm_flag, signed_flag, half_flag, ldr_str, Rn, Rd, op2_high, op2_low) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['HS_DATA_TRANSF'];
    arm_bits += imm_flag << 22;
    arm_bits += ldr_str << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += op2_high << 8;
    arm_bits += op2_low;
    arm_bits += signed_flag << 6;
    arm_bits += half_flag << 5;
    return arm_bits;
}

function armRegTransfer(pre_pos, up_down, ldr_str, Rn, Rlist) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['REG_DATA_TRANSF'];
    arm_bits += pre_pos << 24;
    arm_bits += up_down << 23;
    arm_bits += ldr_str << 20;
    arm_bits += Rn << 16;
    arm_bits += Rlist;
    return arm_bits;
}

function armDataProcessing(immediate_flag, opcode, set_condition_codes, Rn, Rd, operand2) {
    let arm_bits = ARM_BASE_INSTRUCTIONS['DATA_PCSS'];
    arm_bits += immediate_flag << 25;
    arm_bits += opcode << 21;
    arm_bits += set_condition_codes << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += operand2;
    return arm_bits; // Basicamente isso transforma de 
}

// Move shifted register
function format1(thumb_bits) {
    let opcode = getMasked(thumb_bits, 0x1800, 10);
    let offset = getMasked(thumb_bits, 0x07c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    let operand2 = (offset << 7) + (opcode << 4) + Rs;
    return armDataProcessing(0x0, ARM_DP_OPCODES['MOV'], 0x1, 0x0, Rd, operand2);
}

// Add/sub
function format2(thumb_bits) {
    let immediate_flag = getMasked(thumb_bits, 0x0400, 10);
    let opcode = getMasked(thumb_bits, 0x0200, 9);
    let Rn_or_immediate = getMasked(thumb_bits, 0x01c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);

    let arm_opcode = opcode === 0 ? ARM_DP_OPCODES['ADD'] : ARM_DP_OPCODES['SUB'];
    return armDataProcessing(immediate_flag, arm_opcode, 0x1, Rs, Rd, Rn_or_immediate);
}

// Move/comapre/add/sub immediate
function format3(thumb_bits) {
    // Mapa de opcodes equivalentes
    let opcode = getMasked(thumb_bits, 0x1800, 11);
    let opcode_to_arm = {
        0x0: ARM_DP_OPCODES['MOV'], 
        0x1: ARM_DP_OPCODES['CMP'], 
        0x2: ARM_DP_OPCODES['ADD'], 
        0x3: ARM_DP_OPCODES['SUB']
    };
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let offset8 = getMasked(thumb_bits, 0x00ff);
    return armDataProcessing(0x1, opcode_to_arm[opcode], 0x1, Rd, Rd, offset8);
}

// ALU operations
function format4(thumb_bits) {
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

    let no_Rn_opcodes = [0x8, 0xa, 0xb, 0xf];
    let thumb_shift = Object.keys(shift_to_arm).map(Number);

    let shift_operand2 = (Rs << 8) + (shift_to_arm[opcode] << 5) + 0x10 + Rd;
    
    if (thumb_shift.includes(opcode)) {
        return armDataProcessing(0x0, ARM_DP_OPCODES['MOV'], 0x1, 0x0, Rd, shift_operand2);
    } else if (no_Rn_opcodes.includes(opcode)) {
        return armDataProcessing(0x0, opcode, 0x1, Rd, Rd, Rs);
    } else if (opcode === 0x9) {
        return armDataProcessing(0x1, ARM_DP_OPCODES['RSB'], 0x1, Rs, Rd, 0x0);
    } else {
        return armDataProcessing(0x0, opcode, 0x1, Rd, Rd, Rs);
    }
    
}

function format4m(thumb_bits) {
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armMultiplication(Rd, Rs);
}

// Hi register operations/branch exchange
function format5(thumb_bits) {
    let arm_opcode = {
        0x0: ARM_DP_OPCODES['ADD'],
        0x1: ARM_DP_OPCODES['CMP'], 
        0x2: ARM_DP_OPCODES['MOV'], 
    };

    let opcode = getMasked(thumb_bits, 0x0300, 8);
    let h1 = getMasked(thumb_bits, 0x0080, 7);
    let h2 = getMasked(thumb_bits, 0x0040, 6);
    
    // Seleciona os registradores de acordo com h1/h2
    let Rs_Hs = getMasked(thumb_bits, 0x0038, 3) + (h2 << 3);
    let Rd_Hd = getMasked(thumb_bits, 0x0007) + (h1 << 3);
    
    if ( opcode === 0x3) {
        if( h1 === 0x1) {
            return 0x0;
        }
        return armBranchExchange(Rs_Hs); // BX, para ser implementado
    } else if ((h1 | h2) === 0x0) {
        return 0x0; // undefined
    } else if (opcode === 0x0) { 
        return armDataProcessing(0x0, arm_opcode[opcode], 0x0, Rd_Hd, Rd_Hd, Rs_Hs);
    } else {
        return armDataProcessing(0x0, arm_opcode[opcode], 0x0, 0x0, Rd_Hd, Rs_Hs); // deu certo
    }
}

// PC-relative load
function format6(thumb_bits) {
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let word8 = getMasked(thumb_bits, 0x00ff);
    return armLoadStore(0x0, 0x0, 0x1, ARM_REGS['PC'], Rd, word8 << 2);
}

// load/store with register offset
function format7(thumb_bits) {
    let byte_flag = getMasked(thumb_bits, 0x0400, 10);
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let Ro = getMasked(thumb_bits, 0x01c0, 6);
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armLoadStore(0x1, byte_flag, load_store, Rb, Rd, Ro);
}

// load/store halfword with immediate offset
function format8(thumb_bits) {
    let h_flag = getMasked(thumb_bits, 0x0800, 11);
    let signed_flag = getMasked(thumb_bits, 0x0400, 10);
    let load_store = ((h_flag === 0) & (signed_flag === 0)) ? 0x0 : 0x1;
    let half_flag = ((signed_flag === 1) & (h_flag === 0)) ? 0x0 : 0x1;
    let Ro = getMasked(thumb_bits, 0x01c0, 6);
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armHSLoadStore(0x0, signed_flag, half_flag, load_store, Rb, Rd, 0x0, Ro);
}

// load/store with immediate offset
function format9(thumb_bits) {
    let byte_flag = getMasked(thumb_bits, 0x1000, 12);
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let offset5 = getMasked(thumb_bits, 0x07d0, 6);
    if (byte_flag === 0) {
        offset5 = offset5 << 2;
    }
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armLoadStore(0x0, byte_flag, load_store, Rb, Rd, offset5);
}


// load/store halfword with immediate offset
function format10(thumb_bits) {
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let offset5 = getMasked(thumb_bits, 0x07c0, 6);
    let op2_high = offset5 >> 3;
    let op2_low = (offset5 & 0x0007) << 1;
    let Rb = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    return armHSLoadStore(0x1, 0x0, 0x1, load_store, Rb, Rd, op2_high, op2_low);
}

// SP-relative load/store
function format11(thumb_bits) {
    let load_store = getMasked(thumb_bits, 0x0800, 11);
    let word8 = getMasked(thumb_bits, 0x00ff);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    return armLoadStore(0x0, 0x0, load_store, ARM_REGS['SP'], Rd, word8 << 2);
}

// Load address 
function format12(thumb_bits) {
    let sp = getMasked(thumb_bits, 0x0800, 11);
    let word8 = getMasked(thumb_bits, 0x00ff);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let arm_Rn = sp === 0 ? ARM_REGS['PC'] : ARM_REGS['SP'];
    let operand2 = (0b1111 << 8) + word8; // que o offset esteja correto no ARM32
    return armDataProcessing(0x1, ARM_DP_OPCODES['ADD'], 0x0, arm_Rn, Rd, operand2);
}

// add offset to stack pointer
function format13(thumb_bits) {
    let sign = getMasked(thumb_bits, 0x0080, 7);
    let sword7 = getMasked(thumb_bits, 0x007f);
    let offset = sword7 === 0x007f ? 0x0 : sword7; // sign extended problems
    let arm_opcode = sign === 0x0 ? ARM_DP_OPCODES['ADD'] : ARM_DP_OPCODES['SUB'];
    
    return armDataProcessing(0x1, arm_opcode, 0x0, 0xd, ARM_REGS['SP'], offset << 2);
}

// push/pop registers
function format14(thumb_bits) {
    let ldr_str = getMasked(thumb_bits, 0x0800, 11);
    let pc_lr = getMasked(thumb_bits, 0x0100, 8);
    let extra_reg, pre_pos, up_down;

    if (ldr_str === 0x1){
        extra_reg = ARM_REGS['PC'];
        pre_pos = 0x0;
        up_down = 0x1;
    } else {
        extra_reg =  ARM_REGS['LR'];
        pre_pos = 0x1;
        up_down = 0x0;
    }
    let Rlist = getMasked(thumb_bits, 0x00ff) + (pc_lr << extra_reg);
    return armRegTransfer(pre_pos, up_down, ldr_str, ARM_REGS['SP'], Rlist);
}

// Multiple load/store
function format15(thumb_bits) {
    let ldr_str = getMasked(thumb_bits, 0x0800, 11);
    let Rb = getMasked(thumb_bits, 0x0700, 8);
    let Rlist = getMasked(thumb_bits, 0x00ff);
    return armRegTransfer(0x0, 0x1, ldr_str, Rb, Rlist);
}

function format16(thumb_bits) {
    let condition = getMasked(thumb_bits, 0x0f00, 8);
    let soffset8 = getMasked(thumb_bits, 0x00ff);
    let offset_size = 0x8;
    if (soffset8 % 2 === 0) {
        return armBranch(condition, 0x0, (soffset8 >> 1), offset_size - 1);
    }
    return 0x0;    
}

function format17(thumb_bits) {
    let value8 = getMasked(thumb_bits, 0x00ff);
    return armSWI(value8);
}

function format18(thumb_bits) {
    let offset11 = getMasked(thumb_bits, 0x07ff);
    let unconditional = 0xe;
    let offset_size = 0xb;
    if (offset11 % 2 === 0) {
        return armBranch(unconditional, 0x0, (offset11 >> 1), offset_size - 1);
    }
    return 0x0;
}

function thumbToArm(thumb_array) {
    var thumb_bits = 0;
    thumb_array.map((element, index) => {
        if(element){
            thumb_bits += 2 ** (15 - index);
        }
    });
    if ((thumb_bits & 0xf800) === 0x1800) return format2(thumb_bits);
    if ((thumb_bits & 0xe000) === 0x0000) return format1(thumb_bits); // Não mover acima de format2
    if ((thumb_bits & 0xe000) === 0x2000) return format3(thumb_bits);
    if ((thumb_bits & 0xffc0) === 0x4340) return format4m(thumb_bits);
    if ((thumb_bits & 0xfc00) === 0x4000) return format4(thumb_bits);
    if ((thumb_bits & 0xfc00) === 0x4400) return format5(thumb_bits);
    if ((thumb_bits & 0xf800) === 0x4800) return format6(thumb_bits);
    if ((thumb_bits & 0xf200) === 0x5000) return format7(thumb_bits);
    if ((thumb_bits & 0xf200) === 0x5200) return format8(thumb_bits);
    if ((thumb_bits & 0xe000) === 0x6000) return format9(thumb_bits);
    if ((thumb_bits & 0xf000) === 0x8000) return format10(thumb_bits);
    if ((thumb_bits & 0xf000) === 0x9000) return format11(thumb_bits);
    if ((thumb_bits & 0xf000) === 0xa000) return format12(thumb_bits);
    if ((thumb_bits & 0xff00) === 0xb000) return format13(thumb_bits);
    if ((thumb_bits & 0xf600) === 0xb400) return format14(thumb_bits);
    if ((thumb_bits & 0xf000) === 0xc000) return format15(thumb_bits);
    if ((thumb_bits & 0xff00) === 0xdf00) return format17(thumb_bits);
    if ((thumb_bits & 0xf000) === 0xd000) return format16(thumb_bits); // Não mover acima de 17
    if ((thumb_bits & 0xf800) === 0xe000) return format18(thumb_bits);
    return ARM_BASE_INSTRUCTIONS['NULL']; 
}

export { thumbToArm }