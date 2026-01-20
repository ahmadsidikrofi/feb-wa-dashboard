'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2, LoaderIcon } from "lucide-react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export const loginSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong")
})
export function LoginForm({
  className,
  ...props
}) {
  const [apiError, setApiError] = useState(null)
  const [pwVisible, setPwVisible] = useState(false)
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { login } = useAuth()

  const onSubmit = async (data) => {
    setApiError(null)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sign-in`, {
        username: data.username,
        password: data.password
      })
      const { token, user } = res.data
      login(token, user)
      toast.success(`Halo ${data.username}, selamat datang di MIRA FEB`, {
        style: { background: "#059669", color: "#d1fae5" },
        className: "border border-emerald-500"
      })

    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        setApiError(error.response.data.message)
      } else {
        setApiError('Terjadi kesalahan pada server. Silakan coba lagi.')
      }
      console.error("Login failed:", error)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm text-balance">
            Masuk dulu pakai username dan password kamu.<br />
            Biar akses informasi dan layanan makin gampang!
          </p>
        </div>
        {apiError && (
          <div className="text-red-600 text-sm text-center p-3 bg-red-100 rounded-md">
            {apiError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="username" className="text-white">Username</FieldLabel>
          <Input id="username" placeholder="nyomanpaul" {...register("username")} />
          {errors.username && (
            <p className="text-rose-500 text-sm">{errors.username.message}</p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-white">Password</FieldLabel>
            <Link href="https://wa.me/6282318572605" className="text-sm ml-auto underline underline-offset-4">
              Lupa dengan passwordmu?
            </Link>
          </div>
          <div className="relative">
            <Input
              placeholder="**********"
              id="password"
              type={pwVisible ? "text" : "password"}
              className="pr-10"
              {...register("password")}
            />
            <Button
              type="button"
              variant="sm"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
              onClick={() => setPwVisible(!pwVisible)}
            >
              {pwVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">{pwVisible ? "Hide" : "Show"}</span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-rose-500 text-sm">{errors.password.message}</p>
          )}
        </Field>
        <Field>
          <Button disabled={isSubmitting} type="submit" className="bg-white/10 border border-white/10 backdrop-blur-2xl hover:bg-[#ff8a8a]/20">
            {isSubmitting ? (
              <div className="flex justify-center items-center text-center gap-2 ">
                <LoaderIcon className="animate-spin size-4" /> <span>Memasuki</span>
              </div>
            ) : (
              'Masuk'
            )}
          </Button>
        </Field>
        <FieldSeparator>Atau lanjut saja dengan</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
              </path>
            </svg>
            Masuk dengan Google
          </Button>
          <FieldDescription className="text-center">
            Masih belum punya akun?{" "}
            <Link href="https://wa.me/6282318572605" className="underline underline-offset-4">
              Hubungi kami
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
