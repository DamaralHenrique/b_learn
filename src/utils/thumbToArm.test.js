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


