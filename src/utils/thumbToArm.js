function thumbToArm(bits) {
    if (bits & 0xf800 == 0x1800) return format2(bits);
}