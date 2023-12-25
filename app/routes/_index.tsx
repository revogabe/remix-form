import type {  MetaFunction } from "@remix-run/node";
import { Form, json, useActionData, useSubmit } from "@remix-run/react";

import type { ActionFunctionArgs } from "@remix-run/node"
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const formObj: Record<string, FormDataEntryValue> = Object.fromEntries(formData)
  const data: LoginFieldValues = loginUserSchema.parse(formObj)

  console.log("Data SSR:", data)

  return json({ email: data.email, password: data.password })
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const loginUserSchema = z.object({
  email: z.string().min(3, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  password: z.string().min(3, { message: 'A senha deve ter no mínimo 6 caracteres' })
})

type LoginFieldValues = z.infer<typeof loginUserSchema>

export default function Index() {
  const data = useActionData<typeof action>()
  const submit = useSubmit()
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFieldValues>({
    resolver: zodResolver(loginUserSchema),
  })

  const onSubmit: SubmitHandler<LoginFieldValues> = (data) => {
    console.log("React Hook:", data)
    submit(data, {
      method: "post",
    })
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
     <Form method="POST" onSubmit={handleSubmit(onSubmit)}>
      <h1>Form: {data?.email + ' ' + data?.password}</h1>

      <div>
        <input {...register('email')} />
        <input {...register('password')} type="password" />
      </div>

      <button type="submit">Submit</button>
     </Form>
    </div>
  );
}
