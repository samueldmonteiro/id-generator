import { redirect } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { BadgeSubscriptionPosition } from "@/src/generated/prisma/enums";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function SubscriptionRedirectPage({ params }: PageProps) {
  const { code } = await params;

  if (!code) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Link Inválido</h1>
          <p className="mt-2 text-gray-600">
            O código de inscrição não foi fornecido.
          </p>
        </div>
      </div>
    );
  }

  // Fetch link
  const link = await prisma.subscriptionLink.findUnique({
    where: { code },
  });

  // Validation
  let error = null;

  if (!link) {
    error = "Link não encontrado.";
  } else if (!link.active) {
    error = "Este link foi desativado.";
  } else if (link.expiresAt && new Date() > link.expiresAt) {
    error = "Este link expirou.";
  } else if (link.limit && link.usedCount >= link.limit) {
    error = "Limite de usos deste link foi atingido.";
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Redirect based on type
  if (link?.type === "ESTAGIARIO") {
    redirect("/formulario/estagiario");
  } else if (
    link?.type === "PROFESSOR" ||
    link?.type === "TUTOR" ||
    link?.type === "PRECEPTOR" ||
    link?.type === "ADMINISTRATIVO"
  ) {
    redirect(`/formulario/institucional?role=${link.type}`);
  } else {
    redirect("/formulario/institucional");
  }
}
