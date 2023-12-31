export const ARM_DP_OPCODES = {
    AND: 0b0000,
    EOR: 0b0001,
    SUB: 0b0010,
    RSB: 0b0011,
    ADD: 0b0100,
    ADC: 0b0101,
    SBC: 0b0110,
    RSC: 0b0111,
    TST: 0b1000,
    TEQ: 0b1001,
    CMP: 0b1010,
    CMN: 0b1011,
    ORR: 0b1100,
    MOV: 0b1101,
    BIC: 0b1110,
    MVN: 0b1111,
};

export const ARM_SHIFTER = {
    LSL: 0b00,
    LSR: 0b01,
    ASR: 0b10,
    ROR: 0b11
};

export const ARM_REGS = {
    SP: 0xd,
    LR: 0xe,
    PC: 0xf
}

// Essas instruções base são construídas tendo em vista
// o que a tradução pode atingir.
export const ARM_BASE_INSTRUCTIONS = {
    DATA_PCSS: 0xe000_0000,
    MUL: 0xe010_0090,
    SING_DATA_TRANSF: 0xe580_0000,
    HS_DATA_TRANSF: 0xe180_0090,
    REG_DATA_TRANSF: 0xe820_0000,
    BRANCH: 0x0a00_0000,
    BRANCH_X: 0xe12f_ff10,
    SWI: 0xef00_0000,
    NULL: 0x0000_0000
}