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
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
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
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const handleGoogleSuccess = async (credentialsResponse) => {
    try {
      const res = await api.post('/api/auth/google', {
        token: credentialsResponse.credential
      })

      if (res.data.success) {
        login(res.data.token, res.data.user)
      }
    } catch (error) {
      console.error("Gagal login dengan Google:", error);
      toast.error(error.response?.data?.message || "Gagal masuk menggunakan Google", {
        style: { background: "#ef4444", color: "#fee2e2" },
        className: "border border-red-500"
      })
    }
  }

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
    <GoogleOAuthProvider clientId={clientId}>
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
            <Input id="username" placeholder="Masukkan username kamu" {...register("username")} className="border border-white/10" />
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
                className="pr-10 border border-white/10"
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
          <FieldSeparator className="bg-blend-color">Atau lanjut saja dengan</FieldSeparator>
          <Field>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Google Dibatalkan/Gagal');
              }}
              useOneTap
            />
            <FieldDescription className="text-center">
              Masih belum punya akun?{" "}
              <Link href="https://wa.me/6282318572605" className="underline underline-offset-4">
                Hubungi kami
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </GoogleOAuthProvider>
  )
}
