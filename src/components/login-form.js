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
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import api from "@/lib/axios"

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
  const [isLoading, setIsLoading] = useState(false)

  const loginWithGoogleCustom = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true)
        const res = await api.post('/api/auth/google', {
          token: tokenResponse.access_token
        })

        if (res.data.success) {
          login(res.data.token, res.data.user)
          toast.success("Berhasil masuk dengan Google!", {
            position: 'top-center',
            style: { background: "#059669", color: "#d1fae5" },
            className: "border border-emerald-500"
          })
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Gagal masuk menggunakan Google", {
          position: 'top-center',
          style: { background: "#ef4444", color: "#fee2e2" },
          className: "border border-red-500"
        })
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => console.log('Login Google Dibatalkan/Gagal'),
  })

  const onSubmit = async (data) => {
    setApiError(null)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sign-in`, {
        username: data.username,
        password: data.password
      })
      const { token, user } = res.data
      login(token, user)
      toast.success(`Halo ${user.name}, selamat datang di MIRA FEB`, {
        position: 'top-center',
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
          <Input
            id="username"
            placeholder="Masukkan username kamu"
            {...register("username")}
            className="!bg-white/50 text-zinc-900 border-white/10 placeholder:text-zinc-900"
          />
          {errors.username && (
            <p className="text-rose-500 text-sm">{errors.username.message}</p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-white">Password</FieldLabel>
            <Link href="https://wa.me/6282318572605" className="text-sm ml-auto underline underline-offset-4 text-white">
              Lupa dengan passwordmu?
            </Link>
          </div>
          <div className="relative">
            <Input
              placeholder="**********"
              id="password"
              type={pwVisible ? "text" : "password"}
              className="!bg-white/50 text-zinc-900 border-white/10 placeholder:text-zinc-900 pr-10"
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
        <FieldSeparator className="bg-blend-color text-zinc-900 dark:text-white">Atau lanjut saja dengan</FieldSeparator>
        <Field>
          <Button
            type="button"
            onClick={() => loginWithGoogleCustom()}
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-slate-900 border-slate-900 hover:border-zinc-950 hover:bg-zinc-950 shadow-md"
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin size-4" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
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
