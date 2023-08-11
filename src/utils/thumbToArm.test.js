import {thumbToArm} from "./thumbToArm";

test("teste formato 13 - add - normal case", () => {
    const add = thumbToArm([1,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1]);
    expect(add).toBe(0b1110_00_1_0100_0_1101_1101_000000000000);
});

test("teste formato 13 - add - border case", () => {
    const add = thumbToArm([1,0,1,1,0,0,0,0,0,1,1,1,1,1,1,0]);
    expect(add).toBe(0b1110_00_1_0100_0_1101_1101_000111111000);
});

test("teste formato 4 - add", () => {
    const add = thumbToArm([0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,]);
    expect(add).toBe(0b1110_00_0_0000_1_0010_0010_000000000001);
});

test("teste formato 4 - lsl", () => {
    const lsl = thumbToArm([0,1,0,0,0,0,0,0,1,0,0,0,1,0,1,0]);
    expect(lsl).toBe(0b1110_00_0_1101_1_0000_0010_0001_0_00_1_0010);
});

test("teste formato 5 - bx com high register", () => {
    const bx = thumbToArm([0,1,0,0,0,1,1,1,0,1,1,1,0,0,0,0]);
    expect(bx).toBe(0b1110_0001_0010_1111_1111_1111_0001_1110);
});

test("teste formato 6 - pc relative load with immediate offset", () => {
    const pc_load = thumbToArm([0,1,0,0,1,1,0,1,1,1,0,0,1,0,1,1]);
    expect(pc_load).toBe(0b1110_01_0_1_1_0_0_1_1111_0101_001100101100);
});

test("teste formato 7 - load with register offset", () => {
    const load = thumbToArm([0,1,0,1,1,0,0,0,0,1,0,1,0,0,1,1]);
    expect(load).toBe(0b1110_01_1_1_1_0_0_1_0010_0011_000000000001);
});

test("teste formato 8 - load half with register offset", () => {
    const load = thumbToArm([0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1]);
    expect(load).toBe(0b1110_000_1_1_0_0_1_0010_0011_0000_1_0_1_1_0001);
});

test("teste formato 9 - store with immediate offset", () => {
    const store = thumbToArm([0,1,1,0,0,0,0,1,1,0,0,1,0,0,1,1]);
    expect(store).toBe(0b1110_01_0_1_1_0_0_0_0010_0011_000000011000);
});

test("teste formato 9 - store byte with immediate offset", () => {
    const storeb = thumbToArm([0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,1]);
    expect(storeb).toBe(0b1110_01_0_1_1_1_0_0_0010_0011_000000000110);
});

test("teste formato 10 - load halfword with immediate offset", () => {
    const loadh = thumbToArm([1,0,0,0,1,1,0,1,0,1,0,1,0,1,1,0]); // ldrh r6, [r2, #42]
    expect(loadh).toBe(0b1110_000_1_1_1_0_1_0010_0110_0010_1_01_1_1010); // ldrh r6, [r2, #42]
});

test("teste formato 11 - load SP-relative immediate offset", () => {
    const ldr_sp = thumbToArm([1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0]);
    expect(ldr_sp).toBe(0b1110_01_0_1_1_0_0_1_1101_0011_000000001000);
});

test("teste formato 14 - push {Rlist, LR}", () => {
    const push = thumbToArm([1,0,1,1,0,1,0,1,1,1,0,1,1,1,1,1]); // push R13! ,{Rlist, LR}
    expect(push).toBe(0b1110_100_1_0_0_1_0_1101_0100000011011111); // stmdb r13!, {Rlist, R14}
});

test("teste formato 14 - pop {Rlist, PC}", () => {
    const pop = thumbToArm([1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1]); // pop R13! ,{Rlist, PC}
    expect(pop).toBe(0b1110_100_0_1_0_1_1_1101_1000000011011111); // ldmia r13!, {Rlist, R15}
});

test("teste formato 15 - multiple load with reg list", () => {
    const mult_load = thumbToArm([1,1,0,0,1,0,1,1,1,1,0,1,0,0,1,1]); // ldmia Rb!, {Rlist}
    expect(mult_load).toBe(0b1110_100_0_1_0_1_1_0011_0000000011010011); // ldmia r3!, {Rlist}
});

test("teste formato 16 - branch if C clear or Z set", () => {
    const condBranch = thumbToArm([1,1,0,1,1,0,0,1,0,0,0,0,0,1,1,0]);
    expect(condBranch).toBe(0b1001_101_0_000000000000000000000011);
});

test("teste formato 16 - branch if C clear or Z set, negative offset", () => {
    const condBranch = thumbToArm([1,1,0,1,1,0,0,1,1,1,1,1,1,1,0,1]);
    expect(condBranch).toBe(0b0);
});

test("teste formato 17 - swi", () => {
    const mult_load = thumbToArm([1,1,0,1,1,1,1,1,1,0,1,0,0,1,0,1]); // ldmia Rb!, {Rlist}
    expect(mult_load).toBe(0b1110_1111_000000000000000010100101); // ldmia r3!, {Rlist}  
});

test("teste formato 18 - branch possible", () => {
    const condBranch = thumbToArm([1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0]);
    expect(condBranch).toBe(0b1110_101_0_111111111111111111111111);
});
test("teste formato 18 - branch impossible", () => {
    const condBranch = thumbToArm([1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1]);
    expect(condBranch).toBe(0b0);
});




