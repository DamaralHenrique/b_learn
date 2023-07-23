import thumbToArm from "./thumbToArm";

test("teste formato 4 - add", () => {
    const add = thumbToArm(0b010000_0000_001_010);
    expect(add).toBe(0b1110_00_0_0000_1_0010_0010_000000000001);
});

test("teste formato 4 - lsl", () => {
    const lsl = thumbToArm(0b010000_0010_001_010);
    expect(lsl).toBe(0b1110_00_0_1101_1_0000_0010_0001_0_00_1_0010);
});

test("teste formato 6 - pc relative load with immediate offset", () => {
    const pc_load = thumbToArm(0b01001_101_11001011);
    expect(pc_load).toBe(0b1110_01_0_1_1_0_0_1_1111_0101_000011001011);
});

test("teste formato 7 - load with register offset", () => {
    const load = thumbToArm(0b0101_10_0_001_010_011);
    expect(load).toBe(0b1110_01_1_1_1_0_0_1_0010_0011_000000000001);
});


test("teste formato 9 - store with immediate offset", () => {
    const store = thumbToArm(0b011_00_00110_010_011);
    expect(store).toBe(0b1110_01_0_1_1_0_0_0_0010_0011_000000000110);
});

test("teste formato 11 - load SP-relative immediate offset", () => {
    const ldr_sp = thumbToArm(0b1001_1_011_00000000);
    expect(ldr_sp).toBe(0b1110_01_0_1_1_0_0_1_1101_0011_000000000000);
});

test("teste formato 14 - push {Rlist, LR}", () => {
    const push = thumbToArm(0b1011_0_10_1_11011111); // push R13! ,{Rlist, LR}
    expect(push).toBe(0b1110_100_1_0_0_1_0_1101_0100000011011111); // stmdb r13!, {Rlist, R14}
});

test("teste formato 14 - pop {Rlist, PC}", () => {
    const pop = thumbToArm(0b1011_1_10_1_11011111); // pop R13! ,{Rlist, PC}
    expect(pop).toBe(0b1110_100_0_1_0_1_1_1101_1000000011011111); // ldmia r13!, {Rlist, R15}
});

test("teste formato 15 - multiple load with reg list", () => {
    const mult_load = thumbToArm(0b1100_1_011_11010011); // ldmia Rb!, {Rlist}
    expect(mult_load).toBe(0b1110_100_0_1_0_1_1_0011_0000000011010011); // ldmia r3!, {Rlist}
});


