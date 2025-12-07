'use client'

import { login } from "@/src/actions/auth-action";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2, GraduationCap, Key, Mail, Shield } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Autenticando...
        </>
      ) : (
        <>
          <Key className="w-5 h-5" />
          Acessar Sistema
        </>
      )}
    </button>
  );
}

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-4 shadow-md">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gerencimento de Crachás
            </h1>
          </div>

          {/* Alertas de Acesso */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Acesso Restrito:</strong> Esta área é exclusiva para a administração da instituição.
              </p>
            </div>

          </div>
 
          {/* Formulário */}
          <form action={action} className="space-y-6">
            {state?.formError && (
                  <div
                    id="email-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    {state?.formError}
                  </div>
                )}
            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="seu.email@universidade.edu.br"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${state?.errors?.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                  aria-invalid={!!state?.errors?.email}
                  aria-describedby={
                    state?.errors?.email ? "email-error" : undefined
                  }
                  required
                />
                {state?.errors?.email && (
                  <div
                    id="email-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    {state?.errors?.email}
                  </div>
                )}
              </div>

            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${state?.errors?.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                  aria-invalid={!!state?.errors?.password}
                  aria-describedby={
                    state?.errors?.password ? "password-error" : undefined
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded hover:bg-gray-100"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {state?.errors?.password && (
                  <div
                    id="password-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    {state?.errors?.password}
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Submit */}
            <SubmitButton />
          </form>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>v1.0</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} X - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};