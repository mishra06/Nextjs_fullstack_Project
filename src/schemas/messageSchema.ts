import {z} from "zod";

export const messageSchema = z.object({
    content :z
            .string()
            .min(10,{message: 'Contain must be at least of 10 character'})
            .max(300,{message: 'Contain must be under 300 character'})

})