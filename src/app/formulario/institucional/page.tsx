"use client";

import { useState, useCallback } from "react";
import { Camera, BookOpen, CheckCircle, Sparkles } from "lucide-react";
import { InstitutionalBadgePreview } from "@/src/components/subscription/institutional-badge-preview";
import { FileUpload } from "@/src/components/subscription/file-upload";
import { ModeToggle } from "@/src/components/toggle-theme";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Separator } from "@/src/components/ui/separator";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import logo from "@/src/assets/logo.png";
import Image from "next/image";
import Footer from "@/src/components/footer";
import { Alert as AlertCustom } from "@/src/components/custom/alert";
import {
  institutionalSubscription,
  InstitutionalSubscriptionResponse,
} from "@/src/actions/institutional-subscription-action";

const cargos = ["Preceptor", "Professor", "Administrativo", "Tutor"];

export default function InscricaoInstitucional() {
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] =
    useState<InstitutionalSubscriptionResponse | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhotoFile(null);
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
  }, [photoUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedRole || !photoFile) {
      toast.error("Por favor, preencha todos os campos e selecione uma foto.");
      return;
    }

    setIsSubmitting(true);
    setIsSubmitted(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", selectedRole);
    formData.append("image", photoFile);

    try {
      const resultAction = await institutionalSubscription(formData);
      setResult(resultAction);

      if (resultAction.success) {
        toast.success(
          "Inscrição enviada com sucesso! Seu cadastro foi realizado."
        );
        setIsSubmitted(true);
      } else {
        toast.error("Erro ao enviar inscrição. Verifique os dados.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setSelectedRole("");
    handleRemovePhoto();
    setIsSubmitted(false);
    setResult(null);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full border shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Inscrição Concluída!
                </h1>
                <p className="text-muted-foreground">
                  Seu cadastro foi realizado com sucesso.
                </p>
              </div>

              <Alert className="text-left">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Sucesso!</AlertTitle>
                <AlertDescription>
                  Em breve você receberá mais informações sobre seu crachá.
                </AlertDescription>
              </Alert>

              <Button onClick={handleReset} className="w-full" size="lg">
                Nova Inscrição
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-lg">
                <Image alt="logo" src={logo} width={30} height={30} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Inscrição Institucional
              </h1>
            </div>
            <ModeToggle />
          </div>

          {result?.errorForm && (
            <AlertCustom
              variant="error"
              title={result?.errorForm}
              description="Houve um erro no processamento."
            />
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <Card className="border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Preencha todos os campos obrigatórios
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Foto */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Foto 4x4 para o Crachá
                  </Label>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    previewUrl={photoUrl}
                    onRemove={handleRemovePhoto}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    <strong>Importante:</strong> A foto será recortada no
                    formato 4x4. Use uma foto recente com fundo neutro.
                  </p>
                </div>

                <Separator />

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                {/* Cargo */}
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map((cargo) => (
                        <SelectItem key={cargo} value={cargo}>
                          {cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão de Envio */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Solicitar Crachá
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview do Crachá */}
          <div className="space-y-6">
            <Card className="border h-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Preview do Crachá
                </CardTitle>
                <CardDescription>
                  Veja como ficará seu crachá oficial
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <InstitutionalBadgePreview
                    name={name}
                    role={selectedRole}
                    photoUrl={photoUrl}
                  />
                </div>

                <Separator />

                {/* Dicas */}
                <Alert className="bg-primary/5 border-primary/20">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">
                    Dicas para uma boa foto:
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="space-y-1.5 mt-2">
                      {[
                        "Use fundo claro e uniforme",
                        "Olhe diretamente para a câmera",
                        "Use iluminação natural",
                        "Evite acessórios que cubram o rosto",
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rodapé */}
        <Footer />
      </div>
    </div>
  );
}
