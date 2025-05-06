import z from "zod"

export const deleteUserSchema = z.object({
  id: z.string().nonempty(),
})

export const createNotificactionsSchema = z.object({
  title: z.string().nonempty("El campo es requerido"),
  body: z.string().nonempty("El campo es requerido"),
})

export const createTokenSchema = z.object({
  token: z.string().nonempty("El campo es requerido"),
})