export const gender = ['male', 'female'] as const;

export type GenderType = (typeof gender)[number];