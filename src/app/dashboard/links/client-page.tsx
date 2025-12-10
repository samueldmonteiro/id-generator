"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Trash2,
  Edit,
  Check,
  Link as LinkIcon,
  X,
  Calendar,
} from "lucide-react";
import {
  createLink,
  toggleLinkStatus,
  updateLinkExpiry,
} from "@/src/actions/link-action";
import { BadgeSubscriptionPosition } from "@/src/generated/prisma/enums";

interface LinkItem {
  id: number;
  code: string;
  type: BadgeSubscriptionPosition;
  limit: number | null;
  usedCount: number;
  expiresAt: Date | null;
  active: boolean;
  createdAt: Date;
}

interface LinksClientPageProps {
  initialLinks: any[];
}

export function LinksClientPage({ initialLinks }: LinksClientPageProps) {
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  // Sincroniza o estado local quando `initialLinks` é atualizado (ex: após navegação com cache)
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createdLinkCode, setCreatedLinkCode] = useState("");
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const [formData, setFormData] = useState({
    type: "ESTAGIARIO" as BadgeSubscriptionPosition,
    limit: "",
    expiryType: "forever", // 'forever' | 'date'
    expiryDate: "",
  });

  const [editFormData, setEditFormData] = useState({
    expiryDate: "",
  });

  const handleCreate = async () => {
    const limit = formData.limit ? parseInt(formData.limit, 10) : undefined;
    const expiresAt =
      formData.expiryType === "date" && formData.expiryDate
        ? new Date(formData.expiryDate)
        : undefined;

    const result = await createLink({
      type: formData.type,
      limit,
      expiresAt,
    });

    if (result.success && result.code) {
      setCreatedLinkCode(result.code);
      setIsCreateOpen(false);
      setTimeout(() => setIsShareOpen(true), 150);
      router.refresh();
    } else {
      toast.error("Erro ao criar link");
    }
  };

  const handleEditClick = (link: LinkItem) => {
    setEditingLink(link);
    setEditFormData({
      expiryDate: link.expiresAt
        ? new Date(link.expiresAt).toISOString().split("T")[0]
        : "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingLink) return;
    const expiresAt = editFormData.expiryDate
      ? new Date(editFormData.expiryDate)
      : null;

    const result = await updateLinkExpiry(editingLink.id, expiresAt);
    if (result.success) {
      toast.success("Validade atualizada com sucesso");
      setIsEditOpen(false);
      setEditingLink(null);
      router.refresh();
    } else {
      toast.error("Erro ao atualizar link");
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/inscricao/${createdLinkCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const result = await toggleLinkStatus(id, !currentStatus);
    if (result.success) {
      toast.success(currentStatus ? "Link desativado" : "Link ativado");
      // Atualização otimista para melhor UX
      setLinks(
        links.map((l) => (l.id === id ? { ...l, active: !currentStatus } : l))
      );
      router.refresh();
    } else {
      toast.error("Erro ao atualizar status");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciamento de Links
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie links de inscrição para estagiários e colaboradores.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Link</DialogTitle>
              <DialogDescription>
                Configure as regras para o link de inscrição.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Inscrição</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: BadgeSubscriptionPosition) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESTAGIARIO">Estagiário</SelectItem>
                    <SelectItem value="PROFESSOR">Professor</SelectItem>
                    <SelectItem value="TUTOR">Tutor</SelectItem>
                    <SelectItem value="PRECEPTOR">Preceptor</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">
                      Administrativo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="limit">Limite de Usos (Opcional)</Label>
                <Input
                  id="limit"
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Validade</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="forever"
                      name="expiry"
                      checked={formData.expiryType === "forever"}
                      onChange={() =>
                        setFormData({ ...formData, expiryType: "forever" })
                      }
                      className="accent-primary"
                    />
                    <Label htmlFor="forever" className="font-normal">
                      Para sempre
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="date"
                      name="expiry"
                      checked={formData.expiryType === "date"}
                      onChange={() =>
                        setFormData({ ...formData, expiryType: "date" })
                      }
                      className="accent-primary"
                    />
                    <Label htmlFor="date" className="font-normal">
                      Data específica
                    </Label>
                  </div>
                </div>
              </div>
              {formData.expiryType === "date" && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="date-input">Data de Expiração</Label>
                  <Input
                    id="date-input"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Criar Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Usos / Limite</TableHead>
                <TableHead>Expiração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum link ativo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-mono">{link.code}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          link.type === "ESTAGIARIO"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {link.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {link.usedCount} / {link.limit || "∞"}
                    </TableCell>
                    <TableCell>
                      {link.expiresAt
                        ? new Intl.DateTimeFormat("pt-BR").format(
                            new Date(link.expiresAt)
                          )
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`flex items-center gap-1 ${
                          link.active ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {link.active ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        {link.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(link)}
                        title="Editar Validade"
                        aria-label={`Editar validade do link ${link.code}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(link.id, link.active)}
                        title={link.active ? "Desativar" : "Ativar"}
                        aria-label={
                          link.active
                            ? `Desativar link ${link.code}`
                            : `Ativar link ${link.code}`
                        }
                      >
                        {link.active ? (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de Compartilhamento — exibido após criação bem-sucedida */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Link Criado com Sucesso!
            </DialogTitle>
            <DialogDescription>
              Compartilhe este link com os usuários para que eles possam
              realizar a inscrição.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link de inscrição
              </Label>
              <Input
                id="link"
                defaultValue={`${
                  typeof window !== "undefined" ? window.location.origin : ""
                }/inscricao/${createdLinkCode}`}
                readOnly
                className="bg-muted font-mono text-sm"
              />
            </div>
            <Button
              size="icon"
              onClick={copyToClipboard}
              className="px-3"
              variant="secondary"
              aria-label="Copiar link para a área de transferência"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => setIsShareOpen(false)}
            >
              Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Validade */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Validade</DialogTitle>
            <DialogDescription>
              Altere a data de expiração do link{" "}
              <strong>{editingLink?.code}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Nova Data de Expiração</Label>
              <Input
                id="edit-date"
                type="date"
                value={editFormData.expiryDate}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    expiryDate: e.target.value,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para tornar vitalício (nunca expira).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
