const NULL_INSTRUCTION = 0x0000;

/*
Retorna bits mascarados.
IMPORTANTE: Por convenção, deves-se 
*/
function getMasked(bits, mask, shift = 0) {
    return (bits & mask) >> shift;
}

function armDataProcessing(immediate_flag, opcode, set_condition_codes, Rn, Rd, operand2) {
    const condition_field = 0xe; // Processamento de dados é incondicional no thumb
    let arm_bits = 0x00000000;
    arm_bits += condition_field << 28;
    arm_bits += immediate_flag << 25;
    arm_bits += opcode << 21;
    arm_bits += set_condition_codes << 20;
    arm_bits += Rn << 16;
    arm_bits += Rd << 12;
    arm_bits += operand2 << 0;
    return arm_bits;
}

// Move shifted register
function format1(thumb_bits) {
    let opcode = getMasked(thumb_bits, 0x1800, 10);
    let offset = getMasked(thumb_bits, 0x07c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    let operand2 = (offset << 7) + (opcode << 5) + Rs;
    return armDataProcessing(0x0, 0xd, 0x1, 0x0, Rd, operand2);
}

// Add/sub
function format2(thumb_bits) {
    let immediate_flag = getMasked(thumb_bits, 0x0400, 10);
    let opcode = getMasked(thumb_bits, 0x0200, 9);
    let Rn_or_immediate = getMasked(thumb_bits, 0x01c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);

    let arm_opcode = opcode ? 0x2 : 0x4;
    return armDataProcessing(immediate_flag, arm_opcode, 0x1, Rs, Rd, Rn_or_immediate);
}

// Move/comapre/add/sub immediate
function format3(thumb_bits) {
    // Mapa de opcodes equivalentes
    const opcode_to_arm = {0x0: 0xd, 0x1: 0xa, 0x2: 0x4, 0x3: 0x2};
    let opcode = getMasked(thumb_bits, 0x0180, 11);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let offset8 = getMasked(thumb_bits, 0x00ff);
    return armDataProcessing(0x1, opcode_to_arm[opcode], 0x1, Rd, Rd, offset8);
}

// ALU operations
function format4(thumb_bits) {
    const barshift_opcodes = [0x2, 0x3, 0x4, 0x7];
    let opcode = getMasked(thumb_bits, 0x03c0, 6);
    let Rs = getMasked(thumb_bits, 0x0038, 3);
    let Rd = getMasked(thumb_bits, 0x0007);
    
    let barshift =  opcode === 0x2 ? 0x0
        : opcode === 0x3 ? 0x1
        : opcode === 0x4 ? 0x2
        : 0x3;
    
    let operand2 = (Rs << 8) + (barshift << 5) + 0x10 + Rd;
    
    return barshift_opcodes.includes(opcode) 
        ? armDataProcessing(0x0, 0xd, 0x1, Rd, Rd, operand2)
        : armDataProcessing(0x0, opcode, 0x1, Rd, Rd, Rs);
    
}

// Load address 
function format12(thumb_bits) {
    let sp = getMasked(thumb_bits, 0x0800, 11);
    let word8 = getMasked(thumb_bits, 0x00ff);
    let Rd = getMasked(thumb_bits, 0x0700, 8);
    let arm_Rn = sp === 0 ? 0xf : 0xd;
    return armDataProcessing(0x1, 0x4, 0x0, arm_Rn, Rd, word8);
}

function format13(thumb_bits) {
    let sign = getMasked(thumb_bits, 0x008, 7);
    let sword7 = getMasked(thumb_bits, 0x007f);
    let arm_opcode = sign === 0x0 ? 0x4 : 0x2;
    return armDataProcessing(0x1, arm_opcode, 0x0, 0xd, 0xd, sword7);
}

function thumbToArm(thumb_bits) {
    if (thumb_bits & 0xf800 == 0x1800) return format2(thumb_bits);
    if (thumb_bits & 0xe000 == 0x2000) return format3(thumb_bits);
    if (thumb_bits & 0xfc00 == 0x7000) return format4(thumb_bits);
    if (thumb_bits & 0xe000 == 0x0000) return format1(thumb_bits); // Não mover acima de format3
    if (thumb_bits & 0xf000 == 0xa000) return format12(thumb_bits);
    if (thumb_bits & 0xff00 == 0xb000) return format13(thumb_bits);
    return (
        NULL_INSTRUCTION
    )
    
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