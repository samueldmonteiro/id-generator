import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/src/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de inscrições</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            18 inscrições
          </CardTitle>
          
        </CardHeader>
        
      </Card>
     <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estagiários</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5 inscrições
          </CardTitle>
        </CardHeader>
        
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Administrador</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            10 inscrições
          </CardTitle>
        </CardHeader>
        
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Preceptor</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4 inscrições
          </CardTitle>
        </CardHeader>
        
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tutor</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3 inscrições
          </CardTitle>
        </CardHeader>
        
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Professor</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1 inscrições
          </CardTitle>
        </CardHeader>
        
      </Card>
    </div>
  )
}
