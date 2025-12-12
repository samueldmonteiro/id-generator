"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeSubscriptionPosition } from "@/src/generated/prisma/enums";
import { ColumnDef, PaginationState, Updater } from "@tanstack/react-table";
import { DataTable } from "@/src/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Download } from "lucide-react";
import { SectionCards } from "@/src/components/section-cards";

interface Subscription {
  id: number;
  name: string;
  courseName: string | null;
  position: BadgeSubscriptionPosition;
  image: string;
  badgeFile: string;
  createdAt?: Date;
}

interface DashboardClientProps {
  initialSubscriptions: Subscription[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const getBadgeColor = (position: BadgeSubscriptionPosition) => {
  switch (position) {
    case "ESTAGIARIO":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "ADMINISTRATIVO":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "PROFESSOR":
    case "PROFESSORA":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "TUTOR":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export function DashboardClient({
  initialSubscriptions,
  currentPage,
  totalPages,
  itemsPerPage,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole = searchParams.get("role") || "ALL";
  const initialSort = searchParams.get("sort") || "recent";

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("role");
    } else {
      params.set("role", value);
    }
    params.set("page", "1");
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/dashboard?${params.toString()}`);
  };

  // Pagination handler for React Table
  const handlePaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    const params = new URLSearchParams(searchParams.toString());

    const previousState = {
      pageIndex: currentPage - 1,
      pageSize: itemsPerPage,
    };

    const newState =
      typeof updaterOrValue === "function"
        ? updaterOrValue(previousState)
        : updaterOrValue;

    if (
      newState.pageIndex + 1 !== currentPage ||
      newState.pageSize !== itemsPerPage
    ) {
      params.set("page", (newState.pageIndex + 1).toString());
      params.set("limit", newState.pageSize.toString());

      if (newState.pageSize !== itemsPerPage) {
        params.set("page", "1");
      }

      router.push(`/dashboard?${params.toString()}`);
    }
  };

  const columns: ColumnDef<Subscription>[] = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Avatar",
        cell: ({ row }) => (
          <Avatar>
            <AvatarImage src={row.original.image} alt={row.original.name} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ),
      },
      {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "position",
        header: "Cargo",
        cell: ({ row }) => (
          <Badge
            className={`hover:opacity-80 ${getBadgeColor(
              row.original.position
            )}`}
          >
            {row.original.position}
          </Badge>
        ),
      },
      {
        accessorKey: "courseName",
        header: "Curso",
        cell: ({ row }) => (
          <div>
            {row.original.position === "ESTAGIARIO"
              ? row.original.courseName
              : "—"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Ações</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a
                href={row.original.badgeFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <SectionCards />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-background p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Inscrições Realizadas</h2>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select defaultValue={initialRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Cargos</SelectItem>
                <SelectItem value="ESTAGIARIO">Estagiário</SelectItem>
                <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                <SelectItem value="PRECEPTOR">Preceptor</SelectItem>
                <SelectItem value="TUTOR">Tutor</SelectItem>
                <SelectItem value="PROFESSOR">Professor</SelectItem>
                <SelectItem value="PROFESSORA">Professora</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue={initialSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recente</SelectItem>
                <SelectItem value="oldest">Mais Antigo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-background rounded-md">
          <DataTable
            columns={columns}
            data={initialSubscriptions}
            pageCount={totalPages}
            pagination={{
              pageIndex: currentPage - 1,
              pageSize: itemsPerPage,
            }}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </>
  );
}
