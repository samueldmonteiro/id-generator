"use client";

import { login } from "@/src/actions/auth-action";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Key,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent } from "@/src/components/ui/card";

import { ModeToggle } from "@/src/components/toggle-theme";
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from "@/src/assets/logo.png";
import { Alert } from "../custom/alert";
import Footer from "../footer";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Autenticando...
        </>
      ) : (
        <>
          <Key className="w-4 h-4 mr-2" />
          Acessar Sistema
        </>
      )}
    </Button>
  );
}

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action] = useActionState(login, undefined);

  if (state?.success) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/40 transition-colors relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-primary/10 rounded-full ring-8 ring-primary/5">
            <Image
              src={logo}
              alt="Logo da instituição"
              width={80}
              height={80}
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Crachá Pro
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistema de geração de crachás
            </p>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardContent className="space-y-3 pt-1">
            <div className="justify-center flex items-center gap-2 px-3 py-2 bg-orange-600/10 border border-orange-500/20 rounded-md text-orange-600 dark:text-orange-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">
                Área restrita para administradores
              </p>
            </div>

            <form action={action} className="space-y-5">
              {state?.formError && (
                <Alert title={state.formError} variant="error" className="my-5"/>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu.email@universidade.edu.br"
                    className={`pl-10 ${
                      state?.errors?.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    required
                    autoComplete="username"
                  />
                </div>
                {state?.errors?.email && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/recuperar-senha"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${
                      state?.errors?.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {state?.errors?.password && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.password}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>
          </CardContent>

          <Footer/>
        </Card>
      </div>
    </div>
  );
};
