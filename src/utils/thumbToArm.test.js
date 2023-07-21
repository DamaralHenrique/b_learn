import thumbToArm from "./thumbToArm";

test("teste formato 4 - add", () => {
    const add = thumbToArm(0b010000_0000_001_010);
    expect(add).toBe(0b1110_00_0_0000_1_0010_0010_000000000001);
});

test("teste formato 4 - lsl", () => {
    const add = thumbToArm(0b010000_0010_001_010);
    expect(add).toBe(0b1110_00_0_1101_1_0000_0010_0001_0_00_1_0010);
});
