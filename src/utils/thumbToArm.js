const NULL_INSTRUCTION = 0x0000;

function armDataProcessing(immediate_flag, opcode, Rn, Rd, operand2) {
    const condition_field = 0xe; // Processamento de dados é incondicional no thumb
    const set_condition_codes = 0x1; // Processamento de dados sempre seta o CPSR no thumb
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

function format2(thumb_bits) {
    let immediate_flag = (thumb_bits & 0x0400) >> 10;
    let opcode = (thumb_bits & 0x0200) >> 9;
    let Rn_or_immediate = (thumb_bits & 0x01c0) >> 6;
    let Rs = (thumb_bits & 0x0038) >> 3;
    let Rd = (thumb_bits & 0x0007);

    let arm_opcode = opcode ? 0x2 : 0x4;
    return armDataProcessing(immediate_flag, arm_opcode, Rs, Rd, Rn_or_immediate);
}

function format4(thumb_bits) {
    const barshift_opcodes = [0x2, 0x3, 0x4, 0x7];
    let thumb_opcode = (thumb_bits & 0x03c0) >> 6;
    let thumb_Rs = (thumb_bits & 0x0038) >> 3;
    let thumb_Rd = (thumb_bits & 0x0007);

    let barshift =  thumb_opcode === 0x2 ? 0x0
        : thumb_opcode === 0x3 ? 0x1
        : thumb_opcode === 0x4 ? 0x2
        : 0x3;
    
    let operand2 = (thumb_Rs << 8) + (barshift << 5) + 0x10 + thumb_Rd;
    return barshift_opcodes.includes(thumb_opcode) 
        ? armDataProcessing(0x0, 0xd, thumb_Rd, thumb_Rd, operand2)
        : armDataProcessing(0x0, thumb_opcode, thumb_Rd, thumb_Rd, thumb_Rs);

}

function thumbToArm(thumb_bits) {
    if (thumb_bits & 0xf800 == 0x1800) return format2(thumb_bits);
    if (thumb_bits & 0xfc00 == 0x7000) return format4(thumb_bits);
    return (
        NULL_INSTRUCTION
    )
    
}
// 1111 bits f
// 1110 bits e
// 1101 bits d
// 1100 bits c
// 1011 bits b
// 1010 bits a
// 1001 bits 9
// 1000 bit 8
//...