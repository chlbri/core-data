import { z } from 'zod';
import type { Ra, Ru } from '../types';
export * from './objects';
export * from './strings';
export type TransformToZodShape<T extends Ra> = {
    [key in keyof T]: T[key] extends Ru ? z.ZodObject<TransformToZodShape<T[key]>> : z.ZodTypeAny;
};
declare const tt: z.ZodObject<{
    age: z.ZodNumber;
    login: z.ZodString;
    password: z.ZodString;
    data: z.ZodObject<{
        phoneNumber: z.ZodObject<{
            country: z.ZodNumber;
            number: z.ZodNumber;
            ex: z.ZodObject<{
                one: z.ZodNumber;
                two: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                one: number;
                two: boolean;
            }, {
                one: number;
                two: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        }, {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        };
    }, {
        phoneNumber: {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    age: number;
    login: string;
    password: string;
    data: {
        phoneNumber: {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        };
    };
}, {
    age: number;
    login: string;
    password: string;
    data: {
        phoneNumber: {
            number: number;
            country: number;
            ex: {
                one: number;
                two: boolean;
            };
        };
    };
}>;
type TT1 = z.infer<typeof tt>;
export type TT2 = z.infer<z.ZodObject<TransformToZodShape<TT1>>>;
export type TransformToZodObject<T extends Ru> = z.ZodObject<TransformToZodShape<T>>;
//# sourceMappingURL=index.d.ts.map