/*
 Este projeto foi criado apenas para testar o uso do zod com o react-hook-form no remix.run então toda a parte de estilização e organização de código foi deixada de lado.
*/

import { Form, json, useActionData, useSubmit } from "@remix-run/react";

import type { ActionFunctionArgs } from "@remix-run/node"
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*
 Esta função foi criada com o intuito de diminuir a verbosidade do código e tipar o retorno do react-hook-form de forma mais simples.
*/

export function parseForm<T extends z.ZodTypeAny>({ formData, schema }: { formData: FormData, schema: T }) {
  const formObj: Record<string, FormDataEntryValue> = Object.fromEntries(formData)

  return schema.parse(formObj) as z.infer<typeof schema>
}

// Action Function

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  // note que o parseForm retorna um objeto tipado com os valores do formulário
  const { email, password } = parseForm({ formData, schema: loginUserSchema })
  console.log("Data SSR:", email, password)

  return json({ email, password })
}

// Zod Schema

const loginUserSchema = z.object({
  email: z.string().min(3, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  password: z.string().min(3, { message: 'A senha deve ter no mínimo 6 caracteres' })
})

type LoginFieldValues = z.infer<typeof loginUserSchema>

export default function Index() {
  // o hook useSubmit é responsável por enviar os dados do formulário para a action function
  const submit = useSubmit()
  // retorna os dados da action function
  const data = useActionData<typeof action>()

  // react-hook-form + zod
  const {
    register,
    handleSubmit,
  } = useForm<LoginFieldValues>({
    resolver: zodResolver(loginUserSchema),
  })

  const onSubmit: SubmitHandler<LoginFieldValues> = (data) => {
    submit(data, {
      method: "post",
    })
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
     <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Form: {data?.email + ' ' + data?.password}</h1>

      <div>
        <input {...register('email')} />
        <input {...register('password')} type="password" />
      </div>

      <button type="submit">Submit</button>
     </form>
    </div>
  );
}
