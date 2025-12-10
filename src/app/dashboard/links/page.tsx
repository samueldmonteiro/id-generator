import { getActiveLinks } from "@/src/actions/link-action";
import { LinksClientPage } from "./../links/client-page";

export default async function LinksPage() {
  const result = await getActiveLinks();
  const initialLinks = result.success && result.data ? result.data : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <LinksClientPage initialLinks={initialLinks} />
    </div>
  );
}
